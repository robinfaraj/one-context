import {
	deleteChat,
	getChat,
	handleChatRequest,
	listChats,
} from "@onecontext/ai-chat";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { authMiddleware } from "../middleware/auth";

export const aiRouter = new Hono()
	.basePath("/ai")
	.use(authMiddleware)
	.post(
		"/chat",
		describeRoute({
			tags: ["AI Chat"],
			summary: "Stream a chat response",
			description: "Send messages and receive a streaming AI response",
			responses: { 200: { description: "Streaming AI response" } },
		}),
		async (c) => {
			const user = c.get("user");
			const body = await c.req.json();
			const { messages, chatId } = body;

			const { result, chatId: resolvedChatId } = await handleChatRequest({
				chatId,
				messages,
				userId: user.id,
			});

			const response = result.toUIMessageStreamResponse({
				headers: {
					"x-chat-id": resolvedChatId,
				},
			});

			return response;
		},
	)
	.get(
		"/chats",
		describeRoute({
			tags: ["AI Chat"],
			summary: "List user chats",
			description: "Returns all chats for the authenticated user",
			responses: { 200: { description: "List of chats" } },
		}),
		async (c) => {
			const user = c.get("user");
			const chats = await listChats(user.id);
			return c.json(chats);
		},
	)
	.get(
		"/chats/:id",
		describeRoute({
			tags: ["AI Chat"],
			summary: "Get chat with messages",
			description: "Returns a single chat with all its messages",
			responses: {
				200: { description: "Chat with messages" },
				404: { description: "Chat not found" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const chatId = c.req.param("id");
			const chat = await getChat(chatId, user.id);

			if (!chat) {
				return c.json({ error: "Chat not found" }, 404);
			}

			return c.json(chat);
		},
	)
	.delete(
		"/chats/:id",
		describeRoute({
			tags: ["AI Chat"],
			summary: "Delete a chat",
			description: "Deletes a chat and all its messages",
			responses: {
				200: { description: "Chat deleted" },
				404: { description: "Chat not found" },
			},
		}),
		async (c) => {
			const user = c.get("user");
			const chatId = c.req.param("id");
			const deleted = await deleteChat(chatId, user.id);

			if (!deleted) {
				return c.json({ error: "Chat not found" }, 404);
			}

			return c.json({ success: true });
		},
	);
