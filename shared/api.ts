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
