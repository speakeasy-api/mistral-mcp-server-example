# Mistral MCP Server Example

This is a TypeScript-based MCP server that provides two tools to chat with Mistral. It is a basic example of how to create a server that can be used with the [Model Context Protocol (MCP)](https://modelcontextprotocol.io).

## Blog Post

This repository is part of a blog post by Speakeasy: [Building a Mistral MCP Server](https://speakeasy.com/post/mcp-server).

## Requirements

- Node.js (tested on v20.17.10)
- An [MCP client](https://modelcontextprotocol.io/clients) that supports **tools**. We recommend: [Claude Desktop](https://claude.ai/download) or the [Cline VSCode extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev).

## Mistral API key

To interact with the Mistral AI platform, you'll need an API key. You can get one by signing up at [mistral.ai](https://mistral.ai/).

## Tools

This server provides two tools:

- `mistral_chat_text` - Chat with Mistral using text input
  - Takes a model and an array of text inputs
  - Returns a text response from Mistral
- `mistral_chat_image` - Chat with Mistral using mixed text and image input
  - Takes a model and an array of text and image inputs
  - Images must be hosted on a public URL
  - Returns a text response from Mistral

## Development

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

For development with auto-rebuild:

```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json` On
Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "Mistral MCP Server": {
      "command": "node",
      "args": [
        // Update this path to the location of the built server
        "/Users/speakeasy/server-mistral/build/index.js"
      ],
      "env": {
        // Update this with your Mistral API key
        "MISTRAL_API_KEY": "YOUR_MISTRAL_API_KEY"
      }
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We
recommend using the
[MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is
available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
