import { useEffect, useMemo, useState } from "react";
import ChatSidebar, { ChatItem } from "@/components/chat/ChatSidebar";
import ChatWindow, { Message } from "@/components/chat/ChatWindow";
import MessageComposer from "@/components/chat/MessageComposer";
import OtpModal from "@/components/chat/OtpModal";
import MassMessageModal from "@/components/chat/MassMessageModal";
import AccountsManager from "@/components/AccountsManager";
import TemplatesManager from "@/components/TemplatesManager";
import SettingsModal from "@/components/SettingsModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppDashboard() {
  const { user, switchAccount } = useAuth();
  const isMobile = useIsMobile();
  const [otpOpen, setOtpOpen] = useState(false);
  const [massOpen, setMassOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: "1",
      name: "Ali",
      type: "private",
      unread: 1,
      avatar: "/placeholder.svg",
    },
    { id: "2", name: "Nodira", type: "private", avatar: "/placeholder.svg" },
    { id: "3", name: "Jamshid", type: "private", avatar: "/placeholder.svg" },
    { id: "4", name: "Support", type: "private", avatar: "/placeholder.svg" },
    {
      id: "5",
      name: "Marketing",
      type: "group",
      unread: 12,
      avatar: "/placeholder.svg",
    },
    { id: "6", name: "Savdo", type: "group", avatar: "/placeholder.svg" },
  ]);

  // messages keyed by chat id
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1",
        sender: "them",
        text: "Salom! Yordam bera olamanmi?",
        at: Date.now() - 60000,
      },
      {
        id: "m2",
        sender: "me",
        text: "Assalomu alaykum! Ha, hisob ulashmoqchi edim.",
        at: Date.now() - 30000,
      },
    ],
  });

  const [currentId, setCurrentId] = useState<string | null>(null);

  // if user has activeAccountId, show it
  const activeAccount =
    user?.accounts.find((a) => a.id === user.activeAccountId) ??
    user?.accounts[0] ??
    null;

  useEffect(() => {
    if (!isMobile && !currentId) {
      setCurrentId(chats[0]?.id ?? null);
    }
  }, [isMobile, chats]);

  const currentMessages = currentId ? (messages[currentId] ?? []) : [];
  const currentName = chats.find((c) => c.id === currentId)?.name ?? "";

  const send = (payload: {
    text?: string;
    file?: { type: "image" | "audio"; file: File };
  }) => {
    if (!currentId) return;
    setMessages((prev) => ({
      ...prev,
      [currentId]: [
        ...(prev[currentId] ?? []),
        payload.file
          ? {
              id: Math.random().toString(36).slice(2),
              sender: "me",
              at: Date.now(),
              file: {
                type: payload.file.type,
                url: URL.createObjectURL(payload.file.file),
                name: payload.file.file.name,
              },
            }
          : {
              id: Math.random().toString(36).slice(2),
              sender: "me",
              text: payload.text ?? "",
              at: Date.now(),
            },
      ],
    }));
  };

  const sendMass = (text: string) => {
    const blocked = new Set(user?.blocklist ?? []);
    const privateChats = chats.filter(
      (c) => c.type === "private" && !blocked.has(c.name),
    );
    setMessages((prev) => {
      const next = { ...prev };
      privateChats.forEach((c) => {
        const arr = next[c.id] ?? [];
        arr.push({
          id: Math.random().toString(36).slice(2),
          sender: "me",
          text,
          at: Date.now(),
        });
        next[c.id] = arr;
      });
      return next;
    });
  };

  const onCreateChat = ({ name, type }: { name: string; type: "private" | "group" }) => {
    // Avoid duplicates by name/type
    const exists = chats.find((c) => c.name === name && c.type === type);
    if (exists) {
      setCurrentId(exists.id);
      return;
    }
    const id = Math.random().toString(36).slice(2);
    const item: ChatItem = { id, name, type, avatar: "/placeholder.svg" };
    setChats((prev) => [...prev, item]);
    setMessages((prev) => ({ ...prev, [id]: [] }));
    setCurrentId(id);
  };

  return (
    <div className="container py-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAccountsOpen(true)}
            className="inline-flex flex-col text-sm text-left hover:opacity-90"
          >
            <div className="text-muted-foreground text-xs">Hozirgi hisob</div>
            <div className="font-medium">
              {activeAccount
                ? `${activeAccount.name} ${activeAccount.phone ? `(${activeAccount.phone})` : ""}`
                : "— hisob tanlanmagan —"}
            </div>
          </button>
          <Button size="sm" onClick={() => setOtpOpen(true)}>
            Hisob qo'shish
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setMassOpen(true)}
          >
            Mass xabar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setTemplatesOpen(true)}
          >
            Shablonlar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSettingsOpen(true)}
          >
            Sozlamalar
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Offline rejim qo'llab-quvvatlanadi
        </div>
      </div>
      {!isMobile ? (
        <div className="grid gap-3 rounded-xl border overflow-hidden min-h-[70vh] grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr]">
          <ChatSidebar
            chats={chats}
            currentId={currentId}
            onSelect={setCurrentId}
            onCreateChat={onCreateChat}
          />
          <div className="flex flex-col min-h-[50vh]">
            <ChatWindow
              title={currentName}
              status="online"
              messages={currentMessages}
            />
            <MessageComposer onSend={send} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden min-h-[70vh]">
          {!currentId ? (
            <ChatSidebar
              chats={chats}
              currentId={null}
              onSelect={setCurrentId}
              onCreateChat={onCreateChat}
            />
          ) : (
            <div className="flex flex-col min-h-[70vh]">
              <ChatWindow
                title={currentName}
                status="online"
                messages={currentMessages}
                onBack={() => setCurrentId(null)}
              />
              <MessageComposer onSend={send} />
            </div>
          )}
        </div>
      )}
      <OtpModal open={otpOpen} onClose={() => setOtpOpen(false)} />
      <MassMessageModal
        open={massOpen}
        onClose={() => setMassOpen(false)}
        onSend={sendMass}
      />
      <AccountsManager
        open={accountsOpen}
        onClose={() => setAccountsOpen(false)}
      />
      <TemplatesManager
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
