import { gateway } from "ai";

export const chatModel = gateway("anthropic/claude-sonnet-4-5");

export const titleModel = gateway("anthropic/claude-haiku-4-5");
