# Conflict resolution

How to resolve conflicts when merging an upstream tagged release, so that genuine upstream
improvements are kept and every ForgeGuard delta is reapplied.

## Principle

For each conflict, decide which side owns the concern:

- **Upstream owns** core editing, parsing, rendering, and general UI.
- **The fork owns** privacy defaults, the URL/scheme policy, local Monaco bundling, opt-in
  analytics, bounded persistence, container/Nginx, Helm, and CI. See the
  [patch inventory](./patch-inventory.md).

Take the upstream change where it is an improvement, then reapply the fork's behavior on top.
Never resolve a conflict by silently dropping a fork delta or an upstream fix.

## Per-area guidance

| Conflict area | Resolution |
|---|---|
| `src/main.js` render pipeline | Keep upstream parser/render improvements; ensure output still flows through `DOMPurify` and `enforceRenderedUrlPolicy`. |
| Privacy toggles / defaults | Keep the fork's opt-in analytics, default external-image block, and private mode. Merge upstream UI changes around them. |
| Persistence | Preserve `contentRetentionDays = 30` / `settingsRetentionDays = 365`; adopt upstream storage refactors only if they keep bounded expiry. |
| Monaco | Keep local bundling and the worker stub; do not reintroduce a runtime Monaco CDN. |
| Mermaid (upstream feature) | Do not enable by default. Reconcile with sanitizer + CSP + external-resource policy first; if unresolved, keep it disabled and note it in [fork compatibility](../../site/fork/compatibility.md). |
| `index.html` | Keep the header toggles, theme boot script, and SRI-pinned `html2pdf`; merge upstream head/markup changes around them. |
| CSP / headers | Never loosen the CSP to accommodate an upstream feature; adjust the feature instead. |
| `package.json` | Keep the fork's `license`, `repository`/`bugs`/`homepage`, and `engines`; take upstream dependency bumps after reconciling with bundling/CSP. |

## Verification sequence after resolving

Run the full [verification sequence](../development/verification.md), and specifically confirm:

1. `npm run build` succeeds and `dist/` has no runtime Monaco CDN import.
2. Analytics does not load before opt-in; external images are blocked by default; private mode
   suppresses content storage.
3. `helm lint` and `helm template` pass.
4. `node scripts/docs/validate-docs.mjs` passes.
5. `grep -rn "ghcr.io/forgeguard/" .` (excluding `.git`/`node_modules`) returns nothing.

Record in the sync PR which upstream tag was merged, which conflicts arose, and how each fork delta
was reapplied.

## See also

- [Sync policy](./sync-policy.md)
- [Patch inventory](./patch-inventory.md)
