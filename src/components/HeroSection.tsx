import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Star, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroDesktop from "@/assets/hero-desktop.webp";
import heroMobile from "@/assets/hero-mobile.webp";


const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-end md:items-center pb-8 md:pb-0">
      <div className="absolute inset-0">
        <img src={heroMobile} alt="Infrastructure project" className="w-full h-full object-cover md:hidden" loading="eager" fetchPriority="high" decoding="async" />
        <img src={heroDesktop} alt="Infrastructure project" className="w-full h-full object-cover hidden md:block" loading="eager" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative section-container px-5 md:px-8 pt-16 md:pt-20">
        <div className="max-w-2xl">

          {/* Urgentie-badge */}
          <div className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-1 rounded-full mb-3 md:mb-4">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="font-heading font-bold text-[11px] md:text-xs uppercase tracking-wider">
              24/7 beschikbaar voor noodgevallen
            </span>
          </div>

          <h1 className="text-[22px] sm:text-3xl md:text-5xl lg:text-6xl font-heading font-bold uppercase leading-tight text-white mb-2 md:mb-3">
            Ontstopping &amp; rioolservice in Limburg
          </h1>
          <p className="text-sm md:text-lg text-white/80 font-body leading-relaxed mb-4 md:mb-5 max-w-xl">
            Septische put ledigen? Problemen met de riolering? Last van verstoppingen? Riory staat 24/7 klaar in Bilzen, Hoeselt, Hasselt, Genk, Tongeren en heel Limburg!
          </p>

          {/* Social proof balk */}
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
              <span>500+ klanten</span>
            </div>
            <div className="w-px h-3.5 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1 text-white/70 text-xs md:text-sm font-body">
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span>Verzekerd</span>
            </div>
          </div>

          {/* CTA knoppen */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-3 md:mb-4">
            <Button variant="hero" size="lg" className="text-sm md:text-base px-6 md:px-8 py-5 md:py-6 rounded-full" asChild>
              <Link to="/afspraak">maak een afspraak</Link>
            </Button>
            <a
              href="tel:+32472502814"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm md:text-base uppercase tracking-wide shadow-[0_0_20px_hsl(var(--urgent)/0.6),0_0_40px_hsl(var(--urgent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8),0_0_60px_hsl(var(--urgent)/0.4)] transition-shadow animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
              URGENT? BEL NU
            </a>
          </div>

          {/* Telefoon + prijs berekenen — compact naast elkaar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <a
              href="tel:+32472502814"
              className="inline-flex items-center gap-2.5 group"
            >
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
                  Bel ons nu
                </p>
                <p className="text-lg md:text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                  +32 472 50 28 14
                </p>
              </div>
            </a>
            <div className="hidden sm:block w-px h-8 bg-white/20" />
            <Button variant="heroOutline" size="lg" className="text-sm md:text-base px-6 md:px-8 py-4 md:py-5 rounded-full border-white/60 text-white hover:bg-white hover:text-foreground" asChild>
              <Link to="/prijscalculator">PRIJS BEREKENEN</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
