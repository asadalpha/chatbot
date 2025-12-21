import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto grow
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };


  return (
    <div className="relative group/input">
      <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
        <Textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={disabled}
          placeholder="Message AI Assistant..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="min-h-[44px] max-h-48 resize-none border-0 bg-transparent py-3 focus-visible:ring-0 shadow-none text-base placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />

        <Button
          size="icon"
          className={cn(
            "h-10 w-10 shrink-0 rounded-xl transition-all duration-300",
            !text.trim() || disabled
              ? "opacity-30 scale-95 cursor-not-allowed"
              : "hover:scale-110 active:scale-95 shadow-lg shadow-primary/20"
          )}
          disabled={disabled || !text.trim()}
          onClick={handleSend}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
