---
title: Upgrades
description: Image tag policy, chart upgrades, and how the fork tracks upstream releases.
order: 20
status: stable
---

# Upgrades

This page covers keeping a deployment current: container image tags, Helm chart upgrades, and how
this fork relates to upstream releases.

## Prerequisites

- An existing container or Helm deployment (see [Deployment](../deployment/container.md)).

## Image tags

| Tag | Behavior | Recommended for |
|---|---|---|
| `latest` | Moves with each build from `main`. | Trying the newest build; non-critical use. |
| `sha-<commit>` | Immutable; always the same image. | Persistent and production-like deployments. |

For a stable deployment, pin an immutable `sha-<commit>` tag and update it deliberately:

```bash
docker pull ghcr.io/forgeguard-ai/markdown-live-preview:sha-<commit>
```

## Upgrade a container / Compose deployment

```bash
docker compose pull   # or: docker pull <image>:<tag>
docker compose up -d
```

Because the app is stateless (all user state lives in the visitor's browser), upgrades do not
require data migration. Users keep their locally stored content and settings.

## Upgrade the Helm release

```bash
helm upgrade --install markdown-live-preview \
  oci://ghcr.io/forgeguard-ai/helm-charts/markdown-live-preview --version <chart-version> \
  --set image.tag=<image-tag>
```

The chart version and the image tag are independent. Pin both for reproducibility. Verify after
upgrading:

```bash
kubectl rollout status deploy/markdown-live-preview
```

## Tracking upstream

This fork tracks upstream **tagged releases** of `tanabe/markdown-live-preview` and reapplies the
ForgeGuard privacy, container, and Helm changes on top. New upstream features are not automatically
present; see [Fork compatibility](../fork/compatibility.md) for current divergences, and
[Migration from upstream](../fork/migration-from-upstream.md) if you are moving from an upstream
build.

## Verify

```bash
curl --fail http://localhost:8080/
```

## Related

- [Container](../deployment/container.md)
- [Kubernetes](../deployment/kubernetes.md)
- [Fork compatibility](../fork/compatibility.md)
