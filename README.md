# Braze Technical Sequence Diagram Tool

A specialized tool for Braze TAMs to quickly generate, view, and export professional Mermaid sequence diagrams using AI assistance.

## Project Structure

```
aiTool/
├── diagrams/              # Example Mermaid sequence diagrams
├── docs/                  # Documentation and references
├── exporter-app/          # Local web application for viewing/exporting diagrams
│   ├── assets/           # Branding assets
│   ├── dist/             # Built application (generated)
│   ├── scripts/          # Mermaid initialization
│   ├── styles/           # CSS styles
│   ├── utils/scripts/    # Helper scripts for link generation
│   └── index.html        # Main application entry point
└── .cursorrules          # AI assistant configuration
```

## Quick Start

### 1. Open the Project
Simply open the `aiTool` folder in **Cursor**. The assistant will automatically load the configuration from `.cursorrules`.

### 2. Generate Diagrams
Use the AI assistant (**Cmd+I** or **Cmd+L**) to describe a Braze flow. The assistant is configured to:
- Access live documentation via MCP for technical accuracy.
- Follow Braze naming conventions (SDK, API, Canvas, etc.).

### 3. View and Export
The AI will generate a **Direct Preview Link**. Clicking this link opens your diagram in the cloud-hosted Exporter App, where you can:
- **Live Edit**: Tweak the code in the browser for final adjustments.
- **High-Res Export**: Download as **SVG** (recommended for slides) or **PNG**.
- **Braze Branding**: Official Braze branding and styling is applied automatically.


## Features

- **AI-Powered Generation**: Context-aware diagram creation using MCP and live documentation.
- **Zero-Setup Preview**: No local servers required; diagrams load via URL parameters in the hosted web app.
- **Professional Styling**: Pre-configured Braze-branded color scheme (`#ED1A3B`) and formatting.
- **Presentation Ready**: Optimized for high-resolution exports suitable for Keynote, PowerPoint, and internal wikis.

## Documentation

- [Mermaid Reference](docs/mermaid-reference.md) - Mermaid syntax reference.
- [Example Diagrams](diagrams/) - Sample sequence diagrams for common Braze flows.

## Development (Internal)

### Building the Exporter App
If you need to make changes to the web app interface:
```bash
cd exporter-app
npm run build        # Production build for Vercel deployment
