---
title: Export and persistence
description: Export the preview to PDF and understand what is stored in the browser and for how long.
order: 30
status: stable
---

# Export and persistence

This page covers exporting the rendered preview to PDF and exactly what the app stores in your
browser.

## Prerequisites

- A running instance (see [Quickstart](../getting-started/quickstart.md)).

## Export to PDF

Click **Export PDF** in the header to render the current preview to a PDF file
(`markdown-preview.pdf`). The export always uses the light theme for readability, regardless of
the theme you are viewing.

PDF export is powered by the `html2pdf` library, which is loaded at runtime from
`cdnjs.cloudflare.com`. This is the one third-party script the app fetches; it is pinned with a
Subresource Integrity (SRI) hash and loaded with `crossorigin="anonymous"` and a `no-referrer`
policy. Two consequences follow:

- The container's Content Security Policy explicitly allows `cdnjs.cloudflare.com` in `script-src`
  so the library can load. See [Security and privacy](../operations/security-and-privacy.md).
- In a fully offline or CDN-blocked environment the library will not load, and clicking
  **Export PDF** shows a message that export is unavailable. See
  [Common issues](../troubleshooting/common-issues.md).

## What is stored, and for how long

The app uses `localStorage` (under the namespace `com.markdownlivepreview`) with bounded
expiries. Nothing is stored server-side.

| Stored item | Retention | Notes |
|---|---|---|
| Editor content (`last_state`) | 30 days | Not stored while [Private mode](./privacy-controls.md) is on. |
| Sync scroll setting | 365 days | |
| Theme setting | 365 days | Also mirrored to a boot key for flash-free theme on load. |
| Private mode setting | 365 days | |
| External images setting | 365 days | |
| Analytics setting | 365 days | Also mirrored to a boot key. |

Expired entries are not returned after their retention window elapses. This is a deliberate change
from indefinite persistence.

## Clear stored data

To remove everything the app stored, clear site data for the app's origin in your browser
(Application → Storage → Clear site data in Chromium, or the equivalent). For a one-off session
with no content saved, enable [Private mode](./privacy-controls.md) before typing.

## Verify

- **Export:** click **Export PDF** and confirm `markdown-preview.pdf` downloads with light-theme
  styling.
- **Persistence:** type text, reload, and confirm it is restored (with Private mode off).

## Related

- [Privacy controls](./privacy-controls.md)
- [Common issues](../troubleshooting/common-issues.md)
