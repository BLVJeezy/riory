import { ChevronRight } from "lucide-react";

const quickServices = [
  { label: "Dakgootreiniging", href: "#diensten" },
  { label: "Camera Inspectie", href: "#diensten" },
  { label: "Ontstoppingen & Geurdetectie", href: "#diensten" },
  { label: "Ledigen van Septische Putten", href: "#diensten" },
];

const EmergencyBanner = () => {
  return (
    <section className="bg-charcoal">
      <div className="section-container px-6 md:px-8 py-4">
        <div className="flex overflow-x-auto gap-2 md:gap-3 md:grid md:grid-cols-4 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory">
          {quickServices.map((service) => (
            <a
              key={service.label}
              href={service.href}
              className="flex items-center gap-2 bg-background/5 hover:bg-background/10 rounded px-4 py-3 transition-colors group shrink-0 min-w-[160px] md:min-w-0 snap-start"
            >
              <span className="text-[11px] md:text-sm font-heading font-semibold uppercase tracking-wider text-background/80 leading-tight whitespace-nowrap md:whitespace-normal">
                {service.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-background/40 group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencyBanner;
