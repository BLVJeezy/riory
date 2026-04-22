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
}

const LanguageSwitcher = ({ variant = "navbar" }: Props) => {
  const { lang, setLang } = useLanguage();
  const current = langs.find((l) => l.code === lang) ?? langs[0];

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-2 px-5 py-3">
        {langs.map((l) => (
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
      <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-body font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors">
        <Globe className="w-4 h-4" />
        {current.short}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {langs.map((l) => (
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
