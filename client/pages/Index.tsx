import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";

export default function Index() {
  const { t } = useI18n();

  return (
    <div className="bg-gradient-to-b from-background to-secondary/20">
      {/* Hero */}
      <section className="container py-10 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />{" "}
              {t("tagline")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {t("hero_title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              {t("hero_sub")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/app">
                <Button size="lg" className="shadow-lg shadow-cyan-500/20">
                  {t("cta_primary")}
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline">
                  {t("learn_more")}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-3xl" />
            <div className="relative rounded-2xl border bg-card/60 backdrop-blur p-4">
              {/* Mocked Chat Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-2 rounded-xl bg-secondary p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Private</p>
                  {["Ali", "Nodira", "Jamshid", "Support"].map((n, i) => (
                    <div
                      key={n}
                      className={`flex items-center justify-between rounded-lg p-2 ${i === 0 ? "bg-background" : "hover:bg-background/60"}`}
                    >
                      <span className="text-sm">{n}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {i === 0 ? "typing…" : "online"}
                      </span>
                    </div>
                  ))}
                  <p className="text-xs mt-3 text-muted-foreground">Groups</p>
                  {["Marketing", "Savdo"].map((n) => (
                    <div
                      key={n}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-background/60"
                    >
                      <span className="text-sm">{n}</span>
                      <span className="text-[10px] text-muted-foreground">
                        12
                      </span>
                    </div>
                  ))}
                </div>
                <div className="sm:col-span-3 rounded-xl bg-background border p-3 flex flex-col">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-medium">Ali</div>
                    <div className="text-xs text-muted-foreground">online</div>
                  </div>
                  <div className="flex-1 space-y-2 py-2 overflow-hidden">
                    <div className="w-fit max-w-[80%] rounded-lg bg-secondary px-3 py-2 text-sm">
                      Salom! Yordam bera olamanmi?
                    </div>
                    <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm">
                      Assalomu alaykum! Ha, hisob ulashmoqchi edim.
                    </div>
                    <div className="w-fit max-w-[80%] rounded-lg bg-secondary px-3 py-2 text-sm">
                      Telefon raqamingizni yuboring.
                    </div>
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <input
                      className="flex-1 rounded-md bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Yozish..."
                    />
                    <Button size="sm">Yuborish</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick features summary */}
      <section className="container py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          {t("quick_features")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-6 bg-card">
            <h3 className="font-semibold mb-2">Mass xabar yuborish</h3>
            <p className="text-sm text-muted-foreground">
              Yagona panel orqali yuzlab foydalanuvchilarga bir vaqtning oʻzida
              xabar yuboring va yuborish jadvalini sozlang.
            </p>
          </div>
          <div className="rounded-xl border p-6 bg-card">
            <h3 className="font-semibold mb-2">AI avtojavoblar</h3>
            <p className="text-sm text-muted-foreground">
              Savollarga avtomatik javoblar va shablonlar yaratish, bir savolga
              bir nechta javob variantlari bilan.
            </p>
          </div>
          <div className="rounded-xl border p-6 bg-card">
            <h3 className="font-semibold mb-2">Tahlillar va statistikalar</h3>
            <p className="text-sm text-muted-foreground">
              Kampaniya samaradorligini kuzatib boring, ochilish va javob
              ko'rsatkichlarini oling.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Qanday ishlaydi</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-6 bg-card">
            <div className="text-3xl font-extrabold mb-2">1</div>
            <h4 className="font-semibold mb-2">Hisobni ulang</h4>
            <p className="text-sm text-muted-foreground">
              Google yoki email orqali ro'yxatdan o'ting va Telegram
              hisobingizni ulang.
            </p>
          </div>
          <div className="rounded-xl border p-6 bg-card">
            <div className="text-3xl font-extrabold mb-2">2</div>
            <h4 className="font-semibold mb-2">Avtomatlashtiring</h4>
            <p className="text-sm text-muted-foreground">
              Auto-replies, shablonlar va mass-xabarlar yordamida muloqotni
              avtomatlashtiring.
            </p>
          </div>
          <div className="rounded-xl border p-6 bg-card">
            <div className="text-3xl font-extrabold mb-2">3</div>
            <h4 className="font-semibold mb-2">O'lchang</h4>
            <p className="text-sm text-muted-foreground">
              Statistikalar orqali natijalarni tahlil qiling va strategiyani
              optimallashtiring.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations & CTA */}
      <section className="container py-8 sm:py-12">
        <div className="rounded-xl border p-8 bg-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Integratsiyalar</h3>
            <p className="text-sm text-muted-foreground">
              Google auth, Email, va boshqalar bilan osongina integratsiya
              qilinadi.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/register">
              <Button variant="outline">Ro'yxatdan o'tish</Button>
            </Link>
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Foydalanuvchi fikrlari
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-6 bg-card">
            “Sodda va kuchli — mijozlarimiz bilan muloqotni avtomatlashtirdik.”
          </div>
          <div className="rounded-xl border p-6 bg-card">
            “Mass xabarlar va tahlillar yordamida kampaniyalarimiz natijasi
            yaxshilandi.”
          </div>
          <div className="rounded-xl border p-6 bg-card">
            “Auto-replies funksiyasi va shablonlar juda foydali.”
          </div>
        </div>
      </section>
    </div>
  );
}
