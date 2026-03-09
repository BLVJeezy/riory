import { Shield, Clock, Award } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="over-ons" className="section-padding bg-charcoal">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-primary-foreground mb-4">
          Over RIORY
        </h2>
        <div className="w-16 h-1 bg-primary mb-8" />
        <p className="text-lg text-primary-foreground/70 font-body max-w-2xl mb-12 leading-relaxed">
          RIORY is een gespecialiseerd Belgisch bedrijf in rioleringswerken en infrastructuurprojecten. 
          Met jarenlange ervaring en een team van vakspecialisten leveren wij kwaliteit waar u op kunt bouwen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <Shield className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">Betrouwbaar</h3>
              <p className="text-sm text-primary-foreground/60 font-body">
                Elke klus wordt met de hoogste zorg en precisie uitgevoerd. Wij staan achter ons werk.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">Stipt & Efficiënt</h3>
              <p className="text-sm text-primary-foreground/60 font-body">
                Projecten worden op tijd en binnen budget opgeleverd dankzij slimme planning.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Award className="w-10 h-10 text-primary shrink-0" />
            <div>
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">Vakmanschap</h3>
              <p className="text-sm text-primary-foreground/60 font-body">
                Ons ervaren team gebruikt de nieuwste technieken en materialen voor duurzame resultaten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
