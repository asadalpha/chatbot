import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message too long"),
  sessionId: z.string().optional(),
});
