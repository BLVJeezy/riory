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
  useDocumentMeta();

  return (
    <>
      <Navbar />
      <HeroSection />
      <EmergencyBanner />
      
      <ServicesSection />
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
      <Footer />
      
    </>
  );
};

export default Index;
