import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import hasseltImgAsset from "@/assets/stad-hasselt.jpg.asset.json";

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
      image: hasseltImgAsset.url,
    },
    {
      slug: "genk",
      city: "Genk",
      question: t("regionsCallout.genkQuestion", { defaultValue: "Heb je problemen in Genk?" }),
      text: t("regionsCallout.genkText", {
        defaultValue: "Van verstopte WC tot rioollucht in huis: in Genk staan wij dag en nacht voor u klaar.",
      }),
      cta: t("regionsCallout.genkCta", { defaultValue: "Bekijk Genk" }),
      image: null as string | null,
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
              className="relative rounded-2xl overflow-hidden border border-border text-center flex flex-col items-center"
              style={region.image ? { backgroundImage: `url(${region.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
            >
              {region.image && <div className="absolute inset-0 bg-black/60" />}
              <div className={`relative z-10 p-6 md:p-8 flex flex-col items-center ${region.image ? "" : "bg-surface"}`}>
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className={`text-lg md:text-xl font-heading font-bold mb-2 ${region.image ? "text-white" : "text-foreground"}`}>
                {region.question}
              </h3>
              <p className={`text-sm font-body leading-relaxed mb-6 max-w-xs ${region.image ? "text-white/85" : "text-muted-foreground"}`}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegionsCalloutSection;
