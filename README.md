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

### 1. Set Up the Exporter App

```bash
cd exporter-app
npm install
npm run build
npm run serve
```

The app will be available at `http://localhost:8080`.

### 2. Generate Diagrams

Use the AI assistant (configured via `.cursorrules`) to generate Mermaid sequence diagrams. The assistant will:

- Create technically accurate Braze sequence diagrams
- Follow Braze naming conventions and styling
- Generate links to pre-load diagrams in the local exporter app

### 3. View and Export

Click the generated link to open the diagram in the exporter app, where you can:
- Edit the diagram code
- Export as SVG or PNG
- Adjust font size and zoom

## Features

- **AI-Powered Generation**: Context-aware diagram creation using MCP and live documentation
- **Local Exporter App**: View, edit, and export diagrams without external dependencies
- **URL-Based Sharing**: Pre-load diagrams via URL parameters
- **Professional Styling**: Braze-branded color scheme and formatting
- **Export Options**: SVG and PNG export with high-resolution support

## Documentation

- [Exporter App Setup Guide](exporter-app/SETUP.md) - Detailed setup and usage instructions
- [Mermaid Reference](docs/mermaid-reference.md) - Mermaid syntax reference
- [Example Diagrams](diagrams/) - Sample sequence diagrams

## Development

### Building the Exporter App

```bash
cd exporter-app
npm run build        # Production build
npm run dev          # Development build with watch mode
```

### Generating Links

```bash
# Using npm script
npm run generate-link -- "sequenceDiagram\nA->>B: Hello"

# Or directly
node utils/scripts/generate-link.js "your mermaid code"
```

## Configuration

The AI assistant behavior is configured in `.cursorrules`. Key settings:

- Auto-styling with `autonumber` and participant aliases
- Braze-specific naming conventions
- Local app link generation (not mermaid.live)
- Error handling and internal logic notation

## License

ISC

