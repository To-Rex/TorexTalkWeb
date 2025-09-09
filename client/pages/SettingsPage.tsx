import { useEffect, useState } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export default function SettingsPage() {
  const { user, updateUser, addToBlocklist, removeFromBlocklist } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const [sessions, setSessions] = useState<
    { id: string; device: string; last: number }[]
  >([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(`tt_sessions_${user.email}`);
    if (raw) setSessions(JSON.parse(raw));
    else {
      const s = [
        {
          id: "s1",
          device: "Chrome - Desktop",
          last: Date.now() - 1000 * 60 * 60,
        },
        {
          id: "s2",
          device: "Mobile - Android",
          last: Date.now() - 1000 * 60 * 30,
        },
      ];
      localStorage.setItem(`tt_sessions_${user.email}`, JSON.stringify(s));
      setSessions(s);
    }
  }, [user]);

  if (!user)
    return <div className="container py-10">Iltimos tizimga kiring</div>;

  const toggle = (k: "aiForGroups" | "aiForPrivate") => {
    updateUser((u) => ({
      ...u,
      settings: { ...(u.settings ?? {}), [k]: !(u.settings as any)?.[k] },
    }));
  };

  const revokeSession = (id: string) => {
    const next = sessions.filter((s) => s.id !== id);
    setSessions(next);
    localStorage.setItem(`tt_sessions_${user.email}`, JSON.stringify(next));
  };

  const clearMemory = () => {
    localStorage.removeItem(`tt_qas_${user.email}`);
    localStorage.removeItem(`tt_templates_${user.email}`);
    // optionally notify
    alert("AI xotiri tozalandi");
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Sozlamalar</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border p-4 bg-card">
            <div>
              <div className="font-medium">AI avtomatik javob (Guruhlar)</div>
              <div className="text-sm text-muted-foreground">
                Guruhlardagi avtomatik javoblarni boshqaring
              </div>
            </div>
            <div>
              <Button
                variant={
                  user.settings?.aiForGroups ? "default" : ("outline" as any)
                }
                onClick={() => toggle("aiForGroups")}
              >
                {user.settings?.aiForGroups ? "O‘chirish" : "Yoqish"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border p-4 bg-card">
            <div>
              <div className="font-medium">AI avtomatik javob (Shaxsiy)</div>
              <div className="text-sm text-muted-foreground">
                Shaxsiy chatlar uchun avtomatik javoblarni boshqaring
              </div>
            </div>
            <div>
              <Button
                variant={
                  user.settings?.aiForPrivate ? "default" : ("outline" as any)
                }
                onClick={() => toggle("aiForPrivate")}
              >
                {user.settings?.aiForPrivate ? "O‘chirish" : "Yoqish"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <div className="font-medium mb-2">Mass xabar blocklist</div>
            <div className="text-sm text-muted-foreground mb-3">
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

          <div className="rounded-xl border p-4 bg-card">
            <div className="font-medium mb-2">Til</div>
            <div className="flex gap-2">
              <Button
                variant={
                  locale === "uz" ? ("default" as any) : ("outline" as any)
                }
                onClick={() => setLocale("uz")}
              >
                O'zbek
              </Button>
              <Button
                variant={
                  locale === "en" ? ("default" as any) : ("outline" as any)
                }
                onClick={() => setLocale("en")}
              >
                English
              </Button>
              <Button
                variant={
                  locale === "ru" ? ("default" as any) : ("outline" as any)
                }
                onClick={() => setLocale("ru")}
              >
                Русский
              </Button>
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <div className="font-medium mb-2">Xotirani boshqarish</div>
            <div className="text-sm text-muted-foreground mb-3">
              AI xotirasi va shablonlarni tozalash
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={clearMemory}>
                Xotirani tozalash
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border p-4 bg-card">
            <div className="font-medium mb-2">Seanslar</div>
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.device}</div>
                    <div className="text-xs text-muted-foreground">
                      Oxirgi faollik: {new Date(s.last).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => revokeSession(s.id)}
                    >
                      Bekor qilish
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <div className="font-medium mb-2">Sessiyalarni boshqarish</div>
            <div className="text-sm text-muted-foreground mb-3">
              Hamma seanslarni bekor qilish
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  setSessions([]);
                  localStorage.removeItem(`tt_sessions_${user.email}`);
                }}
              >
                Hamma seanslarni o'chirish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
