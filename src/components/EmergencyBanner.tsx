import { Phone } from "lucide-react";

const EmergencyBanner = () => {
  return (
    <section className="bg-primary py-6 md:py-8">
      <div className="section-container px-6 md:px-8">
        <a
          href="tel:+32472502814"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 group"
        >
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
              <Phone className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 bg-primary-foreground text-primary text-xs font-heading font-bold px-2 py-0.5 rounded-full">
              24/7
            </span>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm md:text-base font-heading font-semibold uppercase tracking-wider text-primary-foreground/80">
              24/7 bereikbaar
            </p>
            <p className="text-2xl md:text-4xl font-heading font-bold text-primary-foreground group-hover:underline transition-all">
              +32 (0)472 50 28 14
            </p>
          </div>
        </a>
      </div>
    </section>
  );
};

export default EmergencyBanner;
