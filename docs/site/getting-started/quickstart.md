---
title: Quickstart
description: Run Markdown Live Preview from the published container and open it in a browser.
order: 10
status: stable
---

# Quickstart

Get a running Markdown preview in one command using the published ForgeGuard container image.

## Prerequisites

- Docker Engine (or a compatible runtime) installed and running.
- A free local port. This guide uses `8080`.
- A modern browser (Chromium, Firefox, or WebKit based).

## Run the container

The image is served by Nginx and listens on port `80` inside the container. Map it to a local
port:

```bash
docker run --rm -p 8080:80 ghcr.io/forgeguard-ai/markdown-live-preview:latest
```

## Verify

Check that the container is serving the app:

```bash
curl --fail http://localhost:8080/
```

A successful response returns the application's HTML with exit code `0`. Then open
<http://localhost:8080> in a browser — you should see the editor on the left and a live preview
on the right, pre-filled with a Markdown syntax guide.

## Next steps

- Learn the editor and preview: [Editor and preview](../usage/editor-and-preview.md).
- Review what is stored and what leaves the browser: [Privacy controls](../usage/privacy-controls.md).
- Choose a durable deployment: [Container](../deployment/container.md),
  [Compose & Portainer](../deployment/compose-and-portainer.md), or
  [Kubernetes](../deployment/kubernetes.md).
- Build from source instead of using the published image:
  [Build and configuration](../reference/build-and-configuration.md).
