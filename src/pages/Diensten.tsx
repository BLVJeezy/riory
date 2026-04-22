import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { allServices } from "@/data/services";
import { useLanguage } from "@/i18n/LanguageProvider";

const Diensten = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();
  usePageView("/diensten");
  useDocumentMeta(t("diensten.metaTitle"), t("diensten.metaDescription"));
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-background min-h-screen">
        <div className="section-container px-6 md:px-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to={localizedPath("/")} className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                {t("common.backHome")}
              </Link>
            </Button>
          </div>

          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase text-foreground mb-4">
              {t("diensten.h1")}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              {t("diensten.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allServices.map((service) => {
              const localTitle = t(`servicesData.${service.slug}.title`, { defaultValue: service.title });
              const localShort = t(`servicesData.${service.slug}.shortTitle`, { defaultValue: service.shortTitle || service.title });
              const localDesc = t(`servicesData.${service.slug}.description`, { defaultValue: service.description });
              return (
                <div key={service.slug} className="group rounded-lg overflow-hidden bg-card border border-border">
                  <div className="relative h-52 overflow-hidden">
                    <img src={service.image} alt={localTitle} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-lg font-heading font-bold text-white">{localShort}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{localDesc}</p>
                    <Button variant="cta" size="sm" asChild>
                      <Link to={localizedPath(`/diensten/${service.slug}`)} className="gap-2">
                        {t("services.learnMore")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div ref={formRef}>
        <AppointmentForm />
      </div>
      <FAQSection />
      <Footer />
    </>
  );
};

export default Diensten;
