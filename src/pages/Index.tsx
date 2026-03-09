import { useState } from "react";
import { usePageView } from "@/hooks/usePageView";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyBanner from "@/components/EmergencyBanner";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ReviewsSection from "@/components/ReviewsSection";
import QuoteEstimator from "@/components/QuoteEstimator";
import QuoteForm from "@/components/QuoteForm";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";

export interface EstimationData {
  projectType: string;
  length: string;
  groundType: string;
  location: string;
  min: number;
  max: number;
}

const Index = () => {
  const [estimation, setEstimation] = useState<EstimationData | null>(null);
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
      <QuoteEstimator onEstimationComplete={setEstimation} />
      <QuoteForm estimation={estimation} onClearEstimation={() => setEstimation(null)} />
      <ContactSection />
      <Footer />
      <ChatbotWidget />
    </>
  );
};

export default Index;
