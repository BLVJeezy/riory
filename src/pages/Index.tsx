import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyBanner from "@/components/EmergencyBanner";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProjectsSection from "@/components/ProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";
import PriceCalculator from "@/components/PriceCalculator";
import AppointmentForm from "@/components/AppointmentForm";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyBanner from "@/components/EmergencyBanner";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProjectsSection from "@/components/ProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";
import PriceCalculator from "@/components/PriceCalculator";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";


const Index = () => {
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
      <PriceCalculator />
      <AppointmentForm />
      <FAQSection />
      <ContactSection />
      <Footer />
      
    </>
  );
};

export default Index;
