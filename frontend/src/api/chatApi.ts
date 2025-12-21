import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

export async function sendMessage(
  message: string,
  sessionId?: string
) {
  const res = await api.post("/chat/message", {
    message,
    sessionId,
  });

  return res.data as {
    reply: string;
    sessionId: string;
  };
}
