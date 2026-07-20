#!/usr/bin/env node
/**
 * ForgeGuard documentation validator (dependency-free).
 *
 * Validates the documentation publication contract for this repository:
 *   - .forgeguard/docs.yml manifest schema, identity, upstream fields, and route
 *   - docs/site/index.md existence
 *   - required front matter and allowed values on every docs/site page
 *   - duplicate / case-colliding routes and per-directory navigation order
 *   - relative links, heading anchors, and asset references resolve
 *   - path traversal / symlinks / escapes outside the publication root
 *   - no website publication of maintainer content
 *   - banner PNG type, 2172x724 dimensions, and reasonable size
 *   - README references banner, fork notice, docs index, local LICENSE, GHCR namespace
 *   - stale ghcr.io/forgeguard/ paths anywhere in the repo
 *   - a basic secret scan of documentation
 *
 * Usage: node scripts/docs/validate-docs.mjs
 * Exits non-zero if any error is found.
 */

import { readFileSync, readdirSync, existsSync, lstatSync } from 'node:fs';
import { join, relative, dirname, resolve, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const SITE_ROOT = join(ROOT, 'docs', 'site');
const MAINT_ROOT = join(ROOT, 'docs', 'maintainers');
const MANIFEST = join(ROOT, '.forgeguard', 'docs.yml');
const README = join(ROOT, 'README.md');
const BANNER = join(SITE_ROOT, 'assets', 'repository', 'banner-dark.png');

const ALLOWED_STATUS = new Set(['stable', 'beta', 'experimental', 'deprecated']);
const BANNER_W = 2172;
const BANNER_H = 724;
const BANNER_MAX_BYTES = 5 * 1024 * 1024; // 5 MiB
const EXPECTED_OWNER = 'forgeguard-ai';
const EXPECTED_NAME = 'markdown-live-preview';
const EXPECTED_UPSTREAM = 'tanabe/markdown-live-preview';

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const rel = (p) => relative(ROOT, p) || p;

// ---------- helpers ----------

function walk(dir, filterExt) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      err(`Symlink not allowed under publication tree: ${rel(full)}`);
      continue;
    }
    if (entry.isDirectory()) {
      out.push(...walk(full, filterExt));
    } else if (!filterExt || entry.name.toLowerCase().endsWith(filterExt)) {
      out.push(full);
    }
  }
  return out;
}

function parseFrontMatter(text, file) {
  if (!text.startsWith('---')) {
    err(`Missing front matter: ${rel(file)}`);
    return null;
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) {
    err(`Unterminated front matter: ${rel(file)}`);
    return null;
  }
  const block = text.slice(3, end).trim();
  const fm = {};
  for (const line of block.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return fm;
}

/** Minimal YAML reader for the flat/2-space-nested manifest we control. */
function parseSimpleYaml(text) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    while (stack.length && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (val === '') {
      const child = {};
      parent[key] = child;
      stack.push({ indent, obj: child });
    } else {
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      parent[key] = val;
    }
  }
  return root;
}

function slug(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function collectAnchors(text) {
  const anchors = new Set();
  const seen = {};
  for (const line of text.split('\n')) {
    const m = /^#{1,6}\s+(.*)$/.exec(line);
    if (!m) continue;
    let s = slug(m[1]);
    if (s in seen) {
      seen[s] += 1;
      s = `${s}-${seen[s]}`;
    } else {
      seen[s] = 0;
    }
    anchors.add(s);
  }
  return anchors;
}

// [text](target) and ![alt](target), excluding image/link refs; ignore code spans loosely.
function extractLinks(text) {
  const links = [];
  const re = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push(m[1]);
  }
  return links;
}

// ---------- 1. manifest ----------

