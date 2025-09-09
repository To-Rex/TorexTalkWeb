import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

export default function Features() {
  const { t } = useI18n();
  return (
    <section className="container py-10 sm:py-14">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        {t("features")}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border p-6 bg-card"
          >
            <div className="size-10 rounded-md bg-primary/15 text-primary grid place-items-center mb-4">
              {i}
            </div>
            <h3 className="font-semibold mb-2">{t(`feature_${i}_t`)}</h3>
            <p className="text-sm text-muted-foreground">
              {t(`feature_${i}_d`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
