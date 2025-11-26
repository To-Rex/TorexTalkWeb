import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/auth";

export default function OtpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [country, setCountry] = useState("UZ");
  const phoneRef = useRef<HTMLInputElement>(null);
  const { addAccount } = useAuth();

  const countries = [
    { code: "UZ", name: "Uzbekistan", prefix: "+998" },
    { code: "RU", name: "Russia", prefix: "+7" },
    { code: "KZ", name: "Kazakhstan", prefix: "+7" },
    { code: "KG", name: "Kyrgyzstan", prefix: "+996" },
    { code: "TJ", name: "Tajikistan", prefix: "+992" },
    { code: "TM", name: "Turkmenistan", prefix: "+993" },
  ];

  useEffect(() => {
    if (phoneRef.current) {
      phoneRef.current.value = "+998";
    }
  }, []);

  useEffect(() => {
    if (country && phoneRef.current) {
      const selectedCountry = countries.find(c => c.code === country);
      const prefix = selectedCountry?.prefix || "+998";
      const currentValue = phoneRef.current.value;
      if (!currentValue.startsWith(prefix)) {
        const numberPart = currentValue.replace(/^\+\d+/, '');
        phoneRef.current.value = formatPhoneNumber(prefix + numberPart);
      }
    }
  }, [country]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits except +
    const cleaned = value.replace(/[^\d+]/g, '');
    // Find the prefix
    const matchedCountry = countries.find(c => cleaned.startsWith(c.prefix.slice(1)));
    if (matchedCountry) {
      const prefix = matchedCountry.prefix;
      let numberPart = cleaned.slice(prefix.length - 1); // since prefix includes +
      // Limit to 9 digits for Uzbekistan (adjust for other countries if needed)
      numberPart = numberPart.slice(0, 9);
      // Format as XX XXX XX XX
      const match = numberPart.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      if (match) {
        const formatted = [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
        return prefix + (formatted ? ' ' + formatted : '');
      }
      return prefix + numberPart;
    }
    return cleaned;
  };

  const handlePhoneChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const formatted = formatPhoneNumber(value);
    e.currentTarget.value = formatted;

    // Update country based on formatted value
    const matchedCountry = countries.find(c => formatted.startsWith(c.prefix));
    if (matchedCountry) {
      setCountry(matchedCountry.code);
    } else {
      setCountry("");
    }
  };

  if (!open) return null;

  const handleSendCode = () => {
    setStep("code");
  };

  const handleLink = () => {
    // For demo: accept any code and create a mock account
    const phoneValue = phoneRef.current?.value || "";
    const id = Math.random().toString(36).slice(2);
    const name = `TG ${phoneValue.slice(-4)}`;
    addAccount({ id, name, phone: phoneValue });
    if (phoneRef.current) phoneRef.current.value = "";
    setCode("");
    setStep("phone");
    setCountry("UZ");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Telegram hisobini ulash</h3>
        {step === "phone" ? (
          <div className="space-y-3">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Davlatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name} ({c.prefix})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              ref={phoneRef}
              className="w-full rounded-md bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="90 123 45 67"
              onInput={handlePhoneChange}
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
