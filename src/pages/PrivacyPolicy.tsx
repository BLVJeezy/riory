import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";

const PrivacyPolicy = () => {
  usePageView("/privacy-policy");

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

          <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-8">Laatste update op 06/02/2020</p>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <p>De website www.riory.be (hierna: de "Website") is eigendom van Riory bv, Toekomststraat 19, 3740 Bilzen, België. BE 0840.931.404. Telefoon: +32 472 50 28 14.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Persoonsgegevens die wij verwerken</h2>
            <p>Riory bv verwerkt uw persoonsgegevens doordat u gebruik maakt van onze diensten en/of omdat u deze zelf aan ons verstrekt. Hieronder vindt u een overzicht van de persoonsgegevens die wij verwerken:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Voor- en achternaam</li>
              <li>Telefoonnummer</li>
              <li>E-mailadres</li>
            </ul>
            <p>Onze website en/of dienst heeft niet de intentie gegevens te verzamelen over websitebezoekers die jonger zijn dan 16 jaar, tenzij ze toestemming hebben van ouders of voogd.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Verwerkingsdoelen</h2>
            <p>Riory bv verwerkt uw persoonsgegevens voor de volgende doelen:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>U te kunnen bellen of e-mailen indien dit nodig is om onze dienstverlening uit te kunnen voeren</li>
            </ul>

            <h2 className="text-lg font-heading font-bold text-foreground">Geautomatiseerde besluitvorming</h2>
            <p>Riory bv neemt niet op basis van geautomatiseerde verwerkingen besluiten over zaken die (aanzienlijke) gevolgen kunnen hebben voor personen. Riory bv gebruikt de volgende computerprogramma's of -systemen: Googlemail.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Bewaartermijnen</h2>
            <p>Riory bv bewaart uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Wij hanteren een bewaartermijn van 1 maand voor persoonsgegevens (klantenfiche).</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Delen met derden</h2>
            <p>Riory bv verstrekt uitsluitend aan derden en alleen als dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Cookies</h2>
            <p>Riory bv gebruikt alleen technische en functionele cookies. En analytische cookies die geen inbreuk maken op uw privacy. U kunt zich afmelden voor cookies door uw internetbrowser zo in te stellen dat deze geen cookies meer opslaat.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Gegevens inzien, aanpassen of verwijderen</h2>
            <p>U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. U kunt een verzoek sturen naar <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Beveiliging</h2>
            <p>Riory bv neemt de bescherming van uw gegevens serieus en neemt passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan. Als u de indruk heeft dat uw gegevens niet goed beveiligd zijn, neem dan contact op via <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
