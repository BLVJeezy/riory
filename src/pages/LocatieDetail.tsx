import { useParams, Link, Navigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  AlertTriangle,
  Clock,
  Star,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { allLocations } from "@/data/locations";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LocatieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const location = allLocations.find((l) => l.slug === slug);
  const formRef = useRef<HTMLDivElement>(null);

  const localH1 = location ? t(`locationsData.${location.slug}.h1`, { defaultValue: location.h1 }) : "";
  const localIntro = location ? t(`locationsData.${location.slug}.intro`, { defaultValue: location.intro }) : "";
  const localMetaTitle = location ? t(`locationsData.${location.slug}.metaTitle`, { defaultValue: location.metaTitle }) : undefined;
  const localMetaDesc = location ? t(`locationsData.${location.slug}.metaDescription`, { defaultValue: location.metaDescription }) : undefined;

  const FR_REGION_SLUGS = new Set(["luik", "rocourt", "juprelle", "ans", "milmort", "vottem"]);
  const xDefaultLang = slug && FR_REGION_SLUGS.has(slug) ? "fr" : "nl";

  usePageView(`/regio/${slug}`);
  useDocumentMeta(localMetaTitle, localMetaDesc, { xDefaultLang });

  useEffect(() => {
    if (!location) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `jsonld-location-${slug}`;
    script.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Plumber",
        name: "Riory BV",
        description: `24/7 ontstopping-, riool- & ruimdienst in ${location.city} en heel Limburg`,
        url: `https://riory.be/regio/${location.slug}`,
        telephone: "+32472502814",
        email: "info@riory.be",
        priceRange: "€€",
        image: "https://riory.be/favicon.svg",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Groenstraat 16",
          addressLocality: location.city,
          postalCode: location.postalCode,
          addressRegion: "Limburg",
          addressCountry: "BE",
        },
        areaServed: { "@type": "City", name: location.city },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "50" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: location.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ]);

    document.head.appendChild(script);
    return () => {
      document.getElementById(`jsonld-location-${slug}`)?.remove();
    };
  }, [location, slug]);

  if (!location) {
    return <Navigate to={localizedPath("/")} replace />;
  }

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <section className="pt-20 md:pt-24 pb-16 md:pb-20 bg-background min-h-screen">
        <div className="section-container px-4 md:px-8">
          <div className="mb-4 md:mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link
                to={localizedPath("/")}
                className="gap-2 text-muted-foreground hover:text-foreground text-xs md:text-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {t("common.backHome")}
              </Link>
            </Button>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-charcoal p-6 md:p-12 mb-8 md:mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-primary mb-3">
                <MapPin className="w-5 h-5" />
                <span className="font-heading font-semibold text-sm uppercase tracking-wider">
                  {location.city}, Limburg
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-white uppercase leading-tight mb-4 md:mb-6">
                {localH1}
              </h1>

              <div className="flex flex-row items-center gap-2 sm:gap-3 mb-4">
                <Button
                  variant="cta"
                  size="default"
                  data-track-cta="locatie_top_appointment"
                  className="rounded-full text-xs md:text-base px-4 md:px-6 h-9 md:h-11"
                  onClick={handleScrollToForm}
                >
                  {t("common.appointment")}
                </Button>
                <a
                  href="tel:+32472502814"
                  data-track-cta="locatie_top_urgent_tel"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 md:px-6 md:py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-[11px] md:text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
                >
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{t("common.callNow")} </span>0472 50 28 14
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-1 text-white/80 text-[11px] md:text-sm font-heading">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                  {t("common.available247")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-400 fill-yellow-400" />
                  {t("common.googleReviews")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                  {t("common.insuredCertified")}
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              {localIntro}
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              {t("locatieDetail.ourServicesIn", { city: location.city })}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {location.services.map((svc) => (
                <div
                  key={svc.slug}
                  className="bg-card border border-border rounded-xl p-5 md:p-6 flex flex-col"
                >
                  <h3 className="text-base md:text-lg font-heading font-bold text-foreground mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-1">
                    {svc.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 self-start"
                    asChild
                  >
                    <Link to={localizedPath(`/diensten/${svc.slug}`)}>
                      {t("services.learnMore")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              {t("locatieDetail.faqTitle", { city: location.city })}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {location.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-body leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
              {t("locatieDetail.nearbyTitle", { city: location.city })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {location.nearbyAreas.map((area) => {
                const areaLocation = allLocations.find((l) => l.city === area);
                return areaLocation ? (
                  <Link
                    key={area}
                    to={localizedPath(`/regio/${areaLocation.slug}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card hover:bg-accent text-sm font-heading font-semibold text-foreground transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {area}
                  </Link>
                ) : (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm font-heading font-semibold text-muted-foreground"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {area}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="cta"
              size="lg"
              className="rounded-full"
              onClick={handleScrollToForm}
            >
              {t("common.appointment")}
            </Button>
            <a
              href="tel:+32472502814"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
            >
              <AlertTriangle className="w-4 h-4" />
              {t("common.urgentCallNow")}
            </a>
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

export default LocatieDetail;
