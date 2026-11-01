import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

// Support- en uitlegpagina voor de Riory-app in AI-assistenten (ChatGPT, Claude, ...).
// Wordt gebruikt als support-URL in de app-directory van OpenAI en Anthropic.
const BoekenInChat = () => {
  usePageView("/boeken-in-chat");
  useDocumentMeta(
    "Afspraak boeken in ChatGPT of Claude | Riory",
    "Vraag een afspraak bij Riory aan rechtstreeks in ChatGPT of Claude, zonder de chat te verlaten. Zo werkt het, welke gegevens we ontvangen en hoe u ons bereikt."
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

          <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase text-foreground mb-8">
            Afspraak boeken in ChatGPT of Claude
          </h1>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <p>
              Met de Riory-app vraagt u een afspraak aan rechtstreeks in een AI-assistent zoals ChatGPT of
              Claude, zonder de chat te verlaten. De assistent toont het officiële Riory-afspraakformulier in
              het gesprek. U controleert de gegevens en verstuurt de aanvraag zelf.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">Hoe werkt het?</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Vraag in de chat bijvoorbeeld: <em>"Mijn wc is verstopt in Tongeren, kan Riory komen?"</em>
              </li>
              <li>Het Riory-formulier verschijnt, al ingevuld met wat u in het gesprek vertelde.</li>
              <li>Kies de dienst, geef aan of het dringend is en vul uw contact- en adresgegevens aan.</li>
              <li>Aanvaard de algemene voorwaarden en verstuur de aanvraag.</li>
              <li>
                U krijgt meteen een referentie en een bevestigingsmail. Riory neemt contact met u op om het
                tijdstip te bevestigen.
              </li>
            </ol>
            <p>
              Er wordt niets verstuurd zolang u zelf niet op <strong>Afspraak aanvragen</strong> klikt.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">Dringend?</h2>
            <p>
              Riory is 24/7 bereikbaar. Bij een noodgeval belt u best meteen naar{" "}
              <a href="tel:+32472502814" className="text-primary hover:underline">+32 472 50 28 14</a>.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">Welke gegevens ontvangt Riory?</h2>
            <p>
              Enkel wat u in het formulier invult of bevestigt: de gevraagde dienst, de omschrijving van het
              probleem, uw naam, e-mailadres, telefoonnummer en adres, voor bedrijven de bedrijfsgegevens, en
              de naam van de gebruikte chat-app. Het volledige gesprek met de AI-assistent ontvangen wij niet.
              Uw aanvraag wordt verwerkt zoals een aanvraag via onze website. Meer info in ons{" "}
              <Link to="/privacy-policy" className="text-primary hover:underline">privacybeleid</Link>.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">Hulp of vragen</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Vragen over een aanvraag, of een aanvraag wijzigen of annuleren:{" "}
                <a href="mailto:afspraak@riory.be" className="text-primary hover:underline">afspraak@riory.be</a>{" "}
                of <a href="tel:+32472502814" className="text-primary hover:underline">+32 472 50 28 14</a>.
                Wijzigen of annuleren kan niet via de chat.
              </li>
              <li>
                Vragen over privacy:{" "}
                <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.
              </li>
              <li>
                Liever via de website boeken? Gebruik ons{" "}
                <Link to="/afspraak" className="text-primary hover:underline">afspraakformulier</Link>.
              </li>
            </ul>

            <h2 className="text-lg font-heading font-bold text-foreground">De app uitschakelen</h2>
            <p>
              U kunt de Riory-app op elk moment loskoppelen of uitschakelen in de instellingen van uw
              AI-assistent, bij de apps of connectors.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">Technische info</h2>
            <p>
              MCP-endpoint: <code>https://www.riory.be/api/mcp</code> (Streamable HTTP, geen login). Tools:{" "}
              <code>riory_info</code> (diensten, werkgebied, contact), <code>riory_open_booking_form</code>{" "}
              (afspraakformulier in de chat) en <code>riory_submit_booking</code> (aanvraag versturen).
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BoekenInChat;
