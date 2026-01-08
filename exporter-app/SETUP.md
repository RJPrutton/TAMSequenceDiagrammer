# Exporter App Setup Guide

This guide explains how to set up the exporter app to receive pre-loaded Mermaid diagrams via URL links.

## Prerequisites

- Node.js and npm installed
- The exporter-app folder set up

## Setup Steps

### 1. Install Dependencies

```bash
cd exporter-app
npm install
```

This will install:
- Webpack and build tools
- Monaco Editor
- http-server (for local hosting)

### 2. Build the Application

```bash
npm run build
```

This compiles the JavaScript bundle using webpack. The output will be in the `dist/` folder.

### 3. Start the Local Server

```bash
npm run serve
```

This starts a local HTTP server on port 8080. The app will be available at:
- `http://localhost:8080`

**Note:** Keep this server running while you want to use the app.

### 4. Alternative: Build and Serve in One Command

```bash
npm start
```

This builds the app and starts the server automatically.

## Generating Links with Pre-loaded Diagrams

### Method 1: Using the Helper Script

The `generate-link.js` script can generate links from Mermaid code:

**From command line argument:**
```bash
npm run generate-link -- "sequenceDiagram\nA->>B: Hello"
```

Or directly:
```bash
node utils/scripts/generate-link.js "sequenceDiagram\nA->>B: Hello"
```

**From stdin (pipe a file):**
```bash
cat diagram.mmd | node utils/scripts/generate-link.js
```

**From a file directly:**
```bash
node utils/scripts/generate-link.js < diagram.mmd
```

### Method 2: Programmatic Generation (Node.js)

```javascript
const mermaidCode = `sequenceDiagram
    A->>B: Hello
    B-->>A: Hi`;

// Base64 encode and URL-encode for safe URL transmission
const encoded = Buffer.from(mermaidCode).toString('base64');
const urlEncoded = encodeURIComponent(encoded);
const url = `http://localhost:8080/?code=${urlEncoded}`;
console.log(url);
```

### Method 3: Programmatic Generation (Python)

```python
import base64
from urllib.parse import quote

mermaid_code = """sequenceDiagram
    A->>B: Hello
    B-->>A: Hi"""

# Base64 encode and URL-encode for safe URL transmission
encoded = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
url_encoded = quote(encoded, safe='')
url = f"http://localhost:8080/?code={url_encoded}"
print(url)
```

## How It Works

1. **Diagram Creation**: The AI assistant creates a Mermaid diagram code
2. **Link Generation**: The diagram code is Base64 encoded and added as a URL parameter (`?code=...`)
3. **App Loading**: When the user opens the link, the app:
   - Reads the `code` parameter from the URL
   - Base64 decodes it
   - Loads it into the Monaco editor
   - Automatically renders the diagram
4. **Export**: The user can then export the diagram as SVG or PNG

## URL Format

The generated URLs follow this format:
```
http://localhost:8080/?code=<BASE64_ENCODED_MERMAID_CODE>
```

## Customizing the Server

You can customize the host and port using environment variables:

```bash
PORT=3000 HOST=0.0.0.0 npm run serve
```

Or modify the `generate-link.js` script to use different defaults.

## Development Mode

For development with auto-rebuild on file changes:

```bash
npm run dev
```

This runs webpack in watch mode. You'll still need to run `npm run serve` in another terminal.

## Troubleshooting

- **Port already in use**: Change the port in `package.json` scripts or use `PORT` environment variable
- **Diagram not loading**: Check browser console for errors, ensure the code is properly Base64 encoded
- **Build errors**: Make sure all dependencies are installed with `npm install`

