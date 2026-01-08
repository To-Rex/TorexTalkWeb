import { createClient } from "@supabase/supabase-js";
import { PrivateChatsResponse, TelegramAccountsResponse, GroupsResponse, ChatMessagesResponse } from "@shared/api";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

class ApiService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL;
  private ongoingRequests = new Map<string, Promise<any>>();

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
    const key = `${chatId}-${sessionIndex}-${offset}`;
    if (this.ongoingRequests.has(key)) {
      return this.ongoingRequests.get(key);
    }
    const requestPromise = this.performFetchChatMessages(chatId, sessionIndex, offset);
    this.ongoingRequests.set(key, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.ongoingRequests.delete(key);
    }
  }

  private async performFetchChatMessages(chatId: string, sessionIndex: string, offset: number = 0): Promise<ChatMessagesResponse> {
    const headers = await this.getAuthHeaders();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    try {
      const cleanChatId = chatId.replace(/^\//, '');
      const url = `${this.baseUrl}/me/chats/${cleanChatId}/messages?limit=10&offset=${offset}&session_index=${sessionIndex}`;
      console.log('Fetching chat messages from:', url);
      const res = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log('Fetch response status:', res.status);
      if (!res.ok) {
        throw new Error(`Failed to fetch chat messages: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Fetch error for chat messages:', error);
      throw error;
    }
  }

  async downloadMedia(accountIndex: number, fileId: string, mediaType: string) {
    const headers = await this.getAuthHeaders();
    let actualFileId = fileId;
    if (fileId.startsWith(this.baseUrl)) {
      actualFileId = fileId.replace(this.baseUrl, '');
    }
    const res = await fetch(`${this.baseUrl}/me/download_media?account_index=${accountIndex}&file_id=${actualFileId}&media_type=${mediaType}`, {
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to download media: ${res.status}`);
    }
    const data = await res.json();
    if (data.ok) {
      return this.baseUrl + data.url;
    } else {
      throw new Error('Download failed');
    }
  }

  async logoutTelegramAccount(index: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${this.baseUrl}/me/telegrams/${index}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to logout telegram account: ${res.status}`);
    }
  }
}

export const apiService = new ApiService();