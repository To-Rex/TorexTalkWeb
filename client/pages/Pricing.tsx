import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => {
    const controls = animate(count, value, { duration: 0.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value]);
  return <motion.span>{rounded}</motion.span>;
}

function AnimatedPrice({ price, period }: { price: { monthly: number; yearly: number }; period: "monthly" | "yearly" }) {
  const val = period === "monthly" ? price.monthly : price.yearly;
  const suffix = period === "monthly" ? "/mo" : "/yr";
  return (
    <div className="text-3xl font-extrabold mb-2">
      $<AnimatedNumber value={val} />{suffix}
    </div>
  );
}

export default function Pricing() {
  const { t } = useI18n();
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = useMemo(
    () => [
      {
        id: "free",
        name: t("plan_free"),
        benefit: t("plan_free_benefit"),
        price: { monthly: 0, yearly: 0 },
        features: [t("feature_2_t"), t("feature_4_t"), t("feature_5_t")],
        cta: t("choose_plan"),
      },
      {
        id: "plus",
        name: t("plan_plus"),
        benefit: t("plan_plus_benefit"),
        price: { monthly: 12, yearly: 120 },
        features: [
          t("feature_2_t"),
          t("feature_3_t"),
          t("feature_4_t"),
          t("feature_5_t"),
          t("feature_6_t"),
        ],
        cta: t("choose_plan"),
      },
      {
        id: "premium",
        name: t("plan_premium"),
        benefit: t("plan_premium_benefit"),
        price: { monthly: 29, yearly: 290 },
        features: [
          t("feature_1_t"),
          t("feature_2_t"),
          t("feature_3_t"),
          t("feature_4_t"),
          t("feature_5_t"),
          t("feature_6_t"),
        ],
        cta: t("choose_plan"),
      },
    ],
    [t],
  );

  const comparison = [
    { label: t("label_seats"), free: "1", plus: "3", premium: "10" },
    { label: t("label_msgs"), free: "1 000", plus: "50 000", premium: "500 000" },
    { label: t("label_support"), free: t("support_none"), plus: t("support_business"), premium: t("support_247") },
    { label: t("label_api"), free: false, plus: true, premium: true },
    { label: t("label_integrations"), free: true, plus: true, premium: true },
    { label: t("label_audit"), free: false, plus: false, premium: true },
  ] as const;

  return (
    <section className="container py-10 sm:py-14 relative">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 bg-gradient-to-b from-primary/15 to-transparent blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      <div className="mb-8 sm:mb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl sm:text-4xl font-extrabold"
        >
          {t("plans_title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {t("includes")} · {t("feature_2_t")} · {t("feature_3_t")} · {t("feature_6_t")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-5 inline-flex items-center rounded-full border bg-card p-1 text-xs relative"
          role="tablist"
          aria-label="Billing period"
        >
          <button
            role="tab"
            aria-selected={period === "monthly"}
            onClick={() => setPeriod("monthly")}
            className={`relative z-10 rounded-full px-3 py-1.5 transition-colors ${
              period === "monthly" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("billing_monthly")}
          </button>
          <button
            role="tab"
            aria-selected={period === "yearly"}
            onClick={() => setPeriod("yearly")}
            className={`relative z-10 rounded-full px-3 py-1.5 transition-colors ${
              period === "yearly" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("billing_yearly")}
          </button>
          <motion.span
            layout
            className="absolute h-8 rounded-full bg-primary/10"
            style={{ width: "50%" }}
            animate={{ left: period === "monthly" ? 0 : "50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <AnimatePresence>{period === "yearly" ? (
            <motion.span
              key="saving"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="ml-3 hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary"
            >
              <Sparkles className="h-3 w-3" /> {t("yearly_saving")}
            </motion.span>
          ) : null}</AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="grid md:grid-cols-3 gap-4 sm:gap-6"
      >
        {plans.map((p) => (
          <motion.div
            key={p.id}
            variants={{ hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className={`relative rounded-2xl border bg-card p-6 flex flex-col overflow-hidden ${
              p.id === "plus" ? "ring-2 ring-primary/60" : ""
            }`}
          >
            {p.id === "plus" ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary"
              >
                <Sparkles className="h-3 w-3" /> {t("popular")}
              </motion.div>
            ) : null}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="text-sm text-muted-foreground mb-1">{p.name}</motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={period + p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                <AnimatedPrice price={p.price} period={period} />
              </motion.div>
            </AnimatePresence>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.05 }} className="text-sm text-muted-foreground mb-4">{p.benefit}</motion.p>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="space-y-2 mb-6">
              {p.features.map((f) => (
                <motion.div key={f} variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{f}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto">
              <Button className="w-full">{p.cta}</Button>
            </motion.div>

            <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <motion.div
                className="absolute -inset-6 rounded-3xl bg-primary/10 blur-2xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              {p.id === "plus" ? (
                <motion.div
                  className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                  animate={{ backgroundPositionX: ["0%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 100%" }}
                />
              ) : null}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12">
        <motion.h3 initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25 }} className="text-xl font-semibold mb-4">{t("all_plans_include")}</motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {["feature_1_t", "feature_2_t", "feature_3_t", "feature_4_t", "feature_5_t", "feature_6_t"].map((k, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm"
            >
              <Check className="h-4 w-4 text-primary" /> {t(k)}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <motion.h3 initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25 }} className="text-xl font-semibold mb-4">{t("compare_title")}</motion.h3>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-xl border">
          <div className="grid grid-cols-4 bg-secondary px-3 py-2 text-xs font-semibold">
            <div />
            <div>{t("plan_free")}</div>
            <div>{t("plan_plus")}</div>
            <div>{t("plan_premium")}</div>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="divide-y">
            {comparison.map((row) => (
              <motion.div key={row.label} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }} className="grid grid-cols-4 items-center px-3 py-3 text-sm">
                <div className="text-muted-foreground">{row.label}</div>
                {[row.free, row.plus, row.premium].map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {typeof v === "boolean" ? (
                      v ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>{v}</motion.span>
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="mt-12 rounded-xl border bg-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">{t("guarantee_title")}</div>
          <div className="text-sm text-muted-foreground">{t("guarantee_desc")}</div>
          <div className="mt-2 text-xs text-muted-foreground">{t("payment_methods")}: {t("payment_list")}</div>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button>{t("contact_cta")}</Button>
        </motion.div>
      </motion.div>

      <div className="mt-12">
        <motion.h3 initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.25 }} className="text-xl font-semibold mb-4">{t("faq_title")}</motion.h3>
        <Accordion type="single" collapsible className="rounded-xl border bg-card">
          <AccordionItem value="q1" className="px-4">
            <AccordionTrigger className="text-left">{t("faq_q1")}</AccordionTrigger>
            <AccordionContent>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>{t("faq_a1")}</motion.div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2" className="px-4">
            <AccordionTrigger className="text-left">{t("faq_q2")}</AccordionTrigger>
            <AccordionContent>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>{t("faq_a2")}</motion.div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3" className="px-4">
            <AccordionTrigger className="text-left">{t("faq_q3")}</AccordionTrigger>
            <AccordionContent>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>{t("faq_a3")}</motion.div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 bottom-0 inset-x-0 h-32 bg-gradient-to-t from-primary/10 to-transparent blur-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
    </section>
  );
}
