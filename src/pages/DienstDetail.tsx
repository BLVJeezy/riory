import { useParams, Link, Navigate } from "react-router-dom";
import { useRef } from "react";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, ArrowRight, Phone, Star, ShieldCheck, Clock } from "lucide-react";
import { allServices } from "@/data/services";
import { referenceCategories } from "@/data/references";

const serviceToReferenceSlug: Record<string, string> = {
  "ontstoppingen-en-geurdetectie": "ontstoppingen-en-geurdetectie",
  "leidingen-en-septische-putten": "ledigen-van-septische-putten",
  "camera-inspectie": "dakgootreinigingen",
  "leegpompen-en-reinigen": "leegpompen-en-reinigen",
};

const DienstDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = allServices.find((s) => s.slug === slug);
  const formRef = useRef<HTMLDivElement>(null);

  usePageView(`/diensten/${slug}`);
  useDocumentMeta(service?.metaTitle, service?.metaDescription);

  if (!service) {
    return <Navigate to="/diensten" replace />;
  }

  const handleRequestQuote = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refSlug = slug ? serviceToReferenceSlug[slug] : undefined;
  const refCategory = refSlug
    ? referenceCategories.find((c) => c.slug === refSlug)
    : undefined;

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-background min-h-screen">
        <div className="section-container px-6 md:px-8">
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/diensten" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Terug naar diensten
              </Link>
            </Button>
          </div>

          {/* Hero image with CTA overlay */}
          <div className="relative h-72 md:h-[28rem] rounded-xl overflow-hidden mb-6">
            <img
              src={service.image}
              alt={service.title}
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
              <h1 className="text-xl md:text-4xl font-heading font-bold text-white uppercase leading-tight mb-3 md:mb-4">
                {service.title}
              </h1>

              {/* Above-the-fold CTA + phone */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 mb-3 md:mb-4">
                <Button variant="cta" size="lg" className="rounded-full text-sm md:text-base" onClick={handleRequestQuote}>
                  Afspraak maken
                </Button>
                <a
                  href="tel:+32472502814"
                  className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-xs md:text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
                >
                  <Phone className="w-4 h-4" />
                  BEL NU: 0472 50 28 14
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-white/80 text-xs md:text-sm font-heading">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  24/7 beschikbaar
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  4.9 Google Reviews
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Verzekerd & gecertificeerd
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground font-body leading-relaxed mb-10">
              {service.longDescription}
            </p>

            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
              Wat wij doen
            </h2>
            <ul className="space-y-4 mb-10">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground font-body">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Referenties sectie */}
            {refCategory && (
              <div className="mb-10 p-6 rounded-xl bg-muted/50 border border-border">
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Bekijk onze referenties
                </h3>
                <p className="text-sm text-muted-foreground font-body mb-4">
                  Ontdek wat wij al realiseerden in de categorie "{refCategory.title}".
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                  {refCategory.projects.flatMap((p) => p.images).slice(0, 8).map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img src={img} alt={`Referentie ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-full gap-2" asChild>
                  <Link to={`/referenties/${refCategory.slug}`}>
                    Bekijk alle projecten
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Bottom CTA herhaling */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button variant="cta" size="lg" className="rounded-full" onClick={handleRequestQuote}>
                Afspraak maken
              </Button>
              <a
                href="tel:+32472502814"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8)] transition-shadow"
              >
                <AlertTriangle className="w-4 h-4" />
                URGENT? BEL NU
              </a>
            </div>
          </div>
        </div>
      </section>

      <div ref={formRef}>
        <AppointmentForm />
      </div>
      <Footer />
    </>
  );
};

export default DienstDetail;
