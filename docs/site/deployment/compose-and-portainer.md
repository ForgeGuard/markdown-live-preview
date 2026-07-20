---
title: Compose and Portainer
description: Run Markdown Live Preview with Docker Compose locally or as a Portainer stack from the published image.
order: 20
status: stable
---

# Compose and Portainer

Docker Compose is the simplest way to run the app durably on a single host. The repository's
`docker-compose.yml` builds the image from source; for a managed environment such as Portainer,
use the published image instead of building.

## Prerequisites

- Docker Engine with the Compose plugin (`docker compose`), or a Portainer-managed Docker host.

## Local Compose (build from source)

The bundled `docker-compose.yml` builds the image locally, tags it `markdown-live-preview:local`,
maps `8080:80`, restarts unless stopped, and defines a healthcheck:

```bash
docker compose up --build
```

Open <http://localhost:8080>. Validate the Compose file without starting anything:

```bash
docker compose config
```

## Portainer stack (published image)

In a Portainer-managed environment you typically deploy from a published image rather than a
local build. Create a stack with the following definition, which pulls the ForgeGuard image and
maps it to host port `3002`:

```yaml
services:
  markdown-live-preview:
    image: ghcr.io/forgeguard-ai/markdown-live-preview:latest
    container_name: markdown-live-preview
    restart: unless-stopped
    ports:
      - "3002:80"
```

Then open `http://<host>:3002`.

> Use an immutable `sha-<commit>` tag instead of `latest` for a deployment you do not want to
> change unexpectedly. See [Upgrades](../operations/upgrades.md).

## Verify

```bash
curl --fail http://localhost:8080/   # local Compose
```

For the Portainer stack, request the mapped port (`http://<host>:3002/`) and confirm HTML is
returned. The container's own healthcheck also reports status in Docker/Portainer.

## Related

- [Container](./container.md)
- [Kubernetes](./kubernetes.md)
