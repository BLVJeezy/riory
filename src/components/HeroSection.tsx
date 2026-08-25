import { Button } from "@/components/ui/button";
import { Phone, Clock, Star, ShieldCheck, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/LanguageProvider";
import rioryVanAsset from "@/assets/riory-van-2.png.asset.json";

const HeroSection = () => {
  const { t } = useTranslation();
  const { localizedPath } = useLanguage();

  const bullets = [
    t("hero.bulletCoverage", { defaultValue: "Actief in Bilzen, Genk, Hasselt en Tongeren" }),
    t("hero.bulletArrival", { defaultValue: "Doorgaans binnen 1 à 2 uur ter plaatse" }),
    t("hero.bulletPrices", { defaultValue: "Vaste, transparante prijzen zonder verrassingen" }),
  ];

  return (
    <section id="home" className="bg-background pt-16 md:pt-20">
      <div className="section-container px-0 md:px-8 py-0 md:py-12 lg:py-16">
        <div className="overflow-hidden md:rounded-3xl md:border md:border-border md:bg-card md:shadow-sm">
          <div className="grid lg:grid-cols-[0.62fr_1.38fr]">
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[680px] bg-muted overflow-hidden order-1 lg:order-2">
              <img
                src={rioryVanAsset.url}
                alt="Riory servicewagen — ontstoppingsdienst en rioleringswerken"
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-black/5" />
              <div className="absolute left-5 bottom-5 md:left-7 md:bottom-7 inline-flex items-center gap-2 rounded-full bg-background/95 backdrop-blur px-4 py-2 shadow-[0_6px_24px_rgba(0,0,0,0.18)] border border-border/70">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
                  {t("hero.badge")}
                </span>
              </div>
            </div>

            <div className="order-2 lg:order-1 bg-charcoal text-white px-6 py-9 sm:px-8 sm:py-11 md:px-10 lg:px-12 lg:py-14 xl:px-16 flex items-center">
              <div className="max-w-xl">
                <p className="text-primary font-heading font-bold text-xs md:text-sm uppercase tracking-[0.18em] mb-3">
                  Riory BV
                </p>

                <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-heading font-bold uppercase leading-[1.15] tracking-tight text-white mb-5 whitespace-pre-line">
                  {t("hero.title")}
                </h1>

                <div className="space-y-3 mb-7 max-w-lg">
                  {bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-3 text-sm md:text-base text-white/82">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/15 shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </span>
                      <span className="font-body">{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-7">
                  <Button variant="hero" size="lg" className="h-12 md:h-14 rounded-xl px-7 md:px-8 text-sm md:text-base" asChild>
                    <Link to={localizedPath("/afspraak")} data-track-cta="hero_appointment">
                      {t("hero.ctaAppointment")}
                    </Link>
                  </Button>

                  <a
                    href="tel:+32472502814"
                    data-track-cta="hero_urgent_tel"
                    className="inline-flex h-12 md:h-14 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 md:px-8 font-heading font-bold text-sm md:text-base uppercase tracking-wide text-white hover:bg-white hover:text-foreground transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    0472 50 28 14
                  </a>
                </div>

                <div className="flex flex-nowrap gap-1.5 sm:gap-2.5 border-t border-white/10 pt-5 overflow-x-auto">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white/85 shadow-[0_0_22px_rgba(255,255,255,0.05)] shrink-0">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    4.9 Google
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-primary/25 bg-primary/[0.08] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white/85 shadow-[0_0_22px_hsl(var(--primary)/0.08)] shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    {t("hero.insured")}
                  </span>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-primary/25 bg-primary/[0.08] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white/85 shadow-[0_0_22px_hsl(var(--primary)/0.08)] shrink-0">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    24/7 bereikbaar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
