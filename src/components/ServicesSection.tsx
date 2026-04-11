import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { allServices } from "@/data/services";

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

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10">
          {allServices.map((service) => (
            <div
              key={service.slug}
              className="group relative h-48 md:h-72 rounded-xl overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                <h3 className="text-sm md:text-xl font-heading font-bold text-white mb-1 md:mb-2 leading-tight">
                  {service.title}
                </h3>
                <p className="hidden md:block text-sm text-white/70 font-body leading-relaxed mb-3">
                  {service.description}
                </p>
                <Button variant="cta" size="sm" className="text-xs md:text-sm h-8 md:h-9 px-3 md:px-4" asChild>
                  <Link to={`/diensten/${service.slug}`} className="gap-1 md:gap-2">
                    Meer weten
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </Button>
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
