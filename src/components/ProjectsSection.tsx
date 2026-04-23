import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import { referenceCategories } from "@/data/references";

const ProjectsSection = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const [active, setActive] = useState<string>("alle");

  const filters = [
    { label: t("projects.all"), value: "alle" },
    ...referenceCategories.map((cat) => ({
      label: t(`referencesData.${cat.slug}.title`, { defaultValue: cat.title }),
      value: cat.slug,
    })),
  ];

  const allProjects = referenceCategories.flatMap((cat) =>
    cat.projects.map((p) => ({ ...p, catSlug: cat.slug, catImage: cat.image }))
  );

  const visible =
    active === "alle"
      ? null
      : referenceCategories.filter((c) => c.slug === active);

  return (
    <section id="projecten" className="section-padding bg-surface">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            {t("projects.title")}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm sm:text-base">
            {t("projects.subtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          <button
            onClick={() => setActive("alle")}
            className={`w-full sm:w-auto px-2.5 py-2 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-heading uppercase tracking-wider transition-colors text-center border ${
              active === "alle"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
            }`}
          >
            {t("projects.all")}
          </button>
          <div className="grid grid-cols-2 sm:contents gap-1.5 sm:gap-2">
            {filters.filter((f) => f.value !== "alle").map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`px-2.5 py-2 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-heading uppercase tracking-wider sm:whitespace-nowrap transition-colors text-center border ${
                  active === f.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 border-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-8 sm:space-y-12">
          {visible === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {allProjects.map((project) => (
                <Link
                  key={`${project.catSlug}-${project.title}`}
                  to={localizedPath(`/referenties/${project.catSlug}`)}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <img
                      src={project.images?.[0] ?? project.catImage}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                      <p className="text-[11px] sm:text-sm font-heading font-semibold text-white leading-tight line-clamp-2">
                        {t(`referencesData.${project.catSlug}.projects.${project.title}.title`, { defaultValue: project.title })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            visible.map((cat) => (
              <div key={cat.slug}>
                <div className="flex items-center justify-between mb-4 sm:mb-5 pb-2 border-b border-border">
                  <h3 className="text-base sm:text-lg md:text-xl font-heading font-bold text-foreground">
                    {t(`referencesData.${cat.slug}.title`, { defaultValue: cat.title })}
                  </h3>
                  <Link
                    to={localizedPath(`/referenties/${cat.slug}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs text-primary font-heading uppercase tracking-wider hover:bg-primary/20 transition-colors"
                  >
                    {t("common.viewAll")} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {cat.projects.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {cat.projects.map((project) => (
                      <Link
                        key={project.title}
                        to={localizedPath(`/referenties/${cat.slug}`)}
                        className="group block"
                      >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                          <img
                            src={project.images?.[0] ?? cat.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                            <p className="text-[11px] sm:text-sm font-heading font-semibold text-white leading-tight line-clamp-2">
                              {t(`referencesData.${cat.slug}.projects.${project.title}.title`, { defaultValue: project.title })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-body italic py-4">
                    {t("common.soonAvailable")}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
