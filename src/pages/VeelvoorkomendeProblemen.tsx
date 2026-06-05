import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, ShieldCheck, BadgeCheck, Wrench, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { commonProblems } from "@/data/services";
import { useLanguage } from "@/i18n/LanguageProvider";

const VeelvoorkomendeProblemen = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  usePageView("/veelvoorkomende-problemen");
  useDocumentMeta(
    t("commonProblems.metaTitle", {
      defaultValue: "Veel Voorkomende Problemen in Limburg | Riory BV",
    }),
    t("commonProblems.metaDescription", {
      defaultValue:
        "Verstopping, lek of nare geur? Riory lost veelvoorkomende riool- en afvoerproblemen zorgeloos op — 24/7 in heel Limburg.",
    })
  );
  const formRef = useRef<HTMLDivElement>(null);

  const usps = [
    { icon: Clock, label: t("common.available247", { defaultValue: "24/7 bereikbaar" }) },
    { icon: BadgeCheck, label: t("common.fixedPrices", { defaultValue: "Vaste prijzen" }) },
    { icon: Wrench, label: t("common.noBreaking", { defaultValue: "Geen breekwerk" }) },
    { icon: ShieldCheck, label: t("common.warranty", { defaultValue: "Garantie op werken" }) },
  ];

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-12 md:pb-16 bg-background min-h-screen">
        <div className="section-container px-6 md:px-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={localizedPath("/")} className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                {t("common.backHome")}
              </Link>
            </Button>
          </div>

          <div className="text-center mb-12">
            <span className="inline-block text-xs md:text-sm font-heading font-bold uppercase tracking-wider text-primary mb-3">
              {t("commonProblems.eyebrow", { defaultValue: "Zorgeloos opgelost door Riory" })}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase text-foreground mb-4">
              {t("commonProblems.h1", { defaultValue: "Veel Voorkomende Problemen in Limburg" })}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              {t("commonProblems.intro", {
                defaultValue:
                  "Een verstopt toilet, doucheputje vol haren of plots een lekkende kraan? Het overkomt iedereen. Riory BV staat 24/7 voor u klaar in heel Limburg en lost veelvoorkomende riool- en afvoerproblemen zorgeloos voor u op — met vaste prijzen, zonder breekwerk en met garantie.",
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto mb-14">
            {usps.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-muted/40 border border-border/60"
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                <span className="text-xs md:text-sm font-heading font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonProblems.map((service) => {
              const localTitle = t(`servicesData.${service.slug}.title`, { defaultValue: service.title });
              const localShort = t(`servicesData.${service.slug}.shortTitle`, {
                defaultValue: service.shortTitle || service.title,
              });
              const localDesc = t(`servicesData.${service.slug}.description`, { defaultValue: service.description });
              return (
                <div
                  key={service.slug}
                  className="group rounded-xl overflow-hidden bg-card border border-border flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={localTitle}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
                    <h2 className="absolute bottom-4 left-4 right-4 text-xl md:text-2xl font-heading font-bold text-white leading-tight">
                      {localShort}
                    </h2>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-5 flex-1">
                      {localDesc}
                    </p>
                    <Button variant="cta" size="sm" asChild className="w-fit">
                      <Link to={localizedPath(`/diensten/${service.slug}`)} className="gap-2">
                        {t("services.learnMore")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
              {t("commonProblems.ctaTitle", { defaultValue: "Probleem niet in de lijst?" })}
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto mb-6">
              {t("commonProblems.ctaText", {
                defaultValue:
                  "Bel ons gerust — wij helpen u verder met élk riool- of afvoerprobleem in Limburg, 24 uur per dag.",
              })}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="cta" size="lg" asChild>
                <Link to={localizedPath("/afspraak")} className="gap-2">
                  {t("common.appointment")} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <a
                href="tel:+32472502814"
                data-track-cta="vvp_page_urgent_tel"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
              >
                <Phone className="w-4 h-4" />
                {t("common.callNow")} 0472 50 28 14
              </a>
            </div>
          </div>
        </div>
      </section>
      <div ref={formRef}>
        <AppointmentForm />
      </div>
      <FAQSection />
      <Footer />
    </>
  );
};

export default VeelvoorkomendeProblemen;
