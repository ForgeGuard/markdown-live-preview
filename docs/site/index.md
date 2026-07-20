---
title: Markdown Live Preview
description: Privacy-conscious, browser-only Markdown preview, packaged by ForgeGuard for self-hosting.
order: 0
status: stable
---

# ForgeGuard Markdown Live Preview

Markdown Live Preview is a browser-only tool for editing Markdown with a live rendered preview.
This is the ForgeGuard AI **maintained fork** of [`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview):
it tracks tagged upstream releases and adds privacy-conscious defaults, local dependency
bundling, and container/Helm distribution. Nothing you type is sent to a server — the editor,
Markdown parser, and preview all run in your browser tab.

## Start with a task

- **Preview Markdown** — run the app and learn the editor.
  [Quickstart](./getting-started/quickstart.md) ·
  [Editor and preview](./usage/editor-and-preview.md)
- **Control privacy** — understand and adjust what is stored and what leaves the browser.
  [Privacy controls](./usage/privacy-controls.md) ·
  [Export and persistence](./usage/export-and-persistence.md)
- **Deploy the app** — self-host with a container, Compose, Portainer, or Kubernetes.
  [Container](./deployment/container.md) ·
  [Compose & Portainer](./deployment/compose-and-portainer.md) ·
  [Kubernetes](./deployment/kubernetes.md)
- **Understand the fork** — see what ForgeGuard changed and how it relates to upstream.
  [ForgeGuard changes](./fork/forgeguard-changes.md) ·
  [Compatibility](./fork/compatibility.md) ·
  [Upstream](./fork/upstream.md)

## Sections

| Section | Contents |
|---|---|
| [Getting started](./getting-started/quickstart.md) | Fastest path from zero to a running preview. |
| [Usage](./usage/editor-and-preview.md) | Editor, preview, privacy controls, export, and persistence. |
| [Deployment](./deployment/container.md) | Container, Compose/Portainer, and Kubernetes. |
| [Operations](./operations/security-and-privacy.md) | Security headers, privacy behavior, and upgrades. |
| [Reference](./reference/build-and-configuration.md) | Build, configuration, and compatibility. |
| [Troubleshooting](./troubleshooting/common-issues.md) | Common issues and their fixes. |
| [Fork](./fork/forgeguard-changes.md) | ForgeGuard changes, compatibility, upstream, and migration. |

## What this fork is and is not

This distribution hardens defaults and packages the app for self-hosting. It does **not** change
the core Markdown editing experience, and it does **not** include upstream's Mermaid diagram
rendering. Sanitized rendering reduces the risk of pasting untrusted Markdown but is not a
complete isolation boundary; see [Security and privacy](./operations/security-and-privacy.md).
