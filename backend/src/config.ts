import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

export const config = {
  port: process.env.PORT || 4000,
  geminiApiKey,
  llmModel: process.env.LLM_MODEL || "gemini-2.5-flash-lite",
};
