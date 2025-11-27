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
