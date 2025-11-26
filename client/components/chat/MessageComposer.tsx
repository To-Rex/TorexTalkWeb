import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Paperclip, Mic, Send, X, Calendar } from "lucide-react";

export type Outgoing =
  | { text: string; attachment?: undefined }
  | { text?: string; attachment: { type: "image" | "audio" | "document"; file: File } }
  | { text?: string; attachment: { type: "location"; url: string; name?: string } };

export default function MessageComposer({
  onSend,
}: {
  onSend: (payload: Outgoing) => void;
}) {
  const [text, setText] = useState("");
  const [when, setWhen] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"image" | "audio" | "document" | null>(
    null,
  );

  const templates = [
    "Salom! Sizga qanday yordam bera olaman?",
    "Rahmat! Tez orada aloqaga chiqamiz.",
    "Bugungi taklif: chegirma 20% faqat bugun!",
  ];

  const imgRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const docRef = useRef<HTMLInputElement | null>(null);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);
  const allowScheduleOpen = useRef(false);

  const resetForm = () => {
    setText("");
    setSelectedFile(null);
    setSelectedType(null);
    setWhen("");
    if (imgRef.current) imgRef.current.value = "";
    if (audioRef.current) audioRef.current.value = "";
    if (docRef.current) docRef.current.value = "";
  };

  const handleSend = () => {
    const hasText = !!text.trim();
    const hasFile = !!selectedFile && !!selectedType;
    if (!hasText && !hasFile) return;

    const ts = when ? new Date(when).getTime() : 0;
    const delay = ts - Date.now();

    const sendNow = () => {
      if (hasFile && selectedFile && selectedType) {
        onSend({ attachment: { type: selectedType, file: selectedFile } });
      }
      if (hasText) {
        onSend({ text: text.trim() });
      }
    };

    if (when && delay > 0) {
      window.setTimeout(sendNow, delay);
      resetForm();
      return;
    }

    sendNow();
    resetForm();
  };

  const onPickImage = () => {
    setSelectedType("image");
    imgRef.current?.click();
  };
  const onPickAudio = () => {
    setSelectedType("audio");
    audioRef.current?.click();
  };
  const onPickDocument = () => {
    setSelectedType("document");
    docRef.current?.click();
  };

  const onShareLocation = () => {
    if (!navigator.geolocation) {
      onSend({ text: "Lokatsiyani ulash uchun geolokatsiya qo'llab-quvvatlanmaydi" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://maps.google.com/?q=${latitude},${longitude}`;
        onSend({ attachment: { type: "location", url, name: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` } });
      },
      () => {
        onSend({ text: "Lokatsiyani ulashga ruxsat berilmadi" });
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setSelectedFile(f);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    longPressed.current = false;
    allowScheduleOpen.current = false;
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      allowScheduleOpen.current = true;
      setScheduleOpen(true);
    }, 550);
  };
  const handlePointerUp: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    if (!longPressed.current) {
      handleSend();
    }
    longPressed.current = false;
  };

  return (
    <div className="border-t bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur p-3 sticky bottom-0 z-10">
      <div className="flex items-center gap-2">
        {/* Hidden pickers */}
        <input ref={imgRef} onChange={onFileChange} type="file" accept="image/*,video/*" className="hidden" />
        <input ref={audioRef} onChange={onFileChange} type="file" accept="audio/*" className="hidden" />
        <input ref={docRef} onChange={onFileChange} type="file" accept="*/*" className="hidden" />

        {/* File/Template menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="secondary" size="icon" title="Qo'shish" aria-label="Qo'shish" className="shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={onPickImage}>Surat/Video tanlash</DropdownMenuItem>
            <DropdownMenuItem onClick={onPickAudio}>Audio tanlash</DropdownMenuItem>
            <DropdownMenuItem onClick={onPickDocument}>Hujjat tanlash</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onShareLocation}>Lokatsiya ulash</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Shablonlar</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {templates.map((t) => (
                  <DropdownMenuItem key={t} onClick={() => setText(t)}>{t}</DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Xabar yozing..."
        />

        {/* Audio quick button remains for convenience */}
        <Button type="button" variant="secondary" size="icon" onClick={onPickAudio} title="Audio" aria-label="Audio" className="shrink-0">
          <Mic className="h-4 w-4" />
        </Button>

        {/* Long-press to schedule send */}
        <Popover open={scheduleOpen} onOpenChange={(o) => {
          if (!o) {
            setScheduleOpen(false);
            allowScheduleOpen.current = false;
          } else if (allowScheduleOpen.current) {
            setScheduleOpen(true);
          }
        }}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              title="Yuborish"
              aria-label="Yuborish"
              className="shrink-0"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => {
                if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
                longPressed.current = false;
                allowScheduleOpen.current = false;
              }}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Yuborish vaqtini tanlang</div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
              <div className="flex items-center justify-between">
                <button onClick={() => setWhen("")} className="text-xs rounded px-2 py-1 border hover:bg-background">
                  Tozalash
                </button>
                <span className="text-[11px] text-muted-foreground">{when ? new Date(when).toLocaleString() : "Darhol"}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {when ? (
        <div className="mt-2 text-[11px] inline-flex items-center gap-2 rounded border px-2 py-1">
          Rejalashtirilgan: {new Date(when).toLocaleString()}
          <button
            onClick={() => setWhen("")}
            className="rounded p-0.5 hover:bg-accent/40"
            aria-label="Rejani o'chirish"
            title="Rejani o'chirish"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}

      {selectedFile ? (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{selectedFile.name}</span>
          <span className="rounded border px-1.5 py-0.5 text-[10px]">{selectedType}</span>
          <button
            onClick={() => {
              setSelectedFile(null);
              setSelectedType(null);
              if (imgRef.current) imgRef.current.value = "";
              if (audioRef.current) audioRef.current.value = "";
              if (docRef.current) docRef.current.value = "";
            }}
            className="ml-auto inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] hover:bg-accent/40"
            aria-label="Faylni o'chirish"
            title="Faylni o'chirish"
          >
            <X className="h-3 w-3" /> O'chirish
          </button>
        </div>
      ) : null}

      <div className="pt-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
