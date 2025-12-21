import fs from "fs";
import path from "path";

let cached: string | null = null;

export function loadStoreKnowledge(): string {
  if (cached) return cached;

  try {
    const filePath = path.join(__dirname, "store.md");
    cached = fs.readFileSync(filePath, "utf8");
    return cached;
  } catch (err) {
    console.error("Knowledge load failed:", err);
    return "Store knowledge unavailable.";
  }
}
