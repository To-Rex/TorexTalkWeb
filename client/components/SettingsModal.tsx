import { useState } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, updateUser, addToBlocklist, removeFromBlocklist } = useAuth();
  const [local, setLocal] = useState(() => ({
    aiForGroups: user?.settings?.aiForGroups ?? false,
    aiForPrivate: user?.settings?.aiForPrivate ?? false,
  }));
  const [name, setName] = useState("");

  if (!open || !user) return null;

  const save = () => {
    updateUser((u) => ({
      ...u,
      settings: {
        aiForGroups: local.aiForGroups,
        aiForPrivate: local.aiForPrivate,
      },
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Sozlamalar</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">AI avtomatik javob (Guruhlar)</div>
              <div className="text-xs text-muted-foreground">
                Guruhlarda AI avtojavobni yoqish/o‘chirish
              </div>
            </div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={local.aiForGroups}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, aiForGroups: e.target.checked }))
                }
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">AI avtomatik javob (Shaxsiy)</div>
              <div className="text-xs text-muted-foreground">
                Shaxsiy chatlar uchun AI-avtojavobni yoqish/o‘chirish
              </div>
            </div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={local.aiForPrivate}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, aiForPrivate: e.target.checked }))
                }
              />
            </label>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-medium mb-1">Mass xabar blocklist</div>
          <div className="text-xs text-muted-foreground mb-3">
            Bu ro‘yxatdagi shaxsiy chat foydalanuvchilariga mass xabar
            yuborilmaydi.
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Foydalanuvchi nomi"
              className="flex-1 rounded-md bg-secondary px-3 py-2 text-sm"
            />
            <Button
              onClick={() => {
                const v = name.trim();
                if (!v) return;
                addToBlocklist(v);
                setName("");
              }}
            >
              Qo‘shish
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user.blocklist ?? []).length === 0 ? (
              <div className="text-xs text-muted-foreground">
                Ro‘yxat bo‘sh.
              </div>
            ) : (
              (user.blocklist ?? []).map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
                >
                  {n}
                  <button
                    onClick={() => removeFromBlocklist(n)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Olib tashlash: ${n}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Bekor
          </Button>
          <Button onClick={save}>Saqlash</Button>
        </div>
      </div>
    </div>
  );
}
