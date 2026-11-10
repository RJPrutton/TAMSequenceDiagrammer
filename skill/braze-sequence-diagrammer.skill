---
name: braze-sequence-diagrammer
description: "Use when the user wants a Braze technical sequence diagram generated (e.g. 'diagram the push registration flow') — produces Braze-styled Mermaid, saves it, and gives a preview/export link."
---

# Braze Technical Sequence Diagrammer

This skill generates Braze-styled Mermaid sequence diagrams and links to the hosted exporter app (`https://tam-sequence-diagrammer.vercel.app`), where diagrams can be previewed, edited, and exported with Braze branding.

## When invoked

1. Ask (or infer from context) which Braze flow to diagram if not already clear (e.g. web push registration, in-app message display, SDK user creation, Canvas entry, CDP/Currents integration).
2. Write the Mermaid `sequenceDiagram` code directly — no conversational filler before the code block.

## Technical accuracy

Check Braze API endpoints, SDK behavior, and architecture against the current Braze documentation (`https://www.braze.com/docs`) rather than guessing, and check any unfamiliar Mermaid syntax against the Mermaid documentation (`https://mermaid.js.org`). Use web search or fetch to do this.

## Diagram style rules (must follow exactly)

- Start every diagram with `autonumber`.
- Use `participant` aliases, e.g. `participant B as Braze`.
- Wrap Braze-internal processing in `rect rgb(237, 26, 59, 0.1)`.
- Never add custom `style` blocks or `%%{init}%%` directives unless the user explicitly asks — the exporter app applies Braze branding (`#ED1A3B` accent, `#300266` dark purple text) globally, so rely on its theme for consistent, professional styling.
- Naming: use `End User` or `Customer App` for the user side; `Braze SDK` for client-side, `Braze API` for server-side.
- Use `alt/else` for error handling and `Note over Braze:` for internal logic notes.

## Saving the diagram

Save every generated diagram as a markdown file in a `diagrams/` folder (create it in the folder the user is working in, or the current working directory if that's unclear). Use a descriptive kebab-case filename, e.g. `web-push-registration.md`. File contents: the Mermaid code fenced in a ```mermaid block, nothing else needed but a diagram can have a one-line title comment above the fence if helpful.

## Generating the Direct Preview Link

After the code block, always provide a clickable link to the hosted exporter app:

- Base URL: `https://tam-sequence-diagrammer.vercel.app`
- Encoding (critical, must match the app's decode logic of `decodeURIComponent()` then `atob()`):
  1. Standard Base64-encode the raw Mermaid code (NOT URL-safe base64), e.g. Python: `base64.b64encode(code.strip().encode()).decode()`.
  2. URL-encode that Base64 string, e.g. Python: `urllib.parse.quote(encoded, safe='')`.
  3. The final encoded string must not contain triple backticks or markdown formatting — encode only the raw Mermaid source.
- Output format: `[Direct Preview Link](https://tam-sequence-diagrammer.vercel.app/?code=ENCODED_CODE)`
- Never link to mermaid.live — only the Braze exporter app.

On that page the user can live-edit the code and export high-res SVG (recommended for slides) or PNG with Braze branding applied automatically.

## Example encoding snippet

```python
import base64, urllib.parse
encoded = urllib.parse.quote(base64.b64encode(code.strip().encode()).decode(), safe='')
url = f"https://tam-sequence-diagrammer.vercel.app/?code={encoded}"
```
