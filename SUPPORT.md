# Support

This repository is the **ForgeGuard maintained fork** of
[`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview). Where you should
go depends on whether the problem is with ForgeGuard's packaging/defaults or with the core
application.

## Where to file

| Your problem | Where to go |
|---|---|
| ForgeGuard container image, Helm chart, or Nginx/CSP configuration | [ForgeGuard issues](https://github.com/forgeguard-ai/markdown-live-preview/issues) |
| Privacy/security defaults (analytics, external images, private mode, URL policy, persistence) | [ForgeGuard issues](https://github.com/forgeguard-ai/markdown-live-preview/issues) |
| Core Markdown editing/rendering that also happens on upstream builds | [Upstream project](https://github.com/tanabe/markdown-live-preview) |
| A suspected security vulnerability | Do **not** open a public issue — see [SECURITY.md](./SECURITY.md) |

## Reproduce before filing

For behavior that might be upstream, reproduce it against both where practical:

- The ForgeGuard image (`ghcr.io/forgeguard-ai/markdown-live-preview`), and
- An upstream build or the hosted site at <https://markdownlivepreview.com/>.

Note which is affected. If only the ForgeGuard image is affected, file here; if both are, upstream
is the better venue for the core issue.

## What to include

- The image tag or chart version (for self-hosted deployments).
- Browser and OS.
- Steps to reproduce and what you expected.
- Whether any non-default toggle (external images, analytics) was enabled.

## Documentation

See [`docs/site/`](./docs/site/index.md) for usage, deployment, and troubleshooting, including
[common issues](./docs/site/troubleshooting/common-issues.md).

## Support boundary

This is best-effort, community support through GitHub Issues. There is no private support
commitment. ForgeGuard-specific changes are not supported through upstream channels.
