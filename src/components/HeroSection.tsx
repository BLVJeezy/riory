import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-infrastructure.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Infrastructure project" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>
      <div className="relative section-container px-6 md:px-8 pt-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold uppercase leading-tight text-background mb-6">
            Sterk in Rioleringswerk
          </h1>
          <p className="text-lg md:text-xl text-background/80 font-body leading-relaxed mb-10 max-w-xl">
            Professionele rioleringswerken en infrastructuurprojecten uitgevoerd met precisie en vakmanschap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
              <a href="#offerte">VRAAG EEN OFFERTE</a>
            </Button>
            <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 border-background/60 text-background hover:bg-background hover:text-foreground" asChild>
              <a href="#projecten">BEKIJK PROJECTEN</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
