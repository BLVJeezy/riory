import { useEffect } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { businessRatingSchema } from "@/data/reviews";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyBanner from "@/components/EmergencyBanner";

import ServicesSection from "@/components/ServicesSection";
import CommonProblemsSection from "@/components/CommonProblemsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProjectsSection from "@/components/ProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";
import AppointmentForm from "@/components/AppointmentForm";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";


const Index = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  usePageView("/");
  useDocumentMeta(
    "Ontstoppingsdienst Limburg 24/7 | Riool & Afvoer Verstopt | Riory",
    "Ontstoppingsdienst Limburg nodig? Riory is dé ontstoppingsdienst in Limburg — 24/7 bij verstopte afvoer, gootsteen, WC of riool in Bilzen, Hasselt, Genk & Tongeren. Bel nu!",
  );

  // Speakable schema + AggregateRating/Review schema voor GBP ranking
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld-home-speakable-reviews";
    script.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: "https://riory.be/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-description", ".cta-phone"],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://riory.be/#business",
        name: "Riory BV",
        url: "https://riory.be",
        telephone: "+32472502814",
        ...businessRatingSchema(),
      },
    ]);
    document.head.appendChild(script);
    return () => {
      document.getElementById("jsonld-home-speakable-reviews")?.remove();
    };
  }, []);


  return (
    <>
      <Navbar />
      <HeroSection />
      <EmergencyBanner />
      
      <ServicesSection />
      <CommonProblemsSection />
      <AboutSection />
      <WhyChooseUs />
      <ProjectsSection />
      <ReviewsSection />

      {/* Prijscalculator CTA */}
      <section id="prijscalculator" className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Calculator className="w-5 h-5" />
            <span className="font-heading font-semibold text-sm uppercase tracking-wider">
              {t("calculator.badge")}
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {t("calculator.stepCtaCalculator")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("calculator.stepCtaText")}
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to={localizedPath("/prijscalculator")}>
              {t("calculator.stepCtaButton")} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <AppointmentForm />
      <FAQSection />
      <ContactSection />

      {/* SEO content — Ontstoppingsdienst Limburg */}
      <section aria-labelledby="ontstoppingsdienst-limburg" className="py-12 md:py-16 bg-muted/30 border-t border-border/40">
        <div className="container max-w-4xl mx-auto px-4 space-y-4">
          <h2
            id="ontstoppingsdienst-limburg"
            className="font-heading text-2xl md:text-3xl font-bold text-foreground"
          >
            Ontstoppingsdienst Limburg — als het fout loopt, zijn wij er
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Na een hevige regenbui staat de kelder blank. De WC spoelt niet meer door op een zaterdagavond.
            De gootsteen loopt al drie dagen traag weg en nu staat het water stil. Dat zijn de momenten
            waarop mensen in Hasselt, Genk, Tongeren, Bilzen en de rest van Limburg ons bellen — en wij
            komen. Dag en nacht, ook in het weekend, ook op feestdagen.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Riory is een lokaal Limburgs bedrijf. Wij werken dagelijks in de regio en kennen het verschil
            tussen een rioolprobleem in een Tongerse stadswoning met negentiende-eeuwse leidingen en een
            verstopte septische put op een hoeve in Borgloon. Die lokale kennis betekent dat wij sneller
            de juiste diagnose stellen — en u minder tijd en geld kwijt bent. Vaste prijzen, geen
            verrassingen, altijd netjes achtergelaten.
          </p>
        </div>
      </section>

      <Footer />
      
    </>
  );
};

export default Index;

