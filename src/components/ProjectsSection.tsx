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
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-4">
          Onze Realisaties
        </h2>
        <div className="w-16 h-1 bg-primary mb-8" />

        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider rounded transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-border hover:border-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div key={project.title} className="bg-background rounded overflow-hidden border border-border">
              <img src={project.image} alt={project.title} className="w-full h-52 object-cover" />
              <div className="p-6">
                <span className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                  {project.category}
                </span>
                <h3 className="text-lg font-heading font-semibold text-foreground mt-1 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{project.location}</p>
                <p className="text-sm text-muted-foreground font-body">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
