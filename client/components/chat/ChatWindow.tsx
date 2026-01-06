import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "@/auth";
import { ArrowLeft, Check, CheckCheck, Loader2, MapPin, User, Play, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import VideoNotePlayer from "./VideoNotePlayer";

export interface FileAttachment {
  type: "image" | "audio" | "document" | "location" | "video" | "video_note" | "contact";
  url: string;
  name?: string;
  size?: number;
  duration?: number;
  mime_type?: string;
  contact?: {
    first_name: string;
    last_name?: string;
    phone_number: string;
  };
}

export interface Message {
  id: string;
  sender: string;
  text?: string;
  at: number;
  file?: FileAttachment;
  is_read?: boolean;
  is_outgoing?: boolean;
  userPhoto?: string;
  chatType?: string;
}

export default function ChatWindow({
  title,
  status,
  messages,
  onBack,
  collapsed = false,
  avatar,
  memberCount,
  onlineCount,
  onLoadMore,
  isLoadingMore,
  loadingMessages,
}: {
  title: string;
  status: string;
  messages: Message[];
  onBack?: () => void;
  collapsed?: boolean;
  avatar?: string;
  memberCount?: number;
  onlineCount?: number;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  loadingMessages?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { user, addToBlocklist, removeFromBlocklist } = useAuth();
  const [autoReply, setAutoReply] = useState<boolean>(false);
  const isInitialLoad = useRef<boolean>(true);
  const prevMessagesLength = useRef<number>(messages.length);
  const hasLoggedTop = useRef<boolean>(false);
  const hasScrolledToBottom = useRef<boolean>(false);
  const pendingScroll = useRef<{ prevScrollHeight: number; prevScrollTop: number } | null>(null);
  const lastLoadMoreRef = useRef<number>(0);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const [isAdjustingScroll, setIsAdjustingScroll] = useState<boolean>(false);
  const isAdjustingScrollRef = useRef(isAdjustingScroll);
  const isLoadingMoreRef = useRef(isLoadingMore);

  useEffect(() => {
    isAdjustingScrollRef.current = isAdjustingScroll;
  }, [isAdjustingScroll]);

  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  const isBlocked = (user?.blocklist ?? []).includes(title);
  const toggleBlock = () => {
    if (!user) return;
    if (isBlocked) removeFromBlocklist(title);
    else addToBlocklist(title);
  };

  useLayoutEffect(() => {
    if (isInitialLoad.current && messages.length > 0 && ref.current) {
      // Scroll to bottom on first load. Prefer the last message ref when available.
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'auto' });
      } else {
        // Temporarily disable CSS smooth behavior so this initial jump is immediate
        const prevBehavior = (ref.current.style && ref.current.style.scrollBehavior) || '';
        try { ref.current.style.scrollBehavior = 'auto'; } catch (e) {}
        ref.current.scrollTop = ref.current.scrollHeight;
        try { ref.current.style.scrollBehavior = prevBehavior; } catch (e) {}
      }
      // Mark initial load done and set last load timestamp to prevent immediate load-more
      isInitialLoad.current = false;
      try { lastLoadMoreRef.current = Date.now(); } catch (e) {}
    }
  }, [messages.length]);

  useLayoutEffect(() => {
    if (pendingScroll.current && ref.current) {
      setIsAdjustingScroll(true);
      const { prevScrollHeight, prevScrollTop } = pendingScroll.current;
      const newScrollHeight = ref.current.scrollHeight;
      const newScrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
      // Temporarily disable smooth scrolling to make this adjustment instant and avoid visual jump
      const prevBehavior = (ref.current.style && ref.current.style.scrollBehavior) || '';
      try { ref.current.style.scrollBehavior = 'auto'; } catch (e) {}
      ref.current.scrollTop = newScrollTop;
      try { ref.current.style.scrollBehavior = prevBehavior; } catch (e) {}
      pendingScroll.current = null;
      setIsAdjustingScroll(false);
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current && ref.current && !isInitialLoad.current) {
      // New messages added, scroll to bottom smoothly only if user is near bottom
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) { // within 100px of bottom
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  // Scroll handler to trigger loading older messages when scrolled to top
  useEffect(() => {
    if (!onLoadMore) return;
    const handleScroll = () => {
      if (isInitialLoad.current) return;
      const el = ref.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;

      hasScrolledToBottom.current = scrollTop + clientHeight >= scrollHeight - 100;

      if (scrollTop <= 20) {
        if (!hasLoggedTop.current) {
          console.log("Siz yetib keldingiz.");
          hasLoggedTop.current = true;
        }
      } else {
        hasLoggedTop.current = false;
      }

      if (scrollTop <= 5 && !isLoadingMoreRef.current && !isAdjustingScrollRef.current) {
        const now = Date.now();
        if (now - lastLoadMoreRef.current < 500) return;
        lastLoadMoreRef.current = now;
        pendingScroll.current = {
          prevScrollHeight: scrollHeight,
          prevScrollTop: scrollTop,
        };
        console.log('Calling onLoadMore');
        onLoadMore();
      }
    };
    const scrollElement = ref.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [onLoadMore]);


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
          <div className="flex items-center gap-2">
            {avatar && (
              <img
                src={avatar}
                alt={title}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <div>{title}</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {memberCount !== undefined && onlineCount !== undefined
              ? `${memberCount.toLocaleString()} members, ${onlineCount} online`
              : status}
          </div>
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
            {/* top sentinel for IntersectionObserver to trigger load-more when it becomes visible */}
            <div ref={topSentinelRef} className="w-full h-[1px]" aria-hidden="true" />
            {isBlocked ? "Blokdan chiqarish" : "Mass xabardan bloklash"}
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="relative flex-1 overflow-auto p-3 space-y-2 bg-background scroll-smooth"
       >
         {loadingMessages && messages.length === 0 ? (
           // Skeleton loader for messages
           <div className="space-y-4">
             <div className="flex justify-start">
               <Skeleton className="h-10 w-48 rounded-lg" />
             </div>
             <div className="flex justify-end">
               <Skeleton className="h-10 w-32 rounded-lg" />
             </div>
             <div className="flex justify-start">
               <Skeleton className="h-12 w-56 rounded-lg" />
             </div>
             <div className="flex justify-end">
               <Skeleton className="h-8 w-40 rounded-lg" />
             </div>
             <div className="flex justify-start">
               <Skeleton className="h-10 w-44 rounded-lg" />
             </div>
           </div>
         ) : (
           (() => {
             // Group consecutive messages by sender for group chats
             const messageGroups: Message[][] = [];
             let currentGroup: Message[] = [];
             let lastSender = '';

             messages.forEach((m) => {
               if (m.chatType === "supergroup" && m.sender !== "me" && m.file?.type !== 'video_note') {
                 if (m.sender !== lastSender) {
                   if (currentGroup.length > 0) {
                     messageGroups.push(currentGroup);
                   }
                   currentGroup = [m];
                   lastSender = m.sender;
                 } else {
                   currentGroup.push(m);
                 }
               } else {
                 if (currentGroup.length > 0) {
                   messageGroups.push(currentGroup);
                   currentGroup = [];
                   lastSender = '';
                 }
                 messageGroups.push([m]);
               }
             });

             if (currentGroup.length > 0) {
               messageGroups.push(currentGroup);
             }

             return messageGroups.map((group, groupIndex) => {
               const firstMessage = group[0];
               const isGroupChat = firstMessage.chatType === "supergroup";
               const isFromMe = firstMessage.sender === "me";
               const isLastGroup = groupIndex === messageGroups.length - 1;

               if (isGroupChat && !isFromMe) {
                 return (
                   <div key={`group-${groupIndex}`} className="flex gap-2 relative" ref={isLastGroup ? lastMessageRef : null}>
                     <div className="sticky top-0 self-start">
                       {firstMessage.userPhoto ? (
                         <img
                           src={firstMessage.userPhoto}
                           alt={firstMessage.sender}
                           className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                         />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs flex-shrink-0">
                           {firstMessage.sender.charAt(0).toUpperCase()}
                         </div>
                       )}
                     </div>
                     <div className="flex flex-col max-w-[80%]">
                       {firstMessage.file?.type !== 'video_note' && firstMessage.file?.type !== 'image' && (
                         <div className="text-xs font-medium text-muted-foreground mb-1">
                           {firstMessage.sender === "them" ? title : firstMessage.sender}
                         </div>
                       )}
                       {group.map((m) => (
                         <div key={m.id} className={`w-fit mb-1 ${m.file?.type === 'video_note' || m.file?.type === 'image' || m.file?.type === 'document' ? '' : 'rounded-lg px-3 py-2 text-sm text-white bg-secondary'}`}>
                           {m.text && m.file?.type !== 'video_note' ? (
                             <div className="mb-1 whitespace-pre-wrap">{m.text}</div>
                           ) : null}
                           {m.file ? (
                             m.file.type === "image" ? (
                               <div className="relative inline-block mt-1">
                                 <img
                                   src={m.file.url}
                                   alt={m.file.name ?? "image"}
                                   className="max-w-[300px] rounded-lg cursor-pointer"
                                   onClick={() => window.open(m.file.url, '_blank')}
                                 />
                                 <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded flex items-center gap-1">
                                   {new Date(m.at).toLocaleTimeString()}
                                   {isFromMe && m.is_outgoing && (
                                     m.is_read ? (
                                       <CheckCheck className="h-3 w-3" />
                                     ) : (
                                       <Check className="h-3 w-3" />
                                     )
                                   )}
                                 </div>
                               </div>
                             ) : m.file.type === "video" ? (
                               <video
                                 src={m.file.url}
                                 controls
                                 className="max-w-[300px] rounded-lg mt-1"
                                 style={{ borderRadius: '12px' }}
                               />
                             ) : m.file.type === "video_note" ? (
                               <VideoNotePlayer src={m.file.url} />
                             ) : m.file.type === "audio" ? (
                               <div className="mt-1 flex items-center gap-2 bg-secondary/50 rounded-lg p-2 max-w-[250px]">
                                 <button className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                                   <Play className="h-4 w-4 text-white" />
                                 </button>
                                 <div className="flex-1">
                                   <div className="text-sm font-medium">Audio</div>
                                   {m.file.duration && (
                                     <div className="text-xs text-muted-foreground">
                                       {Math.floor(m.file.duration / 60)}:{(m.file.duration % 60).toString().padStart(2, '0')}
                                     </div>
                                   )}
                                 </div>
                                 <audio src={m.file.url} />
                               </div>
                             ) : m.file.type === "document" ? (
                               <div className="mt-1 flex items-center gap-3 bg-secondary/50 rounded-lg p-3 max-w-[250px]">
                                  <a
                                    href={m.file.url}
                                    download={m.file.name}
                                    className="flex items-center justify-center w-10 h-10 bg-primary rounded-full hover:bg-primary/80"
                                  >
                                    <ArrowDown className="h-8 w-8 text-white" />
                                  </a>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{m.file.name ?? "File"}</div>
                                    {m.file.size && (
                                      <div className="text-xs text-muted-foreground">
                                        {(m.file.size / 1024 / 1024).toFixed(1)} MB
                                      </div>
                                    )}
                                  </div>
                               </div>
                             ) : m.file.type === "location" ? (
                               <div className="mt-1 rounded-lg bg-secondary/50 border p-3 max-w-[250px]">
                                 <div className="flex items-center gap-2">
                                   <MapPin className="h-5 w-5 text-red-500" />
                                   <div className="flex-1">
                                     <div className="font-medium text-sm">Location</div>
                                     {m.file.name && (
                                       <div className="text-xs text-muted-foreground">{m.file.name}</div>
                                     )}
                                   </div>
                                   <a
                                     href={m.file.url}
                                     target="_blank"
                                     rel="noreferrer"
                                     className="text-xs rounded px-2 py-1 border hover:bg-background"
                                   >
                                     View
                                   </a>
                                 </div>
                               </div>
                             ) : m.file.type === "contact" ? (
                               <div className="mt-1 rounded-lg bg-secondary/50 border p-3 max-w-[250px]">
                                 <div className="flex items-center gap-2">
                                   <User className="h-5 w-5 text-blue-500" />
                                   <div className="flex-1">
                                     <div className="font-medium text-sm">
                                       {m.file.contact?.first_name} {m.file.contact?.last_name || ''}
                                     </div>
                                     <div className="text-xs text-muted-foreground">{m.file.contact?.phone_number}</div>
                                   </div>
                                 </div>
                               </div>
                             ) : null
                           ) : null}
                           {m.file?.type !== 'image' && (
                             <div className="text-[10px] text-white mt-1">
                               {new Date(m.at).toLocaleTimeString()}
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               } else {
                 return group.map((m, messageIndex) => (
                   <div
                     key={m.id}
                     className={`w-fit max-w-[80%] ${m.file?.type === 'video_note' || m.file?.type === 'image' || m.file?.type === 'document' ? '' : `rounded-lg px-3 py-2 text-sm text-white ${isFromMe ? `ml-auto bg-primary` : "bg-secondary"}`}`}
                     ref={isLastGroup && messageIndex === group.length - 1 ? lastMessageRef : null}
                   >
                     {m.sender !== "me" && m.file?.type !== 'video_note' && m.file?.type !== 'image' && m.file?.type !== 'document' ? (
                       <div className="text-xs font-medium text-white mb-1">
                         {m.sender === "them" ? title : m.sender}
                       </div>
                     ) : null}
                     {m.text && m.file?.type !== 'video_note' ? (
                       <div className="mb-1 whitespace-pre-wrap">{m.text}</div>
                     ) : null}
                     {m.file ? (
                       m.file.type === "image" ? (
                         <div className="relative inline-block mt-1">
                           <img
                             src={m.file.url}
                             alt={m.file.name ?? "image"}
                             className="max-w-[300px] rounded-lg cursor-pointer"
                             onClick={() => window.open(m.file.url, '_blank')}
                           />
                           <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded flex items-center gap-1">
                             {new Date(m.at).toLocaleTimeString()}
                             {isFromMe && m.is_outgoing && (
                               m.is_read ? (
                                 <CheckCheck className="h-3 w-3" />
                               ) : (
                                 <Check className="h-3 w-3" />
                               )
                             )}
                           </div>
                         </div>
                       ) : m.file.type === "video" ? (
                         <video
                           src={m.file.url}
                           controls
                           className="max-w-[300px] rounded-lg mt-1"
                           style={{ borderRadius: '12px' }}
                         />
                       ) : m.file.type === "video_note" ? (
                         <VideoNotePlayer src={m.file.url} />
                       ) : m.file.type === "audio" ? (
                         <div className="mt-1 flex items-center gap-2 bg-secondary/50 rounded-lg p-2 max-w-[250px]">
                           <button className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                             <Play className="h-4 w-4 text-white" />
                           </button>
                           <div className="flex-1">
                             <div className="text-sm font-medium">Audio</div>
                             {m.file.duration && (
                               <div className="text-xs text-muted-foreground">
                                 {Math.floor(m.file.duration / 60)}:{(m.file.duration % 60).toString().padStart(2, '0')}
                               </div>
                             )}
                           </div>
                           <audio src={m.file.url} />
                         </div>
                       ) : m.file.type === "document" ? (
                         <div className="mt-1 flex items-center gap-3 bg-secondary/50 rounded-lg p-3 max-w-[250px]">
                                  <a
                                    href={m.file.url}
                                    download={m.file.name}
                                    className="flex items-center justify-center w-10 h-10 bg-primary rounded-full hover:bg-primary/80"
                                  >
                                    <ArrowDown className="h-8 w-8 text-white" />
                                  </a>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{m.file.name ?? "File"}</div>
                                    {m.file.size && (
                                      <div className="text-xs text-muted-foreground">
                                        {(m.file.size / 1024 / 1024).toFixed(1)} MB
                                      </div>
                                    )}
                                  </div>
                         </div>
                       ) : m.file.type === "location" ? (
                         <div className="mt-1 rounded-lg bg-secondary/50 border p-3 max-w-[250px]">
                           <div className="flex items-center gap-2">
                             <MapPin className="h-5 w-5 text-red-500" />
                             <div className="flex-1">
                               <div className="font-medium text-sm">Location</div>
                               {m.file.name && (
                                 <div className="text-xs text-muted-foreground">{m.file.name}</div>
                               )}
                             </div>
                             <a
                               href={m.file.url}
                               target="_blank"
                               rel="noreferrer"
                               className="text-xs rounded px-2 py-1 border hover:bg-background"
                             >
                               View
                             </a>
                           </div>
                         </div>
                       ) : m.file.type === "contact" ? (
                         <div className="mt-1 rounded-lg bg-secondary/50 border p-3 max-w-[250px]">
                           <div className="flex items-center gap-2">
                             <User className="h-5 w-5 text-blue-500" />
                             <div className="flex-1">
                               <div className="font-medium text-sm">
                                 {m.file.contact?.first_name} {m.file.contact?.last_name || ''}
                               </div>
                               <div className="text-xs text-muted-foreground">{m.file.contact?.phone_number}</div>
                             </div>
                           </div>
                         </div>
                       ) : null
                     ) : null}
                     {m.file?.type !== 'image' && (
                       <div className="text-[10px] text-white mt-1 flex items-center gap-1">
                         {new Date(m.at).toLocaleTimeString()}
                         {isFromMe && m.is_outgoing && (
                           m.is_read ? (
                             <CheckCheck className="h-3 w-3" />
                           ) : (
                             <Check className="h-3 w-3" />
                           )
                         )}
                       </div>
                     )}
                   </div>
                 ));
               }
             });
           })()
         )}
         {isLoadingMore && (
           <div className="absolute left-0 right-0 top-0 flex justify-center pt-2 z-10 pointer-events-none">
             <div className="flex items-center gap-2 bg-background/80 rounded px-3 py-1 backdrop-blur border">
               <Loader2 className="h-4 w-4 animate-spin" />
               <div className="text-xs text-muted-foreground">Yuklanmoqda...</div>
             </div>
           </div>
         )}
       </div>
    </div>
  );
}








