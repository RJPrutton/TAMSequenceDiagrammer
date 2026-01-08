#!/usr/bin/env python3
"""
Helper script to generate a link to the exporter app with a pre-loaded diagram

Usage:
    python generate_link.py "sequenceDiagram\nA->>B: Hello"
    python generate_link.py < diagram.mmd
    cat diagram.mmd | python generate_link.py
"""

import sys
import base64
import os

def generate_link(mermaid_code, host='localhost', port=8080):
    """
    Generate a URL link to the exporter app with pre-loaded diagram
    
    Args:
        mermaid_code: The Mermaid diagram code as a string
        host: The hostname (default: localhost)
        port: The port number (default: 8080)
    
    Returns:
        The full URL with encoded diagram
    """
    if not mermaid_code or not mermaid_code.strip():
        raise ValueError("No Mermaid code provided")
    
    # Base64 encode the diagram code
    encoded = base64.b64encode(mermaid_code.strip().encode('utf-8')).decode('utf-8')
    
    # Construct the URL
    url = f"http://{host}:{port}/?code={encoded}"
    
    return url

if __name__ == "__main__":
    # Get host and port from environment variables if available
    host = os.getenv('HOST', 'localhost')
    port = int(os.getenv('PORT', 8080))
    
    # Check if code is provided as command line argument
    if len(sys.argv) > 1:
        mermaid_code = '\n'.join(sys.argv[1:])
        link = generate_link(mermaid_code, host, port)
        print(link)
    else:
        # Read from stdin
        mermaid_code = sys.stdin.read()
        link = generate_link(mermaid_code, host, port)
        print(link)

