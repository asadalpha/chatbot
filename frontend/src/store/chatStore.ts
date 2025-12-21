import { create } from "zustand";
import { sendMessage } from "../api/chatApi";

export type ChatMessage = {
  sender: "user" | "ai" | "error" | "system";
  text: string;
  timestamp: number;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

type ChatState = {
  sessions: ChatSession[];
  currentSessionId: string;
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  createNewChat: () => void;
  loadSession: (sessionId: string) => void;
};

const SESSION_STORAGE_KEY = "chat-sessions-v1";
const CURRENT_SESSION_KEY = "current-session-id-v1";

const getInitialSessions = (): ChatSession[] => {
  const saved = localStorage.getItem(SESSION_STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  const initialId = crypto.randomUUID();
  return [{ id: initialId, title: "New Chat", messages: [] }];
};

const getInitialSessionId = (sessions: ChatSession[]): string => {
  const savedId = localStorage.getItem(CURRENT_SESSION_KEY);
  if (savedId && sessions.some(s => s.id === savedId)) return savedId;
  return sessions[0].id;
};

const initialSessions = getInitialSessions();

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: initialSessions,
  currentSessionId: getInitialSessionId(initialSessions),
  loading: false,

  createNewChat: () => {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = { id: newId, title: "New Chat", messages: [] };
    const updatedSessions = [newSession, ...get().sessions];
    set({ sessions: updatedSessions, currentSessionId: newId });
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSessions));
    localStorage.setItem(CURRENT_SESSION_KEY, newId);
  },

  loadSession: (sessionId) => {
    set({ currentSessionId: sessionId });
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
  },

  clearMessages: () => {
    const currentId = get().currentSessionId;
    const updatedSessions = get().sessions.map(s =>
      s.id === currentId ? { ...s, messages: [] } : s
    );
    set({ sessions: updatedSessions });
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSessions));
  },

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const currentId = get().currentSessionId;
    const sessions = get().sessions;
    const sessionIndex = sessions.findIndex(s => s.id === currentId);
    if (sessionIndex === -1) return;

    const userMsg: ChatMessage = { sender: "user", text, timestamp: Date.now() };

    // Update session with user message and potentially update title
    const currentSession = sessions[sessionIndex];
    let newTitle = currentSession.title;
    if (currentSession.messages.length === 0) {
      newTitle = text.length > 30 ? text.slice(0, 30) + "..." : text;
    }

    const updatedSession = {
      ...currentSession,
      title: newTitle,
      messages: [...currentSession.messages, userMsg]
    };

    const sessionsAfterUser = [...sessions];
    sessionsAfterUser[sessionIndex] = updatedSession;

    set({ sessions: sessionsAfterUser, loading: true });
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionsAfterUser));

    try {
      const { reply } = await sendMessage(text, currentId);

      const aiMsg: ChatMessage = { sender: "ai", text: reply, timestamp: Date.now() };
      const sessionAfterAI = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMsg]
      };

      const sessionsAfterAI = get().sessions.map(s => s.id === currentId ? sessionAfterAI : s);
      set({ sessions: sessionsAfterAI, loading: false });
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionsAfterAI));

      // Play subtle ping sound
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
      audio.volume = 0.2;
      audio.play().catch(() => { });

    } catch (err: any) {
      const errorMsg = err?.response?.data?.error || "Agent is unavailable. Please try again.";
      const errorMsgObj: ChatMessage = { sender: "error", text: errorMsg, timestamp: Date.now() };

      const sessionsAfterError = get().sessions.map(s => {
        if (s.id === currentId) {
          return { ...s, messages: [...s.messages, errorMsgObj] };
        }
        return s;
      });

      set({ sessions: sessionsAfterError, loading: false });
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionsAfterError));
    }
  },
}));
