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
  Check,
} from "lucide-react";
import { allLocations } from "@/data/locations";
import { allServices } from "@/data/services";
import rioryVanAsset from "@/assets/riory-van-2.png.asset.json";
import fotoOntstopping from "@/assets/refs/ontstopping-afvoerput-1.webp";
import fotoCamera from "@/assets/service-camera-inspectie.webp";
import fotoSeptisch from "@/assets/refs/septisch-1.webp";
import fotoRegenput from "@/assets/refs/regenput-1.webp";
import { businessRatingSchema, SYMPTOM_SERVICE_SLUGS } from "@/data/reviews";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SERVICE_APPROACH: Record<string, string> = {
  "ontstoppingen-en-geurdetectie":
    "We bepalen eerst waar de blokkade zit en kiezen daarna de minst ingrijpende oplossing. Waar nodig gebruiken we professionele hogedrukreiniging of aanvullende detectie om ook de oorzaak van terugkerende problemen aan te pakken.",
  "camera-inspectie":
    "Met camera-apparatuur bekijken we de leiding van binnenuit. Zo kunnen we verstoppingen, verzakkingen, breuken of wortelgroei gericht lokaliseren zonder onnodig kap- of breekwerk.",
  "septische-put-ledigen":
    "We ledigen de put gecontroleerd met professionele zuigapparatuur en kijken tegelijk naar signalen van overbelasting, verstopping of terugslag. Zo weet u niet alleen dat de put leeg is, maar ook of verdere actie nodig is.",
  "leegpompen-en-reinigen":
    "Bij wateroverlast pompen we eerst veilig leeg en zoeken we vervolgens naar de oorzaak. Bij regenputten en andere reservoirs combineren we leegpompen waar nodig met reiniging en controle van aan- en afvoer.",
};

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

  const FR_REGION_SLUGS = new Set(["luik", "rocourt", "juprelle", "ans", "milmort", "vottem", "chenee"]);
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
        "@type": "LocalBusiness",
        name: "Riory BV",
        "@id": "https://www.riory.be/#business",
        url: "https://www.riory.be",
        telephone: "+32472502814",
        email: "info@riory.be",
        description:
          "Riory BV is uw loodgieter en ontstoppingsdienst in Limburg. 24/7 bereikbaar voor loodgieterwerk, rioolentstoppingen, camera-inspectie en septische put ledigen.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Natveld 47",
          addressLocality: "Bilzen-Hoeselt",
          addressRegion: "Limburg",
          postalCode: "3740",
          addressCountry: "BE",
        },
        areaServed: [
          "Bilzen", "Hasselt", "Genk", "Tongeren", "Hoeselt",
          "Sint-Truiden", "Diepenbeek", "Riemst", "Wellen",
          "Zutendaal", "Alken", "Borgloon", "Kortessem", "Vliermaal", "Vreren",
        ],
        openingHours: "Mo-Su 00:00-24:00",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
          },
        ],
        geo: {
          "@type": "GeoCoordinates",
          latitude: "50.8681",
          longitude: "5.5134",
        },
        hasMap: "https://maps.google.com/?q=Riory+BV+Bilzen",
        priceRange: "€€",
        paymentAccepted: "Cash, Bancontact",
        currenciesAccepted: "EUR",
        ...businessRatingSchema(),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Diensten Riory BV",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Loodgieter" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ontstoppingsdienst" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Camera-inspectie riolering" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Septische put ledigen" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rioolreiniging hogedruk" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Geurdetectie riolering" } },
          ],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: ["Loodgieter", "Ontstoppingsdienst"],
        areaServed: { "@type": "City", name: location.city },
        provider: {
          "@type": "LocalBusiness",
          name: "Riory BV",
          "@id": "https://www.riory.be/#business",
        },
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

          <div className="max-w-5xl mx-auto mb-12 md:mb-16 grid lg:grid-cols-2 gap-8 items-start">
            <div>
              {location.introParagraphs ? (
                <div className="mb-6 space-y-4">
                  <p className="text-lg md:text-xl font-heading font-bold text-foreground leading-snug">
                    {location.introParagraphs[0]}
                  </p>
                  {location.introParagraphs.slice(1).map((para, i) => (
                    <p key={i} className="text-base md:text-lg text-muted-foreground font-body leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed mb-6">
                  {localIntro}
                </p>
              )}

              {location.serviceBullets && (
                <>
                  <h2 className="text-lg md:text-xl font-heading font-bold text-foreground mb-4">
                    Onze ontstoppingsdiensten in {location.city}
                  </h2>
                  <ul className="space-y-2.5 mb-6">
                    {location.serviceBullets.map((item) => (
                      <li key={item.title} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-foreground font-body">
                          <strong>{item.title}:</strong> {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h2 className="text-lg md:text-xl font-heading font-bold text-foreground mb-4">
                Waarom Riory in {location.city}?
              </h2>
              <ul className="space-y-2.5">
                {(location.whyChooseUs || [
                  `24/7 bereikbaar in ${location.city} — ook weekend en feestdagen`,
                  `Doorgaans binnen 1 à 2 uur ter plaatse in ${location.city}`,
                  `Geen rijkosten binnen ${location.city} (postcode ${location.postalCode})`,
                  "Vaste, transparante prijzen — geen verrassingen op de factuur",
                  "Professionele hogedrukapparatuur, camera-inspectie en zuigwagens",
                  "Zonder breekwerk waar mogelijk, altijd netjes achtergelaten",
                  "Verzekerd, gecertificeerd en met garantie op de werken",
                ]).map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-foreground font-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { src: fotoOntstopping, alt: `Ontstoppingsdienst aan het werk in ${location.city}` },
                { src: fotoCamera, alt: `Camera-inspectie riolering in ${location.city}` },
                { src: fotoSeptisch, alt: `Septische put ledigen in ${location.city}` },
                { src: fotoRegenput, alt: `Regenput reinigen en leegpompen in ${location.city}` },
              ].map((img) => (
                <img
                  key={img.alt}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-32 md:h-44 object-cover rounded-xl border border-border"
                />
              ))}
              <img
                src={rioryVanAsset.url}
                alt={`Riory servicewagen onderweg naar een klant in ${location.city}`}
                loading="lazy"
                className="col-span-2 w-full h-32 md:h-44 object-cover rounded-xl border border-border"
              />
            </div>
          </div>

          {/* Uitgebreide lokale diensten: elke dienst krijgt een eigen semantische SEO-sectie. */}
          <div className="max-w-5xl mx-auto mb-10 md:mb-14">
            <div className="max-w-3xl mb-7">
              <p className="text-xs font-heading font-bold uppercase tracking-[0.18em] text-primary mb-2">
                Lokale expertise
              </p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                Riolerings- en ontstoppingsdiensten in {location.city}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed">
                Van een eenvoudige verstopte afvoer tot een terugkerend probleem diep in de riolering: Riory combineert lokale bereikbaarheid met professionele apparatuur en een gerichte diagnose.
              </p>
            </div>

            <div className="space-y-5 md:space-y-7">
              {location.services.map((svc, index) => {
                const svcImage = allServices.find((s) => s.slug === svc.slug)?.image;
                const approach = SERVICE_APPROACH[svc.slug];
                return (
                  <article
                    key={svc.slug}
                    className="grid md:grid-cols-[280px_1fr] gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  >
                    {svcImage && (
                      <img
                        src={svcImage}
                        alt={`${svc.title} in ${location.city}`}
                        loading="lazy"
                        className="w-full h-48 md:h-full min-h-[220px] object-cover"
                      />
                    )}
                    <div className="p-5 md:p-7 lg:p-8">
                      <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-primary mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {location.city} · dienst {index + 1}
                      </div>
                      <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
                        {svc.title}
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-3">
                        {svc.description}
                      </p>
                      {approach && (
                        <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-5">
                          {approach}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
                          <Link to={localizedPath(`/diensten/${svc.slug}`)}>
                            {t("services.learnMore")}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                        <button
                          type="button"
                          onClick={handleScrollToForm}
                          data-track-cta={`locatie_service_${svc.slug}_appointment`}
                          className="inline-flex items-center rounded-full px-4 py-2 text-sm font-heading font-semibold text-primary hover:bg-primary/10 transition-colors"
                        >
                          Afspraak in {location.city}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Midden-CTA op het beslismoment, na de lokale diensten. */}
          <div className="max-w-5xl mx-auto mb-12 md:mb-16 rounded-2xl bg-charcoal overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
            <div className="relative p-6 md:p-9 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-primary font-heading font-bold text-xs uppercase tracking-[0.18em] mb-2">
                  Hulp nodig in {location.city}?
                </p>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  Snel duidelijkheid over uw rioolprobleem
                </h2>
                <p className="text-white/70 font-body text-sm md:text-base leading-relaxed">
                  Vertel ons wat er aan de hand is. We bekijken welke aanpak nodig is en plannen de interventie zo snel mogelijk in. Bij een dringend probleem kunt u ons 24/7 bellen.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
                <Button
                  variant="cta"
                  size="lg"
                  data-track-cta="locatie_mid_appointment"
                  className="rounded-full"
                  onClick={handleScrollToForm}
                >
                  {t("common.appointment")}
                </Button>
                <a
                  href="tel:+32472502814"
                  data-track-cta="locatie_mid_urgent_tel"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" />
                  0472 50 28 14
                </a>
              </div>
            </div>
          </div>

          {/* Werkwijze / expertise: versterkt vertrouwen zonder commerciële claims te verzinnen. */}
          <div className="max-w-5xl mx-auto mb-12 md:mb-16">
            <div className="max-w-3xl mb-6">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
                Zo pakken we een rioolprobleem in {location.city} aan
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed">
                Niet elk probleem vraagt dezelfde machine of dezelfde ingreep. Daarom werken we in drie duidelijke stappen: eerst lokaliseren, dan gericht oplossen en tot slot controleren.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Probleem lokaliseren",
                  body: "We luisteren naar de symptomen en bepalen waar de oorzaak waarschijnlijk zit. Bij terugkerende of onduidelijke problemen kan een camera-inspectie helpen.",
                },
                {
                  step: "02",
                  title: "Gericht oplossen",
                  body: "We kiezen de techniek die bij het probleem past, zoals mechanische ontstopping, hogedrukreiniging, leegpompen of professionele zuigapparatuur.",
                },
                {
                  step: "03",
                  title: "Controleren & adviseren",
                  body: "Na de interventie controleren we of alles opnieuw goed functioneert en geven we praktisch advies wanneer onderhoud of een vervolgstap zinvol is.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-heading font-bold text-sm mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.body}</p>
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
              Veelvoorkomende problemen die wij oplossen in {location.city}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                "Verstopte WC die niet meer doorspoelt",
                "Trage of verstopte gootsteen en keukenafvoer",
                "Doucheputje verstopt door haren en zeepresten",
                "Rioollucht in huis, kelder of garage",
                "Volle septische put of beerput die overloopt",
                "Kelder onder water na hevige regenval",
                "Verstopte regenput of dakgoot",
                "Terugkerende verstoppingen door wortels of vetprop",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-muted-foreground font-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Onze diensten in [Stad] — interne mesh naar alle dienstpagina's */}
          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
              Loodgieter &amp; Ontstoppingsdienst {location.city}
            </h2>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Onze diensten in {location.city}:
            </p>
            <div className="flex flex-wrap gap-2">
              {allServices.map((s) => (
                <Link
                  key={s.slug}
                  to={localizedPath(`/diensten/${s.slug}`)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs md:text-sm font-heading font-semibold transition-colors ${
                    (SYMPTOM_SERVICE_SLUGS as readonly string[]).includes(s.slug)
                      ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {s.shortTitle || s.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
              {t("locatieDetail.nearbyTitle", { city: location.city })}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-4">
              Riory is ook actief in de omliggende gemeenten. Bekijk de lokale informatie voor een regio in de buurt van {location.city}:
            </p>
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
                    Ontstoppingsdienst {area}
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

          {location.cta && (
            <div className="max-w-3xl mx-auto mb-8 md:mb-10 text-center">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
                {location.cta.title}
              </h2>
              <p className="text-base text-muted-foreground font-body mb-6">
                {location.cta.body}
              </p>
            </div>
          )}

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="cta"
              size="lg"
              data-track-cta="locatie_bottom_appointment"
              className="rounded-full"
              onClick={handleScrollToForm}
            >
              {t("common.appointment")}
            </Button>
            <a
              href="tel:+32472502814"
              data-track-cta="locatie_bottom_urgent_tel"
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
