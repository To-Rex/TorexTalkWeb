import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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
  const fileRef = useRef<HTMLInputElement | null>(null);

  const templates = useMemo(
    () => [
      "Salom! Sizga qanday yordam bera olaman?",
      "Rahmat! Tez orada aloqaga chiqamiz.",
      "Bugungi taklif: chegirma 20% faqat bugun!",
    ],
    [],
  );

  const handleSend = () => {
    if (!text.trim() && !selectedFile) return;
    if (selectedFile && selectedType) {
      onSend({ file: { type: selectedType, file: selectedFile } });
    }
    if (text.trim()) {
      onSend({ text: text.trim() });
    }
    setText("");
    setWhen("");
    setSelectedFile(null);
    setSelectedType(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const pickFile = (type: "image" | "audio") => {
    setSelectedType(type);
    fileRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setSelectedFile(f);
  };

  return (
    <div className="border-t bg-background/60 p-3 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <select
          onChange={(e) => setText(e.target.value)}
          className="rounded-md bg-secondary px-2 py-2 text-xs w-full sm:w-auto"
          defaultValue=""
        >
          <option value="" disabled>
            Shablonni tanlang
          </option>
          {templates.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="rounded-md bg-secondary px-3 py-2 text-xs w-full sm:w-auto"
        />
        <label className="text-xs text-muted-foreground">
          {when ? "Rejalashtirilgan" : "Darhol"}
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          className="flex-1 rounded-md bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Xabar yozing..."
        />

        <input
          ref={fileRef}
          onChange={onFileChange}
          type="file"
          accept="image/*,audio/*"
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <button
            title="Rasm qo'shish"
            onClick={() => pickFile("image")}
            className="h-9 w-9 rounded-full bg-secondary grid place-items-center hover:bg-secondary/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
              />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path
                d="M21 15l-5-5-7 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            title="Audio qo'shish"
            onClick={() => pickFile("audio")}
            className="h-9 w-9 rounded-full bg-secondary grid place-items-center hover:bg-secondary/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19a3 3 0 003-3V8a3 3 0 00-6 0v8a3 3 0 003 3z"
              />
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11v2a7 7 0 01-14 0v-2"
              />
            </svg>
          </button>
        </div>

        <Button onClick={handleSend} className="sm:ml-2 w-full sm:w-auto">
          Yuborish
        </Button>
      </div>

      {selectedFile ? (
        <div className="mt-2 text-sm text-muted-foreground">
          Tanlangan fayl: {selectedFile.name} ({selectedType})
        </div>
      ) : null}
    </div>
  );
}
