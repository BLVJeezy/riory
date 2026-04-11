import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Gebruiksvoorwaarden = () => {
  usePageView("/gebruiksvoorwaarden");
  useDocumentMeta("Gebruiksvoorwaarden | Riory", "Lees de gebruiksvoorwaarden van de website van Riory bv.");

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-background min-h-screen">
        <div className="section-container px-6 md:px-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Terug naar home
              </Link>
            </Button>
          </div>

          <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase text-foreground mb-8">
            Gebruiksvoorwaarden
          </h1>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <p>Het gebruik van de website van www.riory.be (de "Website") is onderworpen aan de hierna opgenomen gebruiksvoorwaarden. Het gebruik van de website geldt als aanvaarding van deze voorwaarden. De Website behoort toe aan Riory bv, met maatschappelijke zetel te Toekomststraat 19 3740 Bilzen en met ondernemingsnummer BE 0840.931.404.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Gebruik van de Website</h2>
            <p>Wij besteden veel aandacht aan onze Website. Ondanks deze inspanningen kunnen wij niet garanderen dat de informatie op de Website volledig juist, nauwkeurig en actueel is. Deze gegevens kunnen dus enkel worden gebruikt als algemene informatie. Evenmin kunnen wij aansprakelijk gesteld worden voor (on)rechtstreekse schade die ontstaat uit het gebruik van de Website. De Website kan bestanden van derden of hyperlinks naar websites van derden bevatten. Onze Onderneming is hiervoor in geen enkel geval aansprakelijk.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Intellectuele eigendom</h2>
            <p>Het gebruik van de Website verleent de gebruiker geen enkel intellectueel eigendomsrecht. De inhoud van de Website en de ter beschikking gestelde informatie behoren tot de exclusieve intellectuele eigendom van de Onderneming. De informatie, vormgeving, teksten, tekeningen, foto's, gegevens, logo's, merken en andere elementen die worden weergegeven, zijn beschermd door het merkenrecht en/of het auteursrecht. Elke inbreuk zal aanleiding geven tot rechtsvervolging.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Bescherming van persoonsgegevens</h2>
            <p>Onze Onderneming neemt haar verplichtingen inzake privacy en gegevensbescherming ernstig. Voor meer informatie kan u onze <Link to="/data-protection" className="text-primary hover:underline">Data Protection Notice</Link> consulteren.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Cookies</h2>
            <p>De Website kan gebruik maken van cookies, die het mogelijk maken om informatie op te slaan om het gebruik van de Website te vereenvoudigen. Het gebruik van cookies kunt u in uw browser beheren en/of uitschakelen.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Belgisch recht</h2>
            <p>Uw toegang tot, bezoek of gebruik van de Website en deze gebruiksvoorwaarden worden beheerst door het Belgisch recht. In geval van een geschil zijn enkel de rechtbanken van de maatschappelijke zetel van de Onderneming bevoegd.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Gebruiksvoorwaarden;
