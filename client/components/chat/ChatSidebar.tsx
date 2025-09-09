import { useState } from "react";

export interface ChatItem {
  id: string;
  name: string;
  type: "private" | "group";
  unread?: number;
  avatar?: string; // optional avatar URL
}

export default function ChatSidebar({
  chats,
  currentId,
  onSelect,
}: {
  chats: ChatItem[];
  currentId: string | null;
  onSelect: (id: string) => void;
}) {
  const [tab, setTab] = useState<"private" | "group">("private");
  const filtered = chats.filter((c) => c.type === tab);
  return (
    <aside className="w-full md:w-64 lg:w-72 border-r bg-secondary/30">
      <div className="p-3 flex gap-2">
        <button
          onClick={() => setTab("private")}
          className={`flex-1 px-3 py-2 rounded-md text-sm ${tab === "private" ? "bg-background" : "hover:bg-background/50"}`}
        >
          Private
        </button>
        <button
          onClick={() => setTab("group")}
          className={`flex-1 px-3 py-2 rounded-md text-sm ${tab === "group" ? "bg-background" : "hover:bg-background/50"}`}
        >
          Groups
        </button>
      </div>
      <div className="p-2 space-y-1 max-h-[calc(100vh-18rem)] sm:max-h-[calc(100vh-14rem)] overflow-auto">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left ${
              currentId === c.id
                ? "bg-background border"
                : "hover:bg-background/60"
            }`}
          >
            <div className="flex items-center gap-3">
              {c.avatar ? (
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">
                  {c.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div className="text-sm">{c.name}</div>
            </div>
            {c.unread ? (
              <span className="text-[10px] rounded bg-primary text-primary-foreground px-1.5 py-0.5">
                {c.unread}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </aside>
  );
}
