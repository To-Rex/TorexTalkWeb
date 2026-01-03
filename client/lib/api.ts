import { createClient } from "@supabase/supabase-js";
import { PrivateChatsResponse, TelegramAccountsResponse, GroupsResponse, ChatMessagesResponse } from "@shared/api";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

class ApiService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL;

  private async getAuthHeaders() {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.access_token) {
      throw new Error("No access token");
    }
    return {
      'Authorization': `Bearer ${session.session.access_token}`,
    };
  }

  async fetchPrivateChats(sessionIndex: string): Promise<PrivateChatsResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${this.baseUrl}/me/private_chats/${sessionIndex}?dialog_limit=100`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch private chats: ${res.status}`);
    }
    return res.json();
  }

  async fetchTelegramAccounts(): Promise<TelegramAccountsResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${this.baseUrl}/me/telegrams`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch telegram accounts: ${res.status}`);
    }
    return res.json();
  }

  async fetchGroups(sessionIndex: string): Promise<GroupsResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${this.baseUrl}/me/groups/${sessionIndex}?dialog_limit=100`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch groups: ${res.status}`);
    }
    return res.json();
  }

  async fetchChatMessages(chatId: string, sessionIndex: string, offset: number = 0): Promise<ChatMessagesResponse> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${this.baseUrl}/me/chats/${chatId}/messages?session_index=${sessionIndex}&limit=10&offset=${offset}`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch chat messages: ${res.status}`);
    }
    return res.json();
  }
}

export const apiService = new ApiService();