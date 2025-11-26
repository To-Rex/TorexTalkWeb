import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/auth";

export default function Index() {
   const { t } = useI18n();
   const { user } = useAuth();

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

  const [selectedChat, setSelectedChat] = useState('Ali');

  const chatMessages = {
    Ali: [
      { text: "Salom! Yordam bera olamanmi?", sender: 'other' },
      { text: "Assalomu alaykum! Ha, hisob ulashmoqchi edim.", sender: 'me' },
      { text: "Telefon raqamingizni yuboring.", sender: 'other' }
    ],
    Nodira: [
      { text: "Salom Nodira!", sender: 'me' },
      { text: "Salom! Nima yordam kerak?", sender: 'other' }
    ],
    Jamshid: [
      { text: "Jamshid, savolingiz bormi?", sender: 'other' }
    ],
    Support: [
      { text: "Supportga murojaat qildingiz.", sender: 'other' },
      { text: "Qanday yordam bera olaman?", sender: 'other' }
    ],
    Marketing: [
      { text: "Marketing guruhi", sender: 'other' }
    ],
    Savdo: [
      { text: "Savdo bo'yicha savollar", sender: 'other' }
    ]
  };

  const [messages, setMessages] = useState(chatMessages[selectedChat]);
  const [inputValue, setInputValue] = useState('');

  return (
    <div
      className="bg-gradient-to-b from-background to-secondary/20"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsl(var(--primary) / 0.1) 0%, transparent 50%), radial-gradient(circle at ${mousePos.x + 30}% ${mousePos.y - 30}%, hsl(var(--accent) / 0.1) 0%, transparent 50%), radial-gradient(circle at ${mousePos.x - 30}% ${mousePos.y + 30}%, hsl(var(--secondary) / 0.1) 0%, transparent 50%), linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary) / 0.2) 100%)`
      }}
    >
      {/* Hero */}
      <section className="container py-10 sm:py-16 lg:py-24 min-h-[calc(100vh-3.5rem)] flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/app">
                  <Button size="lg" className="shadow-lg shadow-cyan-500/20 text-white">
                    {user ? t("dashboard") : t("cta_primary")}
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/features">
                  <Button size="lg" variant="outline">
                    {t("learn_more")}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-3xl" />
            <div className="relative rounded-2xl border bg-card/60 backdrop-blur p-4 animate-bg-pulse">
              {/* Mocked Chat Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-2 rounded-xl bg-secondary p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Private</p>
                  {["Ali", "Nodira", "Jamshid", "Support"].map((n) => (
                    <div
                      key={n}
                      className={`flex items-center justify-between rounded-lg p-2 cursor-pointer ${selectedChat === n ? "bg-background" : "hover:bg-background/60"}`}
                      onClick={() => {
                        setSelectedChat(n);
                        setMessages(chatMessages[n] || []);
                      }}
                    >
                      <span className="text-sm text-white">{n}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {selectedChat === n ? "typing…" : "online"}
                      </span>
                    </div>
                  ))}
                  <p className="text-xs mt-3 text-muted-foreground">Groups</p>
                  {["Marketing", "Savdo"].map((n) => (
                    <div
                      key={n}
                      className={`flex items-center justify-between rounded-lg p-2 cursor-pointer ${selectedChat === n ? "bg-background" : "hover:bg-background/60"}`}
                      onClick={() => {
                        setSelectedChat(n);
                        setMessages(chatMessages[n] || []);
                      }}
                    >
                      <span className="text-sm text-white">{n}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {selectedChat === n ? "typing…" : "12"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="sm:col-span-3 rounded-xl bg-background border p-3 flex flex-col">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-medium text-white">{selectedChat}</div>
                    <div className="text-xs text-muted-foreground">{selectedChat === 'Ali' || selectedChat === 'Nodira' || selectedChat === 'Jamshid' || selectedChat === 'Support' ? 'online' : '12 members'}</div>
                  </div>
                  <div className="flex-1 space-y-2 py-2 overflow-hidden">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`w-fit max-w-[80%] rounded-lg px-3 py-2 text-sm text-white ${
                          msg.sender === 'me' ? 'ml-auto bg-primary' : 'bg-secondary'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2">
                    <input
                      className="flex-1 rounded-md bg-secondary px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Yozish..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && inputValue.trim()) {
                          setMessages([...messages, { text: inputValue, sender: 'me' }]);
                          setInputValue('');
                        }
                      }}
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        className="text-white"
                        onClick={() => {
                          if (inputValue.trim()) {
                            setMessages([...messages, { text: inputValue, sender: 'me' }]);
                            setInputValue('');
                          }
                        }}
                      >
                        Yuborish
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick features summary */}
      <motion.section
        className="container py-8 sm:py-12"
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          {t("quick_features")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border p-6 bg-card"
          >
            <h3 className="font-semibold mb-2">{t("feature_mass_messaging_title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("feature_mass_messaging_desc")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border p-6 bg-card"
          >
            <h3 className="font-semibold mb-2">{t("feature_ai_replies_title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("feature_ai_replies_desc")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl border p-6 bg-card"
          >
            <h3 className="font-semibold mb-2">{t("feature_analytics_title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("feature_analytics_desc")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section
        className="container py-8 sm:py-12"
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t("how_it_works")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="text-3xl font-extrabold mb-2">1</div>
            <h4 className="font-semibold mb-2">{t("step1_title")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("step1_desc")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="text-3xl font-extrabold mb-2">2</div>
            <h4 className="font-semibold mb-2">{t("step2_title")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("step2_desc")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="text-3xl font-extrabold mb-2">3</div>
            <h4 className="font-semibold mb-2">{t("step3_title")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("step3_desc")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Integrations & CTA */}
      <motion.section
        className="container py-8 sm:py-12"
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-xl border p-8 bg-card flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{t("integrations_title")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("integrations_desc")}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register">
                <Button variant="outline" className="!text-white">Ro'yxatdan o'tish</Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <Button>{t("sign_in")}</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="container py-8 sm:py-12"
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          {t("testimonials_title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border p-6 bg-card"
          >
            {t("testimonial1")}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border p-6 bg-card"
          >
            {t("testimonial2")}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl border p-6 bg-card"
          >
            {t("testimonial3")}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
