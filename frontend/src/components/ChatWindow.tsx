import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./Typingindicator";
import { ModeToggle } from "./ModeToggle";
import { Bot, RefreshCcw, Trash2, Plus, MessageSquare, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ChatWindow() {
  const {
    sessions,
    currentSessionId,
    sendMessage,
    loading,
    clearMessages,
    createNewChat,
    loadSession
  } = useChatStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [showSidebar, setShowSidebar] = useState(true); // Desktop
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const starters = [
    { label: "Order Help", icon: "📦" },
    { label: "Return policy", icon: "🔄" },
    { label: "Talk to support", icon: "🎧" },
    { label: "Technical issue", icon: "⚙️" },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-muted/30 transition-all duration-400 ease-in-out dark:border-zinc-800 lg:static",
        isSidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0",
        showSidebar ? "lg:w-[280px]" : "lg:w-[64px]"
      )}>
        <div className={cn(
          "flex items-center h-[64px] shrink-0",
          showSidebar ? "justify-between px-4" : "justify-center"
        )}>
          {showSidebar && <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
              } else {
                setShowSidebar(!showSidebar);
              }
            }}
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className={cn("pb-4 shrink-0", showSidebar ? "px-4" : "flex justify-center")}>
          <Button
            onClick={() => {
              createNewChat();
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={cn(
              "rounded-xl bg-card shadow-sm border border-border text-foreground hover:bg-muted transition-all",
              showSidebar ? "w-full gap-2.5 justify-start px-4" : "h-10 w-10 justify-center p-0"
            )}
            title="New Chat"
          >
            <Plus className="h-4 w-4 shrink-0" />
            {showSidebar && <span className="font-semibold text-sm truncate">New Chat</span>}
          </Button>
        </div>

        <div className={cn("flex-1 overflow-y-auto space-y-1 custom-scrollbar", showSidebar ? "px-2" : "px-0")}>
          {showSidebar && (
            <div className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400/80">
              Recent
            </div>
          )}
          {sessions.map((session) => (
            <div key={session.id} className={cn("flex justify-center", showSidebar && "px-1")}>
              <button
                onClick={() => {
                  loadSession(session.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                title={session.title}
                className={cn(
                  "group flex items-center transition-all text-left",
                  showSidebar
                    ? "w-full gap-3 px-3 py-2.5 rounded-xl"
                    : "h-10 w-10 justify-center rounded-xl",
                  currentSessionId === session.id
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <MessageSquare className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  currentSessionId === session.id ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                )} />
                {showSidebar && <span className="truncate font-medium text-sm">{session.title}</span>}
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <PanelLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight ">Shopify Chatbot</h1>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={() => window.location.reload()}
                  title="Reload"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-zinc-500 hover:text-destructive"
                  onClick={() => {
                    if (confirm("Clear current history?")) clearMessages();
                  }}
                  title="Clear"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Messaging Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="mx-auto flex w-full max-w-3xl flex-col space-y-10 p-6 md:p-10">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center">
                <div className="flex flex-col items-center space-y-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-muted shadow-inner transition-colors">
                    <Bot className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <div className="max-w-sm space-y-3">
                    <h3 className="text-3xl font-extrabold tracking-tight">How can I help?</h3>
                    <p className="text-base text-muted-foreground font-medium">
                      Select a suggestion below or start a new conversation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                  {starters.map((starter) => (
                    <motion.button
                      key={starter.label}
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(starter.label)}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left text-sm font-semibold transition-all hover:bg-muted hover:shadow-md"
                    >
                      <span className="text-xl">{starter.icon}</span>
                      <span className="text-foreground font-bold">{starter.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <MessageBubble key={m.timestamp || i} sender={m.sender} text={m.text} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} className="h-8 w-full" />
          </div>
        </main>

        {/* Input Area */}
        <footer className="w-full border-t bg-gradient-to-t from-background to-transparent pb-8 pt-4">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <ChatInput onSend={sendMessage} disabled={loading} />
            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 transition-colors">
              AI assistant powered by Google Generative AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
