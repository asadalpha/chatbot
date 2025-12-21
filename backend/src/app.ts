import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";
import { errorHandler } from "./utils/errors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/chat", chatRoutes);
app.use(errorHandler);

export default app;
