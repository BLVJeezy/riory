import { useRef } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { allServices } from "@/data/services";

const Diensten = () => {
  usePageView("/diensten");
  useDocumentMeta(
    "Rioleringsdiensten Limburg | Ontstopping, Camera & Septische Put | Riory",
    "Alle rioleringsdiensten van Riory: ontstopping, camera-inspectie, septische put ledigen & leegpompen. ✓ 24/7 ✓ Vaste prijzen ✓ Heel Limburg. Plan nu in!"
  );
  const formRef = useRef<HTMLDivElement>(null);

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
              Rioleringsdiensten in Limburg
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Van ontstoppingen tot camera inspectie riool — Riory biedt een compleet aanbod aan rioleringsdiensten in Bilzen, Hasselt, Genk en heel Limburg. 24/7 beschikbaar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allServices.map((service) => (
              <div key={service.slug} className="group rounded-lg overflow-hidden bg-card border border-border">
                <div className="relative h-52 overflow-hidden">
                  <img src={service.image} alt={service.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-lg font-heading font-bold text-white">{service.shortTitle || service.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{service.description}</p>
                  <Button variant="cta" size="sm" asChild>
                    <Link to={`/diensten/${service.slug}`} className="gap-2">
                      Meer weten
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
