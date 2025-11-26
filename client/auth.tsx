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
}

export interface User {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  isAdmin?: boolean;
  accounts: TelegramAccount[];
  activeAccountId?: string | null;
  settings?: {
    aiForGroups?: boolean;
    aiForPrivate?: boolean;
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
          email: "admin@torex.com",
          password: "adminpass",
          isAdmin: true,
          accounts: [],
          activeAccountId: null,
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
          activeAccountId: "acc1",
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
    activeAccountId: null,
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
