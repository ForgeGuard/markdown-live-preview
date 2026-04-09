# Markdown Live Preview

[Markdown Live Preview](https://markdownlivepreview.com/) is a tiny web tool to preview Markdown formatted text.

## Security and privacy defaults

- Markdown is rendered with `marked` and sanitized with `DOMPurify`.
- Runtime loading of Monaco from a third-party CDN has been removed; Monaco is bundled from project dependencies.
- Google Analytics is opt-in (`Analytics` checkbox) and disabled by default.
- External remote images in rendered markdown are blocked by default (`External images` checkbox enables them).
- `Private mode` disables saving editor content to local storage.
- Content persistence is bounded (short retention) instead of effectively indefinite.

## Setup

```bash
make setup
```

## Build

```bash
make build
```

## Local Development

```bash
make dev
```

## Containerization

### Build and run with Docker

```bash
docker build -t markdown-live-preview:local .
docker run --rm -p 8080:80 markdown-live-preview:local
```

### Run with Docker Compose

```bash
docker compose up --build
```

App is available at [http://localhost:8080](http://localhost:8080).

### Portainer stack / remote Docker Compose example

Use this when deploying from published image (no local build required):

```yaml
services:
  markdown-live-preview:
    image: ghcr.io/forgeguard/markdown-live-preview:latest
    container_name: markdown-live-preview
    restart: unless-stopped
    ports:
      - "3002:80"
```

Then open [http://localhost:3002](http://localhost:3002).

## Helm chart

Chart path: `charts/markdown-live-preview`

### Lint and package locally

```bash
helm lint charts/markdown-live-preview
helm package charts/markdown-live-preview --destination .artifacts
```

### Install from local chart

```bash
helm upgrade --install markdown-live-preview charts/markdown-live-preview \
  --set image.repository=ghcr.io/forgeguard/markdown-live-preview \
  --set image.tag=latest
```

### Install from GHCR OCI chart

```bash
helm registry login ghcr.io -u <github-user> --password-stdin
helm pull oci://ghcr.io/forgeguard/helm-charts/markdown-live-preview --version <chart-version>
helm upgrade --install markdown-live-preview ./markdown-live-preview-<chart-version>.tgz \
  --set image.repository=ghcr.io/forgeguard/markdown-live-preview \
  --set image.tag=latest
```

## GitHub Actions workflows

### Container image workflow

- File: `.github/workflows/container-image.yml`
- Trigger: `push` to `main` only
- Behavior:
  - builds image from `Dockerfile`
  - pushes to `ghcr.io/forgeguard/markdown-live-preview`
  - publishes tags: `latest` and `sha-<commit>`

### Helm chart workflow

- File: `.github/workflows/helm-chart.yml`
- Trigger: `push` to `main` only
- Behavior:
  - runs `helm lint`
  - packages chart
  - pushes OCI chart to `ghcr.io/forgeguard/helm-charts`

## Required GitHub package permissions

- Workflows use `GITHUB_TOKEN` with `packages: write`.
- Repository Actions must have permission to publish packages to GHCR.
- Package visibility (public/private) can be controlled in GHCR package settings.

## License

See the [LICENSE](https://github.com/tanabe/markdown-live-preview/blob/master/LICENSE) file in this repo.
