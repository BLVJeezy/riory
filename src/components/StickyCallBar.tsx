import { Phone } from "lucide-react";

const StickyCallBar = () => {
  return (
    <a
      href="tel:+32472502814"
      data-track-cta="sticky_mobile_call"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-green-600 text-white font-heading font-bold text-sm uppercase tracking-wide py-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] active:bg-green-700"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <Phone className="w-5 h-5 fill-white" />
      <span>BELLEN — 24/7 Beschikbaar</span>
    </a>
  );
};

export default StickyCallBar;
