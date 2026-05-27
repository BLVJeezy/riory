import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const CookiePolicy = () => {
  usePageView("/cookie-policy");
  useDocumentMeta(
    "Privacy & Cookiebeleid | Riory",
    "Lees het cookiebeleid van Riory bv en hoe wij cookies en vergelijkbare technieken gebruiken."
  );

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
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Cookiebeleid</h1>
          <p className="text-sm text-muted-foreground mb-8">Laatst bijgewerkt: 27 mei 2026</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-body space-y-6">

            <h2 className="text-xl font-heading font-semibold text-foreground">1. Wat zijn cookies?</h2>
            <p className="text-muted-foreground">
              Cookies zijn kleine bestanden die op uw apparaat worden geplaatst wanneer u onze website bezoekt. In dit beleid bedoelen wij met "cookies" ook andere vergelijkbare technieken, zoals sessionStorage en lokaal opgeslagen identificatoren.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">2. Categorieën cookies</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Strikt noodzakelijk:</strong> nodig om de website te laten werken en uw cookievoorkeuren te bewaren. Geen toestemming vereist.
              </li>
              <li>
                <strong className="text-foreground">Analytisch:</strong> stelt ons in staat om paginabezoeken en herkomst te meten en de werking van de website te verbeteren. Vereist uw toestemming.
              </li>
              <li>
                <strong className="text-foreground">Marketing:</strong> gebruikt om de effectiviteit van advertenties te meten en relevant aanbod te tonen. Vereist uw toestemming.
              </li>
            </ul>

            <h2 className="text-xl font-heading font-semibold text-foreground">3. Bewaartermijn</h2>
            <p className="text-muted-foreground">
              Sessiecookies verdwijnen zodra u uw browser sluit. Overige cookies en lokaal opgeslagen identificatoren worden bewaard zolang dat nodig is voor het beoogde doel, met een maximum van 13 maanden.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">4. Server-side identificatie</h2>
            <p className="text-muted-foreground">
              Voor het meten van marketing-effectiviteit en het voorkomen van misbruik verwerken wij gepseudonimiseerde technische gegevens die door uw browser aan onze server worden gestuurd. Wij baseren ons hierbij op ons gerechtvaardigd belang (art. 6.1.f GDPR). U kunt hiertegen bezwaar maken via info@riory.be.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">5. Cookies beheren</h2>
            <p className="text-muted-foreground">
              U kunt uw cookievoorkeuren op elk moment aanpassen via de cookie-instellingenknop op de website of via de instellingen van uw browser. Wanneer u analytische of marketingcookies weigert, blijven de essentiële functies van de website beschikbaar.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">6. Derde partijen</h2>
            <p className="text-muted-foreground">
              Voor websitestatistieken en advertentiemeting maken wij gebruik van diensten van <strong>Google Ireland Ltd.</strong>, waarbij gegevens ook in de Verenigde Staten kunnen worden verwerkt op grond van het EU-VS Data Privacy Framework.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">7. Wijzigingen</h2>
            <p className="text-muted-foreground">
              Wij behouden ons het recht voor dit cookiebeleid aan te passen. Wijzigingen worden op deze pagina gepubliceerd met een bijgewerkte datum.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">8. Contact</h2>
            <p className="text-muted-foreground">
              Voor vragen kunt u contact opnemen via <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CookiePolicy;
