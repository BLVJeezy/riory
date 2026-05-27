import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const PrivacyPolicy = () => {
  usePageView("/privacy-policy");
  useDocumentMeta(
    "Privacybeleid | Riory",
    "Lees het privacybeleid van Riory bv en hoe wij omgaan met uw persoonsgegevens."
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

          <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-8">
            Laatste update op 27/05/2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <p>
              Riory bv, Toekomststraat 19, 3740 Bilzen — KBO BE 0840.931.404 —
              info@riory.be — verwerkt persoonsgegevens conform de Algemene
              Verordening Gegevensbescherming (GDPR) en de Belgische
              privacywetgeving.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">1. Welke gegevens</h2>
            <p>
              Wij verwerken identiteits- en contactgegevens die u zelf aan ons
              verstrekt (bv. bij een offerte- of afspraakaanvraag) en technische
              gegevens over uw bezoek aan deze website (waaronder gepseudonimiseerde
              identificatoren die ons toelaten te bepalen via welk kanaal u ons
              gevonden heeft).
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">2. Doeleinden en rechtsgronden</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Uitvoering van de overeenkomst</strong> (art. 6.1.b GDPR):
                contact opnemen, offertes opstellen, werken uitvoeren.
              </li>
              <li>
                <strong>Wettelijke verplichtingen</strong> (art. 6.1.c GDPR):
                boekhoudkundige en fiscale verplichtingen.
              </li>
              <li>
                <strong>Gerechtvaardigd belang</strong> (art. 6.1.f GDPR): meten
                via welk kanaal nieuwe klanten ons vinden, optimaliseren van onze
                marketing en voorkomen van misbruik. U kunt hiertegen bezwaar maken
                via info@riory.be.
              </li>
              <li>
                <strong>Toestemming</strong> (art. 6.1.a GDPR): voor analytische
                en marketingcookies. U kunt uw toestemming op elk moment intrekken
                via de cookie-instellingen op de Website. Zie ons{" "}
                <Link to="/cookie-policy" className="text-primary hover:underline">
                  cookiebeleid
                </Link>
                .
              </li>
            </ul>

            <h2 className="text-lg font-heading font-bold text-foreground">3. Bewaartermijn</h2>
            <p>
              Wij bewaren uw gegevens niet langer dan noodzakelijk voor de
              doeleinden waarvoor ze worden verwerkt of dan wettelijk verplicht is
              (waaronder de boekhoudkundige bewaarplicht). Technische
              attributie-gegevens worden gepseudonimiseerd of geanonimiseerd binnen
              maximaal 13 maanden.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">4. Geautomatiseerde besluitvorming</h2>
            <p>
              Wij nemen geen besluiten op basis van geautomatiseerde verwerkingen
              die voor u aanzienlijke gevolgen kunnen hebben.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">5. Ontvangers</h2>
            <p>
              Persoonsgegevens kunnen — uitsluitend in het kader van bovenstaande
              doeleinden — gedeeld worden met onze IT-, communicatie- en
              boekhoudkundige dienstverleners. Voor websitestatistieken en
              advertentiemeting maken wij gebruik van diensten van{" "}
              <strong>Google Ireland Ltd.</strong>, waarbij gegevens ook in de
              Verenigde Staten kunnen worden verwerkt op grond van het EU-VS Data
              Privacy Framework.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">6. Uw rechten</h2>
            <p>
              U heeft het recht op inzage, rectificatie, verwijdering, beperking
              van of bezwaar tegen de verwerking, en op data-portabiliteit. U kunt
              uw toestemming voor cookies op elk moment intrekken. Verzoeken stuurt
              u naar{" "}
              <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.
              U heeft tevens het recht om een klacht in te dienen bij de Belgische
              Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be).
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">7. Beveiliging</h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om uw
              gegevens te beschermen tegen verlies, ongeoorloofde toegang en
              ongeoorloofde wijziging.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
