import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MassMessageModal({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (text: string) => void }) {
  const [text, setText] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Mass xabar yuborish</h3>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full min-h-[120px] rounded-md bg-secondary p-3" placeholder="Xabar matni..." />
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button onClick={() => { if (!text.trim()) return; onSend(text.trim()); setText(""); onClose(); }}>Yuborish</Button>
        </div>
      </div>
    </div>
  );
}
