import { RequestHandler } from "express";
import { ChatMessagesResponse, MessageItem } from "@shared/api";

export const handleChatMessages: RequestHandler = (req, res) => {
  const { chat_id } = req.params;
  const { session_index, limit = 10, offset = 0 } = req.query;

  const parsedLimit = parseInt(limit as string, 10);
  const parsedOffset = parseInt(offset as string, 10);

  // Generate mock messages based on offset
  const generateMockMessages = (startId: number, count: number): MessageItem[] => {
    const messages: MessageItem[] = [];
    for (let i = 0; i < count; i++) {
      const id = startId - i;
      const isOutgoing = i % 2 === 0; // Alternate for demo
      messages.push({
        id,
        date: new Date(Date.now() - (count - i) * 60000).toISOString(), // Decreasing time
        chat_id: parseInt(chat_id),
        chat_type: parseInt(chat_id) > 0 ? "private" : "supergroup",
        from_user: isOutgoing ? {
          id: 777000,
          first_name: "Telegram",
          last_name: null,
          username: null,
          phone_number: null,
          photo_url: null,
          status: null,
          bio: null,
          is_premium: null,
          emoji_url: null
        } : {
          id: 8427826343,
          first_name: "Dilshodjon",
          last_name: "Haydarov",
          username: "torex_amaki",
          phone_number: "998995340313",
          photo_url: "/media/avatars/71f286af-80cf-4d7e-8e2b-b3ec62b12709/1/8427826343.jpg",
          status: "UserStatus.OFFLINE",
          bio: null,
          is_premium: true,
          emoji_url: "/media/avatars/71f286af-80cf-4d7e-8e2b-b3ec62b12709/1/8427826343_emoji.webp"
        },
        text: id === 5621 ? null : id === 5620 ? null : id === 5619 ? null : `Message ${id}`,
        caption: id === 5621 ? "Test image" : id === 5620 ? "Test video" : id === 5619 ? null : null,
        media_type: id === 5621 ? "photo" : id === 5620 ? "video" : id === 5619 ? "voice" : null,
        file_id: id === 5621 ? "test.jpg" : id === 5620 ? "test.mp4" : id === 5619 ? "AwACAgIAAxkBAAIXNWlgomY3Eaf7uWoQ6-5piH3OODhUAAIukQAC4xbxSvqVFhoU21PhHgQ" : null,
        file_url: id === 5621 ? "test.jpg" : id === 5620 ? "test.mp4" : id === 5619 ? "/audio/test.ogg" : null,
        file_name: id === 5621 ? "test.jpg" : id === 5620 ? "test.mp4" : id === 5619 ? null : null,
        mime_type: id === 5621 ? "image/jpeg" : id === 5620 ? "video/mp4" : id === 5619 ? "audio/ogg" : null,
        thumb_url: id === 5621 ? "/media/thumb_test.jpg" : id === 5620 ? "/media/thumb_video.jpg" : id === 5619 ? null : null,
        file_size: id === 5619 ? "12.5 KB" : null,
        duration_seconds: id === 5619 ? 3 : null,
        duration_formatted: id === 5619 ? "0:03" : null,
        waveform: id === 5619 ? [0, 132, 0, 30, 206, 176, 209, 251, 255, 255, 90, 255, 255, 175, 134, 179, 206, 42, 163, 148, 145, 90, 11, 232, 3, 202, 8, 32, 4, 16, 31, 252, 255, 193, 255, 224, 115, 160, 251, 3, 228, 131, 255, 193, 255, 0, 124, 0, 62, 0, 29, 112, 0, 36, 0, 17, 0, 4, 64, 0, 32, 0, 0] : null,
        is_read: !isOutgoing,
        is_outgoing: parseInt(chat_id) > 0 ? isOutgoing : null
      });
    }
    return messages.reverse(); // Latest first
  };

  const totalMessages = 50; // Total messages in chat
  const startId = 5621 - parsedOffset; // Start from latest
  const available = Math.max(0, totalMessages - parsedOffset);
  const messages = generateMockMessages(startId, Math.min(parsedLimit, available));

  const response: ChatMessagesResponse = {
    ok: true,
    count: totalMessages,
    messages
  };

  res.json(response);
};