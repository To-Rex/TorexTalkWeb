import { useState } from "react";

export interface ChatItem {
  id: string;
  name: string;
  type: "private" | "group";
  unread?: number;
  avatar?: string; // optional avatar URL
}

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { User } from "@/auth";

export default function ChatSidebar({
  chats,
  currentId,
  onSelect,
  onCreateChat,
  user,
  collapsed = false,
  onToggleCollapsed,
  loadingPrivate = false,
  loadingGroups = false,
  emptyMessage = "Chatlar yo'q",
  tab = "private",
  onTabChange,
}: {
  chats: ChatItem[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreateChat?: (payload: { name: string; type: "private" | "group" }) => void;
  user: User | null;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  loadingPrivate?: boolean;
  loadingGroups?: boolean;
  emptyMessage?: string;
  tab?: "private" | "group";
  onTabChange?: (tab: "private" | "group") => void;
}) {
  const [query, setQuery] = useState("");

  const lower = query.trim().toLowerCase();
  const filtered = chats.filter(
    (c) => c.type === tab && (!lower || c.name.toLowerCase().includes(lower)),
  );

  // Example global directory to allow starting new conversations (can be wired to backend later)
  const directory: { name: string; type: "private" | "group" }[] = [
    { name: "Dilshodjon Haydarov", type: "private" },
    { name: "Frontend Devs", type: "group" },
    { name: "Marketing", type: "group" },
    { name: "Support", type: "private" },
  ];
  const dirResults = lower
    ? directory.filter(
        (d) =>
          d.type === tab &&
          d.name.toLowerCase().includes(lower) &&
          !chats.some((c) => c.type === d.type && c.name === d.name),
      )
    : [];

  return (
    <aside className={`${collapsed ? "w-16" : "w-full md:w-64 lg:w-72"} border-r bg-secondary/30 flex flex-col h-full min-h-0 transition-all duration-200`}>
      {onToggleCollapsed && (
        <div className="flex justify-between items-center p-2 shrink-0">
          {!collapsed && <div className="text-sm font-medium">Chat</div>}
          <button
            onClick={onToggleCollapsed}
            className="inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-background"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Kengaytirish" : "Qisqartirish"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      )}
      {!collapsed && (
        <div className="p-3 flex gap-2 shrink-0">
          <button
            onClick={() => onTabChange?.("private")}
            className={`flex-1 px-3 py-2 rounded-md text-sm ${tab === "private" ? "bg-background" : "hover:bg-background/50"}`}
          >
            Private
          </button>
          <button
            onClick={() => onTabChange?.("group")}
            className={`flex-1 px-3 py-2 rounded-md text-sm ${tab === "group" ? "bg-background" : "hover:bg-background/50"}`}
          >
            Groups
          </button>
        </div>
      )}

      {!collapsed && (
        <div className="px-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "private" ? "Foydalanuvchi qidirish" : "Guruh qidirish"}
              className="pl-8 pr-8"
            />
            {query ? (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
                aria-label="Tozalash"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div className="p-2 space-y-1 flex-1 min-h-0 overflow-y-auto">
        {((tab === "private" && loadingPrivate) || (tab === "group" && loadingGroups)) ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex items-center ${collapsed ? "justify-center px-1" : "gap-3 px-3"} py-2`}>
              <Skeleton className={`${collapsed ? "h-8 w-8" : "h-10 w-10"} rounded-full`} />
              {!collapsed && <Skeleton className="h-4 flex-1" />}
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</div>
        ) : (
          <>
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-full flex items-center justify-between rounded-lg ${collapsed ? "px-1" : "px-3"} py-2 text-left ${
                  currentId === c.id
                    ? "bg-background border"
                    : "hover:bg-background/60"
                }`}
              >
                <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className={`${collapsed ? "h-8 w-8" : "h-10 w-10"} rounded-full object-cover`}
                    />
                  ) : (
                    <div className={`${collapsed ? "h-8 w-8" : "h-10 w-10"} rounded-full bg-primary text-white grid place-items-center font-semibold ${collapsed ? "text-xs" : ""}`}>
                      {c.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                  {!collapsed && <div className="text-sm">{c.name}</div>}
                </div>
                {c.unread ? (
                  <span className="text-[10px] rounded bg-primary text-primary-foreground px-1.5 py-0.5">
                    {c.unread}
                  </span>
                ) : null}
              </button>
            ))}

            {!collapsed && dirResults.length > 0 ? (
              <div className="pt-2">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  Natijalar
                </div>
                {dirResults.map((d) => (
                  <div key={`${d.type}:${d.name}`} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-background/60">
                    <div className="text-sm">{d.name}</div>
                    {onCreateChat ? (
                      <button
                        onClick={() => onCreateChat({ name: d.name, type: d.type })}
                        className="text-xs rounded px-2 py-1 border hover:bg-background"
                      >
                        Chat boshlash
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

    </aside>
  );
}
