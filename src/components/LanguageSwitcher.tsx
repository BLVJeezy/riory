import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/i18n/config";

const langs: { code: Language; label: string; short: string }[] = [
  { code: "nl", label: "Nederlands", short: "NL" },
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
];

interface Props {
  variant?: "navbar" | "mobile";
  textClassName?: string;
}

const LanguageSwitcher = ({ variant = "navbar", textClassName }: Props) => {
  const { lang, setLang, availableLanguages } = useLanguage();
  const availableLangs = langs.filter(({ code }) => availableLanguages.includes(code));
  const current = availableLangs.find((l) => l.code === lang) ?? availableLangs[0] ?? langs[0];

  // Hide a self-only selector. On a legacy prefixed URL, keep the sole
  // canonical language visible so the visitor can leave the non-equivalent URL.
  if (availableLangs.length === 1 && availableLangs[0].code === lang) return null;

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2 px-5 py-3">
        {availableLangs.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`text-xs font-heading font-bold px-2.5 py-1 rounded transition-colors ${
              l.code === lang
                ? "bg-primary text-primary-foreground"
                : "text-white/60 hover:text-white"
            }`}
          >
            {l.short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex items-center gap-1.5 text-sm font-body font-semibold uppercase tracking-wider transition-colors ${textClassName || "text-foreground hover:text-primary"}`}>
        <Globe className="w-4 h-4" />
        {current.short}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {availableLangs.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={l.code === lang ? "font-bold text-primary" : ""}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
