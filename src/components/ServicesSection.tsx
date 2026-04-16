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
            Onze Diensten in Limburg
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Van ontstoppingen tot camera inspectie riool — Riory biedt een compleet aanbod aan rioleringsdiensten in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg. 24/7 beschikbaar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {allServices.map((service) => (
            <Link
              key={service.slug}
              to={`/diensten/${service.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                  <h3 className="text-sm md:text-xl font-heading font-bold text-white leading-tight">
                    {service.shortTitle || service.title}
                  </h3>
                </div>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs sm:text-sm font-heading font-semibold text-primary group-hover:underline">
                Meer weten <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
