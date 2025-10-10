import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

export default function Terms() {
  return (
    <section className="container py-10 sm:py-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
        >
          Oferta (Foydalanuvchi kelishuvi)
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="mt-3 text-sm sm:text-base text-muted-foreground">
          Ushbu kelishuv Torex-Talk xizmatlaridan foydalanish shartlarini belgilaydi. Xizmatdan foydalanish orqali siz ushbu shartlarga rozilik bildirgan hisoblanasiz.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Xizmatdan foydalanish</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Xizmat qonuniy maqsadlarda va amaldagi qonunchilikka muvofiq ishlatilishi lozim. Noqonuniy kontent tarqatish qat'iyan man etiladi.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={1} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Hisob va xavfsizlik</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hisob ma'lumotlarini sir saqlash foydalanuvchining zimmasida. Hisobingizdan amalga oshirilgan har qanday harakat uchun javobgarsiz.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={2} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">To'lovlar va qaytarish</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pullik rejalar uchun to'lovlar qaytarilmaydi, lekin qonunchilikda nazarda tutilgan hollarda istisnolar qo'llanilishi mumkin.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={3} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Cheklovlar</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Spam va zararli faoliyatlarga yo'l qo'yilmaydi</li>
            <li>Intellektual mulk huquqlariga rioya qiling</li>
            <li>Uchinchi tomon huquqlarini buzish taqiqlanadi</li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} className="md:col-span-2 rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">O'zgarishlar va kuchga kirishi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Oferta mazmuni vaqti-vaqti bilan yangilanishi mumkin. O'zgartirishlar e'lon qilingandan so'ng kuchga kiradi.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
