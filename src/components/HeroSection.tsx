import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Star, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import heroDesktop from "@/assets/hero-desktop.webp";
import heroMobile from "@/assets/hero-mobile.webp";

const HeroSection = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-end md:items-center pb-8 md:pb-0">
      <div className="absolute inset-0">
        <img src={heroMobile} alt="Riory BV — loodgieter en ontstoppingsdienst in Limburg" className="w-full h-full object-cover md:hidden" loading="eager" fetchPriority="high" decoding="async" />
        <img src={heroDesktop} alt="Riory BV — loodgieter en ontstoppingsdienst in Limburg" className="w-full h-full object-cover hidden md:block" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative section-container px-5 md:px-8 pt-16 md:pt-20">
        <div className="max-w-2xl">

          <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full mb-3 md:mb-4">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="font-heading font-bold text-[11px] md:text-xs uppercase tracking-wider">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-[22px] sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold uppercase leading-tight text-white mb-2 md:mb-3">
            {t("hero.title")}
          </h1>
          <p className="hero-description text-sm md:text-lg text-white/80 font-body leading-relaxed mb-3 md:mb-4 max-w-xl">
            {t("hero.description")}
          </p>

          <div className="mb-4 md:mb-5 max-w-xl">
            <p className="text-[10px] md:text-xs font-heading font-bold uppercase tracking-wider text-white/60 mb-1.5">
              {t("hero.servesRegions")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { slug: "hasselt", label: "Hasselt" },
                { slug: "genk", label: "Genk" },
                { slug: "tongeren", label: "Tongeren" },
                { slug: "sint-truiden", label: "Sint-Truiden" },
                { slug: "luik", label: "Luik" },
                { slug: "ans", label: "Ans" },
                { slug: "rocourt", label: "Rocourt" },
                { slug: "juprelle", label: "Juprelle" },
                { slug: "vottem", label: "Vottem" },
                { slug: "milmort", label: "Milmort" },
              ].map((c) => (
                <Link
                  key={c.slug}
                  to={localizedPath(`/regio/${c.slug}`)}
                  className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground border border-white/20 text-white/90 text-[11px] md:text-xs font-body font-medium transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 md:mb-5">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/90 text-xs md:text-sm font-heading font-semibold ml-0.5">4.9</span>
              <span className="text-white/50 text-xs md:text-sm font-body">Google</span>
            </div>
            <div className="w-px h-3.5 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1 text-white/70 text-xs md:text-sm font-body">
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>{t("hero.customers")}</span>
            </div>
            <div className="w-px h-3.5 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1 text-white/70 text-xs md:text-sm font-body">
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>{t("hero.insured")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-3 md:mb-4">
            <Button variant="hero" size="lg" className="text-sm md:text-base px-6 md:px-8 py-5 md:py-6 rounded-full" asChild>
              <Link to={localizedPath("/afspraak")} data-track-cta="hero_appointment">{t("hero.ctaAppointment")}</Link>
            </Button>
            <a
              href="tel:+32472502814"
              data-track-cta="hero_urgent_tel"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm md:text-base uppercase tracking-wide shadow-[0_0_20px_hsl(var(--urgent)/0.6),0_0_40px_hsl(var(--urgent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8),0_0_60px_hsl(var(--urgent)/0.4)] transition-shadow animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              {t("hero.ctaUrgent")}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <a href="tel:+32472502814" aria-label="Bel Riory BV 24/7" data-track-cta="hero_phone_24_7" className="cta-phone inline-flex items-center gap-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <span className="absolute -top-1 -right-1.5 bg-primary text-primary-foreground text-[8px] md:text-[9px] font-heading font-bold px-1 md:px-1.5 py-0.5 rounded-full">
                  24/7
                </span>
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-heading font-semibold uppercase tracking-wider text-white/50">
                  {t("hero.callUs")}
                </p>
                <p className="text-lg md:text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                  +32 472 50 28 14
                </p>
              </div>
            </a>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <div className="flex flex-col gap-1.5">
              <Button variant="heroOutline" size="lg" className="text-sm md:text-base px-6 md:px-8 py-4 md:py-5 rounded-full border-white/60 text-white hover:bg-white hover:text-foreground" asChild>
                <Link to={localizedPath("/prijscalculator")} data-track-cta="hero_calculate_price">{t("hero.calculatePrice")}</Link>
              </Button>
              <p className="text-[10px] md:text-xs font-body text-white/60 leading-snug max-w-[260px]">
                Urgentietarief bij volle planning (zelfde dag): <span className="font-heading font-semibold text-white/80">+50%</span> · Weekend / feestdagen: <span className="font-heading font-semibold text-white/80">+100%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
