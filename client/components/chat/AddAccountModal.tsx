import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, Country } from "@/lib/countries";
import { useAuth } from "@/auth";

const API_BASE_URL = 'https://talkapp.up.railway.app';

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (accountData: any) => void;
}

type Step = 'phone' | 'verify' | 'password';

interface LoginResponse {
  ok: boolean;
  message: string;
  phone_code_hash: string;
  session_name: string;
  account_index: number;
}

export default function AddAccountModal({ open, onClose, onSuccess }: AddAccountModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [isLoading, setIsLoading] = useState(false);

  // Default to Uzbekistan
  const defaultCountry = countries.find(c => c.code === 'UZ') || null;
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(defaultCountry);
  const [phone, setPhone] = useState(defaultCountry?.prefix || "");

  // Verification step
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);

  const handleContinue = async () => {
    if (step === 'phone' && phone.trim()) {
      setIsLoading(true);
      try {
        // Get access token from Supabase session
        const { data: { session } } = await import("@supabase/supabase-js").then(
          ({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getSession();
          }
        );

        if (!session?.access_token) {
          console.error('No access token available');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/start_login`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phone.replace(/\s/g, ''),
          }),
        });

        const data: LoginResponse = await response.json();

        if (data.ok) {
          setLoginData(data);
          setStep('verify');
        } else {
          // Handle error
          console.error('Login failed:', data.message);
        }
      } catch (error) {
        console.error('API call failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 'verify' && verificationCode.trim() && loginData) {
      setIsLoading(true);
      try {
        // Get access token from Supabase session
        const { data: { session } } = await import("@supabase/supabase-js").then(
          ({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getSession();
          }
        );

        if (!session?.access_token) {
          console.error('No access token available');
          setIsLoading(false);
          return;
        }

        const verifyResponse = await fetch(`${API_BASE_URL}/verify_code`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phone.replace(/\s/g, ''),
            code: verificationCode.trim(),
          }),
        });

        const verifyData = await verifyResponse.json();

        if (verifyData.ok && verifyData.status === 'LOGGED_IN') {
          onSuccess({
            ...verifyData,
            phone: phone.replace(/\s/g, ''),
            country: selectedCountry,
          });
          handleClose();
        } else if (verifyData.status === 'PASSWORD_REQUIRED') {
          // Update login data with new session info
          setLoginData(verifyData);
          setStep('password');
        } else {
          console.error('Verification failed:', verifyData.message);
        }
      } catch (error) {
        console.error('Verification API call failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 'password' && password.trim() && loginData) {
      setIsLoading(true);
      try {
        // Get access token from Supabase session
        const { data: { session } } = await import("@supabase/supabase-js").then(
          ({ createClient }) => {
            const supabase = createClient(
              import.meta.env.VITE_SUPABASE_URL,
              import.meta.env.VITE_SUPABASE_ANON_KEY
            );
            return supabase.auth.getSession();
          }
        );

        if (!session?.access_token) {
          console.error('No access token available');
          setIsLoading(false);
          return;
        }

        const passwordResponse = await fetch(`${API_BASE_URL}/verify_password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phone.replace(/\s/g, ''),
            password: password.trim(),
          }),
        });

        const passwordData = await passwordResponse.json();

        if (passwordData.ok && passwordData.status === 'LOGGED_IN') {
          onSuccess({
            ...passwordData,
            phone: phone.replace(/\s/g, ''),
            country: selectedCountry,
          });
          handleClose();
        } else {
          console.error('Password verification failed:', passwordData.message);
        }
      } catch (error) {
        console.error('Password verification API call failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setStep('phone');
    setSelectedCountry(defaultCountry);
    setPhone(defaultCountry?.prefix || "");
    setVerificationCode("");
    setPassword("");
    setLoginData(null);
    setIsLoading(false);
    onClose();
  };

  const handleBack = () => {
    setStep('phone');
    setVerificationCode("");
  };

  const handleCountrySelect = (value: string) => {
    const country = countries.find((c) => c.code === value);
    setSelectedCountry(country || null);
    if (country) {
      // If phone input is empty or just has +, set the prefix
      if (!phone || phone === '+') {
        setPhone(country.prefix);
      } else {
        // If there's already a number, format it with the new country's mask
        const formatted = formatPhoneNumber(phone, country);
        setPhone(formatted);
      }
    }
  };

  const formatPhoneNumber = (input: string, country: Country | null): string => {
    if (!country) return input;

    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');

    // If input doesn't start with country code digits, return as-is
    const countryDigits = country.prefix.replace('+', '');
    if (!digitsOnly.startsWith(countryDigits)) {
      return input;
    }

    // Get digits after country code
    const phoneDigits = digitsOnly.slice(countryDigits.length);

    // Get the full mask pattern and find where the country prefix ends
    const fullMask = country.mask;
    const prefixIndex = fullMask.indexOf(country.prefix) + country.prefix.length;

    // Get the remaining mask pattern after the prefix (including any spaces)
    const remainingMask = fullMask.slice(prefixIndex);

    // Apply the remaining mask pattern
    let formatted = country.prefix;
    let digitIndex = 0;

    for (let i = 0; i < remainingMask.length && digitIndex < phoneDigits.length; i++) {
      const maskChar = remainingMask[i];
      if (maskChar === '9') {
        formatted += phoneDigits[digitIndex];
        digitIndex++;
      } else {
        formatted += maskChar;
      }
    }

    return formatted;
  };

  const handlePhoneChange = (value: string) => {
    // First, try to detect country from the input
    let detectedCountry = null;
    if (value.startsWith('+')) {
      detectedCountry = countries.find(country => value.startsWith(country.prefix));
    }

    // Update selected country if detected
    if (detectedCountry && detectedCountry !== selectedCountry) {
      setSelectedCountry(detectedCountry);
    } else if (!detectedCountry && selectedCountry && !value.startsWith(selectedCountry.prefix)) {
      setSelectedCountry(null);
    }

    // Format the phone number if we have a country
    const currentCountry = detectedCountry || selectedCountry;
    if (currentCountry) {
      const formatted = formatPhoneNumber(value, currentCountry);
      setPhone(formatted);
    } else {
      setPhone(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'phone' ? 'Hisob qo\'shish' :
             step === 'verify' ? 'Kodni tasdiqlash' :
             'Parolni kiriting'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {step === 'phone' ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="country">Davlatni tanlang</Label>
                <Select
                  value={selectedCountry?.code || ""}
                  onValueChange={handleCountrySelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Davlatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.prefix})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefon raqami</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 00 000 00 00"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Telefon raqamingizni kiriting
                </p>
              </div>
            </>
          ) : step === 'verify' ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="code">Tasdiqlash kodi</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="12345"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  {phone} raqamiga yuborilgan kodni kiriting
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ikkinchi bosqichli parolni kiriting
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={step === 'phone' ? handleClose : handleBack}>
            {step === 'phone' ? 'Bekor qilish' : 'Orqaga'}
          </Button>
          <Button
            onClick={handleContinue}
            disabled={
              (step === 'phone' && !phone.trim()) ||
              (step === 'verify' && !verificationCode.trim()) ||
              (step === 'password' && !password.trim()) ||
              isLoading
            }
            className="text-white"
          >
            {isLoading ? 'Yuborilmoqda...' :
             step === 'phone' ? 'Davam etish' :
             step === 'verify' ? 'Tasdiqlash' : 'Kirish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}