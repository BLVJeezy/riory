import { Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageProvider";

const StickyCallBar = () => {
  const { localizedPath } = useLanguage();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-3 pt-2"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href="tel:+32472502814"
        data-track-cta="sticky_mobile_call"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-xs uppercase tracking-wide py-2.5 px-3 shadow-[0_4px_20px_hsl(var(--urgent)/0.4)] active:scale-95 transition-transform"
      >
        <Phone className="w-3.5 h-3.5 fill-current" />
        <span>Bel 24/7</span>
      </a>
      <Link
        to={localizedPath("/afspraak")}
        data-track-cta="sticky_mobile_appointment"
        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground font-heading font-bold text-xs uppercase tracking-wide py-2.5 px-3 shadow-[0_4px_20px_hsl(var(--primary)/0.4)] active:scale-95 transition-transform"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Maak afspraak</span>
      </Link>
    </div>
  );
};

export default StickyCallBar;
