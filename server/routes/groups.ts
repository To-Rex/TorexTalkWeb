import { RequestHandler } from "express";
import { GroupsResponse } from "@shared/api";

export const handleGroups: RequestHandler = (req, res) => {
  const { session_index } = req.params;
  // Mock response for now
  const response: GroupsResponse = {
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