import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.png";
import logo from "@/assets/riory-logo-white.svg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img src={heroMobile} alt="Infrastructure project" className="w-full h-full object-cover md:hidden" />
        <img src={heroDesktop} alt="Infrastructure project" className="w-full h-full object-cover hidden md:block" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative section-container px-6 md:px-8 pt-20">
        <div className="max-w-2xl">
          <img src={logo} alt="RIORY" className="hidden md:block h-20 w-auto mb-6" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold uppercase leading-tight text-white mb-6">
            Sterk in Rioleringswerk
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed mb-10 max-w-xl">
            Professionele rioleringswerken en infrastructuurprojecten uitgevoerd met precisie en vakmanschap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-full" asChild>
              <a href="#offerte">VRAAG EEN OFFERTE</a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 rounded-full border-white/60 text-white hover:bg-white hover:text-foreground" asChild>
              <a href="#projecten">BEKIJK PROJECTEN</a>
            </Button>
          </div>

          {/* Phone number */}
          <a
            href="tel:+32472502814"
            className="inline-flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-full">
                24/7
              </span>
            </div>
            <div>
              <p className="text-xs font-heading font-semibold uppercase tracking-wider text-white/50">
                Bel ons — 24/7 bereikbaar
              </p>
              <p className="text-xl md:text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                +32 (0)472 50 28 14
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
