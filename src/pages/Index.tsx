import { useEffect } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
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
import ArticlesTeaserSection from "@/components/ArticlesTeaserSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import RegionsCalloutSection from "@/components/RegionsCalloutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";
import AppointmentForm from "@/components/AppointmentForm";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";


const Index = () => {
  const { t } = useTranslation();
  const { lang, localizedPath } = useLanguage();
  usePageView("/");
  useDocumentMeta(
    t("homeSeo.metaTitle"),
    t("homeSeo.metaDescription"),
  );

  // Speakable markup voor de belangrijkste samenvatting op de homepage.
  useEffect(() => {
    const pagePath = lang === "nl" ? "/" : `/${lang}`;
    const pageUrl = `https://www.riory.be${pagePath}`;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld-home-speakable";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      inLanguage: lang === "nl" ? "nl-BE" : lang === "fr" ? "fr-BE" : "en",
      isPartOf: { "@id": "https://www.riory.be/#website" },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".hero-description", ".cta-phone"],
      },
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("jsonld-home-speakable")?.remove();
    };
  }, [lang]);


  return (
    <>
      <Navbar />
      <HeroSection />
      <EmergencyBanner />
      
      <ServicesSection />
      <CommonProblemsSection />
      <AboutSection />
      <ArticlesTeaserSection />
      <WhyChooseUs />
      <RegionsCalloutSection />
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
            {t("homeSeo.heading")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("homeSeo.paragraph1")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t("homeSeo.paragraph2")}
          </p>
        </div>
      </section>

      <Footer />
      
    </>
  );
};

export default Index;