function checkManifest() {
  if (!existsSync(MANIFEST)) {
    err(`Missing manifest: ${rel(MANIFEST)}`);
    return;
  }
  const y = parseSimpleYaml(readFileSync(MANIFEST, 'utf8'));
  if (String(y.version) !== '1') err(`Manifest version must be 1 (got ${y.version}).`);
  if (y.enabled !== true) err('Manifest enabled must be true.');

  const p = y.project || {};
  if (p.kind !== 'maintained-fork') err(`Manifest project.kind must be "maintained-fork" (got ${p.kind}).`);
  if (!p.slug) err('Manifest project.slug is required.');
  if (!p.title) err('Manifest project.title is required.');
  if (!p.summary) err('Manifest project.summary is required.');

  const r = y.repository || {};
  if (r.owner !== EXPECTED_OWNER) err(`Manifest repository.owner must be ${EXPECTED_OWNER} (got ${r.owner}).`);
  if (r.name !== EXPECTED_NAME) err(`Manifest repository.name must be ${EXPECTED_NAME} (got ${r.name}).`);
  if (r.default_branch !== 'main') warn(`Manifest repository.default_branch is ${r.default_branch}, expected main.`);

  const s = y.source || {};
  if (s.content_root !== 'docs/site') err(`Manifest source.content_root must be "docs/site" (got ${s.content_root}).`);
  if (s.entrypoint !== 'index.md') err(`Manifest source.entrypoint must be "index.md" (got ${s.entrypoint}).`);

  const pub = y.publishing || {};
  if (!/^\/projects\/[a-z0-9-]+\/docs$/.test(String(pub.route || ''))) {
    err(`Manifest publishing.route is invalid: ${pub.route}`);
  }
  if (pub.include_generated !== false) err('Manifest publishing.include_generated must be false.');

  const u = y.upstream || {};
  if (u.repository !== EXPECTED_UPSTREAM) err(`Manifest upstream.repository must be ${EXPECTED_UPSTREAM} (got ${u.repository}).`);
  if (u.tracking_policy !== 'tagged-releases') err(`Manifest upstream.tracking_policy must be "tagged-releases" (got ${u.tracking_policy}).`);
}

// ---------- 2-7. site pages ----------

function checkSitePages() {
  if (!existsSync(join(SITE_ROOT, 'index.md'))) {
    err('Missing docs/site/index.md.');
  }
  const pages = walk(SITE_ROOT, '.md');
  const routes = new Map(); // lowercase route -> original
  const ordersByDir = new Map();

  for (const file of pages) {
    const text = readFileSync(file, 'utf8');
    const fm = parseFrontMatter(text, file);

    // route uniqueness / case-collision
    const route = relative(SITE_ROOT, file).split(sep).join('/').replace(/\.md$/, '');
    const lc = route.toLowerCase();
    if (routes.has(lc)) {
      err(`Duplicate/case-colliding route: ${route} vs ${routes.get(lc)}`);
    } else {
      routes.set(lc, route);
    }

    if (fm) {
      if (!fm.title) err(`Front matter missing title: ${rel(file)}`);
      if (!fm.description) err(`Front matter missing description: ${rel(file)}`);
      if (!('order' in fm)) {
        err(`Front matter missing order: ${rel(file)}`);
      } else if (!/^\d+$/.test(String(fm.order)) || +fm.order < 0 || +fm.order > 9999) {
        err(`Front matter order must be an integer 0-9999: ${rel(file)} (got ${fm.order})`);
      } else {
        const dir = dirname(file);
        if (!ordersByDir.has(dir)) ordersByDir.set(dir, new Map());
        const seen = ordersByDir.get(dir);
        if (seen.has(+fm.order)) {
          err(`Duplicate navigation order ${fm.order} in ${rel(dir)}: ${rel(file)} and ${rel(seen.get(+fm.order))}`);
        } else {
          seen.set(+fm.order, file);
        }
      }
      if (!fm.status) err(`Front matter missing status: ${rel(file)}`);
      else if (!ALLOWED_STATUS.has(fm.status)) {
        err(`Front matter status "${fm.status}" not allowed (${[...ALLOWED_STATUS].join(', ')}): ${rel(file)}`);
      }
    }

    // links, anchors, assets, traversal, maintainer leakage
    const anchors = collectAnchors(text);
    for (const target of extractLinks(text)) {
      if (/^(https?:|mailto:|tel:)/i.test(target)) continue; // external — allowed absolute
      if (target.startsWith('#')) {
        const a = target.slice(1).toLowerCase();
        if (a && !anchors.has(a)) err(`Broken same-page anchor ${target} in ${rel(file)}`);
        continue;
      }
      const [pathPart, anchor] = target.split('#');
      const resolved = resolve(dirname(file), pathPart);
      const within = relative(SITE_ROOT, resolved);
      if (within.startsWith('..') || within.startsWith(sep)) {
        err(`Link escapes publication root (docs/site): "${target}" in ${rel(file)}`);
        continue;
      }
      if (resolved.startsWith(MAINT_ROOT + sep)) {
        err(`Published page links into docs/maintainers: "${target}" in ${rel(file)}`);
      }
      if (!existsSync(resolved)) {
        err(`Broken relative link "${target}" in ${rel(file)}`);
        continue;
      }
      if (lstatSync(resolved).isSymbolicLink()) {
        err(`Link points at a symlink: "${target}" in ${rel(file)}`);
      }
      if (anchor && resolved.toLowerCase().endsWith('.md')) {
        const targetAnchors = collectAnchors(readFileSync(resolved, 'utf8'));
        if (!targetAnchors.has(anchor.toLowerCase())) {
          err(`Broken anchor "#${anchor}" for ${pathPart} in ${rel(file)}`);
        }
      }
    }
  }
  return routes;
}

