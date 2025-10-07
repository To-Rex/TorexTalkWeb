import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

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

function getUsers(): TUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
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
    if (!raw) return { maintenanceMode: false, aiForGroupsDefault: true, aiForPrivateDefault: true };
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

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard" | "users" | "accounts" | "plans" | "settings" | "logs">("dashboard");
  const [users, setUsers] = useState<TUser[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [acctQuery, setAcctQuery] = useState("");
  const [settings, setSettings] = useState<AdminSettings>(readSettings());
  const [newAcct, setNewAcct] = useState<{ owner: string; name: string; phone: string }>({ owner: "", name: "", phone: "" });
  const [logsUser, setLogsUser] = useState<string>("");
  const [logsQuery, setLogsQuery] = useState<string>("");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  // Derived
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
    for (const u of users) {
      for (const a of u.accounts ?? []) arr.push({ owner: u.email, account: a });
    }
    const q = acctQuery.trim().toLowerCase();
    if (!q) return arr;
    return arr.filter((r) =>
      r.owner.toLowerCase().includes(q) ||
      r.account.name.toLowerCase().includes(q) ||
      (r.account.phone ?? "").toLowerCase().includes(q),
    );
  }, [users, acctQuery]);

  // Helpers to mutate users + persist + log
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
              accounts: [...(u.accounts ?? []), { id: Math.random().toString(36).slice(2), name, phone: phone || undefined }],
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

  // Settings persist
  const updateSettings = (next: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...next };
      writeSettings(merged);
      appendLog({ action: "update_settings", detail: JSON.stringify(next) });
      return merged;
    });
  };

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

  // UI
  return (
    <div className="container py-6">
      <div className="grid gap-4 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]">
        {/* Sidebar (desktop) */}
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
                { k: "logs", label: "Logs" },
              ].map((i) => (
                <button
                  key={i.k}
                  onClick={() => setTab(i.k as typeof tab)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${tab === i.k ? "bg-background border" : "hover:bg-background/60"}`}
                >
                  <span>{i.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="space-y-6 min-w-0">
          {/* Top segmented control (mobile) */}
          <div className="md:hidden rounded-lg border p-1 bg-muted">
            <div className="grid grid-cols-3 gap-1">
              {[
                { k: "dashboard", label: "Dashboard" },
                { k: "users", label: "Users" },
                { k: "accounts", label: "Accounts" },
              ].map((i) => (
                <button
                  key={i.k}
                  onClick={() => setTab(i.k as typeof tab)}
                  className={`px-3 py-1.5 rounded text-sm ${tab === i.k ? "bg-background shadow-sm" : "text-muted-foreground"}`}
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
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
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
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      placeholder="Search users by email"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full sm:w-72 rounded-md bg-secondary px-3 py-2"
                    />
                    <button className="px-3 py-2 rounded border hover:bg-background" onClick={exportUsersJson}>Export</button>
                    <label className="px-3 py-2 rounded border hover:bg-background cursor-pointer">
                      Import
                      <input type="file" accept="application/json" onChange={importUsersJson} className="hidden" />
                    </label>
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground px-2">Found: {filteredUsers.length}</div>
                  </div>
                </div>
                <div className="p-2 overflow-auto">
                  <table className="w-full text-sm min-w-[860px]">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Accounts</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Plan</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.email} className="border-t">
                          <td className="p-2">{u.email}</td>
                          <td className="p-2">{u.isAdmin ? "Admin" : "Member"}</td>
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
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                            <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground" onClick={() => removeUser(u.email)}>
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
                      <option key={u.email} value={u.email}>{u.email}</option>
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
                  <button className="rounded-md border px-3 py-2 hover:bg-background" onClick={addAccount}>Add</button>
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
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground px-2">Found: {accountsFlat.length}</div>
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
                            <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground" onClick={() => removeAccount(row.owner, row.account.id)}>Remove</button>
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
                <p className="text-sm text-muted-foreground">Assign subscription plans per user. This updates the user's stored settings.plan.</p>
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
                              <option key={p} value={p}>{p}</option>
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

          {tab === "logs" ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-card">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-2 sm:items-center">
                  <div className="font-semibold flex-1">Logs</div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select className="rounded-md bg-secondary px-3 py-2" value={logsUser} onChange={(e) => setLogsUser(e.target.value)}>
                      <option value="">All users</option>
                      {users.map((u) => (
                        <option key={u.email} value={u.email}>{u.email}</option>
                      ))}
                    </select>
                    <input
                      placeholder="Filter by action/detail"
                      value={logsQuery}
                      onChange={(e) => setLogsQuery(e.target.value)}
                      className="w-full sm:w-64 rounded-md bg-secondary px-3 py-2"
                    />
                    <button className="px-3 py-2 rounded border hover:bg-background" onClick={() => writeLogs([])}>Clear</button>
                  </div>
                </div>
                <div className="p-2 overflow-auto">
                  {(() => {
                    const all = readLogs();
                    const fq = logsQuery.trim().toLowerCase();
                    const filtered = all.filter((l) => {
                      const okUser = logsUser
                        ? (l.user ? l.user === logsUser : (l.detail ?? "").includes(logsUser))
                        : true;
                      const okQ = fq
                        ? (l.action.toLowerCase().includes(fq) || (l.detail ?? "").toLowerCase().includes(fq))
                        : true;
                      return okUser && okQ;
                    });
                    return (
                      <table className="w-full text-sm min-w-[640px]">
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
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
