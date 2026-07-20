# Contributing

Thanks for your interest in improving the ForgeGuard maintained fork of Markdown Live Preview.

## Before you start

- For a **security issue**, do not open a public issue — follow [SECURITY.md](./SECURITY.md).
- For a **bug or question**, check [SUPPORT.md](./SUPPORT.md) first — some issues belong upstream
  at [`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview).

## Development setup

```bash
npm ci
npm run build      # outputs to dist/
npm run dev        # Vite dev server
```

Node.js 22 is the supported version. See
[`docs/maintainers/development/environment.md`](./docs/maintainers/development/environment.md) for
the full layout and conventions.

## What this fork protects

Please keep changes consistent with the fork's purpose:

- Do not loosen the Content Security Policy or the privacy defaults (opt-in analytics, default
  external-image block, private mode, URL/scheme policy, bounded persistence).
- Keep the Monaco editor bundled locally; do not reintroduce a runtime Monaco CDN.
- Preserve upstream authorship and attribution.

## Pull requests

1. Branch from the default branch.
2. Make focused changes with clear commit messages.
3. Run the verification sequence in
   [`docs/maintainers/development/verification.md`](./docs/maintainers/development/verification.md)
   (`npm run build`, the docs validator, and — for packaging changes — `helm lint`/`helm template`
   and `docker compose config`).
4. Note that `npm test` is an upstream placeholder that intentionally fails; it is not a coverage
   signal.
5. Open a PR describing the change and how you verified it. Documentation changes are validated by
   `.github/workflows/docs-validate.yml`.

## Documentation

User documentation lives in `docs/site/` (published to the website); maintainer material lives in
`docs/maintainers/` (not published). Use relative links within `docs/site/` and add the required
front matter to new public pages — the validator enforces both.