// ---------- 8. banner ----------

function checkBanner() {
  if (!existsSync(BANNER)) {
    err(`Missing banner: ${rel(BANNER)}`);
    return;
  }
  const buf = readFileSync(BANNER);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(sig)) {
    err(`Banner is not a PNG: ${rel(BANNER)}`);
    return;
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width !== BANNER_W || height !== BANNER_H) {
    err(`Banner must be ${BANNER_W}x${BANNER_H} (got ${width}x${height}).`);
  }
  if (buf.length > BANNER_MAX_BYTES) {
    err(`Banner exceeds ${BANNER_MAX_BYTES} bytes (got ${buf.length}).`);
  }
  if (buf.length === 0) err('Banner is empty.');
}

// ---------- 9-10. README ----------

function checkReadme() {
  if (!existsSync(README)) {
    err('Missing README.md.');
    return;
  }
  const t = readFileSync(README, 'utf8');
  const need = [
    ['banner reference', 'docs/site/assets/repository/banner-dark.png'],
    ['fork notice alert', '[!IMPORTANT]'],
    ['upstream attribution', 'tanabe/markdown-live-preview'],
    ['docs index link', 'docs/site/index.md'],
    ['local LICENSE link', '](./LICENSE)'],
    ['GHCR namespace', 'ghcr.io/forgeguard-ai/markdown-live-preview'],
  ];
  for (const [label, needle] of need) {
    if (!t.includes(needle)) err(`README is missing ${label} (expected to contain "${needle}").`);
  }
}

// ---------- 10. stale namespace (repo-wide) ----------

function checkStaleNamespace() {
  const skipDirs = new Set(['.git', 'node_modules', 'dist', '.artifacts']);
  const textExt = /\.(md|ya?ml|json|js|mjs|cjs|ts|html|conf|txt|toml|sh|tpl)$/i;
  const stack = [ROOT];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name)) stack.push(full);
      } else if (textExt.test(entry.name)) {
        const t = readFileSync(full, 'utf8');
        // Stale = an actual artifact reference ghcr.io/forgeguard/<name>, i.e. a slash
        // immediately after "forgeguard" (not "forgeguard-ai/") followed by a name char.
        // This deliberately ignores bare "ghcr.io/forgeguard/" search strings used in
        // instructional grep examples and this validator's own regex source.
        if (/ghcr\.io\/forgeguard\/[a-z]/.test(t)) {
          err(`Stale GHCR namespace "ghcr.io/forgeguard/<name>" in ${rel(full)} (use ghcr.io/forgeguard-ai/).`);
        }
      }
    }
  }
}

// ---------- 11. secret scan (docs surface) ----------

function checkSecrets() {
  const targets = [
    README,
    MANIFEST,
    join(ROOT, 'SECURITY.md'),
    join(ROOT, 'SUPPORT.md'),
    join(ROOT, 'CONTRIBUTING.md'),
    ...walk(SITE_ROOT, '.md'),
    ...walk(MAINT_ROOT, '.md'),
  ];
  const patterns = [
    [/AKIA[0-9A-Z]{16}/, 'AWS access key id'],
    [/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, 'private key block'],
    [/gh[pousr]_[A-Za-z0-9]{36,}/, 'GitHub token'],
    [/github_pat_[A-Za-z0-9_]{22,}/, 'GitHub fine-grained PAT'],
    [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
    [/(?:password|passwd|secret|api[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9!@#$%^&*()_+\-]{8,}/i, 'inline credential'],
  ];
  for (const file of targets) {
    if (!existsSync(file)) continue;
    const t = readFileSync(file, 'utf8');
    for (const [re, label] of patterns) {
      if (re.test(t)) err(`Possible ${label} in ${rel(file)}`);
    }
  }
}

// ---------- run ----------

checkManifest();
checkSitePages();
checkBanner();
checkReadme();
checkStaleNamespace();
checkSecrets();

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  console.error(`\nDocumentation validation FAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`Documentation validation passed${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
