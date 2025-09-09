import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export default function Pricing() {
  const { t } = useI18n();
  const plans = [
    { name: t("plan_free"), benefit: t("plan_free_benefit"), price: "0$" },
    { name: t("plan_plus"), benefit: t("plan_plus_benefit"), price: "12$/mo" },
    {
      name: t("plan_premium"),
      benefit: t("plan_premium_benefit"),
      price: "29$/mo",
    },
  ];
  return (
    <section className="container py-10 sm:py-14">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        {t("plans_title")}
      </h2>
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((p, idx) => (
          <div
            key={p.name}
            className={`rounded-xl border p-6 bg-card flex flex-col ${idx === 2 ? "ring-2 ring-primary" : ""}`}
          >
            <div className="text-sm text-muted-foreground mb-1">{p.name}</div>
            <div className="text-3xl font-extrabold mb-2">{p.price}</div>
            <p className="text-sm text-muted-foreground mb-6">{p.benefit}</p>
            <Button className="mt-auto">{t("choose_plan")}</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
