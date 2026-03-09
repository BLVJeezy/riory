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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {quickServices.map((service) => (
            <a
              key={service.label}
              href={service.href}
              className="flex items-center justify-between gap-2 bg-background/5 hover:bg-background/10 rounded px-4 py-3 transition-colors group"
            >
              <span className="text-xs md:text-sm font-heading font-semibold uppercase tracking-wider text-background/80 leading-tight">
                {service.label}
              </span>
              <ChevronRight className="w-4 h-4 text-background/40 group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencyBanner;
