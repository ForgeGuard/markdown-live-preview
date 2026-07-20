---
title: Fork compatibility
description: The upstream base this fork tracks, known divergences, and version relationships.
order: 20
status: stable
---

# Fork compatibility

This page states how the ForgeGuard fork relates to upstream
[`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview): what it is based
on, where it diverges, and how versions line up. For general platform support (Node, container,
Kubernetes, browsers), see [Reference: compatibility](../reference/compatibility.md).

## Upstream base and tracking

The fork tracks upstream **tagged releases** and reapplies the ForgeGuard privacy, container, and
Helm changes on top. It does not continuously merge upstream's default branch, so upstream changes
made after the tracked point are not automatically present.

## Known divergences

| Area | Upstream | This fork |
|---|---|---|
| Mermaid diagrams | Rendered in current upstream. | **Not supported.** Reconciling Mermaid with this fork's sanitization, CSP, and external-resource policy is deferred. Do not rely on Mermaid rendering here. |
| Monaco editor | Historically loaded from a runtime CDN. | Bundled from local dependencies. |
| Analytics | Enabled by default upstream. | Opt-in, off by default. |
| Remote images | Rendered. | Blocked by default; opt-in toggle. |
| Persistence | Effectively indefinite. | Bounded (content 30 days, settings 365 days). |
| Distribution | Firebase Hosting / hosted site. | Self-hostable GHCR container and OCI Helm chart. |

## Platforms

Container images are currently built for `linux/amd64` only. For other architectures, build the
image from source (see [Container](../deployment/container.md)).

## Version relationships

| Artifact | Version | Notes |
|---|---|---|
| Application | `1.0.0` | `package.json` version and the chart's `appVersion`. |
| Helm chart | `0.1.1` | Versioned independently of the image. |
| Container image | `latest` + `sha-<commit>` | Rolling and immutable tags; not semver-tagged. |

The image tag and chart version are independent — pin both for reproducible deployments.

## Migration caveats

If you are moving from an upstream build or the hosted site, expect the privacy toggles to default
to the restrictive setting and Mermaid diagrams not to render. See
[Migration from upstream](./migration-from-upstream.md).

## Related

- [ForgeGuard changes](./forgeguard-changes.md)
- [Upstream](./upstream.md)
- [Reference: compatibility](../reference/compatibility.md)
