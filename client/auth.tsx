import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface TelegramAccount {
  id: string;
  name: string;
  phone?: string;
}

export interface User {
  email: string;
  password: string;
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
  addToBlocklist: (name: string) => void;
  removeFromBlocklist: (name: string) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = "tt_auth_user";
const USERS_KEY = "tt_users";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (!localStorage.getItem(USERS_KEY)) loadUsers();
  }, []);

  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string) => {
    const users = loadUsers();
    if (users.find((u) => u.email === email)) return false;
    const newUser: User = {
      email,
      password,
      isAdmin: false,
      accounts: [],
      activeAccountId: null,
      settings: { aiForGroups: false, aiForPrivate: false },
    };
    users.push(newUser);
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
    const users = loadUsers().map((u) =>
      u.email === updated.email ? updated : u,
    );
    saveUsers(users);
  };

  const googleSignIn = async (profile?: { email?: string; name?: string }) => {
    const users = loadUsers();
    const email = profile?.email ?? "google_demo@torex.com";
    let found = users.find((u) => u.email === email);
    if (!found) {
      const newUser: User = {
        email,
        password: "",
        isAdmin: false,
        accounts: [
          {
            id: `g_${Math.random().toString(36).slice(2)}`,
            name: profile?.name ? profile.name : "Google User",
            phone: undefined,
          },
        ],
        activeAccountId: undefined,
        settings: { aiForGroups: true, aiForPrivate: true },
        blocklist: [],
      };
      users.push(newUser);
      saveUsers(users);
      found = newUser;
    }
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return true;
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
