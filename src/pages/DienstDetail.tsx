import { useParams, Link, Navigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, ArrowRight, Phone, Star, ShieldCheck, Clock } from "lucide-react";
import { allServices } from "@/data/services";
import { referenceCategories } from "@/data/references";
import { useLanguage } from "@/i18n/LanguageProvider";

const serviceToReferenceSlug: Record<string, string> = {
  "ontstoppingen-en-geurdetectie": "ontstoppingen-en-geurdetectie",
  "leidingen-en-septische-putten": "ledigen-van-septische-putten",
  "camera-inspectie": "dakgootreinigingen",
  "leegpompen-en-reinigen": "leegpompen-en-reinigen",
};

const DienstDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const service = allServices.find((s) => s.slug === slug);
  const formRef = useRef<HTMLDivElement>(null);

  const localTitle = service ? t(`servicesData.${service.slug}.title`, { defaultValue: service.title }) : "";
  const localLong = service ? t(`servicesData.${service.slug}.longDescription`, { defaultValue: service.longDescription }) : "";
  const localH2 = service ? t(`servicesData.${service.slug}.h2Title`, { defaultValue: service.h2Title }) : "";
  const localFeatures = service ? (t(`servicesData.${service.slug}.features`, { returnObjects: true, defaultValue: service.features }) as string[]) : [];
  const localMetaTitle = service ? t(`servicesData.${service.slug}.metaTitle`, { defaultValue: service.metaTitle }) : undefined;
  const localMetaDesc = service ? t(`servicesData.${service.slug}.metaDescription`, { defaultValue: service.metaDescription }) : undefined;

  usePageView(`/diensten/${slug}`);
  useDocumentMeta(localMetaTitle, localMetaDesc);

  // Per-service JSON-LD (Service + FAQPage) for SEO-targeted slugs
  useEffect(() => {
    if (slug !== "ontstoppingen-en-geurdetectie") return;
    const blocks: object[] = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Ontstoppingsdienst Limburg",
        serviceType: "Ontstoppingsdienst, gootsteen ontstoppen, afvoer verstopt",
        provider: {
          "@type": "LocalBusiness",
          name: "Riory BV",
          telephone: "+32472502814",
          email: "info@riory.be",
          url: "https://riory.be",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Tongersestraat 12",
            postalCode: "3740",
            addressLocality: "Bilzen",
            addressRegion: "Limburg",
            addressCountry: "BE",
          },
        },
        areaServed: [
          { "@type": "AdministrativeArea", name: "Limburg" },
          { "@type": "City", name: "Bilzen" },
          { "@type": "City", name: "Hasselt" },
          { "@type": "City", name: "Genk" },
          { "@type": "City", name: "Tongeren" },
          { "@type": "City", name: "Hoeselt" },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          servicePhone: "+32472502814",
          availableLanguage: ["nl", "fr", "en"],
        },
        hoursAvailable: "Mo-Su 00:00-23:59",
        url: "https://riory.be/diensten/ontstoppingen-en-geurdetectie",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Wat kost een ontstoppingsdienst in Limburg?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Riory werkt met vaste, transparante prijzen voor ontstoppingen in Limburg. U weet vooraf wat u betaalt, zonder verrassingen achteraf. Vraag een afspraak aan voor een correcte prijsindicatie.",
            },
          },
          {
            "@type": "Question",
            name: "Mijn gootsteen is verstopt in Limburg — hoe snel zijn jullie ter plaatse?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bij een verstopte gootsteen in Limburg is Riory doorgaans binnen 2 uur ter plaatse in Bilzen, Hasselt, Genk, Tongeren, Hoeselt en omstreken. We zijn 24/7 bereikbaar voor noodgevallen.",
            },
          },
          {
            "@type": "Question",
            name: "Hoe wordt een afvoer ontstopt?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Een verstopte afvoer wordt door Riory ontstopt met professionele hogedrukreiniging en, indien nodig, met camera-inspectie om de exacte oorzaak op te sporen — zonder breekwerk.",
            },
          },
          {
            "@type": "Question",
            name: "Is Riory 24/7 beschikbaar in heel Limburg?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, Riory is dé ontstoppingsdienst van Limburg en is 24 uur op 24, 7 dagen op 7 bereikbaar voor noodontstoppingen in heel de provincie.",
            },
          },
        ],
      },
    ];

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-service", slug);
    script.text = JSON.stringify(blocks);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [slug]);

  if (!service) {
    return <Navigate to={localizedPath("/diensten")} replace />;
  }

  const handleRequestQuote = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refSlug = slug ? serviceToReferenceSlug[slug] : undefined;
  const refCategory = refSlug
    ? referenceCategories.find((c) => c.slug === refSlug)
    : undefined;
  const refCategoryTitle = refCategory ? t(`referencesData.${refCategory.slug}.title`, { defaultValue: refCategory.title }) : "";

  return (
    <>
      <Navbar />
      <section className="pt-20 md:pt-24 pb-16 md:pb-20 bg-background min-h-screen">
        <div className="section-container px-4 md:px-8">
          <div className="mb-2 md:mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={localizedPath("/diensten")} className="gap-2 text-muted-foreground hover:text-foreground text-xs md:text-sm">
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {t("common.backServices")}
              </Link>
            </Button>
          </div>

          <div className="relative h-[21rem] md:h-[28rem] rounded-xl overflow-hidden mb-5 md:mb-6">
            <img
              src={service.image}
              alt={localTitle}
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
              <h1 className="text-lg md:text-4xl font-heading font-bold text-white uppercase leading-tight mb-2.5 md:mb-4">
                {localTitle}
              </h1>

              <div className="flex flex-row items-center gap-2 sm:gap-3 mb-2.5 md:mb-4">
                <Button variant="cta" size="default" data-track-cta="dienst_top_appointment" className="rounded-full text-xs md:text-base px-4 md:px-6 h-9 md:h-11" onClick={handleRequestQuote}>
                  {t("common.appointment")}
                </Button>
                <a
                  href="tel:+32472502814"
                  data-track-cta="dienst_top_urgent_tel"
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

          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground font-body leading-relaxed mb-10">
              {localLong}
            </p>

            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              {localH2}
            </h2>
            <ul className="space-y-4 mb-10">
              {localFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground font-body">{feature}</span>
                </li>
              ))}
            </ul>

            {refCategory && (
              <div className="mb-10 p-6 rounded-xl bg-muted/50 border border-border">
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  {t("dienstDetail.viewReferences")}
                </h3>
                <p className="text-sm text-muted-foreground font-body mb-4">
                  {t("dienstDetail.referenceIntro", { name: refCategoryTitle })}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  {refCategory.projects.flatMap((p) => p.images).slice(0, 8).map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`${refCategoryTitle} ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
                  <Link to={localizedPath(`/referenties/${refCategory.slug}`)}>
                    {t("common.viewAllProjects")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button variant="cta" size="lg" data-track-cta="dienst_bottom_appointment" className="rounded-full" onClick={handleRequestQuote}>
                {t("common.appointment")}
              </Button>
              <a
                href="tel:+32472502814"
                data-track-cta="dienst_bottom_urgent_tel"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
              >
                <AlertTriangle className="w-4 h-4" />
                {t("common.urgentCallNow")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div ref={formRef}>
        <AppointmentForm />
      </div>
      <Footer />
    </>
  );
};

export default DienstDetail;
