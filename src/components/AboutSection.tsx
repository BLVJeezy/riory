import { Shield, Clock, Award } from "lucide-react";
import rioryVan from "@/assets/riory-van.jpeg";

const AboutSection = () => {
  return (
    <section id="over-ons" className="section-padding bg-charcoal">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-primary-foreground mb-2">
              Kwaliteit is onze
            </h2>
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-primary mb-6">
              hoofdnoodzakelijke P(Riory)teit!
            </h2>
            <div className="w-16 h-1 bg-primary mb-8" />
            <p className="text-base md:text-lg text-primary-foreground/70 font-body leading-relaxed mb-8">
              Riory is uw perfecte partner voor rioleringswerk. Uw afvoer heeft geen geheimen voor ons. U kan bij ons 24/7 terecht voor camera inspectie, ontstoppingen, geurdetectie, ledigen van septische putten, leegpompen en reinigen van kelders, putten en regenputten.
            </p>
            <p className="text-base md:text-lg text-primary-foreground/70 font-body leading-relaxed mb-10">
              Met de benodigde expertise van onze vakmensen en professioneel materiaal klaart Riory de vuilste werken voor een eerlijke prijs. Met één telefoontje zijn al uw problemen opgelost. Na iedere klus laten we de omgeving netjes achter, want kwaliteit is onze grootste P(Riory)teit!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <Shield className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-sm">Betrouwbaar</h3>
                  <p className="text-xs text-primary-foreground/50 font-body mt-1">Vakmanschap gegarandeerd</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-sm">24/7 bereikbaar</h3>
                  <p className="text-xs text-primary-foreground/50 font-body mt-1">Altijd paraat</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Award className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-primary-foreground text-sm">Eerlijke prijs</h3>
                  <p className="text-xs text-primary-foreground/50 font-body mt-1">Transparant en correct</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded overflow-hidden border border-primary-foreground/10">
            <img
              src={rioryVan}
              alt="RIORY bedrijfswagen - Sterk in Rioleringswerk"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
