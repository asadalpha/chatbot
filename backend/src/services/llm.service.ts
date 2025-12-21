import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { loadStoreKnowledge } from "../knowledge/loadknowledge";

let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

if (config.geminiApiKey) {
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  model = genAI.getGenerativeModel({
    model: config.llmModel,
  });
} else {
  console.warn("GEMINI_API_KEY missing - LLM responses disabled");
}

export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string,
  truncated: boolean
): Promise<string> {
  try {
    if (!model) {
      return "LLM is not configured; please try again later.";
    }

    const knowledge = loadStoreKnowledge();

    const prompt = `
You are a professional customer support agent. be polite and try to be helpful to user

${knowledge}

Conversation history:
${history.map((m) => `${m.sender}: ${m.text}`).join("\n")}

User: ${userMessage}

${truncated ? "(User message was truncated for length.)" : ""}

Rules:
- Be concise
- Do not hallucinate
- If unsure, say you don't know
`;

    const result = await model.generateContent(prompt);
    return result.response.text() || "Unable to respond right now.";
  } catch (err) {
    console.error("Gemini error:", err);
    return "Sorry, I’m having trouble responding right now.";
  }
}
