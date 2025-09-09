import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/auth";

export interface FileAttachment {
  type: "image" | "audio";
  url: string;
  name?: string;
}

export interface Message {
  id: string;
  sender: "me" | "them";
  text?: string;
  at: number;
  file?: FileAttachment;
}

export default function ChatWindow({
  title,
  status,
  messages,
}: {
  title: string;
  status: string;
  messages: Message[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { user, addToBlocklist, removeFromBlocklist } = useAuth();
  const [autoReply, setAutoReply] = useState<boolean>(false);
  const isBlocked = (user?.blocklist ?? []).includes(title);
  const toggleBlock = () => {
    if (!user) return;
    if (isBlocked) removeFromBlocklist(title);
    else addToBlocklist(title);
  };

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    if (!user) return;
    const key = `tt_ar_${user.email}_${title}`;
    const val = localStorage.getItem(key);
    setAutoReply(val === "1");
  }, [user, title]);

  const toggleAuto = () => {
    if (!user) return;
    const key = `tt_ar_${user.email}_${title}`;
    const next = !autoReply;
    setAutoReply(next);
    localStorage.setItem(key, next ? "1" : "0");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="font-medium flex items-center gap-3">
          <div>{title}</div>
          <div className="text-xs text-muted-foreground">{status}</div>
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={autoReply} onChange={toggleAuto} />{" "}
            Auto-reply
          </label>
          <button
            onClick={toggleBlock}
            disabled={!title}
            className={`text-xs rounded px-2 py-1 border ${isBlocked ? "bg-destructive text-destructive-foreground border-destructive" : "hover:bg-background"} ${!title ? "opacity-50 cursor-not-allowed" : ""}`}
            title={
              isBlocked ? "Mass xabardan chiqarish" : "Mass xabardan bloklash"
            }
          >
            {isBlocked ? "Blokdan chiqarish" : "Mass xabardan bloklash"}
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex-1 overflow-auto p-3 space-y-2 bg-background"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender === "me" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}
          >
            {m.text ? (
              <div className="mb-1 whitespace-pre-wrap">{m.text}</div>
            ) : null}
            {m.file ? (
              m.file.type === "image" ? (
                <img
                  src={m.file.url}
                  alt={m.file.name ?? "image"}
                  className="max-w-full rounded-md mt-1"
                />
              ) : (
                <audio controls src={m.file.url} className="mt-1 w-full" />
              )
            ) : null}
            <div className="text-[10px] text-muted-foreground mt-1">
              {new Date(m.at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
