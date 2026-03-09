import { useState } from "react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    title: "Rioolaansluiting Woonwijk",
    location: "Bilzen, Limburg",
    category: "Rioleringswerken",
    description: "Volledige rioleringsaansluiting voor een nieuwe residentiële verkaveling.",
    image: project1,
  },
  {
    title: "Grondverzet Industrieterrein",
    location: "Hasselt, Limburg",
    category: "Grondwerken",
    description: "Grootschalige uitgraving en grondverzet voor de aanleg van een nieuw bedrijventerrein.",
    image: project2,
  },
  {
    title: "Gemeentelijke Drainage",
    location: "Genk, Limburg",
    category: "Infrastructuur",
    description: "Installatie van een volledig afwateringssysteem langs een gemeentelijke hoofdweg.",
    image: project3,
  },
];

const filters = ["Alle", "Rioleringswerken", "Grondwerken", "Infrastructuur"];

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState("Alle");

  const filtered = activeFilter === "Alle"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projecten" className="section-padding bg-surface">
      <div className="section-container px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            Onze Realisaties
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-heading font-semibold uppercase tracking-wider rounded-full transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-border hover:border-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((project) => (
            <div
              key={project.title}
              className="group bg-background rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-colors"
            >
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-[10px] sm:text-xs font-heading font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-heading font-semibold text-foreground mb-1">
                  {project.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground mb-2">{project.location}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
