import { RequestHandler } from "express";
import { PrivateChatsResponse } from "@shared/api";

export const handlePrivateChats: RequestHandler = (req, res) => {
  const { session_index } = req.params;
  // Mock response for now
  const response: PrivateChatsResponse = {
    ok: true,
    count: 3,
    items: [
      {
        id: 777000,
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