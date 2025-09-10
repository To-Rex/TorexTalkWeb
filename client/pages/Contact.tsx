import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Phone, Mail, Instagram } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function Contact() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent("Yangi xabar");
    const body = encodeURIComponent(
      `Ism: ${data.get("name")}\nEmail: ${data.get("email")}\nTelefon: ${data.get("phone")}\n\nXabar:\n${data.get("message")}`,
    );
    window.location.href = `mailto:dev.dilshodjon@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section className="container py-10 sm:py-16">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-3xl mx-auto text-center">
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Aloqa
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="mt-3 text-sm sm:text-base text-muted-foreground">
          Savolingiz yoki taklifingiz bormi? Quyidagi forma orqali bizga yozing yoki to'g'ridan-to'g'ri bog'laning.
        </motion.p>
      </motion.div>

      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-10 grid gap-8 md:grid-cols-2">
        <motion.form variants={fadeUp} onSubmit={onSubmit} className="rounded-lg border bg-card text-card-foreground p-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Ism</label>
            <Input name="name" placeholder="Ismingiz" required className="mt-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" placeholder="email@namuna.uz" required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Telefon</label>
              <Input name="phone" type="tel" placeholder="+998 90 123 45 67" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Xabar</label>
            <Textarea name="message" rows={5} placeholder="Xabaringizni yozing..." required className="mt-1" />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Yuborish</Button>
          </div>
        </motion.form>

        <div className="space-y-6">
          <motion.div variants={fadeUp} custom={1} className="rounded-lg border p-6">
            <h2 className="font-semibold">Tezkor aloqa</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href="tel:+998995340313" className="underline">+99899 534 03 13</a></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href="mailto:dev.dilshodjon@gmail.com" className="underline">dev.dilshodjon@gmail.com</a></div>
              <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-primary" /><a href="https://www.instagram.com/torex.dev/" target="_blank" rel="noreferrer" className="underline">@torex.dev</a></div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="rounded-lg border overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <iframe
                title="Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=69.241%2C41.299%2C69.301%2C41.329&layer=mapnik"
                className="w-full h-full grayscale-[20%] contrast-110 opacity-90"
                loading="lazy"
              />
            </AspectRatio>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
