import { useState } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";

export default function AccountsManager({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, switchAccount, updateUser } = useAuth();
  const [confirm, setConfirm] = useState<string | null>(null);

  if (!open) return null;
  if (!user) return null;

  const remove = (id: string) => {
    updateUser((u) => ({
      ...u,
      accounts: u.accounts.filter((a) => a.id !== id),
      activeAccountId: u.activeAccountId === id ? null : u.activeAccountId,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Telegram hisoblari</h3>
        <div className="space-y-2">
          {user.accounts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Hisob topilmadi. "Hisob qo'shish" tugmasi orqali qo'shing.
            </div>
          ) : (
            user.accounts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border rounded p-2"
              >
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchAccount(a.id)}
                    className="px-2 py-1 rounded bg-secondary text-sm"
                  >
                    Faollashtirish
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="px-2 py-1 rounded bg-destructive text-destructive-foreground text-sm"
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Yopish
          </Button>
        </div>
      </div>
    </div>
  );
}
