# Patch inventory

Fork-owned files and regions that carry ForgeGuard changes. After any upstream sync, confirm each
item still holds. This document names files and behaviors only; it contains no secrets or
credentials.

## Fork-owned files (added by ForgeGuard; unlikely to exist upstream)

| Path | Purpose |
|---|---|
| `nginx/default.conf` | CSP and security headers, caching, SPA fallback. |
| `Dockerfile` | Multi-stage Node 22 → Nginx 1.27 build. |
| `docker-compose.yml` | Local build-and-run with healthcheck. |
| `charts/markdown-live-preview/**` | Helm chart. |
| `.github/workflows/container-image.yml` | Image publish pipeline. |
| `.github/workflows/helm-chart.yml` | Chart publish pipeline. |
| `.github/workflows/docs-validate.yml` | Documentation validation. |
| `scripts/docs/validate-docs.mjs` | Documentation validator. |
| `.forgeguard/docs.yml` | Website publication manifest. |
| `docs/site/**`, `docs/maintainers/**` | ForgeGuard documentation. |
| `SECURITY.md`, `SUPPORT.md`, `CONTRIBUTING.md` | Fork policy/support files. |

## Fork-owned regions in shared files (high conflict risk)

| File | Region / behavior | Verify after sync |
|---|---|---|
| `src/main.js` | Privacy state (`privateModeEnabled`, `allowExternalImages`, `analyticsEnabled`) and the retention constants (`contentRetentionDays = 30`, `settingsRetentionDays = 365`). | Defaults off; retentions bounded. |
| `src/main.js` | `enforceRenderedUrlPolicy` — link scheme allowlist + `rel="noopener noreferrer nofollow"`; image scheme allowlist + external-image block + `no-referrer`/lazy. | Links/images filtered as documented. |
| `src/main.js` | Opt-in analytics (`initAnalytics` guarded by consent) and `MonacoEnvironment` worker stub. | Analytics loads only after opt-in; Monaco bundled locally. |
| `src/main.js` | `loadLastContent`/`saveLastContent` private-mode short-circuit. | Private mode suppresses content storage. |
| `index.html` | Privacy/analytics/theme header toggles; inline theme boot script; SRI-pinned `html2pdf` from cdnjs. | Toggles present; export script intact. |
| `package.json` | `license` MIT; `repository`/`bugs`/`homepage` pointing to the fork; `engines.node`. | Metadata unchanged by upstream. |

## Expected upstream conflicts

- **Mermaid support**: upstream adds Mermaid rendering; the fork does not include it. A sync that
  pulls Mermaid must reconcile it with the sanitizer, CSP `script-src`/`connect-src`, and the
  external-resource policy before enabling — do not merge it enabled by default.
- **`index.html` / `src/main.js`**: upstream edits to the header, editor setup, or render pipeline
  will collide with the fork's toggles and URL policy.
- **Analytics**: upstream defaults analytics on; the fork must keep it opt-in.
- **Dependency bumps**: reconcile upstream dependency updates with the local Monaco bundling and
  CSP.

## See also

- [Sync policy](./sync-policy.md)
- [Conflict resolution](./conflict-resolution.md)
