# Container and chart release

How the container image and Helm chart are built and published. Both pipelines run on push to
`main` and use the repository `GITHUB_TOKEN` with `packages: write`.

## Container image

- **Workflow:** `.github/workflows/container-image.yml`
- **Trigger:** push to `main`.
- **Registry/name:** `ghcr.io/${GITHUB_REPOSITORY}` lowercased → `ghcr.io/forgeguard-ai/markdown-live-preview`.
- **Tags:** `latest` and `sha-<commit>` (via `docker/metadata-action`).
- **Platforms:** single-platform (`linux/amd64`). No `platforms:` is configured on
  `docker/build-push-action`, so no multi-arch manifest is produced. Adding `linux/arm64` would
  require setting `platforms` and QEMU/buildx accordingly.
- **Build:** multi-stage `Dockerfile` (Node 22 build → Nginx 1.27 runtime).

## Helm chart

- **Workflow:** `.github/workflows/helm-chart.yml`
- **Trigger:** push to `main`.
- **Steps:** `helm lint` → `helm package` → push OCI chart to
  `oci://ghcr.io/${owner}/helm-charts` → `oci://ghcr.io/forgeguard-ai/helm-charts`.
- **Chart:** `charts/markdown-live-preview`, version `0.1.1`, appVersion `1.0.0`.

To cut a new chart version, bump `version` in `charts/markdown-live-preview/Chart.yaml` (and
`appVersion` when the app version changes) and merge to `main`.

## External GitHub settings still required

These live in GitHub/GHCR settings, not in the repository, and must be set by a maintainer with
admin access:

- **Package visibility** for the image and chart packages (public vs private) is controlled in each
  GHCR package's settings.
- **Actions → Workflow permissions** must allow publishing packages (the workflows request
  `packages: write`, but org/repo policy can override this).
- Linking each GHCR package to this repository (Package settings → "Connect repository") if not
  linked automatically.

## Release checklist

1. Confirm `npm ci && npm run build` succeeds.
2. Run the [verification sequence](../development/verification.md).
3. Bump chart/app versions if the chart or app changed.
4. Merge to `main`; confirm both workflows succeed and the expected tags/versions appear in GHCR.
5. Verify package visibility matches intent.

## See also

- [Package metadata](./package-metadata.md)
- [Upstream sync policy](../upstream-sync/sync-policy.md)
