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