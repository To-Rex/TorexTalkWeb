import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/auth";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { t } = useI18n();
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) return setError("Noto'g'ri email yoki parol");
    navigate("/app");
  };

  const handleGoogle = async () => {
    await googleSignIn({
      email: `google_${Math.random().toString(36).slice(2)}@torex.com`,
      name: "Google User",
    });
    navigate("/app");
  };

  return (
    <div className="container py-10 sm:py-16">
      <div className="max-w-md mx-auto rounded-xl border p-4 sm:p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-4">{t("sign_in")}</h2>
        <form onSubmit={handle} className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md bg-secondary px-3 py-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            className="w-full rounded-md bg-secondary px-3 py-2"
          />
          {error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : null}
          <div className="flex items-center justify-between">
            <Button type="submit">{t("sign_in")}</Button>
            <Link
              to="/register"
              className="text-sm text-muted-foreground underline"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </form>
        <div className="mt-4 border-t pt-4">
          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            Google bilan davom etish
          </Button>
        </div>
      </div>
    </div>
  );
}
