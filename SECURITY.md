# Security policy

This policy covers the **ForgeGuard maintained fork** `forgeguard-ai/markdown-live-preview` — its
container image, Helm chart, Nginx configuration, and privacy/security defaults.

## Reporting a vulnerability

Please report suspected vulnerabilities privately. **Do not open a public issue** for a security
problem.

Use GitHub's private vulnerability reporting for this repository:

1. Go to the repository's **Security** tab.
2. Select **Report a vulnerability** (Privately report a vulnerability).
3. Provide a description, affected versions or image/chart tags, reproduction steps, and impact.

Private vulnerability reporting keeps the report visible only to the maintainers until a fix is
available. If you cannot access the Security tab, open a minimal public issue asking a maintainer
to enable a private report — without including vulnerability details.

## Scope

**In scope (report here):**

- The ForgeGuard container image, `nginx/default.conf` (CSP and security headers), the Helm chart's
  security posture, and the fork's privacy defaults (analytics, external images, private mode, URL
  policy, persistence).

**Upstream behavior:** issues in the core Markdown editor, parser, or renderer that also reproduce
on upstream builds are best reported to the upstream project,
[`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview), following its
security process. When in doubt, report here and note that the behavior may be upstream.

## What to expect

- Acknowledgement that the report was received.
- An assessment of validity and severity.
- A fix or mitigation for issues in the fork's scope, and coordination on disclosure timing.

## Good-faith guidance

Please do not run denial-of-service tests, access data that is not yours, or otherwise degrade
services while investigating. Sanitized rendering reduces risk but is not a complete isolation
boundary; findings that require enabling non-default features (for example, external images) should
say so.
