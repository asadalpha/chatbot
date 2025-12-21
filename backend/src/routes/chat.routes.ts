import { Router } from "express";
import { chatSchema } from "../utils/validate";
import { handleChatMessage } from "../services/chat.service";

const router = Router();

router.post("/message", async (req, res, next) => {
  try {
    const parsed = chatSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const result = await handleChatMessage(
      parsed.data.message,
      parsed.data.sessionId
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
