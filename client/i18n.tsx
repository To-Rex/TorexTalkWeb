import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "uz" | "en" | "ru";

const messages: Record<Locale, Record<string, string>> = {
  uz: {
    app_name: "Torex-Talk",
    tagline: "Telegram boshqaruvi va AI-avtojavob platformasi",
    get_started: "Boshlash",
    sign_in: "Kirish",
    dashboard: "Boshqaruv paneli",
    admin_panel: "Admin panel",
    features: "Xususiyatlar",
    pricing: "Tariflar",
    language: "Til",
    hero_title: "Telegram hisoblaringizni boshqaring, xabarlarni avtomatlashtiring",
    hero_sub: "Mass xabar yuborish, AI asosida avtojavob, rejalashtirish va tahlillar — barchasi bitta minimalistik ilovada.",
    cta_primary: "Ro'yxatdan o'tish",
    cta_secondary: "Tizimga kirish",
    feature_1_t: "Telegramga o'xshash chat interfeysi",
    feature_1_d: "Shaxsiy va guruh chatlar alohida, tezkor va qulay boshqaruv.",
    feature_2_t: "Mass xabar yuborish",
    feature_2_d: "Barcha shaxsiy chatlarga bir xil xabarni bir zumda jo'nating.",
    feature_3_t: "AI-avtojavob",
    feature_3_d: "Cheksiz Q&A yordamida o'zingizning AI modelangizni o'rgating.",
    feature_4_t: "Rejalashtirish va shablonlar",
    feature_4_d: "Xabarlarni keyinga qo'ying va matn shablonlarini saqlang.",
    feature_5_t: "Onlayn bildirishnomalar",
    feature_5_d: "Yangi xabarlar va avtojavob holatlari haqida darhol xabardor bo'ling.",
    feature_6_t: "Statistika va tahlillar",
    feature_6_d: "Yuborilgan xabarlar va faollik bo'yicha umumiy ko'rsatkichlar.",
    plans_title: "Obuna rejalar",
    plan_free: "Bepul / Basic",
    plan_plus: "Plus",
    plan_premium: "Premium",
    plan_free_benefit: "3 tagacha Telegram akkaunt",
    plan_plus_benefit: "10 tagacha Telegram akkaunt",
    plan_premium_benefit: "Cheksiz akkauntlar + kengaytirilgan AI",
    choose_plan: "Rejani tanlash",
    footer_rights: "Barcha huquqlar himoyalangan",
  },
  en: {
    app_name: "Torex-Talk",
    tagline: "Telegram management and AI auto-reply platform",
    get_started: "Get Started",
    sign_in: "Sign In",
    dashboard: "Dashboard",
    admin_panel: "Admin Panel",
    features: "Features",
    pricing: "Pricing",
    language: "Language",
    hero_title: "Manage Telegram accounts, automate messaging",
    hero_sub: "Mass messaging, AI auto-replies, scheduling and analytics in one minimal app.",
    cta_primary: "Sign up",
    cta_secondary: "Log in",
    feature_1_t: "Telegram-like chat UI",
    feature_1_d: "Private and Groups separated for fast control.",
    feature_2_t: "Mass messaging",
    feature_2_d: "Send one message to all private chats.",
    feature_3_t: "AI auto-reply",
    feature_3_d: "Train with unlimited Q&A pairs.",
    feature_4_t: "Scheduling & templates",
    feature_4_d: "Schedule messages and reuse templates.",
    feature_5_t: "Real-time notifications",
    feature_5_d: "Alerts for new messages and auto-replies.",
    feature_6_t: "Stats & analytics",
    feature_6_d: "Track sent messages and activity.",
    plans_title: "Subscription Plans",
    plan_free: "Free / Basic",
    plan_plus: "Plus",
    plan_premium: "Premium",
    plan_free_benefit: "Up to 3 Telegram accounts",
    plan_plus_benefit: "Up to 10 Telegram accounts",
    plan_premium_benefit: "Unlimited accounts + advanced AI",
    choose_plan: "Choose plan",
    footer_rights: "All rights reserved",
  },
  ru: {
    app_name: "Torex-Talk",
    tagline: "Управление Telegram и AI-автоответы",
    get_started: "Начать",
    sign_in: "Войти",
    dashboard: "Панель",
    admin_panel: "Админ-панель",
    features: "Возможности",
    pricing: "Тарифы",
    language: "Язык",
    hero_title: "Управляйте аккаунтами Telegram и автоматизируйте сообщения",
    hero_sub: "Массовые рассылки, AI-автоответы, расписание и аналитика в одном приложении.",
    cta_primary: "Зарегистрироваться",
    cta_secondary: "Войти",
    feature_1_t: "Интерфейс как в Telegram",
    feature_1_d: "Личные и группы отдельно для удобного управления.",
    feature_2_t: "Массовые сообщения",
    feature_2_d: "Отправляйте одно сообщение всем личным чатам.",
    feature_3_t: "AI-автоответ",
    feature_3_d: "Обучение без ограничений Q&A.",
    feature_4_t: "Расписание и шаблоны",
    feature_4_d: "Планируйте сообщения и используйте шаблоны.",
    feature_5_t: "Уведомления в реальном времени",
    feature_5_d: "Оповещения о новых сообщениях и автоответах.",
    feature_6_t: "Статистика и аналитика",
    feature_6_d: "Отслеживайте отправленные сообщения и активность.",
    plans_title: "Подписки",
    plan_free: "Бесплатный / Базовый",
    plan_plus: "Плюс",
    plan_premium: "Премиум",
    plan_free_benefit: "До 3 аккаунтов Telegram",
    plan_plus_benefit: "До 10 аккаунтов Telegram",
    plan_premium_benefit: "Безлимитные аккаунты + продвинутый AI",
    choose_plan: "Выбрать тариф",
    footer_rights: "Все права защищены",
  },
};

function detectLocale(): Locale {
  const saved = localStorage.getItem("tt_locale") as Locale | null;
  if (saved) return saved;
  const n = navigator.language.toLowerCase();
  if (n.startsWith("uz")) return "uz";
  if (n.startsWith("ru")) return "ru";
  return "en";
}

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz");

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = (l: Locale) => {
    localStorage.setItem("tt_locale", l);
    setLocaleState(l);
    document.documentElement.lang = l;
  };

  const t = useMemo(() => {
    return (key: string) => messages[locale]?.[key] ?? key;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
