import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

export default function Partners() {
  return (
    <section className="container py-10 sm:py-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-3xl mx-auto text-center">
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Hamkorlik dasturi
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="mt-3 text-sm sm:text-base text-muted-foreground">
          Birgalikda tezroq o'sing: texnologik integratsiyalar, reseller va affiliate yo'nalishlari.
        </motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-6 md:grid-cols-3">
        <motion.div variants={fadeUp} className="rounded-lg border p-6">
          <h3 className="font-semibold">Texnologik hamkor</h3>
          <p className="mt-2 text-sm text-muted-foreground">API/integratsiyalar, qo'shma roadmap va birgalikdagi tadqiqotlar.</p>
        </motion.div>
        <motion.div variants={fadeUp} custom={1} className="rounded-lg border p-6">
          <h3 className="font-semibold">Reseller</h3>
          <p className="mt-2 text-sm text-muted-foreground">Savdo qo'llab-quvvatlovi, marketing materiallari, maxsus shartlar.</p>
        </motion.div>
        <motion.div variants={fadeUp} custom={2} className="rounded-lg border p-6">
          <h3 className="font-semibold">Affiliate</h3>
          <p className="mt-2 text-sm text-muted-foreground">Referal havolalar, komissiyalar va kuzatuv paneli.</p>
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-4 sm:grid-cols-3">
        {["Shaffof komissiyalar", "Qo'shma marketing", "Texnik yordam"].map((b, i) => (
          <motion.div key={b} variants={fadeUp} custom={i} className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
            {b}
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 max-w-3xl mx-auto">
        <motion.div variants={fadeUp} className="rounded-lg border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Hamkor bo'lishni xohlaysizmi?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Qisqa ariza yuboring, jamoamiz tez orada bog'lanadi.</p>
          </div>
          <Button asChild>
            <Link to="/contact">Ariza yuborish</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
