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
  const { user, switchTelegramAccount } = useAuth();

  if (!open) return null;
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Telegram hisoblari</h3>
        <div className="space-y-2">
          {user.telegramAccounts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Hisob topilmadi.
            </div>
          ) : (
            user.telegramAccounts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border rounded p-2"
              >
                <div className="flex items-center gap-3">
                  {a.profile_picture ? (
                    <img
                      src={a.profile_picture}
                      alt={a.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary text-white grid place-items-center font-semibold">
                      {a.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchTelegramAccount(a.id)}
                    className="px-2 py-1 rounded bg-secondary text-sm"
                  >
                    Faollashtirish
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
