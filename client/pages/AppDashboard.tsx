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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function AppDashboard() {
  const { user, switchAccount } = useAuth();
  const isMobile = useIsMobile();
  const [otpOpen, setOtpOpen] = useState(false);
  const [massOpen, setMassOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [chats, setChats] = useState<ChatItem[]>([
    { id: "1", name: "Ali", type: "private", unread: 1, avatar: "/placeholder.svg" },
    { id: "2", name: "Nodira", type: "private", avatar: "/placeholder.svg" },
    { id: "3", name: "Jamshid", type: "private", avatar: "/placeholder.svg" },
    { id: "4", name: "Support", type: "private", avatar: "/placeholder.svg" },
    { id: "7", name: "Dilshod", type: "private", avatar: "/placeholder.svg" },
    { id: "8", name: "Madina", type: "private", avatar: "/placeholder.svg" },
    { id: "9", name: "Bekzod", type: "private", avatar: "/placeholder.svg" },
    { id: "10", name: "Javlon", type: "private", avatar: "/placeholder.svg" },
    { id: "11", name: "Sardor", type: "private", avatar: "/placeholder.svg" },
    { id: "12", name: "Nigora", type: "private", avatar: "/placeholder.svg" },
    { id: "5", name: "Marketing", type: "group", unread: 12, avatar: "/placeholder.svg" },
    { id: "6", name: "Savdo", type: "group", avatar: "/placeholder.svg" },
    { id: "13", name: "Frontend Devs", type: "group", avatar: "/placeholder.svg" },
    { id: "14", name: "Support Team", type: "group", avatar: "/placeholder.svg" },
    { id: "15", name: "Family", type: "group", avatar: "/placeholder.svg" },
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
    attachment?:
      | { type: "image" | "audio" | "document"; file: File }
      | { type: "location"; url: string; name?: string };
  }) => {
    if (!currentId) return;
    setMessages((prev) => ({
      ...prev,
      [currentId]: [
        ...(prev[currentId] ?? []),
        payload.attachment
          ? "file" in payload.attachment
            ? {
                id: Math.random().toString(36).slice(2),
                sender: "me",
                at: Date.now(),
                file: {
                  type: payload.attachment.type,
                  url: URL.createObjectURL(payload.attachment.file),
                  name: payload.attachment.file.name,
                },
              }
            : {
                id: Math.random().toString(36).slice(2),
                sender: "me",
                at: Date.now(),
                file: {
                  type: "location",
                  url: payload.attachment.url,
                  name: payload.attachment.name,
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
        <div className="hidden md:flex items-center gap-3">
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
        <div className="md:hidden flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {activeAccount ? activeAccount.name : "Hisob yo'q"}
          </div>
          <MobileActions
            onAdd={() => setOtpOpen(true)}
            onMass={() => setMassOpen(true)}
            onTemplates={() => setTemplatesOpen(true)}
            onSettings={() => setSettingsOpen(true)}
            onAccounts={() => setAccountsOpen(true)}
          />
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          Offline rejim qo'llab-quvvatlanadi
        </div>
      </div>
      {!isMobile ? (
        <div className="grid gap-3 rounded-xl border overflow-hidden h-[70vh] grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr]">
          <ChatSidebar
            chats={chats}
            currentId={currentId}
            onSelect={setCurrentId}
            onCreateChat={onCreateChat}
            user={user}
          />
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 min-h-0">
              <ChatWindow
                title={currentName}
                status="online"
                messages={currentMessages}
              />
            </div>
            <MessageComposer onSend={send} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden h-[70vh] flex flex-col">
          {!currentId ? (
            <div className="flex-1 min-h-0">
              <ChatSidebar
                chats={chats}
                currentId={null}
                onSelect={setCurrentId}
                onCreateChat={onCreateChat}
                user={user}
              />
            </div>
          ) : (
            <div className="flex flex-col h-[70vh] min-h-0">
              <div className="flex-1 min-h-0">
                <ChatWindow
                  title={currentName}
                  status="online"
                  messages={currentMessages}
                  onBack={() => setCurrentId(null)}
                />
              </div>
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

function MobileActions({
  onAdd,
  onMass,
  onTemplates,
  onSettings,
  onAccounts,
}: {
  onAdd: () => void;
  onMass: () => void;
  onTemplates: () => void;
  onSettings: () => void;
  onAccounts: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-md border px-2 py-2 hover:bg-accent/40"
          aria-label="Amallar"
          title="Amallar"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAccounts}>Hozirgi hisob</DropdownMenuItem>
        <DropdownMenuItem onClick={onAdd}>Hisob qo'shish</DropdownMenuItem>
        <DropdownMenuItem onClick={onMass}>Mass xabar</DropdownMenuItem>
        <DropdownMenuItem onClick={onTemplates}>Shablonlar</DropdownMenuItem>
        <DropdownMenuItem onClick={onSettings}>Sozlamalar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
