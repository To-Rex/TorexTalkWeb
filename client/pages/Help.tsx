import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }),
};

export default function Help() {
  return (
    <section className="container py-10 sm:py-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-3xl mx-auto text-center">
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Yordam markazi
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="mt-3 text-sm sm:text-base text-muted-foreground">
          Savollaringiz bormi? Quyidagi tez-tez beriladigan savollar va yo'riqnomalar yordam beradi.
        </motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-6 md:grid-cols-3">
        <motion.div variants={fadeUp} className="rounded-lg border p-6">
          <h2 className="font-semibold">Boshlash</h2>
          <p className="mt-2 text-sm text-muted-foreground">Ro'yxatdan o'tish, birinchi sozlamalar, tariflar haqida.</p>
        </motion.div>
        <motion.div variants={fadeUp} custom={1} className="rounded-lg border p-6">
          <h2 className="font-semibold">Hisob va to'lov</h2>
          <p className="mt-2 text-sm text-muted-foreground">To'lov usullari, hisob-fakturalar, qayta to'lash.</p>
        </motion.div>
        <motion.div variants={fadeUp} custom={2} className="rounded-lg border p-6">
          <h2 className="font-semibold">Texnik yordam</h2>
          <p className="mt-2 text-sm text-muted-foreground">Kirish muammolari, integratsiyalar, xatoliklarni tuzatish.</p>
        </motion.div>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 max-w-3xl mx-auto">
        <motion.h2 variants={fadeUp} className="text-xl font-semibold">Tez-tez beriladigan savollar</motion.h2>
        <Accordion type="single" collapsible className="mt-4 divide-y rounded-lg border">
          <AccordionItem value="item-1" className="px-4">
            <AccordionTrigger className="text-left">Qanday ro'yxatdan o'taman?</AccordionTrigger>
            <AccordionContent>
              "Ro'yxatdan o'tish" sahifasiga o'ting, email va kuchli parol kiriting, so'ng tasdiqlash havolasini bosing.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="px-4">
            <AccordionTrigger className="text-left">Parolimni unutdim, nima qilay?</AccordionTrigger>
            <AccordionContent>
              "Parolni tiklash" orqali email manzilingizni kiriting, yuborilgan havola yordamida yangi parol o'rnating.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="px-4">
            <AccordionTrigger className="text-left">Qo'llab-quvvatlash bilan qanday bog'lanaman?</AccordionTrigger>
            <AccordionContent>
              "Aloqa" sahifasidagi forma orqali murojaat qiling. Odatda 24–48 soat ichida javob beramiz.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 max-w-3xl mx-auto">
        <motion.div variants={fadeUp} className="rounded-lg border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Hali ham yordam kerakmi?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Bizning jamoa dushanba–juma, 09:00–18:00 (GMT+5) ishlaydi.</p>
          </div>
          <Button asChild>
            <Link to="/contact">Aloqa sahifasiga o'tish</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
