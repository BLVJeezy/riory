import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";

const EmergencyBanner = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();

  const quickServices = [
    { label: t("emergency.cameraInspection"), href: localizedPath("/diensten/camera-inspectie") },
    { label: t("emergency.unblocking"), href: localizedPath("/diensten/ontstoppingen-en-geurdetectie") },
    { label: t("emergency.septicTanks"), href: localizedPath("/diensten/leidingen-en-septische-putten") },
    { label: t("emergency.pumpingCleaning"), href: localizedPath("/diensten/leegpompen-en-reinigen") },
  ];

  return (
    <section className="bg-charcoal">
      <div className="section-container px-6 md:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {quickServices.map((service) => (
            <Link
              key={service.label}
              to={service.href}
              data-track-cta={`emergency_banner_${service.label}`}
              className="flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors group"
            >
              <span className="text-xs md:text-sm font-heading font-semibold uppercase tracking-wider text-white/80 leading-tight">
                {service.label}
              </span>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-primary shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencyBanner;
