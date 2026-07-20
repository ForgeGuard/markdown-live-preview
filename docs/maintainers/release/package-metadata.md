# Package metadata

Notes on `package.json` metadata for this fork and the corrections applied during the docs
migration.

## Corrections applied

| Field | Was | Now | Reason |
|---|---|---|---|
| `license` | `ISC` | `MIT` | The root `LICENSE` is MIT (© 2020 Hideaki Tanabe) and GitHub detects MIT. `ISC` was incorrect. |
| `repository.url` | upstream `tanabe/...` | `forgeguard-ai/markdown-live-preview` | This package's source lives in the fork. |
| `bugs.url` | upstream issues | `forgeguard-ai/markdown-live-preview/issues` | ForgeGuard packaging/privacy issues should route to the fork. |
| `homepage` | upstream `#readme` | `forgeguard-ai/markdown-live-preview#readme` | Points to this repository's README. |
| `description` | Markdown-link string | plain text | Avoid embedded Markdown in a metadata string. |
| `engines.node` | (absent) | `>=22` | Documents the supported/build Node version. |

The `LICENSE` file itself is unchanged (byte-for-byte). Upstream attribution is preserved in the
README, the `docs/site/fork/` pages, and the license notice; only the machine-readable package
metadata was repointed so ForgeGuard-specific issues do not land upstream by accident.

## Not changed

- `name`, `version` (`1.0.0`, which the chart mirrors as `appVersion`).
- Dependency versions and the `storehouse-js` GitHub dependency.
- The upstream MIT license text and copyright holder.

## See also

- [Container and chart release](./container-and-chart.md)
