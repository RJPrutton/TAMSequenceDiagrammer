```mermaid
sequenceDiagram
    autonumber
    participant User as User
    participant AI as AI Agent (Cursor)
    participant MCP as MCP (Context7)
    participant WA as Web App (Vercel)

    Note over User,AI: Diagram Creation Phase
    User->>AI: Prompts for sequence diagram
    rect rgb(237, 26, 59, 0.1)
    AI->>MCP: Queries Mermaid documentation
    MCP-->>AI: Returns Mermaid syntax reference
    AI->>MCP: Queries Braze documentation
    MCP-->>AI: Returns Braze API/architecture details
    Note over AI: Uses Mermaid + Braze docs<br/>to generate diagram code
    AI->>AI: Outputs diagram in MM format<br/>inside project
    AI->>AI: Encodes diagram to Base64
    AI->>AI: Creates URL with encoded diagram
    end
    AI-->>User: Displays preview link

    Note over User,WA: Diagram Viewing & Export Phase
    User->>WA: Clicks preview link
    WA->>WA: Decodes Base64 diagram
    WA->>WA: Renders Mermaid diagram
    WA-->>User: Displays interactive diagram

    alt User exports diagram
        User->>WA: Clicks export (PNG/SVG)
        WA-->>User: Downloads diagram file
    else User edits diagram directly
        User->>WA: Edits diagram in web app
        WA->>WA: Updates diagram display
        WA-->>User: Shows updated diagram
    end

    opt User requests changes
        Note over User,AI: Iteration Loop
        User->>AI: Reprompts with edits/feedback
        rect rgb(237, 26, 59, 0.1)
        AI->>MCP: Queries updated documentation
        MCP-->>AI: Returns updated reference
        Note over AI: Generates updated<br/>Mermaid diagram
        AI->>AI: Outputs updated diagram in MM format
        AI->>AI: Encodes new diagram to Base64
        AI->>AI: Creates new preview link
        end
        AI-->>User: Displays updated preview link
        User->>WA: Clicks new preview link
        WA->>WA: Decodes and renders new diagram
        WA-->>User: Displays updated diagram
    end
```

