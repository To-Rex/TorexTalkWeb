import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "@/auth";
import { ArrowLeft, Check, CheckCheck, Loader2, MapPin, User, Play, Pause, ArrowDown, X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import VideoNotePlayer from "./VideoNotePlayer";
import { apiService } from "@/lib/api";

export interface FileAttachment {
  type: "image" | "audio" | "document" | "location" | "video" | "video_note" | "contact" | "voice";
  url: string;
  name?: string;
  size?: string | number;
  duration?: number;
  duration_formatted?: string;
  waveform?: number[] | null;
  mime_type?: string;
  thumb_url?: string;
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
  const [selectedImage, setSelectedImage] = useState<{ url: string; name?: string } | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mediaUrls, setMediaUrls] = useState<Map<string, string>>(new Map());
  const downloadedRef = useRef<Set<string>>(new Set());
  const [playingAudios, setPlayingAudios] = useState<Map<string, boolean>>(new Map());
  const audioInstances = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [audioProgress, setAudioProgress] = useState<Map<string, number>>(new Map());
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState<Map<string, string>>(new Map());
  const [draggingMessageId, setDraggingMessageId] = useState<string | null>(null);
  const waveformRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingMessageId) {
        const waveformEl = waveformRefs.current.get(draggingMessageId);
        if (waveformEl) {
          const rect = waveformEl.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setAudioProgress(prev => new Map(prev).set(draggingMessageId, progress));
        }
      }
    };

    const handleMouseUp = () => {
      if (draggingMessageId) {
        const progress = audioProgress.get(draggingMessageId) || 0;
        const audio = audioInstances.current.get(draggingMessageId);
        const isPlaying = playingAudios.get(draggingMessageId) || false;
        if (audio) {
          const seekTime = progress * (audio.duration || 0);
          const setSeek = () => {
            audio.currentTime = seekTime;
            if (!isPlaying) {
              audio.play();
              setPlayingAudios(prev => new Map(prev).set(draggingMessageId, true));
            }
          };
          if (audio.readyState < 2) {
            audio.addEventListener('loadedmetadata', setSeek, { once: true });
          } else {
            setSeek();
          }
        }
        setDraggingMessageId(null);
      }
    };

    if (draggingMessageId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingMessageId, audioProgress]);

  useEffect(() => {
    if (selectedImage) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [selectedImage]);

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

  const renderFile = (m: Message, isFromMe: boolean) => {
    if (!m.file) return null;
    const isLoaded = mediaUrls.has(m.file.url) || m.file.url.startsWith('/');
    switch (m.file.type) {
      case "image":
        if (!isLoaded) {
          return (
            <div className="relative inline-block mt-1">
              <img
                src={m.file.thumb_url || "/placeholder.svg"}
                alt="image"
                className="max-w-[300px] rounded-lg"
              />
              <div
                className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={async () => {
                  try {
                    const url = await apiService.downloadMedia(1, m.file.url, 'photo');
                    setMediaUrls(prev => new Map(prev).set(m.file.url, url));
                    setSelectedImage({ url, name: m.file.name });
                  } catch (e) {
                    console.error('Download failed', e);
                  }
                }}
              >
                <div className="bg-black/50 rounded-full p-2">
                  <ArrowDown className="h-6 w-6 text-white" />
                </div>
              </div>
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
          );
        } else {
          return (
            <div className="relative inline-block mt-1">
              <img
                src={mediaUrls.get(m.file.url) || (m.file.url.startsWith('/') ? m.file.url : '/placeholder.svg')}
                alt={m.file.name ?? "image"}
                className="max-w-[300px] rounded-lg cursor-pointer"
                onClick={async () => {
                  let url = mediaUrls.get(m.file.url) || (m.file.url.startsWith('/') ? m.file.url : null);
                  if (!url) {
                    try {
                      url = await apiService.downloadMedia(1, m.file.url, 'photo');
                      setMediaUrls(prev => new Map(prev).set(m.file.url, url));
                    } catch (e) {
                      console.error('Download failed', e);
                      return;
                    }
                  }
                  setSelectedImage({ url, name: m.file.name });
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  (e.target as HTMLElement).parentNode?.querySelector('.error-placeholder')?.setAttribute('style', 'display: flex;');
                }}
              />
              <div className="error-placeholder hidden items-center justify-center w-full h-32 bg-muted rounded-lg text-muted-foreground text-sm">
                Image not available
              </div>
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
          );
        }
      case "video":
        if (!isLoaded) {
          return (
            <div className="relative mt-1 inline-block">
              <div
                className="max-w-[300px] h-48 bg-muted rounded-lg flex items-center justify-center cursor-pointer"
                style={m.file.thumb_url ? { backgroundImage: `url(${m.file.thumb_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                onClick={async () => {
                  try {
                    const url = await apiService.downloadMedia(1, m.file.url, 'video');
                    setMediaUrls(prev => new Map(prev).set(m.file.url, url));
                  } catch (e) {
                    console.error('Download failed', e);
                  }
                }}
              >
                {!m.file.thumb_url && <ArrowDown className="h-8 w-8 text-muted-foreground" />}
                {m.file.thumb_url && <Play className="h-8 w-8 text-white drop-shadow-lg" />}
              </div>
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
          );
        } else {
          return (
            <div className="relative mt-1 inline-block">
              <video
                src={mediaUrls.get(m.file.url) || (m.file.url.startsWith('/') ? m.file.url : '')}
                controls
                className="max-w-[300px] rounded-lg"
                style={{ borderRadius: '12px' }}
                onPlay={async () => {
                  if (!mediaUrls.get(m.file.url) && !m.file.url.startsWith('/')) {
                    try {
                      const url = await apiService.downloadMedia(1, m.file.url, 'video');
                      setMediaUrls(prev => new Map(prev).set(m.file.url, url));
                    } catch (e) {
                      console.error('Download failed', e);
                    }
                  }
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  (e.target as HTMLElement).parentNode?.querySelector('.error-placeholder')?.setAttribute('style', 'display: flex;');
                }}
              />
              <div className="error-placeholder hidden items-center justify-center w-full h-32 bg-muted rounded-lg text-muted-foreground text-sm">
                Video not available
              </div>
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
          );
        }
      case "video_note":
        if (!isLoaded) {
          return (
            <div className="relative inline-block">
              <div
                className="w-56 h-56 bg-muted rounded-full flex items-center justify-center cursor-pointer"
                style={m.file.thumb_url ? { backgroundImage: `url(${m.file.thumb_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                onClick={async () => {
                  try {
                    const url = await apiService.downloadMedia(1, m.file.url, 'video_note');
                    setMediaUrls(prev => new Map(prev).set(m.file.url, url));
                  } catch (e) {
                    console.error('Download failed', e);
                  }
                }}
              >
                <div className="bg-black/50 rounded-full p-2">
                  <ArrowDown className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded flex items-center gap-1">
                {new Date(m.at).toLocaleTimeString()}
                {isFromMe && m.is_outgoing && (
                  m.is_read ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : (
                    <CheckCheck className="h-3 w-3" />
                  )
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="relative inline-block">
              <VideoNotePlayer src={mediaUrls.get(m.file.url) || (m.file.url.startsWith('/') ? m.file.url : '')} />
              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded flex items-center gap-1">
                {new Date(m.at).toLocaleTimeString()}
                {isFromMe && m.is_outgoing && (
                  m.is_read ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : (
                    <CheckCheck className="h-3 w-3" />
                  )
                )}
              </div>
            </div>
          );
        }
      case "audio":
      case "voice":
        const isDownloaded = mediaUrls.has(m.file.url);
        const isPlaying = playingAudios.get(m.id) || false;
        const progress = audioProgress.get(m.id) || 0;
        const waveformBars = m.file.waveform?.slice(0, 40) || [];
        return (
          <div className={`relative mt-1 pl-0 pr-2 py-2 pb-6 max-w-[250px] rounded-lg flex items-center space-x-2`}>
              <button
                className={`p-2 rounded-full ${isFromMe ? 'bg-white text-blue-500 hover:bg-gray-100' : 'bg-blue-500 text-white hover:bg-blue-100'} transition-colors`}
                onClick={async () => {
                  if (!isDownloaded) {
                    try {
                      const url = await apiService.downloadMedia(1, m.file.url, 'voice');
                      setMediaUrls(prev => new Map(prev).set(m.file.url, url));
                    } catch (e) {
                      console.error('Download failed', e);
                    }
                  } else {
                    let audio = audioInstances.current.get(m.id);
                    if (!audio) {
                      audio = new Audio(mediaUrls.get(m.file.url));
                      audioInstances.current.set(m.id, audio);
                      audio.onended = () => {
                        setPlayingAudios(prev => new Map(prev).set(m.id, false));
                        setAudioProgress(prev => new Map(prev).set(m.id, 0));
                        setCurrentTimeDisplay(prev => new Map(prev).set(m.id, '0:00'));
                      };
                      audio.ontimeupdate = () => {
                        const progress = audio.currentTime / audio.duration;
                        setAudioProgress(prev => new Map(prev).set(m.id, progress));
                        const minutes = Math.floor(audio.currentTime / 60);
                        const seconds = Math.floor(audio.currentTime % 60);
                        const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        setCurrentTimeDisplay(prev => new Map(prev).set(m.id, formatted));
                      };
                    }
                    if (isPlaying) {
                      audio.pause();
                      setPlayingAudios(prev => new Map(prev).set(m.id, false));
                    } else {
                      audio.play();
                      setPlayingAudios(prev => new Map(prev).set(m.id, true));
                    }
                  }
                }}
              >
                {isDownloaded ? (isPlaying ? <Pause size={16} /> : <Play size={16} />) : <ArrowDown size={16} />}
              </button>

              <span className={`text-sm font-medium ${isFromMe ? 'text-white' : 'text-gray-600'}`}>{isPlaying ? (currentTimeDisplay.get(m.id) || '0:00') : (m.file.duration_formatted || (m.file.duration ? Math.floor(m.file.duration / 60) + ':' + (m.file.duration % 60).toString().padStart(2, '0') : ''))}</span>

              <div
                ref={(el) => {
                  if (el) waveformRefs.current.set(m.id, el);
                }}
                className="flex items-end space-x-0.5 flex-1 min-w-0 overflow-hidden cursor-pointer"
                onMouseDown={(e) => {
                  if (isDownloaded) {
                    setDraggingMessageId(m.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    setAudioProgress(prev => new Map(prev).set(m.id, progress));
                  }
                }}
              >
                {waveformBars.map((value, index) => {
                  const barProgress = index / waveformBars.length;
                  const isPlayed = barProgress < progress;
                  return (
                    <div
                      key={index}
                      className={`${isPlayed ? (isFromMe ? 'bg-white' : 'bg-blue-600') : (isFromMe ? 'bg-gray-300' : 'bg-blue-400')} rounded-sm flex-shrink-0 hover:opacity-80`}
                      style={{ height: `${Math.max(1, (value / 255) * 16)}px`, width: '1px' }}
                      onClick={() => {
                        const audio = audioInstances.current.get(m.id);
                        if (audio) {
                          const seekTime = barProgress * (audio.duration || 0);
                          const setSeek = () => {
                            audio.currentTime = seekTime;
                            setAudioProgress(prev => new Map(prev).set(m.id, barProgress));
                            if (!isPlaying) {
                              audio.play();
                              setPlayingAudios(prev => new Map(prev).set(m.id, true));
                            }
                          };
                          if (audio.readyState < 2) {
                            audio.addEventListener('loadedmetadata', setSeek, { once: true });
                          } else {
                            setSeek();
                          }
                        }
                      }}
                    />
                  );
                })}
              </div>

              {m.file.size && <span className={`text-xs ml-2 ${isFromMe ? 'text-white/70' : 'text-gray-500'}`}>{typeof m.file.size === 'string' ? m.file.size : `${(m.file.size / 1024 / 1024).toFixed(1)} MB`}</span>}

              <div className="absolute bottom-1 right-1 z-10 bg-black/50 text-white text-[10px] px-1 rounded">
                {new Date(m.at).toLocaleTimeString()}
              </div>
          </div>
        );
      case "document":
        return (
          <div className="relative mt-1 flex items-center gap-3 bg-secondary/50 rounded-lg p-3 max-w-[350px]">
            <button
              onClick={async () => {
                try {
                  const url = await apiService.downloadMedia(1, m.file.url, 'document');
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = m.file.name ?? 'file';
                  link.click();
                } catch (e) {
                  console.error('Download failed', e);
                }
              }}
              className="flex items-center justify-center w-10 h-10 bg-primary rounded-full hover:bg-primary/80"
            >
              <ArrowDown className="h-8 w-8 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{m.file.name ?? "File"}</div>
              {m.file.size && (
                <div className="text-xs text-muted-foreground">
                  {typeof m.file.size === 'string' ? m.file.size : `${(m.file.size / 1024 / 1024).toFixed(1)} MB`}
                </div>
              )}
            </div>
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
        );
      case "location":
        return (
          <div className="relative mt-1 rounded-lg bg-secondary/50 border p-3 max-w-[250px]">
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
        );
      case "contact":
        return (
          <div className="relative mt-1 rounded-lg bg-secondary/50 border p-3 max-w-[250px]">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {m.file.contact?.first_name} {m.file.contact?.last_name || ''}
                </div>
                <div className="text-xs text-muted-foreground">{m.file.contact?.phone_number}</div>
              </div>
            </div>
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
        );
      default:
        return null;
    }
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
                       {firstMessage.file && firstMessage.file.type !== 'video_note' && firstMessage.file.type !== 'image' && (
                         <div className="text-xs font-medium text-muted-foreground mb-1">
                           {firstMessage.sender === "them" ? title : firstMessage.sender}
                         </div>
                       )}
                       {group.map((m) => (
                         <div key={m.id} className={`w-fit mb-1 ${m.file?.type === 'video_note' || m.file?.type === 'image' || m.file?.type === 'document' ? '' : 'relative rounded-lg px-3 py-2 text-sm text-white bg-secondary'}`}>
                           {m.text && m.file?.type !== 'video_note' ? (
                             <div className="mb-1 whitespace-pre-wrap">{m.text}</div>
                           ) : null}
                           {renderFile(m, isFromMe)}
                           {!m.file && (
                             <div className="text-[10px] text-white mt-1 text-right flex justify-end items-center gap-1">
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
                       ))}
                     </div>
                   </div>
                 );
               } else {
                 return group.map((m, messageIndex) => (
                   <div
                     key={m.id}
                     className={`w-fit max-w-[80%] ${m.file?.type === 'video_note' || m.file?.type === 'image' || m.file?.type === 'document' ? (isFromMe ? 'ml-auto' : '') : `relative rounded-lg px-3 py-2 text-sm text-white ${isFromMe ? `ml-auto bg-primary` : "bg-secondary"}`}`}
                     ref={isLastGroup && messageIndex === group.length - 1 ? lastMessageRef : null}
                   >
                     {m.sender !== "me" && m.file && m.file.type !== 'video_note' && m.file.type !== 'image' && m.file.type !== 'document' && m.file.type !== 'voice' && m.file.type !== 'audio' ? (
                       <div className="text-xs font-medium text-white mb-1">
                         {m.sender === "them" ? title : m.sender}
                       </div>
                     ) : null}
                     {m.text && m.file?.type !== 'video_note' ? (
                       <div className="mb-1 whitespace-pre-wrap">{m.text}</div>
                     ) : null}
                     {renderFile(m, isFromMe)}
                     {!m.file && (
                       <div className="text-[10px] text-white mt-1 text-right flex justify-end items-center gap-1">
                         {new Date(m.at).toLocaleTimeString()}
                         {isFromMe && m.is_outgoing && (
                           m.is_read ? (
                             <CheckCheck className="h-3 w-3" />
                           ) : (
                             <CheckCheck className="h-3 w-3" />
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
       {selectedImage && (
         <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
           <DialogContent className="p-0 flex items-center justify-center max-w-[90vw] !bg-transparent border-none shadow-none [&>button]:hidden">
             <div className="relative inline-block">
               <img
                 src={selectedImage.url}
                 alt="Image"
                 className="max-w-[90vw] max-h-[90vh] object-contain"
                 style={{
                   transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                   cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                   transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                 }}
                 onWheel={(e) => {
                   e.preventDefault();
                   setScale(s => e.deltaY < 0 ? Math.min(s * 1.1, 3) : Math.max(s / 1.1, 0.5));
                 }}
                 onMouseDown={(e) => {
                   if (scale > 1) {
                     setIsDragging(true);
                     setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                   }
                 }}
                 onMouseMove={(e) => {
                   if (isDragging) {
                     setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
                   }
                 }}
                 onMouseUp={() => setIsDragging(false)}
                 onMouseLeave={() => setIsDragging(false)}
               />
               <div className="absolute top-0 right-0 z-10 p-4 flex gap-2">
                 <button
                   onClick={() => setScale(s => Math.max(s / 1.2, 0.5))}
                   className="p-2 bg-black/50 text-white rounded hover:bg-black/70"
                   title="Zoom out"
                 >
                   <ZoomOut className="h-4 w-4" />
                 </button>
                 <button
                   onClick={() => setScale(s => Math.min(s * 1.2, 3))}
                   className="p-2 bg-black/50 text-white rounded hover:bg-black/70"
                   title="Zoom in"
                 >
                   <ZoomIn className="h-4 w-4" />
                 </button>
                 <button
                   onClick={async () => {
                     try {
                       const res = await fetch(selectedImage.url);
                       const blob = await res.blob();
                       const url = URL.createObjectURL(blob);
                       const link = document.createElement('a');
                       link.href = url;
                       link.download = selectedImage.name ?? 'image.jpg';
                       link.click();
                       URL.revokeObjectURL(url);
                     } catch (e) {
                       console.error('Download failed', e);
                     }
                   }}
                   className="p-2 bg-black/50 text-white rounded hover:bg-black/70"
                   title="Download image"
                 >
                   <Download className="h-4 w-4" />
                 </button>
                 <DialogClose className="p-2 bg-black/50 text-white rounded hover:bg-black/70">
                   <X className="h-4 w-4" />
                 </DialogClose>
               </div>
             </div>
           </DialogContent>
         </Dialog>
       )}
    </div>
  );
}








