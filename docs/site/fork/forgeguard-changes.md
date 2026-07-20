---
title: ForgeGuard changes
description: What the ForgeGuard fork adds or changes compared to upstream, from a user's perspective.
order: 10
status: stable
---

# ForgeGuard changes

This is a maintained fork of [`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview).
The core editing experience is upstream's; ForgeGuard adds privacy-conscious defaults and
self-hosting artifacts. The table below lists the user-visible changes.

## User-visible changes

| Area | What ForgeGuard changed | Where to learn more |
|---|---|---|
| Local Monaco bundling | The Monaco editor is bundled from project dependencies instead of being loaded from a third-party runtime CDN. | [Reference: build](../reference/build-and-configuration.md) |
| Opt-in analytics | Google Analytics is disabled by default and loads only after you enable the Analytics toggle. | [Privacy controls](../usage/privacy-controls.md) |
| Private mode | A toggle that stops editor content from being saved to browser storage. | [Privacy controls](../usage/privacy-controls.md) |
| Remote-image blocking | Cross-origin images are blocked by default; an explicit toggle enables them with `no-referrer` and lazy loading. | [Privacy controls](../usage/privacy-controls.md) |
| Link/image URL policy | Rendered links are limited to safe schemes and get `rel="noopener noreferrer nofollow"`; images are limited to `https:`/`data:`. | [Security and privacy](../operations/security-and-privacy.md) |
| Bounded persistence | Editor content is retained for 30 days and settings for 365 days, instead of indefinitely. | [Export and persistence](../usage/export-and-persistence.md) |
| Nginx security headers | The container serves a strict CSP plus MIME, clickjacking, referrer, and permissions headers. | [Security and privacy](../operations/security-and-privacy.md) |
| Container and Compose packaging | A multi-stage Dockerfile and a Compose file for local and single-host hosting. | [Container](../deployment/container.md) · [Compose & Portainer](../deployment/compose-and-portainer.md) |
| Helm chart and GHCR publication | A published container image and an OCI Helm chart with a hardened security posture. | [Kubernetes](../deployment/kubernetes.md) |

## Scope of the "local bundling" claim

Local bundling applies to the **Monaco editor**. The PDF export feature still loads the `html2pdf`
library at runtime from `cdnjs.cloudflare.com` (pinned with a Subresource Integrity hash). The app
is therefore not fully free of third-party runtime scripts; see
[Export and persistence](../usage/export-and-persistence.md).

## What ForgeGuard did not change

- The core Markdown editing and preview behavior is upstream's.
- Runtime privacy defaults are hardened but the application UI is not redesigned.
- Upstream's Mermaid diagram rendering is **not** included in this fork; see
  [Compatibility](./compatibility.md).

## Related

- [Compatibility](./compatibility.md)
- [Upstream](./upstream.md)
- [Migration from upstream](./migration-from-upstream.md)
