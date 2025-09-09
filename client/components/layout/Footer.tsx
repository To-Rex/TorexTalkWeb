import { useI18n } from "@/i18n";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-background/50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-primary/15 to-transparent blur-2xl" />
      <div className="container py-8 sm:py-12 text-sm text-muted-foreground grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              TT
            </span>
            <div>
              <div className="font-semibold text-foreground">Torex-Talk</div>
              <div className="text-xs text-muted-foreground">
                Telegram manager
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed">
            Xabarlarni avtomatlashtirish, mass xabar va AI-avtojavoblar uchun
            qulay platforma.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://www.instagram.com/torex.dev/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border px-2 py-1 hover:bg-accent/30"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden
              >
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm11 1.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
              @torex.dev
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold text-foreground mb-2">Hujjatlar</div>
          <div className="flex flex-col gap-2">
            <Link to="/privacy" className="hover:underline">
              Maxfiylik siyosati
            </Link>
            <Link to="/security" className="hover:underline">
              Ma'lumotlar xavfsizligi
            </Link>
          </div>
        </div>

        <div>
          <div className="font-semibold text-foreground mb-2">
            Qo'llab-quvvatlash
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/help" className="hover:underline">
              Yordam
            </Link>
            <Link to="/partners" className="hover:underline">
              Hamkorlik
            </Link>
          </div>
        </div>

        <div>
          <div className="font-semibold text-foreground mb-2">Aloqa</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-secondary">
                📞
              </span>
              <a href="tel:+998995340313" className="underline">
                +99899 534 03 13
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-secondary">
                ✉️
              </span>
              <a href="mailto:dev.dilshodjon@gmail.com" className="underline">
                dev.dilshodjon@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-secondary">
                📷
              </span>
              <a
                href="https://www.instagram.com/torex.dev/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                @torex.dev
              </a>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-4 mt-2 border-t pt-4 text-center text-xs text-muted-foreground/70">
          © {year} Torex-Talk. {t("footer_rights")}.
        </div>
      </div>
    </footer>
  );
}
