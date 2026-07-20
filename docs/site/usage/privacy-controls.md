---
title: Privacy controls
description: Control persistence, analytics, and remote image loading from the header toggles.
order: 20
status: stable
---

# Privacy controls

Markdown Live Preview keeps content in your browser and blocks or defers most outbound requests.
Three header toggles let you adjust this behavior. All three default to the privacy-preserving
setting.

## Prerequisites

- A running instance (see [Quickstart](../getting-started/quickstart.md)).

## Defaults at a glance

| Control | Default | When enabled |
|---|---|---|
| External images | Off (blocked) | Cross-origin images render with `loading="lazy"` and `referrerpolicy="no-referrer"`. |
| Private mode | Off (content is saved) | Editor content is no longer written to or read from `localStorage`. |
| Analytics | Off (no analytics) | Google Analytics loads and begins collecting after you opt in. |

Each toggle's own on/off state is remembered in `localStorage` so your choice persists across
visits (see [Export and persistence](./export-and-persistence.md)).

## External images

By default, images whose source is a different origin than the app are removed from the preview
entirely. Same-origin images and inline `data:` images always render. Only `https:` and `data:`
image sources are permitted; other schemes are dropped.

Enable **External images** to allow cross-origin `https:` images. When allowed, each image is
rendered with lazy loading and a `no-referrer` referrer policy, so the remote host does not
receive a referrer header. Note that loading a remote image reveals your IP address and request
to that host — enable this only for content you trust.

## Private mode

By default, the current editor content is saved to `localStorage` so it is restored on your next
visit. Enable **Private mode** to stop this: while it is on, content is neither saved nor loaded.
This is useful on shared or public machines.

Private mode affects only editor **content**. Your toggle settings (theme, sync scroll, and the
privacy toggles themselves) are still stored so the interface behaves consistently.

## Analytics

Analytics is **opt-in**. No analytics script is loaded and no measurement requests are made until
you enable the **Analytics** toggle. When you enable it, a Google Analytics (GA4) script is loaded
from Google's tag manager and analytics begins. Disabling the toggle stops future opt-in loads;
to clear an already-loaded session, reload the page with the toggle off.

## Verify

- **External images blocked:** paste `![remote](https://example.com/logo.png)` with the toggle
  off and confirm no image appears; enable the toggle and confirm it renders.
- **Private mode:** enable Private mode, type text, reload the page, and confirm the text is not
  restored.
- **Analytics off by default:** with the toggle off, open your browser's network tab and confirm
  no request is made to `googletagmanager.com` or `google-analytics.com`.

## Related

- [Export and persistence](./export-and-persistence.md)
- [Security and privacy](../operations/security-and-privacy.md)
