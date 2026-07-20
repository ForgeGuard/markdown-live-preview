---
title: Common issues
description: Fixes for external images, analytics, PDF export, read-only filesystem, and ports.
order: 10
status: stable
---

# Common issues

Solutions to the issues most likely to come up when using or hosting the app.

## Remote images do not appear

External (cross-origin) images are blocked by default. Enable the **External images** toggle in
the header. Only `https:` and `data:` image sources are permitted; `http:` and other schemes are
removed even when the toggle is on. See [Privacy controls](../usage/privacy-controls.md).

## Analytics is not recording

Analytics is opt-in and off by default. Enable the **Analytics** toggle; a Google Analytics script
then loads and collection begins. If it still does not record, confirm your network and the
container's Content Security Policy allow `googletagmanager.com` and the Google Analytics endpoints
(they are allowed by the default policy). See
[Security and privacy](../operations/security-and-privacy.md).

## "PDF export is not available yet"

PDF export uses a library loaded at runtime from `cdnjs.cloudflare.com`. If that request is blocked
(offline, a proxy, or a tightened CSP), the library never loads and clicking **Export PDF** shows
this message. Allow `cdnjs.cloudflare.com` in `script-src`, or export from an environment with
access to the CDN. See [Export and persistence](../usage/export-and-persistence.md).

## Kubernetes pod crashes with a read-only filesystem error

The chart sets `readOnlyRootFilesystem: true`, but Nginx must write to cache, PID, and temp paths.
Without writable `emptyDir` volumes the container fails to start. Mount writable volumes for those
paths, or relax the setting for the environment. See [Kubernetes](../deployment/kubernetes.md).

## Port already in use

If `docker run -p 8080:80` fails because `8080` is taken, map a different host port, for example
`-p 9090:80`, and browse to that port. The container always listens on `80` internally.

## Content was not restored after reload

If your text is not restored, check whether **Private mode** is enabled — it stops content from
being saved. Also note editor content expires after 30 days. See
[Export and persistence](../usage/export-and-persistence.md).

## Related

- [Privacy controls](../usage/privacy-controls.md)
- [Security and privacy](../operations/security-and-privacy.md)
