import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import heroDesktop from "@/assets/hero-desktop.webp";
import heroMobile from "@/assets/hero-mobile.webp";


const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img src={heroMobile} alt="Infrastructure project" className="w-full h-full object-cover md:hidden" loading="eager" fetchPriority="high" decoding="async" />
        <img src={heroDesktop} alt="Infrastructure project" className="w-full h-full object-cover hidden md:block" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative section-container px-6 md:px-8 pt-20">
        <div className="max-w-2xl">
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold uppercase leading-snug text-white mb-6">
            24/7 Ontstopping-, riool- &amp; ruimdienst
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed mb-10 max-w-xl">
            Septische put ledigen? Problemen met de riolering? Last van verstoppingen? Riory staat 24/7 klaar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-full" asChild>
              <Link to="/afspraak">maak een afspraak</Link>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 rounded-full border-white/60 text-white hover:bg-white hover:text-foreground" asChild>
              <a href="#projecten">BEKIJK PROJECTEN</a>
            </Button>
          </div>
          <div className="mb-10">
            <a
              href="tel:+32472502814"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-base uppercase tracking-wide shadow-[0_0_20px_hsl(var(--urgent)/0.6),0_0_40px_hsl(var(--urgent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8),0_0_60px_hsl(var(--urgent)/0.4)] transition-shadow animate-pulse"
            >
              <AlertTriangle className="w-5 h-5" />
              URGENT? BEL NU
            </a>
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
