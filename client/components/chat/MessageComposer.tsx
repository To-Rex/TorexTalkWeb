import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paperclip, Mic, Send, X, Calendar, List } from "lucide-react";

export type Outgoing = {
  text?: string;
  file?: { type: "image" | "audio"; file: File };
};

export default function MessageComposer({
  onSend,
}: {
  onSend: (payload: Outgoing) => void;
}) {
  const [text, setText] = useState("");
  const [when, setWhen] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"image" | "audio" | null>(
    null,
  );

  const templates = [
    "Salom! Sizga qanday yordam bera olaman?",
    "Rahmat! Tez orada aloqaga chiqamiz.",
    "Bugungi taklif: chegirma 20% faqat bugun!",
  ];

  const imgRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setText("");
    setSelectedFile(null);
    setSelectedType(null);
    setWhen("");
    if (imgRef.current) imgRef.current.value = "";
    if (audioRef.current) audioRef.current.value = "";
  };

  const handleSend = () => {
    const hasText = !!text.trim();
    const hasFile = !!selectedFile && !!selectedType;
    if (!hasText && !hasFile) return;

    const ts = when ? new Date(when).getTime() : 0;
    const delay = ts - Date.now();

    const sendNow = () => {
      if (hasFile && selectedFile && selectedType) {
        onSend({ file: { type: selectedType, file: selectedFile } });
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

  return (
    <div className="border-t bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur p-3 sticky bottom-0 z-10">
      <div className="flex items-center gap-2">
        <input
          ref={imgRef}
          onChange={onFileChange}
          type="file"
          accept="image/*"
          className="hidden"
        />
        <input
          ref={audioRef}
          onChange={onFileChange}
          type="file"
          accept="audio/*"
          className="hidden"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              title="Shablon"
              aria-label="Shablon"
              className="shrink-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Shablonni tanlang</div>
              <Select onValueChange={(v) => setText(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Shablon..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={onPickImage}
          title="Fayl tanlash"
          aria-label="Fayl tanlash"
          className="shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Input
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Xabar yozing..."
        />

        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={onPickAudio}
          title="Audio"
          aria-label="Audio"
          className="shrink-0"
        >
          <Mic className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              title="Vaqt belgilash"
              aria-label="Vaqt belgilash"
              className="shrink-0"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Yuborish vaqtini tanlang</div>
              <Input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setWhen("")}
                  className="text-xs rounded px-2 py-1 border hover:bg-background"
                >
                  Tozalash
                </button>
                <span className="text-[11px] text-muted-foreground">
                  {when ? new Date(when).toLocaleString() : "Darhol"}
                </span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          title="Yuborish"
          aria-label="Yuborish"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
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
          <span className="rounded border px-1.5 py-0.5 text-[10px]">
            {selectedType}
          </span>
          <button
            onClick={() => {
              setSelectedFile(null);
              setSelectedType(null);
              if (imgRef.current) imgRef.current.value = "";
              if (audioRef.current) audioRef.current.value = "";
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
