import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/auth";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileAttachment {
  type: "image" | "audio" | "document" | "location";
  url: string;
  name?: string;
}

export interface Message {
  id: string;
  sender: string;
  text?: string;
  at: number;
  file?: FileAttachment;
}

export default function ChatWindow({
  title,
  status,
  messages,
  onBack,
  collapsed = false,
}: {
  title: string;
  status: string;
  messages: Message[];
  onBack?: () => void;
  collapsed?: boolean;
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
      <div className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-2 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="font-medium flex items-center gap-3">
          {onBack ? (
            <button
              className="md:hidden -ml-2 mr-1 inline-flex items-center justify-center rounded p-2 hover:bg-accent/40"
              onClick={onBack}
              aria-label="Orqaga"
              title="Orqaga"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
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
            className={`w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm text-white ${m.sender === "me" ? `ml-auto bg-primary` : "bg-secondary"}`}
          >
            {m.sender !== "me" ? (
              <div className="text-xs font-medium text-white mb-1">
                {m.sender === "them" ? title : m.sender}
              </div>
            ) : null}
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
              ) : m.file.type === "audio" ? (
                <audio controls src={m.file.url} className="mt-1 w-full" />
              ) : m.file.type === "document" ? (
                <a
                  href={m.file.url}
                  download={m.file.name}
                  className="mt-1 inline-flex items-center gap-2 underline underline-offset-2"
                >
                  📎 {m.file.name ?? "Hujjat"}
                </a>
              ) : (
                <div className="mt-1 rounded-md bg-background/60 border p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">📍</span>
                    <div className="flex-1">
                      <div className="font-medium">Lokatsiya</div>
                      {m.file.name ? (
                        <div className="text-xs text-muted-foreground">{m.file.name}</div>
                      ) : null}
                    </div>
                    <a
                      href={m.file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs rounded px-2 py-1 border hover:bg-background"
                    >
                      Ko'rish
                    </a>
                  </div>
                </div>
              )
            ) : null}
            <div className="text-[10px] text-white mt-1">
              {new Date(m.at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
