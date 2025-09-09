import { useState } from "react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminLoginModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handle = async () => {
    const ok = await login("admin@torex.com", password);
    if (!ok) return setError("Noto'g'ri admin parol");
    onClose();
    navigate("/admin");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Admin kirish</h3>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Admin parol"
          className="w-full rounded-md bg-secondary px-3 py-2"
        />
        {error ? (
          <div className="text-sm text-destructive mt-2">{error}</div>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Bekor
          </Button>
          <Button onClick={handle}>Kirish</Button>
        </div>
      </div>
    </div>
  );
}
