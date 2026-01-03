import { useEffect, useMemo, useState } from "react";
import { PrivateChatsResponse } from "@shared/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Local storage user shape
export type TAccount = { id: string; name: string; phone?: string };
export type TUser = {
  email: string;
  password?: string;
  isAdmin?: boolean;
  blocked?: boolean;
  accounts: TAccount[];
  activeAccountId?: string | null;
  settings?: Record<string, unknown>;
  blocklist?: string[];
};

const USERS_KEY = "tt_users";
const LOGS_KEY = "tt_admin_logs";
const SETTINGS_KEY = "tt_admin_settings";
const ROLES_DEF_KEY = "tt_admin_roles_def";
const USER_ROLES_KEY = "tt_admin_user_roles";
const FEATURES_KEY = "tt_admin_features";
const ANNOUNCEMENTS_KEY = "tt_admin_announcements";
const WEBHOOKS_KEY = "tt_admin_webhooks";
const QUOTAS_KEY = "tt_admin_quotas";
const SESSIONS_KEY = "tt_admin_sessions";

function getUsers(): TUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const defaults: TUser[] = [
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
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as TUser[];
    return [];
  } catch {
    return [];
  }
}

function saveUsers(users: TUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

type AdminLog = { id: string; at: number; action: string; detail?: string; user?: string };
function readLogs(): AdminLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as AdminLog[]) : [];
  } catch {
    return [];
  }
}
function writeLogs(logs: AdminLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}
function appendLog(entry: Omit<AdminLog, "id" | "at">) {
  const current = readLogs();
  current.unshift({ id: Math.random().toString(36).slice(2), at: Date.now(), ...entry });
  writeLogs(current);
}

type AdminSettings = {
  maintenanceMode: boolean;
  aiForGroupsDefault: boolean;
  aiForPrivateDefault: boolean;
};
function readSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw)
      return { maintenanceMode: false, aiForGroupsDefault: true, aiForPrivateDefault: true };
    const parsed = JSON.parse(raw) as Partial<AdminSettings>;
    return {
      maintenanceMode: Boolean(parsed.maintenanceMode),
      aiForGroupsDefault: parsed.aiForGroupsDefault ?? true,
      aiForPrivateDefault: parsed.aiForPrivateDefault ?? true,
    };
  } catch {
    return { maintenanceMode: false, aiForGroupsDefault: true, aiForPrivateDefault: true };
  }
}
function writeSettings(s: AdminSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// Roles & permissions
const ALL_PERMS = [
  "view_analytics",
  "manage_users",
  "manage_accounts",
  "manage_plans",
  "manage_settings",
  "manage_roles",
  "manage_features",
  "manage_announcements",
  "manage_webhooks",
  "view_logs",
  "send_mass",
] as const;
export type Permission = typeof ALL_PERMS[number];
export type RoleDef = { name: string; permissions: Permission[] };
export type UserRoles = Record<string, string[]>; // email -> role names

function readRoleDefs(): RoleDef[] {
  try {
    const raw = localStorage.getItem(ROLES_DEF_KEY);
    if (!raw) {
      const defaults: RoleDef[] = [
        { name: "Admin", permissions: [...ALL_PERMS] },
        { name: "Support", permissions: ["manage_users", "view_logs", "send_mass", "view_analytics"] },
        { name: "Viewer", permissions: ["view_analytics"] },
      ];
      localStorage.setItem(ROLES_DEF_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw) as RoleDef[];
  } catch {
    return [];
  }
}
function writeRoleDefs(list: RoleDef[]) {
  localStorage.setItem(ROLES_DEF_KEY, JSON.stringify(list));
}
function readUserRoles(): UserRoles {
  try {
    const raw = localStorage.getItem(USER_ROLES_KEY);
    return raw ? (JSON.parse(raw) as UserRoles) : {};
  } catch {
    return {};
  }
}
function writeUserRoles(m: UserRoles) {
  localStorage.setItem(USER_ROLES_KEY, JSON.stringify(m));
}

// Feature flags
export type FeatureFlag = { key: string; name: string; description?: string; enabled: boolean };
function readFeatures(): FeatureFlag[] {
  try {
    const raw = localStorage.getItem(FEATURES_KEY);
    return raw ? (JSON.parse(raw) as FeatureFlag[]) : [];
  } catch {
    return [];
  }
}
function writeFeatures(flags: FeatureFlag[]) {
  localStorage.setItem(FEATURES_KEY, JSON.stringify(flags));
}

// Announcements
export type Announcement = { id: string; title: string; body: string; active: boolean; createdAt: number };
function readAnnouncements(): Announcement[] {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    return raw ? (JSON.parse(raw) as Announcement[]) : [];
  } catch {
    return [];
  }
}
function writeAnnouncements(list: Announcement[]) {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
}

// Webhooks
export type Webhook = { id: string; name: string; url: string; events: string[] };
const ALL_EVENTS = [
  "user.created",
  "user.deleted",
  "account.added",
  "account.removed",
  "plan.changed",
  "settings.updated",
];
function readWebhooks(): Webhook[] {
  try {
    const raw = localStorage.getItem(WEBHOOKS_KEY);
    return raw ? (JSON.parse(raw) as Webhook[]) : [];
  } catch {
    return [];
  }
}
function writeWebhooks(list: Webhook[]) {
  localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(list));
}

