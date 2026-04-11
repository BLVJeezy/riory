import { useRef } from "react";
import { usePageView } from "@/hooks/usePageView";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import serviceOntstoppingen from "@/assets/service-ontstoppingen-geurdetectie.jpg";
import serviceLeidingen from "@/assets/service-leidingen-septisch.jpg";
import serviceCamera from "@/assets/service-camera-inspectie.jpg";
import serviceLeegpompen from "@/assets/service-leegpompen-reinigen.jpg";

const allServices = [
  { title: "Ontstoppingen en geurdetectie", description: "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen. Opsporing en verhelping van stankoverlast en rioolvliegjes.", image: serviceOntstoppingen },
  { title: "Leidingen en septische putten", description: "Professioneel ledigen en reinigen van septische putten, regenputten en aanleg of herstelling van leidingen.", image: serviceLeidingen },
  { title: "Camera-inspectie", description: "Gedetailleerde camera-inspectie van rioleringen om problemen snel en nauwkeurig te lokaliseren.", image: serviceCamera },
  { title: "Leegpompen en reinigen", description: "Leegpompen en reinigen bij wateroverlast, periodiek onderhoud en preventieve reiniging van uw rioleringssysteem.", image: serviceLeegpompen },
];

const Diensten = () => {
  usePageView("/diensten");
  const formRef = useRef<HTMLDivElement>(null);

  const handleRequestQuote = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-background min-h-screen">
        <div className="section-container px-6 md:px-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Terug naar home
              </Link>
            </Button>
          </div>

          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase text-foreground mb-4">
              Al Onze Diensten
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Van ontstoppingen tot camera-inspectie — wij bieden een compleet aanbod aan rioleringsdiensten, 24/7 beschikbaar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allServices.map((service) => (
              <div key={service.title} className="group relative h-64 rounded-lg overflow-hidden">
                <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-heading font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-sm text-white font-body leading-relaxed mb-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{service.description}</p>
                  <Button variant="cta" size="sm" onClick={() => handleRequestQuote()}>
                    Offerte aanvragen
                  </Button>
                </div>
              </div>
            ))}
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

export default Diensten;
