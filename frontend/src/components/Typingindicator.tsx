import { Bot } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 transition-opacity duration-500"
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border bg-card shadow-sm border-border">
        <Bot className="h-4.5 w-4.5 animate-pulse text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2 rounded-[20px] rounded-tl-none bg-card px-5 py-4 border border-border shadow-sm w-[200px]">
        <Skeleton className="h-3 w-[140px] rounded-full" />
        <Skeleton className="h-3 w-[100px] rounded-full" />
      </div>
    </motion.div>
  );
}
