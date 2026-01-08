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
        text: id === 5621 ? null : `Message ${id}`,
        caption: id === 5621 ? "Test image" : null,
        media_type: id === 5621 ? "photo" : null,
        file_id: id === 5621 ? "test.jpg" : null,
        file_url: id === 5621 ? "test.jpg" : null,
        file_name: id === 5621 ? "test.jpg" : null,
        mime_type: id === 5621 ? "image/jpeg" : null,
        thumb_url: id === 5621 ? "/media/thumb_test.jpg" : null,
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