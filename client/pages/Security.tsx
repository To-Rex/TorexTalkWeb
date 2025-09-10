import { motion } from "framer-motion";
import { ShieldCheck, Lock, KeyRound, Database, Activity, AlertTriangle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const Card = ({ icon: Icon, title, text, i = 0 }: { icon: any; title: string; text: string; i?: number }) => (
  <motion.div
    variants={fadeUp}
    custom={i}
    className="rounded-lg border bg-card text-card-foreground p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-primary/10 text-primary p-2">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  </motion.div>
);

export default function Security() {
  return (
    <section className="container py-10 sm:py-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-3xl mx-auto text-center">
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Ma'lumotlar xavfsizligi
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="mt-3 text-sm sm:text-base text-muted-foreground">
          Xavfsizlik – platformamiz asosiy ustuvor yo'nalishi. Biz zamonaviy standartlar va eng yaxshi amaliyotlarga tayanamiz.
        </motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
        <Card i={0} icon={Lock} title="Transportda shifrlash (TLS 1.3)" text="Barcha trafik HTTPS orqali himoyalanadi. HSTS va kuchli shifrlash to'plamlari qo'llaniladi." />
        <Card i={1} icon={Database} title="Saqlashda shifrlash (AES‑256)" text="Muhim ma'lumotlar AES‑256 bilan shifrlanadi, kalitlar alohida boshqariladi." />
        <Card i={2} icon={KeyRound} title="Kirish nazorati" text="Rolga asoslangan ruxsatlar, 2FA va sessiya himoyasi bilan nozik imkoniyatlar boshqariladi." />
        <Card i={3} icon={Activity} title="Monitoring va audit" text="Tizim voqealari, kirishlar va o'zgarishlar doimiy kuzatuv ostida. Shubhali faolliklar avtomatik aniqlanadi." />
        <Card i={4} icon={ShieldCheck} title="Zaxira va barqarorlik" text="Versiyalangan zaxira nusxalar, avtomatik tiklash sinovlari va ko'p zonali joylashtirish." />
        <Card i={5} icon={AlertTriangle} title="Hodisalar boshqaruvi" text="Aniq IR rejasi: aniqlash, cheklash, bartaraf etish va xabar berish bosqichlari." />
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Muvofiqlik va standartlar</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>GDPR tamoyillari: minimallashtirish, maqsadga bog'liqlik, shaffoflik</li>
            <li>CCPAga mos shaffoflik va o'chirish huquqlari</li>
            <li>OWASP ASVS amaliyotlari, statik/dinamik xavfsizlik tekshiruvlari</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
