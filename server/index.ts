import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import { handleDemo } from "./routes/demo";
import { handlePrivateChats } from "./routes/private-chats";
import { handleGroups } from "./routes/groups";
import { handleChatMessages } from "./routes/chat-messages";

export function createServer() {
  const app = express();

  // Middleware
  app.use(compression());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/me/private_chats/:session_index", handlePrivateChats);
  app.get("/api/me/groups/:session_index", handleGroups);
  app.get("/api/me/chats/:chat_id/messages", handleChatMessages);

  return app;
}
