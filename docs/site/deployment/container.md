---
title: Container
description: Run Markdown Live Preview as a static Nginx container, from GHCR or built from source.
order: 10
status: stable
---

# Container

Markdown Live Preview ships as a static site served by Nginx. The container listens on port `80`
and serves the built application with a strict Content Security Policy and security headers.

## Prerequisites

- Docker Engine (or a compatible OCI runtime).
- Network access to `ghcr.io` to pull the published image, or a local checkout to build from
  source.

## Run the published image

The image is published to GitHub Container Registry at
`ghcr.io/forgeguard-ai/markdown-live-preview`. Map the container's port `80` to a local port:

```bash
docker run --rm -p 8080:80 ghcr.io/forgeguard-ai/markdown-live-preview:latest
```

Open <http://localhost:8080>.

### Image tags

| Tag | Meaning |
|---|---|
| `latest` | Rolling tag that moves with each build from `main`. |
| `sha-<commit>` | Immutable tag pinned to a specific commit. Use this for persistent deployments. |

Images are currently built for `linux/amd64` only. See [Upgrades](../operations/upgrades.md) for
tag and pinning guidance.

## Build from source

To build the image yourself from a checkout:

```bash
docker build -t markdown-live-preview:local .
docker run --rm -p 8080:80 markdown-live-preview:local
```

The build uses a multi-stage `Dockerfile`: a Node 22 stage runs `npm ci` and `npm run build`, and
the resulting static files are copied into an Nginx runtime image alongside `nginx/default.conf`.

## Verify

The image includes a container healthcheck that requests `/`. Check it from the host:

```bash
curl --fail http://localhost:8080/
```

A `0` exit code and returned HTML indicate the app is being served.

## Related

- [Compose & Portainer](./compose-and-portainer.md)
- [Kubernetes](./kubernetes.md)
- [Security and privacy](../operations/security-and-privacy.md)
