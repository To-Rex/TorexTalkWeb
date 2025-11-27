import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/auth";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Apple, Github, Facebook, Chrome, Eye, EyeOff } from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

export default function Register() {
   const { t } = useI18n();
   const { register, oauthSignIn } = useAuth();
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState<string | null>(null);
   const [accepted, setAccepted] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
   const mouseRef = useRef({ x: 50, y: 50 });

   useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       const rect = document.body.getBoundingClientRect();
       mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
       mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
     };

     const animate = () => {
       setMousePos(prev => ({
         x: prev.x + (mouseRef.current.x - prev.x) * 0.05, // Slower easing for better performance
         y: prev.y + (mouseRef.current.y - prev.y) * 0.05,
       }));
       requestAnimationFrame(animate);
     };

     // Check for reduced motion preference
     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     if (!prefersReducedMotion) {
       animate();
       window.addEventListener('mousemove', handleMouseMove);
     }

     return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);

  const validate = () => {
    if (!accepted) {
      setError("Davom etishdan oldin Oferta va Maxfiylik siyosatiga rozilik bering");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email noto'g'ri formatda");
      return false;
    }
    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return false;
    }
    setError(null);
    return true;
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ok = await register(email, password);
    setSubmitting(false);
    if (!ok) return setError("Email allaqachon mavjud");
    navigate("/app");
  };

  const handleOAuth = async (
    provider: "google" | "github" | "facebook" | "apple",
  ) => {
    if (!accepted) {
      setError("Davom etishdan oldin Oferta va Maxfiylik siyosatiga rozilik bering");
      return;
    }
    setError(null);
    setSubmitting(true);
    await oauthSignIn(provider, {
      email: `${provider}_${Math.random().toString(36).slice(2)}@torex.com`,
      name: `${provider[0].toUpperCase()}${provider.slice(1)} User`,
    });
    setSubmitting(false);
    navigate("/app");
  };

  return (
    <div
      className="bg-gradient-to-b from-background to-secondary/20"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.1) 0%, transparent 50%), radial-gradient(circle at ${mousePos.x + 30}% ${mousePos.y - 30}%, hsl(var(--accent) / 0.1) 0%, transparent 50%), radial-gradient(circle at ${mousePos.x - 30}% ${mousePos.y + 30}%, hsl(var(--secondary) / 0.1) 0%, transparent 50%), linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary) / 0.2) 100%)`
      }}
    >
      <section className="container py-10 sm:py-16 min-h-[calc(100vh-3.5rem)] flex items-center">
        <motion.div initial="hidden" animate="show" className="mx-auto max-w-lg">
          <Card className="overflow-hidden border-0 shadow-lg shadow-primary/10">
            <CardHeader className="text-center pb-2">
              <motion.div variants={fade} className="mx-auto h-12 w-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <span className="font-bold">TT</span>
              </motion.div>
              <motion.div variants={fade} custom={1}>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Ro'yxatdan o'tish
                </CardTitle>
                <CardDescription className="mt-1 text-muted-foreground">
                  Tez ro'yxatdan o'ting yoki ijtimoiy tarmoqlar orqali davom eting
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.form onSubmit={handle} className="space-y-3" variants={fade} custom={2}>
                <div className="space-y-1">
                  <label className="text-sm">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full rounded-md bg-secondary px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Parol</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-md bg-secondary px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                      className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="text-sm text-destructive">{error}</div>
                ) : null}

                <div className="flex items-start gap-2 pt-1">
                  <Checkbox id="accept" checked={accepted} onCheckedChange={(v) => setAccepted(!!v)} />
                  <label htmlFor="accept" className="text-xs leading-5 text-muted-foreground">
                    Men <Link to="/terms" className="underline">Oferta</Link> va {" "}
                    <Link to="/privacy" className="underline">Maxfiylik siyosati</Link> shartlariga roziman
                  </label>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button type="submit" disabled={!accepted || submitting}>
                    Ro'yxatdan o'tish
                  </Button>
                  <Link to="/login" className="text-sm text-muted-foreground underline">
                    {t("sign_in")}
                  </Link>
                </div>
              </motion.form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">yoki</span>
                </div>
              </div>

              <motion.div variants={fade} custom={3} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full transition-all hover:scale-[1.02] hover:bg-[#4285F4]/15 hover:text-foreground/90 hover:border-[#4285F4]/30"
                  disabled={!accepted || submitting}
                  onClick={() => handleOAuth("google")}
                >
                  <Chrome className="mr-2 h-4 w-4" /> Google bilan
                </Button>
                <Button
                  variant="outline"
                  className="w-full transition-all hover:scale-[1.02] hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground/90 hover:border-foreground/20"
                  disabled={!accepted || submitting}
                  onClick={() => handleOAuth("apple")}
                >
                  <Apple className="mr-2 h-4 w-4" /> Apple bilan
                </Button>
                <Button
                  variant="outline"
                  className="w-full transition-all hover:scale-[1.02] hover:bg-[#1877F2]/15 hover:text-foreground/90 hover:border-[#1877F2]/30"
                  disabled={!accepted || submitting}
                  onClick={() => handleOAuth("facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4" /> Facebook bilan
                </Button>
                <Button
                  variant="outline"
                  className="w-full transition-all hover:scale-[1.02] hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground/90 hover:border-foreground/20"
                  disabled={!accepted || submitting}
                  onClick={() => handleOAuth("github")}
                >
                  <Github className="mr-2 h-4 w-4" /> GitHub bilan
                </Button>
              </motion.div>
            </CardContent>

            <CardFooter className="justify-center text-xs text-muted-foreground">
              Davom etish orqali siz yuqoridagi shartlarni qabul qilgan bo'lasiz
            </CardFooter>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
