import { pool } from "../db";
import { v4 as uuid } from "uuid";

export async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string
) {
  await pool.query(
    `INSERT INTO messages (id, conversation_id, sender, text)
     VALUES ($1, $2, $3, $4)`,
    [uuid(), conversationId, sender, text]
  );
}

export async function getRecentMessages(
  conversationId: string,
  limit = 8
) {
  const res = await pool.query(
    `SELECT sender, text
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC
     LIMIT $2`,
    [conversationId, limit]
  );
  return res.rows;
}
