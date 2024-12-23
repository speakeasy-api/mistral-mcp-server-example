# Mistral MCP server example

This is a TypeScript-based MCP server that provides two tools for chatting with Mistral. It is a basic example of how to create a server that can be used with the [Model Context Protocol (MCP)](https://modelcontextprotocol.io).

## Blog post

This repository is part of a blog post by Speakeasy: [Building an MCP server for Mistral](https://speakeasy.com/post/mcp-server).

## Requirements

- Node.js (tested on v20.17.10)
- An [MCP client](https://modelcontextprotocol.io/clients) that supports **tools**. We recommend the [Claude desktop application](https://claude.ai/download) or the [Cline VSCode extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev).

## Mistral API key

To interact with the Mistral AI platform, you'll need an API key. You can get one by signing up at [mistral.ai](https://mistral.ai/).

Set your API key as an environment variable. Create a copy of `.env.example` and rename it `.env`.

```bash
cp .env.example .env
open .env
```

Now update the `.env` file with your Mistral API key:

```bash
MISTRAL_API_KEY="YOUR_MISTRAL_API_KEY"
```

## Tools

This server provides two tools.

For chatting with Mistral using text input, the `mistral_chat_text` tool:

- Takes a model and an array of text inputs
- Returns a text response from Mistral. 

For chatting with Mistral using text and image input, the `mistral_chat_image` tool:

- Takes a model and an array of text and image inputs
- Only accepts images hosted on a public URL
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

To use this server with the Claude desktop app, add the following server config to your Claude config file:

- On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

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

Since MCP servers communicate over `stdio`, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The MCP Inspector will provide a URL for accessing debugging tools in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
