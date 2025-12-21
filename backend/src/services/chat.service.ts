import {
  createConversation,
  conversationExists,
} from "../repositories/conversation.repo";
import { saveMessage, getRecentMessages } from "../repositories/message.repo";
import { generateReply } from "./llm.service";
import { AppError } from "../utils/errors";

export async function handleChatMessage(message: string, sessionId?: string) {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new AppError(400, "Message cannot be empty");
  }

  const MAX_LEN = 1000;
  const truncated = trimmed.length > MAX_LEN;
  const safeMessage = truncated ? trimmed.slice(0, MAX_LEN) : trimmed;

  let conversationId = sessionId;

  if (!conversationId || !(await conversationExists(conversationId))) {
    conversationId = await createConversation();
  }

  await saveMessage(conversationId, "user", safeMessage);

  const history = await getRecentMessages(conversationId);

  const reply = await generateReply(history, safeMessage, truncated);

  await saveMessage(conversationId, "ai", reply);

  return { reply, sessionId: conversationId, truncated };
}
