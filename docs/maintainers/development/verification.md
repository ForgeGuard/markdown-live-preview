# Verification sequence

Because there is no unit-test suite, verification for this fork relies on build, container, chart,
and documentation checks. Run the following before merging documentation or packaging changes.

> `npm test` is the upstream placeholder that intentionally exits non-zero
> (`"Error: no test specified"`). It is **not** a coverage signal and must not be treated as one.

## Core sequence

```bash
git diff --check                                   # whitespace / conflict markers
npm ci
npm run build                                      # produces dist/
node scripts/docs/validate-docs.mjs                # documentation validator
docker compose config                              # Compose file is valid
helm lint charts/markdown-live-preview
helm template markdown-live-preview charts/markdown-live-preview >/dev/null
```

## Namespace and moved-path checks

```bash
# Must return nothing: stale GHCR namespace (non "-ai").
grep -rn "ghcr.io/forgeguard/" . --exclude-dir=.git --exclude-dir=node_modules

# The published image/chart namespace should be forgeguard-ai.
grep -rn "ghcr.io/forgeguard-ai/" . --exclude-dir=.git --exclude-dir=node_modules
```

## Container smoke test (when Docker is available)

```bash
docker build -t markdown-live-preview:verify .
docker run --rm -d -p 8080:80 --name mlp-verify markdown-live-preview:verify
curl --fail http://localhost:8080/
docker rm -f mlp-verify
```

## Focused privacy checks (browser)

After `npm run build`, confirm in a browser / built `dist/`:

- No runtime Monaco CDN import (`grep -ri "jsdelivr\|cdn.jsdelivr\|monaco.*cdn" dist/` returns
  nothing for Monaco). The only expected third-party runtime script is `html2pdf` from cdnjs.
- Analytics does not load before opting in (no `googletagmanager.com` request with the toggle off).
- External images are blocked by default; enabling the toggle renders them.
- Private mode suppresses content persistence across reloads.

## What cannot be verified in CI

- Live Kubernetes pod startup under `readOnlyRootFilesystem: true` (requires a cluster). `helm
  lint`/`helm template` pass without running a pod; see the read-only filesystem note in
  `docs/site/deployment/kubernetes.md`.

## See also

- [Development environment](./environment.md)
