import { useI18n, Locale } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const langs: { code: Locale; label: string }[] = [
  { code: "uz", label: "Oʻzbek" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export default function LanguageSwitcher({
  mode = "inline",
}: {
  mode?: "inline" | "menu";
}) {
  const { locale, setLocale } = useI18n();
  if (mode === "menu") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/80">
            <span>
              {langs.find((l) => l.code === locale)?.label ?? "Language"}
            </span>
            <svg
              className="h-4 w-4 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M6 9l6 6 6-6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {langs.map((l) => (
            <DropdownMenuItem key={l.code} onClick={() => setLocale(l.code)}>
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-muted" />
              {l.label}
              {locale === l.code ? (
                <span className="ml-auto text-xs">✓</span>
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <div className="flex items-center gap-1">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-2 py-1 rounded-md text-xs transition-colors ${
            locale === l.code
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
