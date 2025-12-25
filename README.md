#  AI Chatbot

A high-performance, full-stack chatbot application featuring a sleek React frontend and a Express backend powered by Google's Gemini AI. 

---

##  Features

-   ** Gemini AI Integration:** Leverages Google's latest `gemini-2.5-flash` or `gemini-2.5-flash-lite` models for fast and intelligent responses.
-   ** Knowledge-base Integration:** Inject custom business knowledge or facts via `store.md` to ground AI responses.
-   ** Persistent Conversations:** PostgreSQL-backed storage ensures your chat history is saved and retrievable across sessions.
-   ** Real-time Experience:** Smooth typing indicators and streaming-like response handling.
-   ** Premium UI/UX:** Built with React 19, TailwindCSS v4, and Framer Motion for beautiful animations and transitions.
-   ** Dynamic Theming:** Full support for Light and Dark modes with seamless transitions.
-   ** Markdown Support:** Rich rendering for code blocks, tables, and formatted text using `react-markdown`.
-   ** Fully Responsive:** Optimized for desktop, tablet, and mobile viewing.

---

## 🛠️ Tech Stack

### Frontend
-   **Framework:** [React 19](https://react.dev/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [TailwindCSS v4](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)

### Backend
-   **Runtime:** [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Server:** [Express](https://expressjs.com/)
-   **AI:** [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)


---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL Database
-   Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chatbot.git
    cd chatbot
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    - Create a `.env` file in the `backend` directory:
      ```env
      PORT=4000
      GEMINI_API_KEY=your_api_key_here
      DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db
      LLM_MODEL=gemini-2.0-flash-exp
      ```
    - Initialize the database using the schema in `src/db/schema.sql`.

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```
    - Create a `.env` file in the `frontend` directory:
      ```env
      VITE_API_URL=http://localhost:4000
      ```

### Running the Application

- **Start Backend:**
  ```bash
  cd backend
  npm run dev
  ```

- **Start Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```

The application will be available at `http://localhost:5173`.

---

##  Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── db/             # Database connection & schema
│   │   ├── services/       # AI & Chat logic
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API endpoints
│   │   └── server.ts       # Entrance point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components (ChatWindow, MessageBubble, etc.)
│   │   ├── store/          # Zustand state management
│   │   ├── api/            # Axios API client
│   │   └── App.tsx         # Main layout
│   └── package.json
└── README.md
```

Built with ❤️ by Asad
