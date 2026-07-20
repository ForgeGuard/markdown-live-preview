---
title: Editor and preview
description: Edit Markdown in the Monaco editor and read the live rendered preview.
order: 10
status: stable
---

# Editor and preview

The interface is split into two panes: a Monaco-based editor on the left and a live HTML preview
on the right. Editing happens entirely in your browser.

## Prerequisites

- A running instance (see [Quickstart](../getting-started/quickstart.md)).

## Layout and controls

The header exposes these actions and toggles:

| Control | Effect |
|---|---|
| **Reset** | Restores the default Markdown sample. If you have edited the content, it asks for confirmation first. |
| **Copy** | Copies the current editor text to the clipboard. |
| **Export PDF** | Renders the preview to a PDF. See [Export and persistence](./export-and-persistence.md). |
| **Sync scroll** | Keeps the preview scrolled in proportion to the editor. |
| **Dark mode** | Switches the page and preview between light and dark themes. |
| **External images** | Allows remote images in the preview. Off by default — see [Privacy controls](./privacy-controls.md). |
| **Private mode** | Stops saving editor content to browser storage. See [Privacy controls](./privacy-controls.md). |
| **Analytics** | Enables opt-in Google Analytics. Off by default. |

## Editing

Type Markdown in the left pane. As you type, the preview updates: the text is parsed by `marked`,
sanitized by `DOMPurify`, and passed through a URL/scheme policy before it is inserted into the
preview. Standard Markdown is supported — headings, emphasis, lists, tables, blockquotes, links,
images, and fenced or inline code.

The editor is single-purpose: language features such as autocomplete, hover, folding, and the
minimap are intentionally disabled to keep it a distraction-free Markdown surface.

### Resize the panes

Drag the divider between the two panes to change their relative width. Double-click the divider
to reset the split to 50/50.

## Preview

The preview uses GitHub-style Markdown CSS and follows the current theme. Rendered links open
with `rel="noopener noreferrer nofollow"`, and images are subject to the remote-image policy
described in [Privacy controls](./privacy-controls.md).

> Sanitized rendering reduces the risk of pasting untrusted Markdown, but it is not a complete
> isolation boundary. See [Security and privacy](../operations/security-and-privacy.md).

## Verify

- Type `# Hello` and confirm a level-1 heading appears in the preview.
- Enable **Sync scroll**, scroll the editor, and confirm the preview follows.

## Related

- [Privacy controls](./privacy-controls.md)
- [Export and persistence](./export-and-persistence.md)
