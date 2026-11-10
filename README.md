# Braze Technical Sequence Diagram Tool

A specialized tool for Braze TAMs to quickly generate, view, and export professional Mermaid sequence diagrams in Braze styling, using AI assistance.

## Project Structure

```
TAMSequenceDiagrammer/
├── diagrams/              # Example Mermaid diagrams + outputted Mermaid diagrams
└── exporter-app/          # Web application for viewing/exporting diagrams
    ├── assets/            # Branding assets
    ├── dist/              # Built application (generated)
    ├── scripts/           # Mermaid initialization
    ├── styles/            # CSS styles
    ├── utils/scripts/     # Helper scripts for link generation
    └── index.html         # Main application entry point
```

## Quick Start

### 1. Install the Skill

Diagram generation is handled by the **braze-sequence-diagrammer** Claude skill. Install it in Claude, then ask for the flow you want, for example:

> "Diagram the web push registration flow"

The skill follows Braze naming conventions (SDK, API, Canvas, etc.) and the Braze diagram style rules.

### 2. Generate Diagrams

Describe a Braze flow (web push registration, in-app message display, SDK user creation, Canvas entry, CDP/Currents integration, and so on). Claude will:

- Write the Mermaid `sequenceDiagram` code.
- Save it as a markdown file in a `diagrams/` folder.
- Give you a **Direct Preview Link**.

### 3. View and Export

The Direct Preview Link opens your diagram in the cloud-hosted Exporter App, where you can:

- **Live Edit**: Tweak the code in the browser for final adjustments.
- **High-Res Export**: Download as **SVG** (recommended for slides) or **PNG**.
- **Braze Branding**: Official Braze branding and styling is applied automatically.

## Features

- **AI-Powered Generation**: Context-aware diagram creation using live Braze documentation. Describe a flow in plain language and get a ready-to-export diagram.
- **Zero-Setup Preview**: No local servers required; diagrams load via URL parameters in the hosted web app.
- **Professional Styling**: Pre-configured Braze-branded color scheme (`#ED1A3B`) and formatting.
- **Presentation Ready**: Optimized for high-resolution exports suitable for Keynote, PowerPoint, and internal wikis.

## Documentation

- [Example Diagrams](https://github.com/RJPrutton/TAMSequenceDiagrammer/blob/main/diagrams) - Sample sequence diagrams for common Braze flows.

## Development (Internal)

### Building the Exporter App

If you need to make changes to the web app interface:

```bash
cd exporter-app
npm run build        # Production build for Vercel deployment
```
