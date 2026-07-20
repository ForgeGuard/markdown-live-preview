# Upstream sync policy

How this fork stays current with upstream
[`tanabe/markdown-live-preview`](https://github.com/tanabe/markdown-live-preview) while preserving
ForgeGuard changes.

## Tracked source

- **Upstream:** `tanabe/markdown-live-preview`.
- **Tracking policy:** upstream **tagged releases** (matching `.forgeguard/docs.yml`'s
  `tracking_policy: tagged-releases`). The fork does not continuously merge upstream `main`.
- **Shared merge base (research-time):** `a9096889daef75633e4a42e95a847203ad7014ae`. Re-derive the
  current base before each sync with `git merge-base HEAD <upstream>/main`.

## Cadence

- Review upstream tags when a new one is published, and on a periodic cadence (at least quarterly).
- Prioritize security-relevant upstream fixes.

## Procedure (real merge of a tagged release)

1. Add the upstream remote and fetch tags:
   ```bash
   git remote add upstream https://github.com/tanabe/markdown-live-preview.git   # once
   git fetch upstream --tags
   ```
2. Create a sync branch from the fork default branch.
3. Merge the chosen upstream **tag** (not `main`):
   ```bash
   git merge <upstream-tag>
   ```
4. Resolve conflicts using [conflict-resolution.md](./conflict-resolution.md) and the
   [patch inventory](./patch-inventory.md). Reapply ForgeGuard deltas; preserve genuine upstream
   improvements.
5. Run the full [verification sequence](../development/verification.md).
6. Open a PR summarizing which upstream tag was merged and which fork deltas were reapplied.

## Rules

- **Preserve upstream improvements.** Do not discard an upstream change just because it touches a
  fork-owned file; integrate it and reapply the ForgeGuard delta on top.
- **Reapply, do not drop, fork deltas.** Every item in the patch inventory must still hold after a
  sync, verified by the checks in that document.
- **Do not adopt upstream features that conflict with fork policy without review.** In particular,
  upstream Mermaid rendering must be reconciled with this fork's sanitization, CSP, and
  external-resource policy before it can be enabled here.

## See also

- [Patch inventory](./patch-inventory.md)
- [Conflict resolution](./conflict-resolution.md)
