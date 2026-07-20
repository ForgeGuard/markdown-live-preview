---
title: Compatibility
description: Supported Node, container, Kubernetes, browser, and platform targets.
order: 20
status: stable
---

# Compatibility

The supported targets below reflect what the repository's build, container, and chart actually
use and produce. For the relationship to the upstream project and known divergences, see
[Fork compatibility](../fork/compatibility.md).

## Build and runtime

| Target | Status | Notes |
|---|---|---|
| Node.js 22 | Supported | Used by the Dockerfile build stage; the baseline for building from source. |
| Vite 6 | Supported | Build tooling. |
| Nginx 1.27 (Alpine) | Supported | Runtime image that serves the built site on port `80`. |

## Container platforms

| Platform | Status | Notes |
|---|---|---|
| `linux/amd64` | Supported | The image is currently built for amd64 only. |
| `linux/arm64` | Not currently published | No multi-architecture build is configured; build from source for other architectures. |

## Kubernetes

| Target | Status | Notes |
|---|---|---|
| Helm 3 | Supported | Chart `markdown-live-preview` version `0.1.1`, app version `1.0.0`. |
| Read-only root filesystem | Requires writable volumes | See [Kubernetes](../deployment/kubernetes.md). |

## Browsers

| Target | Status | Notes |
|---|---|---|
| Modern Chromium, Firefox, WebKit | Supported | Requires JavaScript, `localStorage`, and Clipboard API for copy. |

## Version relationships

- The **image tag** (`latest` or `sha-<commit>`) and the **chart version** are independent; pin
  both for reproducible deployments.
- The chart's `appVersion` (`1.0.0`) mirrors the application's `package.json` version and does not
  change with every image build.

## Related

- [Fork compatibility](../fork/compatibility.md)
- [Build and configuration](./build-and-configuration.md)
