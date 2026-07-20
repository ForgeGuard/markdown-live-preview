---
title: Upstream
description: How the ForgeGuard fork relates to the upstream project, and where to file issues.
order: 30
status: stable
---

# Upstream

Markdown Live Preview is created and maintained by
[Hideaki Tanabe](https://github.com/tanabe/markdown-live-preview). This repository is a ForgeGuard
AI **maintained fork** of that project.

## Relationship

- Upstream owns the original application, its identity, and the hosted site at
  <https://markdownlivepreview.com/>.
- ForgeGuard maintains packaging (container image, Helm chart) and privacy/security default
  changes on top of a tracked upstream release.
- ForgeGuard is **not affiliated with or endorsed by** the upstream project, and this fork does not
  imply upstream endorsement of ForgeGuard.

## Attribution and license

The project is distributed under the MIT License, © 2020 Hideaki Tanabe. Upstream copyright and
the MIT terms are preserved unchanged in [`LICENSE`](https://github.com/forgeguard-ai/markdown-live-preview/blob/main/LICENSE). ForgeGuard-authored changes
are identified in the repository history and in [ForgeGuard changes](./forgeguard-changes.md).

## Where to file issues

| Kind of issue | Where |
|---|---|
| ForgeGuard container, Helm chart, or privacy/security defaults | [ForgeGuard issues](https://github.com/forgeguard-ai/markdown-live-preview/issues) |
| Core Markdown editing behavior reproducible on upstream builds | [Upstream project](https://github.com/tanabe/markdown-live-preview) |

If you are unsure, reproduce the problem against both the ForgeGuard image and an upstream build
where practical, and note which is affected. See
[SUPPORT.md](https://github.com/forgeguard-ai/markdown-live-preview/blob/main/SUPPORT.md).

## Related

- [ForgeGuard changes](./forgeguard-changes.md)
- [Compatibility](./compatibility.md)
- [Migration from upstream](./migration-from-upstream.md)
