import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// Minimal local copy of the user shape stored in localStorage (tt_users)
type TAccount = { id: string; name: string; phone?: string };
type TUser = {
  email: string;
  password?: string;
  isAdmin?: boolean;
  accounts: TAccount[];
  activeAccountId?: string | null;
  settings?: Record<string, unknown>;
  blocklist?: string[];
};

function getUsers(): TUser[] {
  try {
    const raw = localStorage.getItem("tt_users");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as TUser[];
    return [];
  } catch {
    return [];
  }
}

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard" | "users" | "accounts">("dashboard");
  const [users, setUsers] = useState<TUser[]>([]);
  const [userQuery, setUserQuery] = useState("");
  const [acctQuery, setAcctQuery] = useState("");

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

  return (
    <div className="container py-6 space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab("dashboard")}
          className={`px-3 py-1.5 rounded border text-sm ${tab === "dashboard" ? "bg-background" : "hover:bg-background/60"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-3 py-1.5 rounded border text-sm ${tab === "users" ? "bg-background" : "hover:bg-background/60"}`}
        >
          Users
        </button>
        <button
          onClick={() => setTab("accounts")}
          className={`px-3 py-1.5 rounded border text-sm ${tab === "accounts" ? "bg-background" : "hover:bg-background/60"}`}
        >
          Accounts
        </button>
      </div>

      {tab === "dashboard" ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
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
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              placeholder="Search users by email"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full sm:w-72 rounded-md bg-secondary px-3 py-2"
            />
            <div className="text-xs text-muted-foreground">Found: {filteredUsers.length}</div>
          </div>

          <div className="rounded-xl border p-2 bg-card overflow-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Accounts</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.email} className="border-t">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.isAdmin ? "Admin" : "Member"}</td>
                    <td className="p-2">{u.accounts?.length ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {tab === "accounts" ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              placeholder="Search by user, account or phone"
              value={acctQuery}
              onChange={(e) => setAcctQuery(e.target.value)}
              className="w-full sm:w-96 rounded-md bg-secondary px-3 py-2"
            />
            <div className="text-xs text-muted-foreground">Found: {accountsFlat.length}</div>
          </div>

          <div className="rounded-xl border p-2 bg-card overflow-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="p-2">User</th>
                  <th className="p-2">Account</th>
                  <th className="p-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {accountsFlat.map((row) => (
                  <tr key={`${row.owner}:${row.account.id}`} className="border-t">
                    <td className="p-2">{row.owner}</td>
                    <td className="p-2">{row.account.name}</td>
                    <td className="p-2">{row.account.phone ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
