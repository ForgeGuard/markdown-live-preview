---
title: Migration from upstream
description: What changes for users moving from an upstream build or the hosted site to this fork.
order: 40
status: stable
---

# Migration from upstream

If you are coming from the hosted site at <https://markdownlivepreview.com/> or a self-built
upstream copy, the editing experience is the same, but defaults and distribution differ. This page
lists what to expect.

## Prerequisites

- A running instance of this fork (see [Quickstart](../getting-started/quickstart.md)).

## What is the same

- The split editor and live preview, Markdown syntax support, themes, sync scroll, copy, and reset
  behave as upstream.
- The default sample document and general look are preserved.

## What differs

| Behavior | Upstream default | This fork default | Action |
|---|---|---|---|
| Analytics | On | Off (opt-in) | Enable the Analytics toggle if you want it. |
| Remote images | Rendered | Blocked | Enable the External images toggle for trusted content. |
| Monaco editor source | Runtime CDN | Bundled locally | No action; improves offline/CSP behavior. |
| Persistence | Effectively indefinite | Content 30 days, settings 365 days | Re-save periodically if you rely on long-term recall. |
| Mermaid diagrams | Rendered | Not supported | Use an alternative until a future sync reconciles it. |
| Hosting | Hosted site | Self-hosted container / Helm | See [Deployment](../deployment/container.md). |

## Moving existing content

There is no export/import between the hosted site and a self-hosted instance — content lives in
each browser's `localStorage` per origin. To carry a document over, copy the Markdown text
(the **Copy** button) and paste it into your self-hosted instance.

## Verify

- Confirm the privacy toggles reflect the restrictive defaults on first load.
- Paste a document that uses remote images and confirm they are blocked until you opt in.

## Related

- [ForgeGuard changes](./forgeguard-changes.md)
- [Compatibility](./compatibility.md)
- [Privacy controls](../usage/privacy-controls.md)
