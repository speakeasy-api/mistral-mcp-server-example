#!/usr/bin/env node
import path from "path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Mistral } from "@mistralai/mistralai";

import {
  type ChatCompletionRequest,
  TextChatCompletionRequestJsonSchema,
  VisionChatCompletionRequestJsonSchema,
  VisionModelRequest,
  TextModelRequest,
} from "./schema.js";

import dotenv from "dotenv";
dotenv.config({path: path.join(import.meta.dirname, "..", ".env")});

const server = new Server(
  {
    name: "Mistral MCP Server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  console.error("MISTRAL_API_KEY environment variable is required");
  process.exit(1);
}

const mistral = new Mistral({ apiKey: MISTRAL_API_KEY });

async function getCompletion(input: ChatCompletionRequest) {
  const response = await mistral.chat.complete(input);
  return response;
}

/**
 * Handler that lists available tools.
 * Exposes a single "mistral_chat" tool that lets clients ask Mistral for a chat completion.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "mistral_chat_text",
        description:
          "Ask the Mistral AI platform for a completion. Use this tool when the user specifically asks for Mistral's input, or when the user suggests you get a second opinion. This tool does not support images.",
        inputSchema: TextChatCompletionRequestJsonSchema,
      },
      {
        name: "mistral_chat_image",
        description:
          "Ask the Mistral AI platform for a completion that includes image URLs. Use this tool when you need Mistral to access an image via its link.",
        inputSchema: VisionChatCompletionRequestJsonSchema,
      }
    ],
  };
});

/**
 * Handler for the mistral_chat tool.
 * Creates a new note with the provided title and content, and returns success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "mistral_chat_text": {
      const chatCompletionRequest = TextModelRequest.parse(
        request.params.arguments,
      );

      const completion = await getCompletion(chatCompletionRequest);

      return {
        content: [
          {
            type: "text",
            text: completion.choices?.[0].message.content ?? "No completion",
          },
        ],
      };
    }
    case "mistral_chat_image": {
      const chatCompletionRequest = VisionModelRequest.parse(
        request.params.arguments,
      );

      const completion = await getCompletion(chatCompletionRequest);

      return {
        content: [
          {
            type: "text",
            text: completion.choices?.[0].message.content ?? "No completion",
          },
        ],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
