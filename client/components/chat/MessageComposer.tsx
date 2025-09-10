import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Mic, Send, X } from "lucide-react";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"image" | "audio" | null>(
    null,
  );

  const imgRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (!text.trim() && !selectedFile) return;
    if (selectedFile && selectedType) {
      onSend({ file: { type: selectedType, file: selectedFile } });
    }
    if (text.trim()) {
      onSend({ text: text.trim() });
    }
    setText("");
    setSelectedFile(null);
    setSelectedType(null);
    if (imgRef.current) imgRef.current.value = "";
    if (audioRef.current) audioRef.current.value = "";
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
