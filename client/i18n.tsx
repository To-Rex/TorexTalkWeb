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
    learn_more: "Batafsil",
    quick_features: "Asosiy xususiyatlar",
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
    billing_monthly: "Oyiga",
    billing_yearly: "Yiliga",
    yearly_saving: "2 oy bepul",
    includes: "Nimalar kiradi",
    all_plans_include: "Barcha tariflarda mavjud",
    popular: "Ommabop",
    compare_title: "Xususiyatlar taqqoslanishi",
    guarantee_title: "14 kunlik pulni qaytarish kafolati",
    guarantee_desc: "Agar platforma siz kutgan natijani bermasa, 14 kun ichida to'liq qaytarib beramiz.",
    contact_cta: "Savollaringiz bormi? Biz bilan bog'laning",
    label_seats: "Jamoa a'zolari",
    label_msgs: "Oylik xabar limiti",
    label_support: "Qo'llab-quvvatlash",
    label_api: "API kirish",
    label_integrations: "Integratsiyalar",
    label_audit: "Audit jurnallari",
    support_none: "Yo'q",
    support_business: "Ish vaqti",
    support_247: "24/7",
    payment_methods: "To'lov usullari",
    payment_list: "Visa, Mastercard, Payme, Click",
    faq_title: "Ko'p so'raladigan savollar",
    faq_q1: "Qanday to'lov usullari mavjud?",
    faq_a1: "Visa/Mastercard, mahalliy to'lov tizimlari (Payme/Click) va invois orqali to'lash mumkin.",
    faq_q2: "Obunani istalgan payt bekor qila olamanmi?",
    faq_a2: "Ha, istalgan vaqtda bekor qilishingiz mumkin. Keyingi davr uchun to'lov olinmaydi.",
    faq_q3: "Hisoblar cheklovi qanday?",
    faq_a3: "Basic: 3 ta, Plus: 10 ta, Premium: cheksiz akkauntlar qo'llab-quvvatlanadi.",
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
    learn_more: "Learn more",
    quick_features: "Key features",
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
    billing_monthly: "Monthly",
    billing_yearly: "Yearly",
    yearly_saving: "2 months free",
    includes: "What's included",
    all_plans_include: "All plans include",
    popular: "Most popular",
    compare_title: "Feature comparison",
    guarantee_title: "14-day money-back guarantee",
    guarantee_desc: "If it's not a fit, get a full refund within 14 days.",
    contact_cta: "Have questions? Contact us",
    label_seats: "Team seats",
    label_msgs: "Monthly message limit",
    label_support: "Support",
    label_api: "API access",
    label_integrations: "Integrations",
    label_audit: "Audit logs",
    support_none: "None",
    support_business: "Business hours",
    support_247: "24/7",
    payment_methods: "Payment methods",
    payment_list: "Visa, Mastercard, Payme, Click",
    faq_title: "Frequently Asked Questions",
    faq_q1: "What payment methods are supported?",
    faq_a1: "Visa/Mastercard, local providers, and invoicing are supported.",
    faq_q2: "Can I cancel anytime?",
    faq_a2: "Yes. Cancel anytime and you'll not be charged for the next period.",
    faq_q3: "Are there account limits?",
    faq_a3: "Basic: 3, Plus: 10, Premium: unlimited Telegram accounts.",
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
    learn_more: "Подробнее",
    quick_features: "Ключевые возможности",
    feature_1_t: "Интерфейс как в Telegram",
    feature_1_d: "Личные и группы отдельно для удобного управления.",
    feature_2_t: "Массовые сообщ��ния",
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
    billing_monthly: "Ежемесячно",
    billing_yearly: "Ежегодно",
    yearly_saving: "2 меся��а бесплатно",
    includes: "Что включено",
    all_plans_include: "Во всех тарифах",
    popular: "Популярный",
    compare_title: "Сравнение возможностей",
    guarantee_title: "Гарантия возврата 14 дней",
    guarantee_desc: "Если сервис вам не подошёл — полный возврат в течение 14 дней.",
    contact_cta: "Остались вопросы? Свяжитесь с нами",
    label_seats: "Места в команде",
    label_msgs: "Лимит сообщений в месяц",
    label_support: "Поддержка",
    label_api: "Доступ к API",
    label_integrations: "Интеграции",
    label_audit: "Журналы аудита",
    support_none: "Нет",
    support_business: "В рабочие часы",
    support_247: "24/7",
    payment_methods: "Способы оплаты",
    payment_list: "Visa, Mastercard, Payme, Click",
    faq_title: "Частые вопросы",
    faq_q1: "Какие способы оплаты доступны?",
    faq_a1: "Поддерживаются Visa/Mastercard, локальные провайдеры и оплата по счёту.",
    faq_q2: "Могу ли я отменить в любое время?",
    faq_a2: "Да, отмена в любой момент. Следующий период не будет списан.",
    faq_q3: "Есть ли ограничения по аккаунтам?",
    faq_a3: "Basic: 3, Plus: 10, Premium: без ограничений на аккаунты Telegram.",
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
