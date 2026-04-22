import { Shield, Clock, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import rioryVan from "@/assets/riory-van.jpeg";

const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="over-ons" className="section-padding bg-charcoal">
      <div className="section-container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-primary-foreground mb-5 leading-tight">
              {t("about.title")}
            </h2>
            <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-bold uppercase text-primary mb-5 leading-tight">
              {t("about.subtitle")}
            </h3>
            <div className="w-12 h-1 bg-primary mb-6" />
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/70 font-body leading-relaxed mb-6">
              {t("about.p1")}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/70 font-body leading-relaxed mb-8">
              {t("about.p2")}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Shield className="w-7 h-7 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-xs sm:text-sm">{t("about.reliable")}</h3>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/50 font-body mt-0.5">{t("about.reliableSub")}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Clock className="w-7 h-7 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-xs sm:text-sm">{t("about.available247")}</h3>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/50 font-body mt-0.5">{t("about.available247Sub")}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Award className="w-7 h-7 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-xs sm:text-sm">{t("about.fairPrice")}</h3>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/50 font-body mt-0.5">{t("about.fairPriceSub")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-primary-foreground/10 relative">
            <img
              src={rioryVan}
              alt="RIORY bedrijfswagen - Sterk in Rioleringswerk"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2">
              <span className="text-sm font-body font-medium text-white">{t("about.vanCaption")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
