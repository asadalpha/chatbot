import { cn } from "@/lib/utils";
import { Bot, User, AlertCircle, Terminal, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Button } from "./ui/button";

export function MessageBubble({
  sender,
  text,
}: {
  sender: "user" | "ai" | "error" | "system";
  text: string;
}) {
  const isSystem = sender === "system";
  const isUser = sender === "user";
  const isAI = sender === "ai";
  const isError = sender === "error";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.4
      }}
      className={cn(
        "group flex w-full flex-col gap-3",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className={cn("flex items-start gap-4 max-w-[85%] sm:max-w-[75%]", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            "mt-1 flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-[10px] border shadow-sm transition-all",
            isUser
              ? "bg-primary text-primary-foreground border-transparent"
              : "bg-card text-muted-foreground border-border"
          )}
        >
          {isUser && <User className="h-4.5 w-4.5" />}
          {isAI && <Bot className="h-4.5 w-4.5" />}
          {isError && <AlertCircle className="h-4.5 w-4.5 text-destructive" />}
          {isSystem && <Terminal className="h-4.5 w-4.5" />}
        </motion.div>

        {/* Bubble */}
        <div
          className={cn(
            "relative flex flex-col gap-2 rounded-[20px] px-5 py-3.5 text-[15px] leading-relaxed transition-all",
            isUser
              ? "bg-muted text-foreground rounded-tr-none shadow-sm"
              : "bg-card text-foreground border border-border shadow-sm rounded-tl-none",
            isError && "bg-destructive/5 text-destructive border-destructive/10",
            isSystem && "bg-muted/30 text-muted-foreground italic text-xs border-dashed"
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:dark:bg-black prose-pre:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text}
            </ReactMarkdown>
          </div>
          <div className={cn(
            "flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-opacity",
            isUser ? "justify-end" : "justify-start"
          )}>
            <span className="opacity-40">{sender} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

            {!isUser && isAI && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-6 w-6 rounded-md opacity-40 group-hover:opacity-100 transition-opacity"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
