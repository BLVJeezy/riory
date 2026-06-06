import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { commonProblems } from "@/data/services";

const CommonProblemsSection = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();

  return (
    <section id="veelvoorkomende-problemen" className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="inline-block text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-primary mb-3">
            {t("commonProblems.eyebrow", { defaultValue: "Zorgeloos opgelost door Riory" })}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
            {t("commonProblems.sectionTitle", { defaultValue: "Veel Voorkomende Problemen" })}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            {t("commonProblems.sectionDescription", {
              defaultValue:
                "Verstopping, lek of nare geur? Riory lost het zorgeloos voor u op — 24/7 in heel Limburg.",
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {commonProblems.map((service, idx) => {
            const localTitle = t(`servicesData.${service.slug}.title`, { defaultValue: service.title });
            const localShort = t(`servicesData.${service.slug}.shortTitle`, {
              defaultValue: service.shortTitle || service.title,
            });
            // Show first 4 on mobile, first 3 on desktop
            const hideOnMobile = idx >= 4;
            const hideOnDesktop = idx >= 3;
            if (hideOnMobile && hideOnDesktop) return null;
            return (
              <Link
                key={service.slug}
                to={localizedPath(`/diensten/${service.slug}`)}
                className={`group block ${hideOnDesktop ? "md:hidden" : ""} ${hideOnMobile ? "hidden md:block" : ""}`}
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={localTitle}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                    <h3 className="text-sm md:text-xl font-heading font-bold text-white leading-tight">
                      {localShort}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>


        <div className="text-center mt-10 px-4">
          <Button variant="cta" size="lg" asChild className="w-full sm:w-auto h-auto min-h-11 py-3 px-6 whitespace-normal text-center text-sm sm:text-base leading-tight">
            <Link to={localizedPath("/veelvoorkomende-problemen")} className="gap-2">
              <span className="sm:hidden">{t("commonProblems.viewAllShort", { defaultValue: "Bekijk alle problemen" })}</span>
              <span className="hidden sm:inline">{t("commonProblems.viewAll", { defaultValue: "Bekijk alle veelvoorkomende problemen" })}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommonProblemsSection;
