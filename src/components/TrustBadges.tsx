import { Shield, Clock, Zap, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const TrustBadges = () => {
  const { t } = useTranslation();
  const badges = [
    { icon: Clock, label: t("trust.available") },
    { icon: Zap, label: t("trust.fastIntervention") },
    { icon: Star, label: t("trust.happyCustomers") },
    { icon: Shield, label: t("trust.certified") },
  ];

  return (
    <section className="bg-background border-t border-border">
      <div className="section-container px-4 md:px-8 py-3 md:py-4">
        <div className="grid grid-cols-2 md:flex md:justify-between gap-2 md:gap-4">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 md:bg-transparent md:text-foreground md:rounded-none md:px-3 md:py-2"
            >
              <badge.icon className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-heading font-semibold whitespace-nowrap md:text-sm md:font-bold">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
