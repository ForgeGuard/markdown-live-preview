---
title: Build and configuration
description: Build the app from source, the tooling involved, and where configuration lives.
order: 10
status: stable
---

# Build and configuration

Markdown Live Preview is a static site built with [Vite](https://vitejs.dev/). This page is for
users and contributors who want to build it from source or understand its configuration surface.

## Prerequisites

- Node.js 22 (the version used by the container build and the supported baseline).
- npm (bundled with Node).

## Build from source

```bash
npm ci
npm run build
```

The build output is written to `dist/`. Serve it with any static file server, or use the provided
scripts:

```bash
npm run preview       # Vite preview server
npm run serve-dist    # serve dist/ on port 5001
```

A `Makefile` wraps the common tasks (`make setup`, `make build`, `make dev`, `make preview`,
`make serve-dist`).

## Run a development server

```bash
npm run dev
```

## Configuration surface

This is a client-only app; there are no server-side environment variables for application logic.
The relevant configuration lives in a few files:

| File | Purpose |
|---|---|
| `nginx/default.conf` | Content Security Policy, security headers, caching, and SPA fallback for the container. |
| `Dockerfile` | Multi-stage build: Node 22 build stage → Nginx 1.27 runtime. Exposes port `80`. |
| `docker-compose.yml` | Local build-and-run with a healthcheck; maps `8080:80`. |
| `charts/markdown-live-preview/values.yaml` | Helm chart configuration (image, resources, probes, security context, ingress). |

Runtime behavior such as retention windows and the analytics measurement ID is defined in the
application source (`src/main.js`). Changing these is a code change, not deployment configuration.

## Tests

There is no automated test suite in this repository. `npm test` is the upstream placeholder that
intentionally exits non-zero (`"Error: no test specified"`) — it does not indicate a real failure
and is not a coverage signal. Verification relies on building, container smoke tests, chart checks,
and the documentation validator rather than a unit-test run.

## Related

- [Compatibility](./compatibility.md)
- [Container](../deployment/container.md)
