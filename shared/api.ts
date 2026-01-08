/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Telegram account from /me/telegrams API
 */
export interface TelegramAccountResponse {
  index: string;
  full_name: string;
  username: string;
  phone_number: string;
  telegram_id: number;
  profile_picture: string;
  profile_url: string;
}

/**
 * Response type for /me/telegrams
 */
export interface TelegramAccountsResponse {
  ok: boolean;
  user_id: string;
  email: string;
  telegram_accounts: TelegramAccountResponse[];
}

/**
 * Private chat item
 */
export interface PrivateChatItem {
  id: number;
  full_name: string;
  username: string | null;
  last_seen: string;
  is_online: boolean;
  has_photo: boolean;
  photo_url: string;
}

/**
 * Response type for /me/private_chats/:session_index
 */
export interface PrivateChatsResponse {
  ok: boolean;
  count: number;
  items: PrivateChatItem[];
}

/**
 * Group chat item
 */
export interface GroupChatItem {
  id: number;
  title: string;
  username: string | null;
  member_count: number;
  online_count: number;
  has_photo: boolean;
  photo_url: string;
}

/**
 * Response type for /me/groups/:session_index
 */
export interface GroupsResponse {
  ok: boolean;
  count: number;
  items: GroupChatItem[];
}

/**
 * User in message
 */
export interface MessageUser {
  id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  phone_number: string | null;
  photo_url: string | null;
  status: string | null;
  bio: string | null;
}

/**
 * Message item
 */
export interface MessageItem {
  id: number;
  date: string;
  chat_id: number;
  chat_type: string;
  from_user: MessageUser;
  text: string | null;
  caption: string | null;
  media_type: string | null;
  file_id: string | null;
  file_url: string | null;
  file_name: string | null;
  mime_type: string | null;
  thumb_url: string | null;
  is_read: boolean;
  is_outgoing: boolean | null;
}

/**
 * Response type for /me/chats/:chat_id/messages
 */
export interface ChatMessagesResponse {
  ok: boolean;
  count: number;
  messages: MessageItem[];
}
