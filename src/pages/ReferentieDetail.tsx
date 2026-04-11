import { useParams, Link, Navigate } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { referenceCategories } from "@/data/references";

const ReferentieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = referenceCategories.find((c) => c.slug === slug);

  usePageView(`/referenties/${slug}`);

  if (!category) {
    return <Navigate to="/#projecten" replace />;
  }

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-background min-h-screen">
        <div className="section-container px-4 sm:px-6 md:px-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/#projecten" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Terug naar referenties
              </Link>
            </Button>
          </div>

          {/* Hero */}
          <div className="relative h-48 md:h-80 rounded-xl overflow-hidden mb-10">
            <img
              src={category.image}
              alt={category.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-white uppercase">
                {category.title}
              </h1>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-base sm:text-lg text-muted-foreground font-body leading-relaxed">
              {category.description}
            </p>
          </div>

          {/* Projects */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              Uitgevoerde projecten
            </h2>
            <div className="grid gap-4 sm:gap-6">
              {category.projects.map((project) => (
                <div
                  key={project.title}
                  className="bg-surface rounded-xl border border-border p-5 sm:p-6"
                >
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-1">
                    {project.title}
                  </h3>
                  <p className="flex items-center gap-1.5 text-xs sm:text-sm text-primary font-heading mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </p>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ReferentieDetail;
