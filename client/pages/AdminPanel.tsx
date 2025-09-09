import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminPanel() {
  const data = useMemo(
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

  const users = [
    { email: "user1@example.com", status: "active", plan: "Plus" },
    { email: "user2@example.com", status: "blocked", plan: "Free" },
    { email: "user3@example.com", status: "active", plan: "Premium" },
  ];

  return (
    <div className="container py-6 space-y-6">
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
          <div className="text-2xl font-bold">312</div>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-card">
        <div className="mb-3 font-semibold">System-wide analytics</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20 }}>
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

      <div className="rounded-xl border p-4 bg-card overflow-auto">
        <div className="mb-3 font-semibold">User management</div>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Plan</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.status}</td>
                <td className="p-2">{u.plan}</td>
                <td className="p-2 space-x-2">
                  <button className="px-2 py-1 rounded bg-secondary">Edit</button>
                  <button className="px-2 py-1 rounded bg-destructive text-destructive-foreground">Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
