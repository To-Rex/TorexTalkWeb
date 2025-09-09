import { useEffect, useState } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";

export default function TemplatesManager({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, updateUser } = useAuth();
  const [list, setList] = useState<string[]>([]);
  const [newT, setNewT] = useState("");

  useEffect(() => {
    if (!user) return;
    const key = `tt_templates_${user.email}`;
    const raw = localStorage.getItem(key);
    setList(
      raw
        ? JSON.parse(raw)
        : [
            "Salom! Sizga qanday yordam bera olaman?",
            "Rahmat! Tez orada aloqaga chiqamiz.",
          ],
    );
  }, [user]);

  const save = (next: string[]) => {
    if (!user) return;
    const key = `tt_templates_${user.email}`;
    localStorage.setItem(key, JSON.stringify(next));
    setList(next);
  };

  if (!open) return null;
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Xabar shablonlari</h3>
        <div className="space-y-2 mb-3">
          {list.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded p-2"
            >
              <div className="text-sm">{t}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = list.filter((_, idx) => idx !== i);
                    save(next);
                  }}
                  className="px-2 py-1 rounded bg-destructive text-destructive-foreground"
                >
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newT}
            onChange={(e) => setNewT(e.target.value)}
            placeholder="Yangi shablon..."
            className="flex-1 rounded-md bg-secondary px-3 py-2"
          />
          <Button
            onClick={() => {
              if (!newT.trim()) return;
              const next = [...list, newT.trim()];
              save(next);
              setNewT("");
            }}
          >
            Qo'shish
          </Button>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Yopish
          </Button>
        </div>
      </div>
    </div>
  );
}
