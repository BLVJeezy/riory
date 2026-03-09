import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyBanner from "@/components/EmergencyBanner";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import QuoteEstimator from "@/components/QuoteEstimator";
import QuoteForm from "@/components/QuoteForm";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";

const Index = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <EmergencyBanner />
      <ServicesSection />
      <ProjectsSection />
      <QuoteEstimator />
      <QuoteForm />
      <AboutSection />
      <ContactSection />
      <Footer />
      <ChatbotWidget />
    </>
  );
};

export default Index;
