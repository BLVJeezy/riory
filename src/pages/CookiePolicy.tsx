import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const CookiePolicy = () => {
  usePageView("/cookie-policy");
  useDocumentMeta("Privacy & Cookiebeleid | Riory", "Lees het privacy- en cookiebeleid van Riory bv en hoe wij cookies gebruiken op onze website.");

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
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Privacy & Cookiebeleid</h1>
          <p className="text-sm text-muted-foreground mb-8">Laatst bijgewerkt: april 2025</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-body space-y-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">1. Inleiding</h2>
            <p className="text-muted-foreground">
              Riory bv hecht veel belang aan de bescherming van uw privacy en de transparante verwerking van uw persoonsgegevens. Dit Privacy & Cookiebeleid legt uit welke cookies wij gebruiken, waarom, en hoe u uw voorkeuren kunt beheren.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">2. Wat zijn cookies?</h2>
            <p className="text-muted-foreground">
              Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt. Ze helpen ons om de website correct te laten functioneren, de gebruikerservaring te verbeteren en het gebruik van de website te analyseren.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">3. Welke cookies gebruiken wij?</h2>
            <p className="text-muted-foreground">Wij maken gebruik van de volgende categorieën cookies:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Strikt noodzakelijke cookies:</strong> Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld. Ze worden meestal ingesteld als reactie op uw acties, zoals het instellen van uw privacyvoorkeuren of het invullen van formulieren.</li>
              <li><strong className="text-foreground">Analytische cookies:</strong> Deze cookies helpen ons te begrijpen hoe bezoekers onze website gebruiken, zodat we de werking en inhoud ervan kunnen verbeteren. De verzamelde gegevens zijn anoniem.</li>
              <li><strong className="text-foreground">Functionele cookies:</strong> Deze cookies stellen de website in staat om verbeterde functionaliteit en personalisatie te bieden, zoals het onthouden van uw taalvoorkeur of regio.</li>
            </ul>

            <h2 className="text-xl font-heading font-semibold text-foreground">4. Bewaartermijn</h2>
            <p className="text-muted-foreground">
              De bewaartermijn van cookies verschilt per type. Sessiecookies worden verwijderd zodra u uw browser sluit. Permanente cookies blijven op uw apparaat staan tot ze verlopen of tot u ze handmatig verwijdert. De maximale bewaartermijn bedraagt 12 maanden.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">5. Cookies beheren</h2>
            <p className="text-muted-foreground">
              U kunt uw cookievoorkeuren op elk moment wijzigen via de instellingen van uw browser. U kunt cookies blokkeren of verwijderen, maar houd er rekening mee dat sommige delen van de website mogelijk niet correct functioneren als u cookies uitschakelt.
            </p>
            <p className="text-muted-foreground">Meer informatie over het beheren van cookies vindt u op de website van uw browser:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Safari</li>
              <li>Microsoft Edge</li>
            </ul>

            <h2 className="text-xl font-heading font-semibold text-foreground">6. Diensten van derden</h2>
            <p className="text-muted-foreground">
              Onze website kan cookies bevatten van diensten van derden, zoals analytische tools. Deze derden hebben hun eigen privacybeleid en wij raden u aan deze te raadplegen voor meer informatie over hun gegevensverwerkingspraktijken.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">7. Uw rechten</h2>
            <p className="text-muted-foreground">
              Onder de AVG (GDPR) heeft u het recht op inzage, correctie, verwijdering en beperking van de verwerking van uw persoonsgegevens. U kunt ook bezwaar maken tegen de verwerking of verzoeken om gegevensoverdraagbaarheid. Neem hiervoor contact met ons op via onderstaande gegevens.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">8. Wijzigingen</h2>
            <p className="text-muted-foreground">
              Riory bv behoudt zich het recht voor om dit Privacy & Cookiebeleid te wijzigen. Wijzigingen worden op deze pagina gepubliceerd met een bijgewerkte datum. Wij raden u aan deze pagina regelmatig te raadplegen.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">9. Contact</h2>
            <p className="text-muted-foreground">
              Voor vragen over dit Privacy & Cookiebeleid kunt u contact opnemen met:<br />
              <strong className="text-foreground">Riory bv</strong><br />
              E-mail: info@riory.be
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CookiePolicy;
