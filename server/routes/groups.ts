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