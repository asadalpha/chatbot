import { ChatWindow } from "./components/ChatWindow";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ChatWindow />
    </ThemeProvider>
  );
}
