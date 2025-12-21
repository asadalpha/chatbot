import { pool } from "../db";
import { v4 as uuid } from "uuid";

export async function createConversation(): Promise<string> {
  const id = uuid();
  await pool.query(
    "INSERT INTO conversations (id) VALUES ($1)",
    [id]
  );
  return id;
}

export async function conversationExists(id: string): Promise<boolean> {
  const res = await pool.query(
    "SELECT id FROM conversations WHERE id = $1",
    [id]
  );
  return res.rowCount! > 0;
}
