import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  const { t } = useI18n();
  const bullets = (i: number) => [
    t(`feature_${i}_b1`),
    t(`feature_${i}_b2`),
    t(`feature_${i}_b3`),
  ];

  return (
    <section className="container py-10 sm:py-14 relative">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 bg-gradient-to-b from-primary/15 to-transparent blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      <div className="text-center mb-8 sm:mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl sm:text-4xl font-extrabold"
        >
          {t("features")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {t("features_sub")}
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative rounded-xl border p-6 bg-card overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25 }}
              className="size-10 rounded-md bg-primary/15 text-primary grid place-items-center mb-4"
            >
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                {i}
              </motion.span>
            </motion.div>

            <motion.h3 className="font-semibold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.25 }}>
              {t(`feature_${i}_t`)}
            </motion.h3>
            <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.05 }}>
              {t(`feature_${i}_d`)}
            </motion.p>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-4 space-y-2 text-sm"
            >
              {bullets(i).map((b, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="flex items-center gap-2"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
              <motion.div
                className="absolute -inset-6 rounded-3xl bg-primary/10 blur-2xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

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
