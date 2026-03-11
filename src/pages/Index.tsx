import { usePageView } from "@/hooks/usePageView";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyBanner from "@/components/EmergencyBanner";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";
import QuoteForm from "@/components/QuoteForm";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";

const Index = () => {
  usePageView("/");

  return (
    <>
      <Navbar />
      <HeroSection />
      <EmergencyBanner />
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <ReviewsSection />
      <QuoteForm />
      <FAQSection />
      <ContactSection />
      <Footer />
      <ChatbotWidget />
    </>
  );
};

export default Index;
