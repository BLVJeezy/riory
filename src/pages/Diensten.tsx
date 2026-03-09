import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import serviceSeptisch from "@/assets/service-septisch.jpg";
import serviceRegenput from "@/assets/service-regenput.jpg";
import serviceOnstopping from "@/assets/service-ontstopping.jpg";
import serviceDakgoot from "@/assets/service-dakgoot.jpg";
import serviceCamera from "@/assets/service-camera.jpg";
import serviceDrainage from "@/assets/service-drainage.jpg";
import serviceAfwatering from "@/assets/service-afwatering.jpg";
import serviceHerstelling from "@/assets/service-herstelling.jpg";
import serviceRiolering from "@/assets/service-riolering.jpg";
import serviceGrondwerk from "@/assets/service-grondwerk.jpg";

const allServices = [
  {
    title: "Septische put ledigen",
    description: "Professioneel ledigen en reinigen van septische putten met gespecialiseerde zuigwagens.",
    image: serviceSeptisch,
  },
  {
    title: "Regenput reinigen",
    description: "Grondig reinigen van regenputten zodat uw afwatering optimaal blijft functioneren.",
    image: serviceRegenput,
  },
  {
    title: "Ontstopping",
    description: "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen met hoge druk.",
    image: serviceOnstopping,
  },
  {
    title: "Dakgootreiniging",
    description: "Reiniging van dakgoten en afvoerbuizen om verstoppingen en waterschade te voorkomen.",
    image: serviceDakgoot,
  },
  {
    title: "Camera-inspectie",
    description: "Gedetailleerde camera-inspectie van rioleringen om problemen snel en nauwkeurig te lokaliseren.",
    image: serviceCamera,
  },
  {
    title: "Plaatsbepaling afvoeren",
    description: "Exacte lokalisatie van ondergrondse afvoerleidingen met professionele detectieapparatuur.",
    image: serviceDrainage,
  },
  {
    title: "Geurhinder",
    description: "Opsporing en verhelping van stankoverlast uit rioleringen en afvoersystemen.",
    image: serviceRiolering,
  },
  {
    title: "Rioolvliegjes",
    description: "Bestrijding van rioolvliegjes door de bron aan te pakken in uw afvoersysteem.",
    image: serviceHerstelling,
  },
  {
    title: "Periodieke reiniging",
    description: "Preventief onderhoud en periodieke reiniging van uw volledige rioleringssysteem.",
    image: serviceGrondwerk,
  },
  {
    title: "Wateroverlast",
    description: "Leegpompen en reinigen bij wateroverlast, snel ter plaatse voor noodgevallen.",
    image: serviceAfwatering,
  },
];

const Diensten = () => {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service) => (
              <div
                key={service.title}
                className="group relative h-64 rounded-lg overflow-hidden"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-heading font-bold text-background mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-background/70 font-body leading-relaxed mb-3">
                    {service.description}
                  </p>
                  <Button variant="cta" size="sm" asChild>
                    <Link to={`/#offerte`}>Offerte aanvragen</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Diensten;
