# Development environment

Maintainer setup for building and hacking on the ForgeGuard fork of Markdown Live Preview. This
material is intentionally kept out of the published website (`docs/site/`).

## Toolchain

- **Node.js 22** — matches the Dockerfile build stage and is the supported baseline.
- **npm** — bundled with Node; the lockfile is `package-lock.json` (use `npm ci`).
- **Docker** with the Compose plugin — for building and smoke-testing the container.
- **Helm 3** — for chart lint/template/package.

## Install and build

```bash
npm ci
npm run build      # outputs to dist/
npm run dev        # Vite dev server
```

The `Makefile` wraps these: `make setup`, `make build`, `make dev`, `make preview`,
`make serve-dist`.

## Repository layout

| Path | Purpose |
|---|---|
| `src/main.js` | The entire application (editor, parser, sanitizer, URL policy, privacy controls, export, persistence). |
| `index.html` | Page shell; inline theme boot script; loads the SRI-pinned `html2pdf` from cdnjs. |
| `public/` | Static assets copied into the build (CSS, images, favicon). |
| `nginx/default.conf` | CSP, security headers, caching, SPA fallback for the container. |
| `Dockerfile`, `docker-compose.yml` | Container build and local run. |
| `charts/markdown-live-preview/` | Helm chart. |
| `.github/workflows/` | Image and chart publish pipelines, plus docs validation. |
| `.forgeguard/docs.yml` | Website publication manifest. |
| `docs/site/`, `docs/maintainers/` | Public and maintainer documentation. |
| `scripts/docs/validate-docs.mjs` | Documentation validator. |

## Conventions

- Preserve upstream authorship and structure where practical; keep ForgeGuard changes reviewable
  and identified in history (see `docs/maintainers/upstream-sync/`).
- Do not loosen the CSP or privacy defaults to make examples convenient.

## See also

- [Verification](./verification.md)
- [Container and chart release](../release/container-and-chart.md)
