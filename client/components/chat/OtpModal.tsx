import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth";

export default function OtpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const { addAccount } = useAuth();

  if (!open) return null;

  const handleSendCode = () => {
    setStep("code");
  };

  const handleLink = () => {
    // For demo: accept any code and create a mock account
    const id = Math.random().toString(36).slice(2);
    const name = `TG ${phone.slice(-4)}`;
    addAccount({ id, name, phone });
    setPhone("");
    setCode("");
    setStep("phone");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Telegram hisobini ulash</h3>
        {step === "phone" ? (
          <div className="space-y-3">
            <input
              className="w-full rounded-md bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleSendCode} className="w-full">
              SMS kodini yuborish
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              className="w-full rounded-md bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary tracking-widest"
              placeholder="6 xonali kod"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={handleLink} className="w-full">
              Ulash
            </Button>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-3 block w-full text-center text-xs text-muted-foreground hover:underline"
        >
          Bekor qilish
        </button>
      </div>
    </div>
  );
}
