import { useEffect, useMemo, useState } from "react";
import ChatSidebar, { ChatItem } from "@/components/chat/ChatSidebar";
import ChatWindow, { Message, FileAttachment } from "@/components/chat/ChatWindow";
import MessageComposer from "@/components/chat/MessageComposer";
import MassMessageModal from "@/components/chat/MassMessageModal";
import AddAccountModal from "@/components/chat/AddAccountModal";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronDown } from "lucide-react";
import { PrivateChatsResponse, GroupsResponse, ChatMessagesResponse, GroupChatItem } from "@shared/api";
import { apiService } from "@/lib/api";

export default function AppDashboard() {
  const { user, switchTelegramAccount } = useAuth();
  const isMobile = useIsMobile();
  const [massOpen, setMassOpen] = useState(false);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("tt_chat_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  // if user has activeTelegramAccountId, show it
  const activeTelegramAccount =
    user?.telegramAccounts.find((a) => a.id === user.activeTelegramAccountId) ??
    user?.telegramAccounts[0] ??
    null;

  const [privateChats, setPrivateChats] = useState<ChatItem[]>([]);
  const [groups, setGroups] = useState<ChatItem[]>([]);
  const [fullGroups, setFullGroups] = useState<GroupChatItem[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentTab, setCurrentTab] = useState<"private" | "group">("private");

  useEffect(() => {
    const fetchPrivateChats = async () => {
      if (!activeTelegramAccount?.index) return;
      setLoadingChats(true);
      try {
        const data = await apiService.fetchPrivateChats(activeTelegramAccount.index);
        if (data.ok) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL;
          const privates: ChatItem[] = data.items.map(item => ({
            id: item.id.toString(),
            name: item.full_name || item.username || "Deleted Account",
            type: "private" as const,
            avatar: (!item.full_name && !item.username) ? "deleted" : item.has_photo ? `${baseUrl}${item.photo_url}` : undefined,
          }));
          setPrivateChats(privates);
        }
      } catch (error) {
        console.error('Failed to fetch private chats', error);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchPrivateChats();
  }, [activeTelegramAccount?.index]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!activeTelegramAccount?.index || currentTab !== "group") return;
      setLoadingGroups(true);
      try {
        const data = await apiService.fetchGroups(activeTelegramAccount.index);
        if (data.ok) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL;
          const groupItems: ChatItem[] = data.items.map(item => ({
            id: item.id.toString(),
            name: item.title,
            type: "group" as const,
            avatar: item.has_photo ? `${baseUrl}${item.photo_url}` : undefined,
          }));
          setGroups(groupItems);
          setFullGroups(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch groups', error);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [activeTelegramAccount?.index, currentTab, groups.length]);

  useEffect(() => {
    try {
      localStorage.setItem("tt_chat_sidebar_collapsed", sidebarCollapsed ? "1" : "0");
    } catch {}
  }, [sidebarCollapsed]);

  const chats = useMemo(() => [...privateChats, ...groups], [privateChats, groups]);

  // messages keyed by chat id
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "m1",
        sender: "them",
        text: "Salom! Yordam bera olamanmi?",
        at: Date.now() - 600000,
      },
      {
        id: "m2",
        sender: "me",
        text: "Assalomu alaykum! Ha, hisob ulashmoqchi edim.",
        at: Date.now() - 570000,
      },
      {
        id: "m3",
        sender: "them",
        text: "Qaysi hisob haqida gapiryapsiz?",
        at: Date.now() - 540000,
      },
      {
        id: "m4",
        sender: "me",
        text: "Telegram hisobim haqida. Yangi loyihamiz uchun.",
        at: Date.now() - 510000,
      },
      {
        id: "m5",
        sender: "them",
        text: "Tushundim. Ma'lumotlaringizni yuboring.",
        at: Date.now() - 480000,
      },
      {
        id: "m6",
        sender: "me",
        text: "Albatta, hoziroq yuboraman.",
        at: Date.now() - 450000,
      },
      {
        id: "m7",
        sender: "them",
        text: "Rahmat. Ko'rib chiqaman.",
        at: Date.now() - 30000,
      },
    ],
    "2": [
      {
        id: "m8",
        sender: "them",
        text: "Qanday yordam kerak?",
        at: Date.now() - 720000,
      },
      {
        id: "m9",
        sender: "me",
        text: "Mahsulot haqida ma'lumot beraman.",
        at: Date.now() - 690000,
      },
      {
        id: "m10",
        sender: "them",
        text: "Qaysi mahsulot?",
        at: Date.now() - 660000,
      },
      {
        id: "m11",
        sender: "me",
        text: "Yangi smartfon modelimiz.",
        at: Date.now() - 630000,
      },
      {
        id: "m12",
        sender: "them",
        text: "Narxi qancha?",
        at: Date.now() - 600000,
      },
      {
        id: "m13",
        sender: "me",
        text: "2 million so'mdan boshlanadi.",
        at: Date.now() - 570000,
      },
      {
        id: "m14",
        sender: "them",
        text: "Qiziqarli. Ko'proq ma'lumot bering.",
        at: Date.now() - 120000,
      },
    ],
    "3": [
      {
        id: "m15",
        sender: "them",
        text: "Loyiha qachon tugaydi?",
        at: Date.now() - 900000,
      },
      {
        id: "m16",
        sender: "me",
        text: "Keyingi oy oxirida.",
        at: Date.now() - 870000,
      },
      {
        id: "m17",
        sender: "them",
        text: "Jadvalga rioya qilamizmi?",
        at: Date.now() - 840000,
      },
      {
        id: "m18",
        sender: "me",
        text: "Ha, barcha vazifalar bajarildi.",
        at: Date.now() - 810000,
      },
      {
        id: "m19",
        sender: "them",
        text: "Ajoyib! Mijozga xabar beraman.",
        at: Date.now() - 180000,
      },
    ],
    "4": [
      {
        id: "m20",
        sender: "them",
        text: "Texnik yordam kerak.",
        at: Date.now() - 1080000,
      },
      {
        id: "m21",
        sender: "me",
        text: "Qanday muammo bor?",
        at: Date.now() - 1050000,
      },
      {
        id: "m22",
        sender: "them",
        text: "Kompyuter sekin ishlayapti.",
        at: Date.now() - 1020000,
      },
      {
        id: "m23",
        sender: "me",
        text: "Qaysi operatsion sistema?",
        at: Date.now() - 990000,
      },
      {
        id: "m24",
        sender: "them",
        text: "Windows 10.",
        at: Date.now() - 960000,
      },
      {
        id: "m25",
        sender: "me",
        text: "Diagnostika qilaman. Kuting.",
        at: Date.now() - 240000,
      },
    ],
    "5": [
      {
        id: "m26",
        sender: "user1",
        text: "Yangi kampaniya boshlandi!",
        at: Date.now() - 1200000,
      },
      {
        id: "m27",
        sender: "user2",
        text: "Ajoyib! Qanday natija kutmoqdamiz?",
        at: Date.now() - 1170000,
      },
      {
        id: "m28",
        sender: "me",
        text: "Kampaniya muvaffaqiyatli bo'lsin!",
        at: Date.now() - 1140000,
      },
      {
        id: "m29",
        sender: "user3",
        text: "Men ham qo'shilaman!",
        at: Date.now() - 1110000,
      },
      {
        id: "m30",
        sender: "user4",
        text: "Byudjet qancha?",
        at: Date.now() - 1080000,
      },
      {
        id: "m31",
        sender: "me",
        text: "5 million so'm ajratildi.",
        at: Date.now() - 1050000,
      },
      {
        id: "m32",
        sender: "user1",
        text: "Yaxshi, boshladik!",
        at: Date.now() - 300000,
      },
    ],
    "6": [
      {
        id: "m33",
        sender: "user3",
        text: "Savdo ko'rsatkichlari yaxshi.",
        at: Date.now() - 1320000,
      },
      {
        id: "m34",
        sender: "me",
        text: "Qaysi oy uchun?",
        at: Date.now() - 1290000,
      },
      {
        id: "m35",
        sender: "user3",
        text: "O'tgan oy.",
        at: Date.now() - 1260000,
      },
      {
        id: "m36",
        sender: "me",
        text: "Foiz qancha o'sish bor?",
        at: Date.now() - 1230000,
      },
      {
        id: "m37",
        sender: "user3",
        text: "15% o'sish.",
        at: Date.now() - 360000,
      },
    ],
    "7": [
      {
        id: "m38",
        sender: "them",
        text: "Salom do'stim!",
        at: Date.now() - 1440000,
      },
      {
        id: "m39",
        sender: "me",
        text: "Salom! Qandaysan?",
        at: Date.now() - 1410000,
      },
      {
        id: "m40",
        sender: "them",
        text: "Yaxshi, rahmat. Sen-chi?",
        at: Date.now() - 1380000,
      },
      {
        id: "m41",
        sender: "me",
        text: "Men ham yaxshi. Ishlar qalay?",
        at: Date.now() - 420000,
      },
    ],
    "8": [
      {
        id: "m42",
        sender: "them",
        text: "Yordam bera olasizmi?",
        at: Date.now() - 1560000,
      },
      {
        id: "m43",
        sender: "me",
        text: "Albatta, nima yordam kerak?",
        at: Date.now() - 1530000,
      },
      {
        id: "m44",
        sender: "them",
        text: "Darsda tushunmaganman.",
        at: Date.now() - 1500000,
      },
      {
        id: "m45",
        sender: "me",
        text: "Qaysi mavzu?",
        at: Date.now() - 1470000,
      },
      {
        id: "m46",
        sender: "them",
        text: "Matematika.",
        at: Date.now() - 480000,
      },
    ],
    "9": [
      {
        id: "m47",
        sender: "them",
        text: "Loyiha muhokamasi.",
        at: Date.now() - 1680000,
      },
      {
        id: "m48",
        sender: "me",
        text: "Qachon uchrashamiz?",
        at: Date.now() - 1650000,
      },
      {
        id: "m49",
        sender: "them",
        text: "Ertaga soat 10:00 da.",
        at: Date.now() - 1620000,
      },
      {
        id: "m50",
        sender: "me",
        text: "Yaxshi, kelaman.",
        at: Date.now() - 540000,
      },
    ],
    "10": [
      {
        id: "m51",
        sender: "them",
        text: "Tadbir haqida gaplashaylik.",
        at: Date.now() - 1800000,
      },
      {
        id: "m52",
        sender: "me",
        text: "Qaysi tadbir?",
        at: Date.now() - 1770000,
      },
      {
        id: "m53",
        sender: "them",
        text: "Kompaniya yubileyi.",
        at: Date.now() - 1740000,
      },
      {
        id: "m54",
        sender: "me",
        text: "Qachon bo'ladi?",
        at: Date.now() - 1710000,
      },
      {
        id: "m55",
        sender: "them",
        text: "Keyingi oy.",
        at: Date.now() - 600000,
      },
    ],
    "11": [
      {
        id: "m56",
        sender: "them",
        text: "Yangi loyiha taklifi.",
        at: Date.now() - 1920000,
      },
      {
        id: "m57",
        sender: "me",
        text: "Qanday loyiha?",
        at: Date.now() - 1890000,
      },
      {
        id: "m58",
        sender: "them",
        text: "Mobil ilova.",
        at: Date.now() - 1860000,
      },
      {
        id: "m59",
        sender: "me",
        text: "Qiziq. Batafsil aytib bering.",
        at: Date.now() - 660000,
      },
    ],
    "12": [
      {
        id: "m60",
        sender: "them",
        text: "Uchrashuv belgilaylik.",
        at: Date.now() - 2040000,
      },
      {
        id: "m61",
        sender: "me",
        text: "Qachon qulay?",
        at: Date.now() - 2010000,
      },
      {
        id: "m62",
        sender: "them",
        text: "Bugun kechqurun.",
        at: Date.now() - 1980000,
      },
      {
        id: "m63",
        sender: "me",
        text: "Soat 18:00 da bo'ladi.",
        at: Date.now() - 720000,
      },
    ],
    "13": [
      {
        id: "m64",
        sender: "user4",
        text: "Frontend kod review qilindi.",
        at: Date.now() - 2160000,
      },
      {
        id: "m65",
        sender: "user5",
        text: "Yaxshi ish! Bug'lar tuzatildi.",
        at: Date.now() - 2130000,
      },
      {
        id: "m66",
        sender: "me",
        text: "Rahmat jamoa!",
        at: Date.now() - 2100000,
      },
      {
        id: "m67",
        sender: "user6",
        text: "Testlar o'tkazildi.",
        at: Date.now() - 2070000,
      },
      {
        id: "m68",
        sender: "user4",
        text: "Deployment tayyor.",
        at: Date.now() - 2040000,
      },
      {
        id: "m69",
        sender: "me",
        text: "Ajoyib! Deploy qilamiz.",
        at: Date.now() - 780000,
      },
    ],
    "14": [
      {
        id: "m70",
        sender: "user6",
        text: "Mijoz shikoyati kelib tushdi.",
        at: Date.now() - 2280000,
      },
      {
        id: "m71",
        sender: "me",
        text: "Qanday shikoyat?",
        at: Date.now() - 2250000,
      },
      {
        id: "m72",
        sender: "user6",
        text: "Yetkazib berish kechikdi.",
        at: Date.now() - 2220000,
      },
      {
        id: "m73",
        sender: "me",
        text: "Mijozga uzr so'raymiz.",
        at: Date.now() - 2190000,
      },
      {
        id: "m74",
        sender: "user6",
        text: "Yaxshi, men hal qilaman.",
        at: Date.now() - 840000,
      },
    ],
    "15": [
      {
        id: "m75",
        sender: "user7",
        text: "Oilaviy uchrashuv rejalashtirildi.",
        at: Date.now() - 2400000,
      },
      {
        id: "m76",
        sender: "me",
        text: "Qachon?",
        at: Date.now() - 2370000,
      },
      {
        id: "m77",
        sender: "user7",
        text: "Shanba kuni.",
        at: Date.now() - 2340000,
      },
      {
        id: "m78",
        sender: "me",
        text: "Barcha keladimi?",
        at: Date.now() - 2310000,
      },
      {
        id: "m79",
        sender: "user7",
        text: "Ha, hamma keladi.",
        at: Date.now() - 900000,
      },
    ],
  });
  // offsets for infinite scroll
  const [messageOffsets, setMessageOffsets] = useState<Record<string, number>>({});
  // loading more messages
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});
  // total message counts
  const [totalMessageCounts, setTotalMessageCounts] = useState<Record<string, number>>({});
  // has more messages to load
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({});

  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentId || !activeTelegramAccount?.index) return;
      setLoadingMessages(true);
      try {
        const data = await apiService.fetchChatMessages(currentId, activeTelegramAccount.index, 0);
        if (data.ok) {
          const baseUrl = import.meta.env.VITE_API_BASE_URL;
          const mappedMessages: Message[] = data.messages.map(item => {
            const sender = item.from_user.id === parseInt(activeTelegramAccount!.id) ? "me" : item.from_user.first_name || "them";
            const text = item.text || item.caption || "";
            const at = new Date(item.date).getTime();
            let file: Message['file'];
            if (item.media_type) {
              const mediaTypeMap: Record<string, FileAttachment['type']> = {
                photo: 'image',
                video: 'video',
                video_note: 'video_note',
                audio: 'audio',
                document: 'document',
                location: 'location',
                contact: 'contact',
              };
              const mappedType = mediaTypeMap[item.media_type] || 'document';
              file = {
                type: mappedType,
                url: item.file_url ? `${baseUrl}${item.file_url}` : item.file_id ? `${baseUrl}${item.file_id}` : "",
                name: item.file_name || undefined,
                mime_type: item.mime_type || undefined,
                thumb_url: item.thumb_url ? `${baseUrl}${item.thumb_url}` : undefined,
              };
            }
            return {
              id: item.id.toString(),
              sender,
              text,
              at,
              file,
              is_read: item.is_read,
              is_outgoing: item.is_outgoing,
              userPhoto: item.from_user.photo_url ? `${baseUrl}${item.from_user.photo_url}` : undefined,
              chatType: item.chat_type,
            };
          }).reverse(); // since API returns latest first, reverse to show oldest first
          setMessages(prev => ({ ...prev, [currentId]: mappedMessages }));
          setMessageOffsets(prev => ({ ...prev, [currentId]: 0 }));
          setTotalMessageCounts(prev => ({ ...prev, [currentId]: data.count }));
          setHasMore(prev => ({ ...prev, [currentId]: data.messages.length === 10 }));
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [currentId, activeTelegramAccount?.index]);

  useEffect(() => {
    if (!isMobile && !currentId) {
      setCurrentId(chats[0]?.id ?? null);
    }
  }, [isMobile, chats]);

  const loadMoreMessages = async () => {
    if (!currentId || !activeTelegramAccount?.index || loadingMore[currentId]) return;
    setLoadingMore(prev => ({ ...prev, [currentId]: true }));
    const currentOffset = messageOffsets[currentId] || 0;
    const newOffset = currentOffset + 10;
    try {
      const data = await apiService.fetchChatMessages(currentId, activeTelegramAccount?.index || '1', newOffset);
      if (data.ok) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const mappedMessages: Message[] = data.messages.map(item => {
          const sender = item.from_user.id === parseInt(activeTelegramAccount!.id) ? "me" : item.from_user.first_name || "them";
          const text = item.text || item.caption || "";
          const at = new Date(item.date).getTime();
          let file: Message['file'];
          if (item.media_type) {
            const mediaTypeMap: Record<string, FileAttachment['type']> = {
              photo: 'image',
              video: 'video',
              video_note: 'video',
              audio: 'audio',
              document: 'document',
              location: 'location',
              contact: 'contact',
            };
            const mappedType = mediaTypeMap[item.media_type] || 'document';
            file = {
              type: mappedType,
              url: item.file_id || "",
              name: item.file_name || undefined,
              mime_type: item.mime_type || undefined,
              thumb_url: item.thumb_url ? `${baseUrl}${item.thumb_url}` : undefined,
            };
          }
          return {
            id: item.id.toString(),
            sender,
            text,
            at,
            file,
            is_read: item.is_read,
            is_outgoing: item.is_outgoing,
            userPhoto: item.from_user.photo_url ? `${baseUrl}${item.from_user.photo_url}` : undefined,
            chatType: item.chat_type,
          };
        }).reverse();
        if (mappedMessages.length > 0) {
          setMessages(prev => ({ ...prev, [currentId]: [...mappedMessages, ...(prev[currentId] || [])] }));
          setMessageOffsets(prev => ({ ...prev, [currentId]: newOffset }));
          setHasMore(prev => ({ ...prev, [currentId]: mappedMessages.length === 10 }));
        }
      }
    } catch (error) {
      console.error('Failed to load more messages', error);
    } finally {
      setLoadingMore(prev => ({ ...prev, [currentId]: false }));
    }
  };


  const currentMessages = currentId ? (messages[currentId] ?? []) : [];
  const currentChat = chats.find((c) => c.id === currentId);
  const currentName = currentChat?.name ?? "";
  const currentAvatar = currentChat?.avatar;
  const currentGroup = fullGroups.find((g) => g.id.toString() === currentId);
  const memberCount = currentGroup?.member_count;
  const onlineCount = currentGroup?.online_count;
  const isLoadingMore = currentId ? loadingMore[currentId] || false : false;

  const send = (payload: {
    text?: string;
    attachment?:
      | { type: "image"; file: File }
      | { type: "image"; url: string; name?: string }
      | { type: "audio"; file: File }
      | { type: "document"; file: File }
      | { type: "location"; url: string; name?: string };
  }) => {
    if (!currentId) return;
    setMessages((prev) => ({
      ...prev,
      [currentId]: [
        ...(prev[currentId] ?? []),
        {
          id: Math.random().toString(36).slice(2),
          sender: "me",
          text: payload.text,
          at: Date.now(),
          file: payload.attachment
            ? "file" in payload.attachment
              ? {
                  type: payload.attachment.type,
                  url: URL.createObjectURL(payload.attachment.file),
                  name: payload.attachment.file.name,
                }
              : "url" in payload.attachment && payload.attachment.type === "image"
              ? {
                  type: "image",
                  url: payload.attachment.url,
                  name: payload.attachment.name,
                }
              : {
                  type: "location",
                  url: payload.attachment.url,
                  name: payload.attachment.name,
                }
            : undefined,
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
    if (type === "private") {
      setPrivateChats((prev) => [...prev, item]);
    } else {
      setGroups((prev) => [...prev, item]);
    }
    setMessages((prev) => ({ ...prev, [id]: [] }));
    setCurrentId(id);
  };


  return (
    <div className="py-6 px-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 text-sm text-left hover:opacity-90">
                {activeTelegramAccount?.profile_picture ? (
                  <img
                    src={activeTelegramAccount.profile_picture}
                    alt={activeTelegramAccount.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-semibold text-xs">
                    {activeTelegramAccount?.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="font-medium">
                    {activeTelegramAccount?.name || "— hisob tanlanmagan —"}
                  </div>
                  {activeTelegramAccount?.phone && (
                    <div className="text-xs text-muted-foreground">
                      +{activeTelegramAccount.phone.slice(0, 3)} {activeTelegramAccount.phone.slice(3, 5)} {activeTelegramAccount.phone.slice(5, 8)} {activeTelegramAccount.phone.slice(8, 10)} {activeTelegramAccount.phone.slice(10)}
                    </div>
                  )}
                </div>
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {user?.telegramAccounts.map((acc) => (
                <DropdownMenuItem
                  key={acc.id}
                  onClick={() => switchTelegramAccount(acc.id)}
                  className={`flex items-center gap-2 ${acc.id === user.activeTelegramAccountId ? "bg-accent" : ""}`}
                >
                  {acc.profile_picture ? (
                    <img
                      src={acc.profile_picture}
                      alt={acc.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center font-semibold text-xs">
                      {acc.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {acc.name}
                    </div>
                    {acc.phone && (
                      <div className="text-xs">
                        +{acc.phone.slice(0, 3)} {acc.phone.slice(3, 5)} {acc.phone.slice(5, 8)} {acc.phone.slice(8, 10)} {acc.phone.slice(10)}
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAccountsOpen(true)}>
                Hisob boshqarish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="text-white" onClick={() => setAddAccountOpen(true)}>
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
            {activeTelegramAccount ? activeTelegramAccount.name : "Hisob yo'q"}
          </div>
          <MobileActions
            onAdd={() => {}}
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
        <div className="flex gap-3 rounded-xl border overflow-hidden h-[70vh]">
          <ChatSidebar
            chats={chats}
            currentId={currentId}
            onSelect={setCurrentId}
            onCreateChat={onCreateChat}
            user={user}
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
            loadingPrivate={loadingChats}
            loadingGroups={loadingGroups}
            emptyMessage="Chatlar yo'q"
            tab={currentTab}
            onTabChange={setCurrentTab}
          />
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <ChatWindow
                key={currentId}
                title={currentName}
                status="online"
                messages={currentMessages}
                collapsed={sidebarCollapsed}
                avatar={currentAvatar}
                memberCount={memberCount}
                onlineCount={onlineCount}
                onLoadMore={loadMoreMessages}
                isLoadingMore={isLoadingMore}
                loadingMessages={loadingMessages}
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
                loadingPrivate={loadingChats}
                loadingGroups={loadingGroups}
                emptyMessage="Chatlar yo'q"
                tab={currentTab}
                onTabChange={setCurrentTab}
              />
            </div>
          ) : (
            <div className="flex flex-col h-[70vh] min-h-0">
              <div className="flex-1 min-h-0">
                <ChatWindow
                  key={currentId}
                  title={currentName}
                  status="online"
                  messages={currentMessages}
                  onBack={() => setCurrentId(null)}
                  avatar={currentAvatar}
                  memberCount={memberCount}
                  onlineCount={onlineCount}
                  onLoadMore={loadMoreMessages}
                  isLoadingMore={isLoadingMore}
                  loadingMessages={loadingMessages}
                />
              </div>
              <MessageComposer onSend={send} />
            </div>
          )}
        </div>
      )}
      <AddAccountModal
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onSuccess={(accountData) => {
          // Handle successful account addition
          console.log("Account added successfully:", accountData);
          // You can add the account to the user's telegramAccounts here
        }}
      />
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
