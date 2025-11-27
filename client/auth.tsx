import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient, Session, User as SupabaseUser } from "@supabase/supabase-js";

export interface TelegramAccount {
  id: string;
  name: string;
  phone?: string;
  username?: string;
  telegram_id?: number;
}

export interface User {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  isAdmin?: boolean;
  accounts: TelegramAccount[];
  telegramAccounts: TelegramAccount[];
  activeTelegramAccountId?: string | null;
  activeAccountId?: string | null;
  settings?: {
    aiForGroups?: boolean;
    aiForPrivate?: boolean;
    plan?: string;
  };
  blocklist?: string[]; // list of chat names to exclude from mass messages
}

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addAccount: (acc: TelegramAccount) => void;
  switchAccount: (accountId: string) => void;
  fetchTelegramAccounts: () => Promise<void>;
  switchTelegramAccount: (accountId: string) => void;
  updateUser: (fn: (u: User) => User) => void;
  googleSignIn: (profile?: {
    email?: string;
    name?: string;
  }) => Promise<boolean>;
  oauthSignIn: (
    provider: "google" | "github" | "facebook" | "apple",
    profile?: { email?: string; name?: string }
  ) => Promise<boolean>;
  addToBlocklist: (name: string) => void;
  removeFromBlocklist: (name: string) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "tt_auth_user";
const USERS_KEY = "tt_users";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const defaults: User[] = [
        {
          email: "torex.amaki@gmail.com",
          password: "admin123",
          isAdmin: true,
          accounts: [],
          telegramAccounts: [],
          activeAccountId: null,
          activeTelegramAccountId: null,
          settings: { aiForGroups: true, aiForPrivate: false },
          blocklist: [],
        },
        {
          email: "demo@torex.com",
          password: "demopass",
          isAdmin: false,
          accounts: [
            { id: "acc1", name: "Demo Account 1", phone: "+998901234567" },
          ],
          telegramAccounts: [],
          activeAccountId: "acc1",
          activeTelegramAccountId: null,
          settings: { aiForGroups: true, aiForPrivate: true },
          blocklist: [],
        },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw) as User[];
  } catch (e) {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function mapSupabaseUserToUser(supabaseUser: SupabaseUser): User {
  const email = supabaseUser.email || '';
  const name = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '';
  const avatar = supabaseUser.user_metadata?.picture || supabaseUser.user_metadata?.avatar_url || '';
  // Try to load existing user data from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const storedUser = JSON.parse(raw) as User;
      if (storedUser.email === email) {
        return {
          ...storedUser,
          name: name || storedUser.name,
          avatar: avatar || storedUser.avatar,
        };
      }
    }
  } catch (e) {
    // Ignore
  }
  // Default new user
  return {
    email,
    password: '', // Don't store password
    name,
    avatar,
    isAdmin: supabaseUser.app_metadata?.role === 'admin' || false,
    accounts: [],
    telegramAccounts: [],
    activeAccountId: null,
    activeTelegramAccountId: null,
    settings: { aiForGroups: false, aiForPrivate: false },
    blocklist: [],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      }
      setLoading(false);
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUserToUser(session.user));
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTelegramAccounts();
    }
  }, [user?.email]); // Only when user email changes

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    // User will be set via onAuthStateChange
    return true;
  };

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Register error:', error.message);
      return false;
    }
    // User will be set via onAuthStateChange if confirmed
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addAccount = (acc: TelegramAccount) => {
    if (!user) return;
    const updated = {
      ...user,
      accounts: [...user.accounts, acc],
      activeAccountId: acc.id,
    };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const users = loadUsers().map((u) =>
      u.email === updated.email ? updated : u,
    );
    saveUsers(users);
  };

  const switchAccount = (accountId: string) => {
    if (!user) return;
    const updated = { ...user, activeAccountId: accountId };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const users = loadUsers().map((u) =>
      u.email === updated.email ? updated : u,
    );
    saveUsers(users);
  };

  const fetchTelegramAccounts = async () => {
    if (!user) return;
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) return;

      const response = await fetch('https://talkapp.up.railway.app/me/telegrams', {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        },
      });
      if (!response.ok) return;

      const data = await response.json();
      if (data.ok && data.telegram_accounts) {
        const telegramAccounts: TelegramAccount[] = data.telegram_accounts
          .filter((acc: any) => !acc.invalid)
          .map((acc: any) => ({
            id: acc.telegram_id.toString(),
            name: acc.full_name,
            phone: acc.phone_number,
            username: acc.username,
            telegram_id: acc.telegram_id,
          }));
        const updated = { ...user, telegramAccounts };
        if (!user.activeTelegramAccountId && telegramAccounts.length > 0) {
          updated.activeTelegramAccountId = telegramAccounts[0].id;
        }
        setUser(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        const users = loadUsers().map((u) =>
          u.email === updated.email ? updated : u,
        );
        saveUsers(users);
      }
    } catch (error) {
      console.error('Failed to fetch Telegram accounts:', error);
    }
  };

  const switchTelegramAccount = (accountId: string) => {
    if (!user) return;
    const updated = { ...user, activeTelegramAccountId: accountId };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const users = loadUsers().map((u) =>
      u.email === updated.email ? updated : u,
    );
    saveUsers(users);
  };

  const updateUser = (fn: (u: User) => User) => {
    if (!user) return;
    const updated = fn(user);
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const oauthSignIn = async (
    provider: "google" | "github" | "facebook" | "apple",
    profile?: { email?: string; name?: string },
  ) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) {
      console.error('OAuth error:', error.message);
      return false;
    }
    // User will be set via onAuthStateChange
    return true;
  };

  const googleSignIn = async (profile?: { email?: string; name?: string }) => {
    return oauthSignIn("google", profile);
  };

  const addToBlocklist = (name: string) => {
    if (!user) return;
    const next = Array.from(new Set([...(user.blocklist ?? []), name]));
    const updated = { ...user, blocklist: next };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const users = loadUsers().map((u) =>
      u.email === updated.email ? updated : u,
    );
    saveUsers(users);
  };

  const removeFromBlocklist = (name: string) => {
    if (!user) return;
    const next = (user.blocklist ?? []).filter((n) => n !== name);
    const updated = { ...user, blocklist: next };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    const users = loadUsers().map((u) =>
      u.email === updated.email ? updated : u,
    );
    saveUsers(users);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      addAccount,
      switchAccount,
      fetchTelegramAccounts,
      switchTelegramAccount,
      updateUser,
      googleSignIn,
      oauthSignIn,
      addToBlocklist,
      removeFromBlocklist,
    }),
    [user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
