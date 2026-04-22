import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { referenceCategories } from "@/data/references";
import { useLanguage } from "@/i18n/LanguageProvider";

const ReferentieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  const category = referenceCategories.find((c) => c.slug === slug);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const localCatTitle = category ? t(`referencesData.${category.slug}.title`, { defaultValue: category.title }) : "";
  const localCatDesc = category ? t(`referencesData.${category.slug}.description`, { defaultValue: category.description }) : "";

  usePageView(`/referenties/${slug}`);
  useDocumentMeta(
    category ? `${localCatTitle} | ${t("referentieDetail.metaTitleSuffix")}` : undefined,
    category ? `Riory ${localCatTitle.toLowerCase()}` : undefined
  );

  if (!category) {
    return <Navigate to={`${localizedPath("/")}#projecten`} replace />;
  }

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-background min-h-screen">
        <div className="section-container px-4 sm:px-6 md:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                navigate(`${localizedPath("/")}#projecten`);
                setTimeout(() => {
                  document.getElementById("projecten")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("common.backReferences")}
            </Button>
          </div>

          <div className="relative h-48 md:h-80 rounded-xl overflow-hidden mb-10">
            <img
              src={category.projects[0]?.images?.[0] ?? category.image}
              alt={localCatTitle}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-white uppercase">
                {localCatTitle}
              </h1>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-base sm:text-lg text-muted-foreground font-body leading-relaxed">
              {localCatDesc}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              {t("referentieDetail.executedProjects")}
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
                  {project.images && project.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                      {project.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${project.title} ${i + 1}`}
                          loading="lazy"
                          onClick={() => setLightbox({ images: project.images!, index: i })}
                          className="w-full h-32 sm:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <AppointmentForm />
          </div>
        </div>
      </section>
      <Footer />

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length });
                }}
                className="absolute left-2 sm:left-6 text-white/70 hover:text-white z-10"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length });
                }}
                className="absolute right-2 sm:right-6 text-white/70 hover:text-white z-10"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <img
            src={lightbox.images[lightbox.index]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
};

export default ReferentieDetail;
