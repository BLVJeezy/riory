import { Phone, ChevronRight } from "lucide-react";

const quickServices = [
  { label: "Dakgootreiniging", href: "#diensten" },
  { label: "Camera Inspectie", href: "#diensten" },
  { label: "Ontstoppingen & Geurdetectie", href: "#diensten" },
  { label: "Ledigen van Septische Putten", href: "#diensten" },
];

const EmergencyBanner = () => {
  return (
    <section className="bg-primary">
      {/* Phone bar */}
      <div className="py-5 md:py-6">
        <div className="section-container px-6 md:px-8">
          <a
            href="tel:+32472502814"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 group"
          >
            <div className="relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
                <Phone className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 bg-primary-foreground text-primary text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-full">
                24/7
              </span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs md:text-sm font-heading font-semibold uppercase tracking-wider text-primary-foreground/80">
                24/7 bereikbaar
              </p>
              <p className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground group-hover:underline transition-all">
                +32 (0)472 50 28 14
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Quick service links */}
      <div className="bg-charcoal/40 border-t border-primary-foreground/10">
        <div className="section-container px-6 md:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {quickServices.map((service) => (
              <a
                key={service.label}
                href={service.href}
                className="flex items-center justify-between gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded px-4 py-3 transition-colors group"
              >
                <span className="text-xs md:text-sm font-heading font-semibold uppercase tracking-wider text-primary-foreground leading-tight">
                  {service.label}
                </span>
                <ChevronRight className="w-4 h-4 text-primary-foreground/60 group-hover:text-primary-foreground shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyBanner;
