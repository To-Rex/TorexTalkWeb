import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import compression from "compression";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const handlePrivateChats = (req, res) => {
  const { session_index } = req.params;
  const response = {
    ok: true,
    count: 3,
    items: [
      {
        id: 777e3,
        full_name: "Telegram",
        username: null,
        last_seen: "online",
        is_online: true,
        has_photo: true,
        photo_url: "/media/avatars/default.jpg"
      },
      {
        id: 152856580,
        full_name: "Zokir Aka",
        username: "Zokriy",
        last_seen: "recently",
        is_online: false,
        has_photo: false,
        photo_url: "/media/avatars/default.jpg"
      },
      {
        id: 7488382262,
        full_name: "Bobokulov",
        username: "bobokulov010",
        last_seen: "offline",
        is_online: false,
        has_photo: false,
        photo_url: "/media/avatars/default.jpg"
      }
    ]
  };
  res.json(response);
};
const handleGroups = (req, res) => {
  const { session_index } = req.params;
  const response = {
    ok: true,
    count: 3,
    items: [
      {
        id: -1003453950518,
        title: "❤️🎂Shirinliklar olami❤️🎂",
        username: "Shaxnoz_bakeryyy",
        member_count: 1815,
        online_count: 1,
        has_photo: true,
        photo_url: "/media/avatars/71f286af-80cf-4d7e-8e2b-b3ec62b12709/1/-1003453950518.jpg"
      },
      {
        id: -1001522987908,
        title: "Arzon bumagalar",
        username: null,
        member_count: 500,
        online_count: 5,
        has_photo: false,
        photo_url: "/media/avatars/default.jpg"
      },
      {
        id: -1002740169594,
        title: "DoubleH Programming team",
        username: null,
        member_count: 25,
        online_count: 3,
        has_photo: true,
        photo_url: "/media/avatars/default.jpg"
      }
    ]
  };
  res.json(response);
};
const handleChatMessages = (req, res) => {
  const { chat_id } = req.params;
  const { session_index, limit = 10, offset = 0 } = req.query;
  const parsedLimit = parseInt(limit, 10);
  const parsedOffset = parseInt(offset, 10);
  const generateMockMessages = (startId2, count) => {
    const messages2 = [];
    for (let i = 0; i < count; i++) {
      const id = startId2 - i;
      const isOutgoing = i % 2 === 0;
      messages2.push({
        id,
        date: new Date(Date.now() - (count - i) * 6e4).toISOString(),
        // Decreasing time
        chat_id: parseInt(chat_id),
        chat_type: parseInt(chat_id) > 0 ? "private" : "supergroup",
        from_user: isOutgoing ? {
          id: 777e3,
          first_name: "Telegram",
          last_name: null,
          username: null,
          phone_number: null,
          photo_url: null,
          status: null,
          bio: null
        } : {
          id: 6208845490,
          first_name: "Shahnozabonu",
          last_name: null,
          username: null,
          phone_number: null,
          photo_url: "/media/avatars/71f286af-80cf-4d7e-8e2b-b3ec62b12709/1/6208845490.jpg",
          status: "UserStatus.RECENTLY",
          bio: null
        },
        text: `Message ${id}`,
        caption: null,
        media_type: null,
        file_id: null,
        file_name: null,
        mime_type: null,
        is_read: !isOutgoing,
        is_outgoing: parseInt(chat_id) > 0 ? isOutgoing : null
      });
    }
    return messages2.reverse();
  };
  const totalMessages = 50;
  const startId = 5621 - parsedOffset;
  const available = Math.max(0, totalMessages - parsedOffset);
  const messages = generateMockMessages(startId, Math.min(parsedLimit, available));
  const response = {
    ok: true,
    count: totalMessages,
    messages
  };
  res.json(response);
};
function createServer() {
  const app2 = express__default();
  app2.use(compression());
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.get("/api/me/private_chats/:session_index", handlePrivateChats);
  app2.get("/api/me/groups/:session_index", handleGroups);
  app2.get("/api/me/chats/:chat_id/messages", handleChatMessages);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
