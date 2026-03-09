import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import serviceSeptisch from "@/assets/service-septisch.jpg";
import serviceOnstopping from "@/assets/service-ontstopping.jpg";

const featuredServices = [
  {
    title: "Septische put ledigen",
    description: "Professioneel ledigen en reinigen van septische putten met gespecialiseerde zuigwagens.",
    image: serviceSeptisch,
  },
  {
    title: "Ontstopping",
    description: "Snelle en efficiënte ontstopping van rioleringen, afvoeren en leidingen met hoge druk.",
    image: serviceOnstopping,
  },
];

const ServicesSection = () => {
  return (
    <section id="diensten" className="section-padding bg-background">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
            Onze Diensten
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Van ontstoppingen tot camera-inspectie — wij bieden een compleet aanbod aan rioleringsdiensten, 24/7 beschikbaar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {featuredServices.map((service) => (
            <div
              key={service.title}
              className="group relative h-64 md:h-80 rounded-xl overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-white/70 font-body leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="cta" size="lg" className="rounded-full" asChild>
            <Link to="/diensten" className="gap-2">
              Bekijk al onze diensten
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
