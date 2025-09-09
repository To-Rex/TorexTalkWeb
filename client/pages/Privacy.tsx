import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" } }),
};

export default function Privacy() {
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
          Maxfiylik siyosati
        </motion.h1>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="mt-3 text-sm sm:text-base text-muted-foreground"
        >
          Sizning ishonchingiz biz uchun eng muhim qadriyat. Biz ma'lumotlaringizni adolatli, shaffof va xavfsiz asosda qayta ishlaymiz.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2"
      >
        <motion.div variants={fadeUp} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Yig'iladigan ma'lumotlar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hisob yaratishda taqdim etilgan ism, email, telefon; foydalanish loglari va qurilma ma'lumotlari; to'lovga oid tranzaksiya rekvizitlari (agar qo'llanilsa).
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Xizmatdan foydalanish statistikasi</li>
            <li>Texnik diagnostika ma'lumotlari</li>
            <li>Foydalanuvchi afzalliklari</li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} custom={1} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Foydalanish maqsadlari</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Xizmatni ko'rsatish, takomillashtirish, qo'llab-quvvatlash va xavfsizlikni ta'minlash; qonuniy majburiyatlarni bajarish hamda firibgarlikning oldini olish.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={2} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Cookie va shunga o'xshash texnologiyalar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sessiyani boshqarish, afzalliklarni eslab qolish va faoliyatni tahlil qilish uchun foydalanamiz. Brauzer sozlamalaridan cookie'larni cheklashingiz mumkin.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={3} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Saqlash muddati</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ma'lumotlar maqsadga erishish uchun zarur bo'lgan muddat davomida saqlanadi, so'ngra xavfsiz tarzda o'chiriladi yoki anonimlashtiriladi.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Foydalanuvchi huquqlari</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Kirish va nusxa olish</li>
            <li>O'zgartirish va yangilash</li>
            <li>O'chirish va cheklash</li>
            <li>Rozilikni qaytarib olish</li>
            <li>Shikoyat qilish huquqi</li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} className="rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Ulashish va uchinchi tomonlar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ishonchli subpudratchilar bilan faqat zarur bo'lgan hajmda va shartnomaviy himoya choralari asosida ulashamiz. Hech qachon ma'lumotlaringizni noqonuniy sotmaymiz.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={6} className="md:col-span-2 rounded-lg border bg-card text-card-foreground p-6">
          <h2 className="text-lg font-semibold">Bog'lanish</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Maxfiylik bo'yicha savollar uchun "Aloqa" sahifasi orqali murojaat qiling. So'rovlaringizga 48 soat ichida javob beramiz.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
