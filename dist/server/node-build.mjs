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
        has_photo: true,
        photo_url: "/media/avatars/default.jpg"
      },
      {
        id: -1001522987908,
        title: "Arzon bumagalar",
        username: null,
        has_photo: false,
        photo_url: "/media/avatars/default.jpg"
      },
      {
        id: -1002740169594,
        title: "DoubleH Programming team",
        username: null,
        has_photo: true,
        photo_url: "/media/avatars/default.jpg"
      }
    ]
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
