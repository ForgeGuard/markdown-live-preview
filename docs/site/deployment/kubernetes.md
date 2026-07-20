---
title: Kubernetes
description: Deploy Markdown Live Preview to Kubernetes with the ForgeGuard Helm chart.
order: 30
status: stable
---

# Kubernetes

ForgeGuard publishes a Helm chart for Markdown Live Preview. The chart runs the static container
with a hardened security posture: non-root, dropped capabilities, no privilege escalation, a
read-only root filesystem, and a `RuntimeDefault` seccomp profile.

## Prerequisites

- A Kubernetes cluster and `kubectl` context.
- Helm 3.
- Cluster access to pull `ghcr.io/forgeguard-ai/markdown-live-preview`.

## Chart facts

| Field | Value |
|---|---|
| Chart path (in repo) | `charts/markdown-live-preview` |
| Chart version | `0.1.1` |
| App version | `1.0.0` |
| Default image | `ghcr.io/forgeguard-ai/markdown-live-preview:latest` |
| Service | `ClusterIP` on port `80`, targeting container port `80` (`http`) |
| Probes | HTTP `GET /` liveness and readiness |
| Resources | requests `50m` CPU / `64Mi`; limits `200m` CPU / `128Mi` |
| Ingress | Disabled by default |
| ServiceAccount | Not created by default (`serviceAccount.create: false`) |

## Install from the local chart

From a checkout of this repository:

```bash
helm upgrade --install markdown-live-preview charts/markdown-live-preview \
  --set image.tag=latest
```

Lint and render the chart without applying it:

```bash
helm lint charts/markdown-live-preview
helm template markdown-live-preview charts/markdown-live-preview
```

## Install from the OCI chart

The chart is also published to GHCR as an OCI artifact under
`oci://ghcr.io/forgeguard-ai/helm-charts`:

```bash
helm pull oci://ghcr.io/forgeguard-ai/helm-charts/markdown-live-preview --version 0.1.1
helm upgrade --install markdown-live-preview \
  oci://ghcr.io/forgeguard-ai/helm-charts/markdown-live-preview --version 0.1.1
```

If the package is private, authenticate first:

```bash
helm registry login ghcr.io -u <github-user>
```

## Read-only root filesystem: writable volumes required

The chart sets `securityContext.readOnlyRootFilesystem: true`. Nginx needs to write to a few
paths at runtime (cache, PID, and temporary files), which a read-only root filesystem forbids. On
most clusters you must provide writable `emptyDir` volumes for those paths, or the container will
fail to start. The chart does not mount these by default, so add them through your own values or a
patch, for example:

```yaml
# values you supply to helm upgrade --install ... -f writable.yaml
extraVolumes:
  - name: nginx-cache
    emptyDir: {}
  - name: nginx-run
    emptyDir: {}
  - name: tmp
    emptyDir: {}
```

> The bundled chart templates do not yet expose `extraVolumes`/`extraVolumeMounts`. Until they
> do, mount the writable paths with a Kustomize patch or a post-render step, or relax
> `readOnlyRootFilesystem` for a specific environment. Validate on a non-production namespace
> first. This limitation is tracked as a known issue.

## Ingress

Ingress is disabled by default. Enable it and set a host/class through values:

```bash
helm upgrade --install markdown-live-preview charts/markdown-live-preview \
  --set ingress.enabled=true \
  --set ingress.className=nginx \
  --set ingress.hosts[0].host=markdown.example.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=Prefix
```

## Verify

```bash
kubectl get pods -l app.kubernetes.io/name=markdown-live-preview
kubectl port-forward svc/markdown-live-preview 8080:80
curl --fail http://localhost:8080/
```

## Related

- [Container](./container.md)
- [Security and privacy](../operations/security-and-privacy.md)
- [Upgrades](../operations/upgrades.md)
