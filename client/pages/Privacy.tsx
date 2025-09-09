import { useI18n } from "@/i18n";

export default function Privacy() {
  const { t } = useI18n();
  return (
    <section className="container py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        Maxfiylik siyosati
      </h1>
      <p className="text-sm text-muted-foreground">
        Ushbu sahifada biz foydalanuvchi ma'lumotlarining maxfiyligi va ularni
        qayta ishlash tartibi haqida ma'lumot beramiz.
      </p>
    </section>
  );
}
