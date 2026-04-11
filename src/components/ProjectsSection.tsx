import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { referenceCategories } from "@/data/references";

const ProjectsSection = () => {
  return (
    <section id="projecten" className="section-padding bg-surface">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            Onze Referenties
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm sm:text-base">
            Ontdek onze uitgevoerde projecten per categorie.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {referenceCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/referenties/${cat.slug}`}
              className="group relative h-44 sm:h-52 md:h-72 rounded-xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                <h3 className="text-xs sm:text-sm md:text-xl font-heading font-bold text-white mb-1 md:mb-2 leading-tight">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-white/70 font-heading uppercase tracking-wider group-hover:text-primary transition-colors">
                  Bekijk projecten <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
