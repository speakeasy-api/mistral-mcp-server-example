import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const VISION_MODELS = ["pixtral-large-latest", "pixtral-12b-2409"] as const;
const TEXT_MODELS = ["mistral-large-latest", "mistral-small-latest"] as const;

const TextChunk = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const ImageUrl = z.object({
  url: z.string(),
  detail: z.string().nullable().optional(),
});

const ImageUrlChunk = z.object({
  type: z.literal("image_url"),
  imageUrl: z.union([z.string(), ImageUrl]),
}).describe(
  `An image URL to be displayed in the chat. Only valid with vision models: ${
    VISION_MODELS.join(", ")
  }`,
);

const SystemMessage = z.object({
  role: z.literal("system"),
  content: z.union([
    z.string(),
    z.array(TextChunk).nonempty(),
  ]),
}).describe(
  "A system message is an optional message that sets the behavior and context for Mistral in a conversation, such as modifying its personality or providing specific instructions. It is always text-only.",
);

const TextModelUserMessage = z.object({
  role: z.literal("user"),
  content: z.union([
    z.string(),
    z.array(TextChunk).nonempty(),
  ]),
}).describe("User message for text-only models - no image content allowed");

const TextModelAssistantMessage = z.object({
  role: z.literal("assistant"),
  content: z.union([
    z.string(),
    z.array(TextChunk).nonempty(),
  ]),
}).describe(
  "Assistant message for text-only models - no image content allowed",
);

const VisionModelUserMessage = z.object({
  role: z.literal("user"),
  content: z.union([
    z.string(),
    z.array(z.union([TextChunk, ImageUrlChunk])).nonempty(),
  ]),
}).describe(
  "User message for vision models - can include text, images, or both",
);

const VisionModelAssistantMessage = z.object({
  role: z.literal("assistant"),
  content: z.union([
    z.string(),
    z.array(z.union([TextChunk, ImageUrlChunk])).nonempty(),
  ]),
}).describe(
  "Assistant message for vision models - can include text, images, or both",
);

export const TextModelRequest = z.object({
  model: z.enum(TEXT_MODELS),
  messages: z.array(
    z.discriminatedUnion("role", [
      SystemMessage,
      TextModelUserMessage,
      TextModelAssistantMessage,
    ]),
  ).nonempty().refine(
    (messages) => {
      return messages.every((msg) => {
        if (typeof msg.content === "string") return true;
        return msg.content.every((chunk) => chunk.type === "text");
      });
    },
    "Text-only models cannot process image content in any message",
  ),
}).describe("Request for text-only models");

export const VisionModelRequest = z.object({
  model: z.enum(VISION_MODELS),
  messages: z.array(
    z.discriminatedUnion("role", [
      SystemMessage,
      VisionModelUserMessage,
      VisionModelAssistantMessage,
    ]),
  ).nonempty(),
}).describe("Request for vision-capable models");

const ChatCompletionRequestSchema = z.discriminatedUnion("model", [
  TextModelRequest,
  VisionModelRequest,
]);

export type ChatCompletionRequest = z.infer<typeof ChatCompletionRequestSchema>;

export const TextChatCompletionRequestJsonSchema = zodToJsonSchema(
  TextModelRequest,
  {
    $refStrategy: "none",
  },
);

export const VisionChatCompletionRequestJsonSchema = zodToJsonSchema(
  VisionModelRequest,
  {
    $refStrategy: "none",
  },
);
