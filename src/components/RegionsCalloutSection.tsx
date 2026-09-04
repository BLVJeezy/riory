import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";

const RegionsCalloutSection = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();

  const regions = [
    {
      slug: "hasselt",
      city: "Hasselt",
      question: t("regionsCallout.hasseltQuestion", { defaultValue: "Heb je problemen in Hasselt?" }),
      text: t("regionsCallout.hasseltText", {
        defaultValue: "Verstopte afvoer, riool of septische put in Hasselt? Wij zijn 24/7 snel ter plaatse.",
      }),
      cta: t("regionsCallout.hasseltCta", { defaultValue: "Bekijk Hasselt" }),
    },
    {
      slug: "genk",
      city: "Genk",
      question: t("regionsCallout.genkQuestion", { defaultValue: "Heb je problemen in Genk?" }),
      text: t("regionsCallout.genkText", {
        defaultValue: "Van verstopte WC tot rioollucht in huis: in Genk staan wij dag en nacht voor u klaar.",
      }),
      cta: t("regionsCallout.genkCta", { defaultValue: "Bekijk Genk" }),
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-primary mb-2">
            {t("regionsCallout.eyebrow", { defaultValue: "Werkzaam in uw regio" })}
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-foreground">
            {t("regionsCallout.title", { defaultValue: "Riory in Hasselt & Genk" })}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {regions.map((region) => (
            <div
              key={region.slug}
              className="rounded-2xl bg-surface border border-border p-6 md:p-8 text-center flex flex-col items-center"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-2">
                {region.question}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6 max-w-xs">
                {region.text}
              </p>
              <Button variant="cta" asChild>
                <Link
                  to={localizedPath(`/regio/${region.slug}`)}
                  data-track-cta={`home_region_callout_${region.slug}`}
                  className="gap-2"
                >
                  {region.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsCalloutSection;
