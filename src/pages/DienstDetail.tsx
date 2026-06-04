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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const serviceToReferenceSlug: Record<string, string> = {
  "ontstoppingen-en-geurdetectie": "ontstoppingen-en-geurdetectie",
  "septische-put-ledigen": "ledigen-van-septische-putten",
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

  // Per-service JSON-LD (Service + FAQPage) + SEO meta — dynamisch voor elke dienst met faq.
  useEffect(() => {
    if (!service) return;

    const PAGE_URL = `https://riory.be/diensten/${service.slug}`;
    const IMAGE_URL = `https://riory.be${service.image}`;
    const serviceName = service.shortTitle || service.title;
    const serviceType = service.serviceType || serviceName;
    const imageAlt = `${serviceName} — Riory`;

    const setOrCreate = (
      tag: "meta" | "link",
      keyAttr: string,
      keyValue: string,
      valueAttr: string,
      value: string,
    ): { el: Element; created: boolean; prev: string | null } => {
      let el = document.head.querySelector(`${tag}[${keyAttr}="${keyValue}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement(tag);
        el.setAttribute(keyAttr, keyValue);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute(valueAttr);
      el.setAttribute(valueAttr, value);
      return { el, created, prev };
    };

    const managed = [
      setOrCreate("meta", "name", "robots", "content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"),
      setOrCreate("meta", "name", "geo.region", "content", "BE-VLI"),
      setOrCreate("meta", "name", "geo.placename", "content", "Limburg, België"),
      setOrCreate("meta", "name", "geo.position", "content", "50.8741;5.5167"),
      setOrCreate("meta", "name", "ICBM", "content", "50.8741, 5.5167"),
      setOrCreate("meta", "property", "og:type", "content", "website"),
      setOrCreate("meta", "property", "og:image", "content", IMAGE_URL),
      setOrCreate("meta", "property", "og:image:alt", "content", imageAlt),
      setOrCreate("meta", "property", "og:url", "content", PAGE_URL),
      setOrCreate("meta", "property", "og:site_name", "content", "Riory — Sterk in Rioleringswerk"),
      setOrCreate("meta", "name", "twitter:card", "content", "summary_large_image"),
      setOrCreate("meta", "name", "twitter:image", "content", IMAGE_URL),
      setOrCreate("meta", "name", "author", "content", "Riory BV"),
      setOrCreate("meta", "name", "publisher", "content", "Riory BV"),
      setOrCreate("link", "rel", "canonical", "href", PAGE_URL),
    ];

    const blocks: object[] = [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: serviceName,
        serviceType,
        description: service.description,
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
          areaServed: ["Bilzen", "Hasselt", "Genk", "Tongeren", "Hoeselt"],
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
        url: PAGE_URL,
      },
    ];

    if (service.faq && service.faq.length > 0) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-service", service.slug);
    script.text = JSON.stringify(blocks);
    document.head.appendChild(script);
    return () => {
      script.remove();
      managed.forEach(({ el, created, prev }) => {
        if (created) {
          el.remove();
        } else if (prev !== null) {
          el.setAttribute("content", prev);
          el.setAttribute("href", prev);
        }
      });
    };
  }, [service]);


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
