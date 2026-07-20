---
title: Security and privacy
description: The container's Content Security Policy, security headers, and the app's privacy behavior and limits.
order: 10
status: stable
---

# Security and privacy

This page describes the deployment-level protections set by the Nginx container and how they
relate to the app-level privacy controls. Two layers exist: controls a user toggles in the app,
and headers an operator serves from the container.

## App-level vs deployment-level

| Layer | Owner | Examples |
|---|---|---|
| App controls | The user, in the browser | External images, Private mode, Analytics — see [Privacy controls](../usage/privacy-controls.md). |
| Deployment headers | The operator, via Nginx | Content Security Policy and security headers, below. |

## Security headers

The container's `nginx/default.conf` sets the following response headers on every request:

| Header | Value |
|---|---|
| `Content-Security-Policy` | See the policy below. |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### Content Security Policy

```text
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdnjs.cloudflare.com;
connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;
img-src 'self' data: https:;
style-src 'self' 'unsafe-inline';
font-src 'self';
object-src 'none';
base-uri 'self';
frame-ancestors 'none';
form-action 'self';
```

Notes on specific directives:

- `script-src` allows `googletagmanager.com` (for opt-in analytics) and `cdnjs.cloudflare.com`
  (for the SRI-pinned PDF export library). `'unsafe-inline'` is present for the app's small inline
  boot script.
- `connect-src` allows the Google Analytics measurement endpoints, used only after a user opts in.
- `img-src` permits any `https:` image at the CSP layer. The **default block** on cross-origin
  images is enforced in application JavaScript, not by the CSP — the CSP is deliberately broader
  so that enabling **External images** works without loosening headers.
- `frame-ancestors 'none'` and `X-Frame-Options: DENY` together prevent the app from being framed.

> The application is also deployable to Firebase Hosting upstream; that path (`firebase.json`)
> serves an equivalent CSP with `upgrade-insecure-requests` and adds HSTS. The ForgeGuard
> container is the supported self-host target and is the authority for the headers above.

## What leaves the browser

By default, nothing you type leaves the browser. The only outbound paths are:

- **Opt-in analytics** to Google, after you enable the Analytics toggle.
- **External images**, after you enable that toggle, which fetches from the image host (with a
  `no-referrer` policy).
- **The PDF export library** fetched once from `cdnjs.cloudflare.com` when the page loads.

## Rendering safety and its limits

Markdown is parsed by `marked`, sanitized by `DOMPurify`, and then filtered by a URL/scheme
policy: links are limited to `http`, `https`, `mailto`, and relative targets and receive
`rel="noopener noreferrer nofollow"`; images are limited to `https:` and `data:` and are removed
if cross-origin while External images is off.

This meaningfully reduces the risk of pasting untrusted Markdown, but it is **not** a complete
isolation boundary. Sanitizer bypasses, browser vulnerabilities, enabling remote resources, and
operator misconfiguration all remain relevant. Do not treat the preview as a safe sandbox for
actively hostile content.

## Container security posture (Kubernetes)

The Helm chart runs the container non-root with a `RuntimeDefault` seccomp profile,
`allowPrivilegeEscalation: false`, all capabilities dropped, and a read-only root filesystem.
Because Nginx needs writable cache/PID/temp paths, the read-only root filesystem requires
writable `emptyDir` volumes — see [Kubernetes](../deployment/kubernetes.md).

## Related

- [Privacy controls](../usage/privacy-controls.md)
- [Export and persistence](../usage/export-and-persistence.md)
- [Kubernetes](../deployment/kubernetes.md)
