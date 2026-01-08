#!/usr/bin/env node

/**
 * Helper script to generate a link to the exporter app with a pre-loaded diagram
 * 
 * Usage:
 *   node generate-link.js "sequenceDiagram\nA->>B: Hello"
 *   node generate-link.js < diagram.mmd
 * 
 * Or pipe Mermaid code:
 *   echo "sequenceDiagram\nA->>B: Hello" | node generate-link.js
 */

const readline = require('readline');

function generateLink(mermaidCode) {
  if (!mermaidCode || !mermaidCode.trim()) {
    console.error('Error: No Mermaid code provided');
    process.exit(1);
  }

  // Base64 encode the diagram code
  const encoded = Buffer.from(mermaidCode.trim()).toString('base64');
  
  // URL-encode the Base64 string to handle special characters (+, /, =)
  const urlEncoded = encodeURIComponent(encoded);
  
  // Default to localhost:8080, but can be overridden with PORT env var
  const port = process.env.PORT || 8080;
  const host = process.env.HOST || 'localhost';
  
  const url = `http://${host}:${port}/?code=${urlEncoded}`;
  
  return url;
}

// Check if code is provided as command line argument
if (process.argv.length > 2) {
  const mermaidCode = process.argv.slice(2).join('\n');
  const link = generateLink(mermaidCode);
  console.log(link);
  process.exit(0);
}

// Otherwise, read from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let input = '';

rl.on('line', (line) => {
  input += line + '\n';
});

rl.on('close', () => {
  const link = generateLink(input);
  console.log(link);
  process.exit(0);
});