// Quotas per plan
export type Quotas = {
  Free: { maxMessagesPerDay: number; maxAccounts: number };
  Plus: { maxMessagesPerDay: number; maxAccounts: number };
  Premium: { maxMessagesPerDay: number; maxAccounts: number };
};
function readQuotas(): Quotas {
  try {
    const raw = localStorage.getItem(QUOTAS_KEY);
    if (!raw)
      return {
        Free: { maxMessagesPerDay: 100, maxAccounts: 1 },
        Plus: { maxMessagesPerDay: 1000, maxAccounts: 5 },
        Premium: { maxMessagesPerDay: 10000, maxAccounts: 20 },
      };
    return JSON.parse(raw) as Quotas;
  } catch {
    return {
      Free: { maxMessagesPerDay: 100, maxAccounts: 1 },
      Plus: { maxMessagesPerDay: 1000, maxAccounts: 5 },
      Premium: { maxMessagesPerDay: 10000, maxAccounts: 20 },
    };
  }
}
function writeQuotas(q: Quotas) {
  localStorage.setItem(QUOTAS_KEY, JSON.stringify(q));
}

// Sessions (simulated)
export type Session = { id: string; user: string; device: string; lastActive: number };
function readSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}
function writeSessions(list: Session[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(list));
}

export default function AdminPanel() {
  // Chats state
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [chats, setChats] = useState<PrivateChatsResponse | null>(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [tab, setTab] = useState<
    | "dashboard"
    | "users"
    | "accounts"
    | "plans"
    | "settings"
    | "roles"
    | "features"
    | "announcements"
    | "webhooks"
    | "quotas"
    | "sessions"
    | "logs"
    | "chats"
  >("dashboard");

  const [users, setUsers] = useState<TUser[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [acctQuery, setAcctQuery] = useState("");
  const [settings, setSettings] = useState<AdminSettings>(readSettings());
  const [newAcct, setNewAcct] = useState<{ owner: string; name: string; phone: string }>({ owner: "", name: "", phone: "" });
  const [logsUser, setLogsUser] = useState<string>("");
  const [logsQuery, setLogsQuery] = useState<string>("");

  // Roles / features / announcements / webhooks / quotas / sessions state
  const [roleDefs, setRoleDefs] = useState<RoleDef[]>(readRoleDefs());
  const [userRoles, setUserRoles] = useState<UserRoles>(readUserRoles());
  const [features, setFeatures] = useState<FeatureFlag[]>(readFeatures());
  const [ann, setAnn] = useState<Announcement[]>(readAnnouncements());
  const [webhooks, setWebhooks] = useState<Webhook[]>(readWebhooks());
  const [quotas, setQuotas] = useState<Quotas>(readQuotas());
  const [sessions, setSessions] = useState<Session[]>(readSessions());

  // Users selection (bulk actions)
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const dashData = useMemo(
    () => [
      { day: "Mon", sent: 120, auto: 40 },
      { day: "Tue", sent: 180, auto: 70 },
      { day: "Wed", sent: 90, auto: 30 },
      { day: "Thu", sent: 240, auto: 100 },
      { day: "Fri", sent: 200, auto: 80 },
      { day: "Sat", sent: 140, auto: 60 },
      { day: "Sun", sent: 170, auto: 65 },
    ],
    [],
  );

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, userQuery]);

  const accountsFlat = useMemo(() => {
    const arr: Array<{ owner: string; account: TAccount }> = [];
    for (const u of users) for (const a of u.accounts ?? []) arr.push({ owner: u.email, account: a });
    const q = acctQuery.trim().toLowerCase();
    if (!q) return arr;
    return arr.filter(
      (r) =>
        r.owner.toLowerCase().includes(q) ||
        r.account.name.toLowerCase().includes(q) ||
        (r.account.phone ?? "").toLowerCase().includes(q),
    );
  }, [users, acctQuery]);

  // Mutations helpers
  const updateUsers = (updater: (prev: TUser[]) => TUser[]) => {
    setUsers((prev) => {
      const next = updater(prev);
      saveUsers(next);
      return next;
    });
  };

  const toggleAdmin = (email: string) => {
    updateUsers((prev) => prev.map((u) => (u.email === email ? { ...u, isAdmin: !u.isAdmin } : u)));
    appendLog({ action: "toggle_admin", detail: email, user: email });
  };
  const toggleBlocked = (email: string) => {
    updateUsers((prev) => prev.map((u) => (u.email === email ? { ...u, blocked: !u.blocked } : u)));
    appendLog({ action: "toggle_blocked", detail: email, user: email });
  };
  const removeUser = (email: string) => {
    updateUsers((prev) => prev.filter((u) => u.email !== email));
    appendLog({ action: "remove_user", detail: email, user: email });
  };
  const changePlan = (email: string, plan: string) => {
    updateUsers((prev) => prev.map((u) => (u.email === email ? { ...u, settings: { ...(u.settings ?? {}), plan } } : u)));
    appendLog({ action: "change_plan", detail: `${email} -> ${plan}`, user: email });
  };
  const bulkBlock = (value: boolean) => {
    const targets = Object.keys(selectedUsers).filter((k) => selectedUsers[k]);
    if (!targets.length) return;
    updateUsers((prev) =>
      prev.map((u) => (targets.includes(u.email) ? { ...u, blocked: value } : u)),
    );
    appendLog({ action: value ? "bulk_block" : "bulk_unblock", detail: targets.join(", ") });
  };
  const bulkDelete = () => {
    const targets = Object.keys(selectedUsers).filter((k) => selectedUsers[k]);
    if (!targets.length) return;
    updateUsers((prev) => prev.filter((u) => !targets.includes(u.email)));
    appendLog({ action: "bulk_delete", detail: targets.join(", ") });
    setSelectedUsers({});
  };

  const addAccount = () => {
    const owner = newAcct.owner.trim();
    const name = newAcct.name.trim();
    const phone = newAcct.phone.trim();
    if (!owner || !name) return;
    updateUsers((prev) =>
      prev.map((u) =>
        u.email === owner
          ? {
              ...u,
              accounts: [
                ...(u.accounts ?? []),
                { id: Math.random().toString(36).slice(2), name, phone: phone || undefined },
              ],
            }
          : u,
      ),
    );
    appendLog({ action: "add_account", detail: `${owner} <- ${name}`, user: owner });
    setNewAcct({ owner: "", name: "", phone: "" });
  };
  const removeAccount = (owner: string, accountId: string) => {
    updateUsers((prev) =>
      prev.map((u) =>
        u.email === owner ? { ...u, accounts: (u.accounts ?? []).filter((a) => a.id !== accountId) } : u,
      ),
    );
    appendLog({ action: "remove_account", detail: `${owner} - ${accountId}`, user: owner });
  };

  // Settings
  const updateSettings = (next: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...next };
      writeSettings(merged);
      appendLog({ action: "update_settings", detail: JSON.stringify(next) });
      return merged;
    });
  };

  // Users import/export
  const exportUsersJson = () => {
    const data = JSON.stringify(users, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement("a");
    aEl.href = url;
    aEl.download = "torex_users_export.json";
    aEl.click();
    URL.revokeObjectURL(url);
  };
  const importUsersJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) {
          saveUsers(parsed as TUser[]);
          setUsers(parsed as TUser[]);
          appendLog({ action: "import_users" });
        }
      } catch {}
    };
    reader.readAsText(f);
  };

  // Roles handlers
  const addRole = () => {
    const name = prompt("Role name");
    if (!name) return;
    const exists = roleDefs.some((r) => r.name === name);
    if (exists) return;
    const next = [...roleDefs, { name, permissions: [] }];
    setRoleDefs(next);
    writeRoleDefs(next);
    appendLog({ action: "add_role", detail: name });
  };
  const removeRole = (name: string) => {
    const next = roleDefs.filter((r) => r.name !== name);
    setRoleDefs(next);
    writeRoleDefs(next);
    const m = { ...userRoles };
    Object.keys(m).forEach((k) => (m[k] = (m[k] || []).filter((x) => x !== name)));
    setUserRoles(m);
    writeUserRoles(m);
    appendLog({ action: "remove_role", detail: name });
  };
  const togglePerm = (role: string, perm: Permission) => {
    const next = roleDefs.map((r) =>
      r.name === role
        ? {
            ...r,
            permissions: r.permissions.includes(perm)
              ? r.permissions.filter((p) => p !== perm)
              : [...r.permissions, perm],
          }
        : r,
    );
    setRoleDefs(next);
    writeRoleDefs(next);
    appendLog({ action: "update_role_perms", detail: `${role}:${perm}` });
  };
  const assignUserRoles = (email: string, roles: string[]) => {
    const next = { ...userRoles, [email]: roles };
    setUserRoles(next);
    writeUserRoles(next);
    appendLog({ action: "assign_user_roles", detail: `${email} -> ${roles.join(",")}`, user: email });
  };

  // Features handlers
  const addFeature = () => {
    const key = prompt("Feature key (unique)")?.trim();
    if (!key) return;
    if (features.some((f) => f.key === key)) return;
    const name = prompt("Name")?.trim() || key;
    const next = [...features, { key, name, enabled: false }];
    setFeatures(next);
    writeFeatures(next);
    appendLog({ action: "add_feature", detail: key });
  };
  const toggleFeature = (key: string) => {
    const next = features.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f));
    setFeatures(next);
    writeFeatures(next);
    appendLog({ action: "toggle_feature", detail: key });
  };
  const removeFeature = (key: string) => {
    const next = features.filter((f) => f.key !== key);
    setFeatures(next);
    writeFeatures(next);
    appendLog({ action: "remove_feature", detail: key });
  };

  // Announcements handlers
  const addAnnouncement = () => {
    const title = prompt("Title")?.trim();
    if (!title) return;
    const body = prompt("Body")?.trim() || "";
    const next = [
      { id: Math.random().toString(36).slice(2), title, body, active: true, createdAt: Date.now() },
      ...ann,
    ];
    setAnn(next);
    writeAnnouncements(next);
    appendLog({ action: "add_announcement", detail: title });
  };
  const toggleAnnouncement = (id: string) => {
    const next = ann.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    setAnn(next);
    writeAnnouncements(next);
    appendLog({ action: "toggle_announcement", detail: id });
  };
  const removeAnnouncement = (id: string) => {
    const next = ann.filter((a) => a.id !== id);
    setAnn(next);
    writeAnnouncements(next);
    appendLog({ action: "remove_announcement", detail: id });
  };

  // Webhooks handlers
  const addWebhook = () => {
    const name = prompt("Webhook name")?.trim();
    const url = prompt("Webhook URL (https://...) ")?.trim();
    if (!name || !url) return;
    const next = [...webhooks, { id: Math.random().toString(36).slice(2), name, url, events: [] }];
    setWebhooks(next);
    writeWebhooks(next);
    appendLog({ action: "add_webhook", detail: `${name} -> ${url}` });
  };
  const toggleWebhookEvent = (id: string, evt: string) => {
    const next = webhooks.map((w) =>
      w.id === id
        ? {
            ...w,
            events: w.events.includes(evt)
              ? w.events.filter((e) => e !== evt)
              : [...w.events, evt],
          }
        : w,
    );
    setWebhooks(next);
    writeWebhooks(next);
    appendLog({ action: "update_webhook", detail: `${id}:${evt}` });
  };
  const removeWebhook = (id: string) => {
    const next = webhooks.filter((w) => w.id !== id);
    setWebhooks(next);
    writeWebhooks(next);
    appendLog({ action: "remove_webhook", detail: id });
  };
  const pingWebhook = (id: string) => {
    const w = webhooks.find((x) => x.id === id);
    if (!w) return;
    appendLog({ action: "webhook_ping", detail: `${w.name} -> ${w.url}` });
  };

  // Quotas handlers
  const updateQuota = (
    plan: keyof Quotas,
    key: keyof Quotas["Free"],
    value: number,
  ) => {
    const next = { ...quotas, [plan]: { ...quotas[plan], [key]: value } } as Quotas;
    setQuotas(next);
    writeQuotas(next);
    appendLog({ action: "update_quota", detail: `${String(plan)}.${String(key)}=${value}` });
  };

  // Sessions handlers
  const addSession = () => {
    const user = prompt("User email")?.trim();
    const device = prompt("Device (Chrome / iPhone ...)")?.trim() || "Unknown";
    if (!user) return;
    const next = [
      { id: Math.random().toString(36).slice(2), user, device, lastActive: Date.now() },
      ...sessions,
    ];
    setSessions(next);
    writeSessions(next);
    appendLog({ action: "session_add", detail: `${user} - ${device}`, user });
  };
  const clearUserSessions = (email: string) => {
    const next = sessions.filter((s) => s.user !== email);
    setSessions(next);
    writeSessions(next);
    appendLog({ action: "session_clear_user", detail: email, user: email });
  };
  const clearAllSessions = () => {
    setSessions([]);
    writeSessions([]);
    appendLog({ action: "session_clear_all" });
  };

  // Fetch private chats for a session
  const fetchChats = async (sessionId: string) => {
    setLoadingChats(true);
    try {
      const response = await fetch(`/api/me/private_chats/${sessionId}?dialog_limit=100`);
      const data: PrivateChatsResponse = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      setChats(null);
    } finally {
      setLoadingChats(false);
    }
  };

  // Logs export
  const exportLogs = () => {
    const data = JSON.stringify(readLogs(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aEl = document.createElement("a");
    aEl.href = url;
    aEl.download = "torex_admin_logs.json";
    aEl.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-6">
      <div className="grid gap-4 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        <aside className="hidden md:block">
          <div className="rounded-xl border bg-card p-3 md:sticky md:top-4">
            <div className="text-sm font-semibold mb-2">Admin panel</div>
            <nav className="grid gap-1">
              {[
                { k: "dashboard", label: "Dashboard" },
                { k: "users", label: "Users" },
                { k: "accounts", label: "Accounts" },
                { k: "plans", label: "Plans" },
                { k: "settings", label: "Settings" },
                { k: "roles", label: "Roles" },
                { k: "features", label: "Features" },
                { k: "announcements", label: "Announcements" },
                { k: "webhooks", label: "Webhooks" },
                { k: "quotas", label: "Quotas" },
                { k: "sessions", label: "Sessions" },
                { k: "logs", label: "Logs" },
                { k: "chats", label: "Chats" },
              ].map((i) => (
                <button
                  key={i.k}
                  onClick={() => setTab(i.k as any)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    tab === (i.k as any) ? "bg-background border" : "hover:bg-background/60"
                  }`}
                >
                  <span>{i.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="space-y-6 min-w-0">
          <div className="md:hidden rounded-lg border p-1 bg-muted">
            <div className="grid grid-cols-3 gap-1">
              {[
                { k: "dashboard", label: "Dashboard" },
                { k: "users", label: "Users" },
                { k: "accounts", label: "Accounts" },
                { k: "chats", label: "Chats" },
              ].map((i) => (
                <button
                  key={i.k}
                  onClick={() => setTab(i.k as any)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    tab === (i.k as any) ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "dashboard" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-xl border p-4 bg-card">
                  <div className="text-sm text-muted-foreground">Messages sent</div>
                  <div className="text-2xl font-bold">1,140</div>
                </div>
                <div className="rounded-xl border p-4 bg-card">
                  <div className="text-sm text-muted-foreground">Auto replies</div>
                  <div className="text-2xl font-bold">445</div>
                </div>
                <div className="rounded-xl border p-4 bg-card">
                  <div className="text-sm text-muted-foreground">Active users</div>
                  <div className="text-2xl font-bold">{users.length || 0}</div>
                </div>
              </div>

              <div className="rounded-xl border p-4 bg-card">
                <div className="mb-3 font-semibold">System-wide analytics</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashData} margin={{ left: -20 }}>
                      <defs>
                        <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Area type="monotone" dataKey="sent" stroke="hsl(var(--primary))" fill="url(#c1)" />
                      <Area type="monotone" dataKey="auto" stroke="hsl(var(--accent))" fillOpacity={0.1} fill="hsl(var(--accent))" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "users" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="font-semibold flex-1">Users</div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <input
                      placeholder="Search users by email"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full sm:w-72 rounded-md bg-secondary px-3 py-2"
                    />
                    <button className="px-3 py-2 rounded border hover:bg-background" onClick={exportUsersJson}>
                      Export
                    </button>
                    <label className="px-3 py-2 rounded border hover:bg-background cursor-pointer">
                      Import
                      <input type="file" accept="application/json" onChange={importUsersJson} className="hidden" />
                    </label>
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground px-2">
                      Found: {filteredUsers.length}
                    </div>
                  </div>
                </div>
                <div className="p-3 border-b flex flex-wrap gap-2 items-center">
                  <button className="px-2 py-1 rounded border hover:bg-background" onClick={() => bulkBlock(true)}>
                    Block selected
                  </button>
                  <button className="px-2 py-1 rounded border hover:bg-background" onClick={() => bulkBlock(false)}>
                    Unblock selected
                  </button>
                  <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground" onClick={bulkDelete}>
                    Delete selected
                  </button>
                </div>
                <div className="p-2 overflow-auto">
                  <table className="w-full text-sm min-w-[980px]">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="p-2"><input type="checkbox" onChange={(e) => {
                          const checked = e.target.checked;
                          const map: Record<string, boolean> = {};
                          filteredUsers.forEach((u) => (map[u.email] = checked));
                          setSelectedUsers(map);
                        }} /></th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Assigned roles</th>
                        <th className="p-2">Accounts</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Plan</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.email} className="border-t">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={!!selectedUsers[u.email]}
                              onChange={(e) =>
                                setSelectedUsers((m) => ({ ...m, [u.email]: e.target.checked }))
                              }
                            />
                          </td>
                          <td className="p-2">{u.email}</td>
                          <td className="p-2">{u.isAdmin ? "Admin" : "Member"}</td>
                          <td className="p-2">
                            <select
                              multiple
                              className="rounded border bg-background px-2 py-1 min-w-32"
                              value={userRoles[u.email] ?? []}
                              onChange={(e) =>
                                assignUserRoles(
                                  u.email,
                                  Array.from(e.target.selectedOptions).map((o) => o.value),
                                )
                              }
                            >
                              {roleDefs.map((r) => (
                                <option key={r.name} value={r.name}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">{u.accounts?.length ?? 0}</td>
                          <td className="p-2 capitalize">{u.blocked ? "blocked" : "active"}</td>
                          <td className="p-2">{String((u.settings as any)?.plan ?? "Free")}</td>
                          <td className="p-2 space-x-2 whitespace-nowrap">
                            <button className="px-2 py-1 rounded border hover:bg-background" onClick={() => toggleAdmin(u.email)}>
                              {u.isAdmin ? "Revoke admin" : "Make admin"}
                            </button>
                            <button className="px-2 py-1 rounded border hover:bg-background" onClick={() => toggleBlocked(u.email)}>
                              {u.blocked ? "Unblock" : "Block"}
                            </button>
                            <select
                              className="px-2 py-1 rounded border bg-background"
                              value={String((u.settings as any)?.plan ?? "Free")}
                              onChange={(e) => changePlan(u.email, e.target.value)}
                            >
                              {["Free", "Plus", "Premium"].map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                            <button
                              className="px-2 py-1 rounded bg-destructive text-destructive-foreground"
                              onClick={() => removeUser(u.email)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "accounts" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="font-semibold mb-3">Add account</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <select
                    className="rounded-md bg-secondary px-3 py-2"
                    value={newAcct.owner}
                    onChange={(e) => setNewAcct((s) => ({ ...s, owner: e.target.value }))}
                  >
                    <option value="">Select user</option>
                    {users.map((u) => (
                      <option key={u.email} value={u.email}>
                        {u.email}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Account name"
                    className="rounded-md bg-secondary px-3 py-2"
                    value={newAcct.name}
                    onChange={(e) => setNewAcct((s) => ({ ...s, name: e.target.value }))}
                  />
                  <input
                    placeholder="Phone (+998...)"
                    className="rounded-md bg-secondary px-3 py-2"
                    value={newAcct.phone}
                    onChange={(e) => setNewAcct((s) => ({ ...s, phone: e.target.value }))}
                  />
                  <button className="rounded-md border px-3 py-2 hover:bg-background" onClick={addAccount}>
                    Add
                  </button>
                </div>
              </div>

              <div className="rounded-xl border bg-card">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="font-semibold flex-1">Accounts</div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      placeholder="Search by user, account or phone"
                      value={acctQuery}
                      onChange={(e) => setAcctQuery(e.target.value)}
                      className="w-full sm:w-96 rounded-md bg-secondary px-3 py-2"
                    />
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground px-2">
                      Found: {accountsFlat.length}
                    </div>
                  </div>
                </div>
                <div className="p-2 overflow-auto">
                  <table className="w-full text-sm min-w-[720px]">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="p-2">User</th>
                        <th className="p-2">Account</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountsFlat.map((row) => (
                        <tr key={`${row.owner}:${row.account.id}`} className="border-t">
                          <td className="p-2">{row.owner}</td>
                          <td className="p-2">{row.account.name}</td>
                          <td className="p-2">{row.account.phone ?? "—"}</td>
                          <td className="p-2">
                            <button
                              className="px-2 py-1 rounded bg-destructive text-destructive-foreground"
                              onClick={() => removeAccount(row.owner, row.account.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "plans" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="font-semibold mb-2">Plans overview</div>
                <p className="text-sm text-muted-foreground">
                  Assign subscription plans per user. This updates the user's stored settings.plan.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-2 overflow-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="p-2">User</th>
                      <th className="p-2">Current plan</th>
                      <th className="p-2">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.email} className="border-t">
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{String((u.settings as any)?.plan ?? "Free")}</td>
                        <td className="p-2">
                          <select
                            className="px-2 py-1 rounded border bg-background"
                            value={String((u.settings as any)?.plan ?? "Free")}
                            onChange={(e) => changePlan(u.email, e.target.value)}
                          >
                            {["Free", "Plus", "Premium"].map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "settings" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="font-semibold mb-3">System settings</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => updateSettings({ maintenanceMode: e.target.checked })}
                    />
                    <span className="text-sm">Maintenance mode</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.aiForGroupsDefault}
                      onChange={(e) => updateSettings({ aiForGroupsDefault: e.target.checked })}
                    />
                    <span className="text-sm">AI for groups (default)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.aiForPrivateDefault}
                      onChange={(e) => updateSettings({ aiForPrivateDefault: e.target.checked })}
                    />
                    <span className="text-sm">AI for private (default)</span>
                  </label>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "roles" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">Roles</div>
                  <button className="px-2 py-1 rounded border hover:bg-background" onClick={addRole}>
                    Add role
                  </button>
                </div>
                <div className="space-y-3">
                  {roleDefs.map((r) => (
                    <div key={r.name} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{r.name}</div>
                        <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground" onClick={() => removeRole(r.name)}>
                          Remove
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {ALL_PERMS.map((p) => (
                          <label key={p} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={r.permissions.includes(p)}
                              onChange={() => togglePerm(r.name, p)}
                            />
                            <span>{p}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4">
                <div className="font-semibold mb-3">Assign roles to users</div>
                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.email} className="border rounded p-3 flex items-center gap-3 flex-wrap">
                      <div className="font-medium min-w-48">{u.email}</div>
                      <select
                        multiple
                        className="rounded border bg-background px-2 py-1 min-w-40"
                        value={userRoles[u.email] ?? []}
                        onChange={(e) =>
                          assignUserRoles(
                            u.email,
                            Array.from(e.target.selectedOptions).map((o) => o.value),
                          )
                        }
                      >
                        {roleDefs.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <div className="text-xs text-muted-foreground">
                        Permissions: {
                          (userRoles[u.email] ?? [])
                            .map((rn) => roleDefs.find((d) => d.name === rn)?.permissions ?? [])
                            .flat()
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .join(", ") || "—"
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === "features" ? (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Feature flags</div>
                <button className="px-2 py-1 rounded border hover:bg-background" onClick={addFeature}>
                  Add feature
                </button>
              </div>
              <div className="space-y-2">
                {features.map((f) => (
                  <div key={f.key} className="flex items-center gap-3 border rounded p-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{f.name} <span className="text-xs text-muted-foreground">({f.key})</span></div>
                      {f.description ? (
                        <div className="text-xs text-muted-foreground truncate">{f.description}</div>
                      ) : null}
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={f.enabled} onChange={() => toggleFeature(f.key)} />
                      <span>{f.enabled ? "Enabled" : "Disabled"}</span>
                    </label>
                    <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground" onClick={() => removeFeature(f.key)}>
                      Remove
                    </button>
                  </div>
                ))}
                {features.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No features yet</div>
                ) : null}
              </div>
            </div>
          ) : null}

          {tab === "announcements" ? (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Announcements</div>
                <button className="px-2 py-1 rounded border hover:bg-background" onClick={addAnnouncement}>
                  New
                </button>
              </div>
              <div className="space-y-2">
                {ann.map((a) => (
                  <div key={a.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{a.title}</div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={a.active}
                            onChange={() => toggleAnnouncement(a.id)}
                          />
                          <span>{a.active ? "Active" : "Inactive"}</span>
                        </label>
                        <button
                          className="px-2 py-1 rounded bg-destructive text-destructive-foreground"
                          onClick={() => removeAnnouncement(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {a.body}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                {ann.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No announcements</div>
                ) : null}
              </div>
            </div>
          ) : null}

          {tab === "webhooks" ? (
            <div className="rounded-xl border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Webhooks</div>
                <button className="px-2 py-1 rounded border hover:bg-background" onClick={addWebhook}>
                  Add webhook
                </button>
              </div>
              <div className="space-y-3">
                {webhooks.map((w) => (
                  <div key={w.id} className="border rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{w.name}</div>
                      <div className="space-x-2">
                        <button className="px-2 py-1 rounded border hover:bg-background" onClick={() => pingWebhook(w.id)}>
                          Ping
                        </button>
                        <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground" onClick={() => removeWebhook(w.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground break-all">{w.url}</div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {ALL_EVENTS.map((evt) => (
                        <label key={evt} className="text-sm flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={w.events.includes(evt)}
                            onChange={() => toggleWebhookEvent(w.id, evt)}
                          />
                          <span>{evt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {webhooks.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No webhooks configured</div>
                ) : null}
              </div>
            </div>
          ) : null}

          {tab === "quotas" ? (
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="font-semibold">Quotas per plan</div>
              {(["Free", "Plus", "Premium"] as const).map((plan) => (
                <div key={plan} className="border rounded p-3 grid sm:grid-cols-3 gap-2 items-center">
                  <div className="font-medium">{plan}</div>
                  <label className="text-sm flex items-center gap-2">
                    <span className="w-44">Max messages/day</span>
                    <input
                      type="number"
                      className="w-28 rounded border bg-background px-2 py-1"
                      value={quotas[plan].maxMessagesPerDay}
                      onChange={(e) => updateQuota(plan, "maxMessagesPerDay", Number(e.target.value))}
                    />
                  </label>
                  <label className="text-sm flex items-center gap-2">
                    <span className="w-44">Max accounts</span>
                    <input
                      type="number"
                      className="w-28 rounded border bg-background px-2 py-1"
                      value={quotas[plan].maxAccounts}
                      onChange={(e) => updateQuota(plan, "maxAccounts", Number(e.target.value))}
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "sessions" ? (
            <div className="rounded-xl border bg-card">
              <div className="p-4 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="font-semibold flex-1">Sessions</div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="px-3 py-2 rounded border hover:bg-background" onClick={addSession}>
                    Add session
                  </button>
                  <button className="px-3 py-2 rounded border hover:bg-background" onClick={clearAllSessions}>
                    Clear all
                  </button>
                </div>
              </div>
              <div className="p-2 overflow-auto">
                <table className="w-full text-sm min-w-[680px]">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="p-2">User</th>
                      <th className="p-2">Device</th>
                      <th className="p-2">Last active</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="p-2">{s.user}</td>
                        <td className="p-2">{s.device}</td>
                        <td className="p-2 whitespace-nowrap">{new Date(s.lastActive).toLocaleString()}</td>
                        <td className="p-2">
                          <button className="px-2 py-1 rounded border hover:bg-background" onClick={() => clearUserSessions(s.user)}>
                            Clear for user
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sessions.length === 0 ? (
                      <tr>
                        <td className="p-2 text-sm text-muted-foreground" colSpan={4}>
                          No sessions
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {tab === "logs" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="font-semibold flex-1">Logs</div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <select
                      className="rounded-md bg-secondary px-3 py-2"
                      value={logsUser}
                      onChange={(e) => setLogsUser(e.target.value)}
                    >
                      <option value="">All users</option>
                      {users.map((u) => (
                        <option key={u.email} value={u.email}>
                          {u.email}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Filter by action/detail"
                      value={logsQuery}
                      onChange={(e) => setLogsQuery(e.target.value)}
                      className="w-full sm:w-64 rounded-md bg-secondary px-3 py-2"
                    />
                    <button className="px-3 py-2 rounded border hover:bg-background" onClick={() => writeLogs([])}>
                      Clear
                    </button>
                    <button className="px-3 py-2 rounded border hover:bg-background" onClick={exportLogs}>
                      Export
                    </button>
                  </div>
                </div>
                <div className="p-2 overflow-auto">
                  {(() => {
                    const all = readLogs();
                    const fq = logsQuery.trim().toLowerCase();
                    const filtered = all.filter((l) => {
                      const okUser = logsUser
                        ? l.user
                          ? l.user === logsUser
                          : (l.detail ?? "").includes(logsUser)
                        : true;
                      const okQ = fq
                        ? l.action.toLowerCase().includes(fq) || (l.detail ?? "").toLowerCase().includes(fq)
                        : true;
                      return okUser && okQ;
                    });
                    return (
                      <table className="w-full text-sm min-w-[720px]">
                        <thead className="text-left text-muted-foreground">
                          <tr>
                            <th className="p-2">User</th>
                            <th className="p-2">Time</th>
                            <th className="p-2">Action</th>
                            <th className="p-2">Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((l) => (
                            <tr key={l.id} className="border-t">
                              <td className="p-2 whitespace-nowrap">{l.user ?? "—"}</td>
                              <td className="p-2 whitespace-nowrap">{new Date(l.at).toLocaleString()}</td>
                              <td className="p-2">{l.action}</td>
                              <td className="p-2 break-words">{l.detail ?? ""}</td>
                            </tr>
                          ))}
                          {filtered.length === 0 ? (
                            <tr>
                              <td className="p-2 text-sm text-muted-foreground" colSpan={4}>
                                No logs
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : null}

          {tab === "chats" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-4">
                <div className="font-semibold mb-3">Private Chats</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    className="rounded-md bg-secondary px-3 py-2"
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                  >
                    <option value="">Select session</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.user} - {s.device}
                      </option>
                    ))}
                  </select>
                  <button
                    className="rounded-md border px-3 py-2 hover:bg-background"
                    onClick={() => selectedSession && fetchChats(selectedSession)}
                    disabled={!selectedSession || loadingChats}
                  >
                    {loadingChats ? "Loading..." : "Fetch Chats"}
                  </button>
                </div>
              </div>

              {chats && (
                <div className="rounded-xl border bg-card">
                  <div className="p-4 border-b">
                    <div className="font-semibold">Chats ({chats.count})</div>
                  </div>
                  <div className="p-2 overflow-auto">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead className="text-left text-muted-foreground">
                        <tr>
                          <th className="p-2">ID</th>
                          <th className="p-2">Full Name</th>
                          <th className="p-2">Username</th>
                          <th className="p-2">Last Seen</th>
                          <th className="p-2">Online</th>
                          <th className="p-2">Photo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chats.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-2">{item.id}</td>
                            <td className="p-2">{item.full_name}</td>
                            <td className="p-2">{item.username || "—"}</td>
                            <td className="p-2">{item.last_seen}</td>
                            <td className="p-2">{item.is_online ? "Yes" : "No"}</td>
                            <td className="p-2">{item.has_photo ? "Yes" : "No"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
