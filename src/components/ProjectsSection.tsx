import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { referenceCategories } from "@/data/references";

const ProjectsSection = () => {
  const [active, setActive] = useState<string>("alle");

  const filters = [
    { label: "Alle", value: "alle" },
    ...referenceCategories.map((cat) => ({ label: cat.title, value: cat.slug })),
  ];

  const visible =
    active === "alle"
      ? referenceCategories
      : referenceCategories.filter((c) => c.slug === active);

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

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-heading uppercase tracking-wider whitespace-nowrap transition-colors ${
                active === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects per category */}
        <div className="space-y-10">
          {visible.map((cat) => (
            <div key={cat.slug}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                  {cat.title}
                </h3>
                <Link
                  to={`/referenties/${cat.slug}`}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-primary font-heading uppercase tracking-wider hover:text-primary/80 transition-colors"
                >
                  Bekijk projecten <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {cat.projects.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {cat.projects.map((project) => (
                    <Link
                      key={project.title}
                      to={`/referenties/${cat.slug}`}
                      className="group"
                    >
                      <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden mb-2">
                        {project.images && project.images.length > 0 ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={cat.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                      </div>
                      <p className="text-xs sm:text-sm font-heading font-semibold text-foreground leading-tight">
                        {project.title}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-body italic">
                  Binnenkort beschikbaar.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
