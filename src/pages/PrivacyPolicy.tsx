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
            Laatste update op 26/05/2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <p>
              De website www.riory.be (hierna: de "Website") is eigendom van Riory bv,
              Toekomststraat 19, 3740 Bilzen, België. Ondernemingsnummer BE 0840.931.404.
              Telefoon: +32 472 50 28 14. E-mail: info@riory.be.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">1. Persoonsgegevens die wij verwerken</h2>
            <p>
              Wij verwerken persoonsgegevens die u zelf aan ons verstrekt wanneer u
              gebruik maakt van onze diensten of contact opneemt via onze Website. Dit
              betreft onder meer:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Voor- en achternaam</li>
              <li>Telefoonnummer en e-mailadres</li>
              <li>Werf- en facturatieadres</li>
              <li>Bedrijfsgegevens (indien van toepassing): bedrijfsnaam, btw-nummer, KBO-nummer</li>
              <li>Beschrijving van uw vraag of opdracht</li>
              <li>Communicatie via e-mail, formulier of telefoon</li>
            </ul>
            <p>
              Daarnaast registreren wij — in het kader van het beheer en de verbetering
              van onze diensten — technische gegevens over uw bezoek aan de Website:
              IP-adres, browser- en apparaattype, taal-instelling, bezochte pagina's,
              referrer, en marketing-attributie-parameters (gclid, utm_*) wanneer die in
              de URL aanwezig zijn. Deze gegevens worden gepseudonimiseerd opgeslagen
              (gehashte IP + browser-fingerprint) en worden uitsluitend gebruikt om te
              kunnen achterhalen via welk kanaal een klant onze diensten heeft gevonden.
              Zie sectie 4 voor de bewaartermijn.
            </p>
            <p>
              Onze website heeft niet de intentie gegevens te verzamelen over bezoekers
              die jonger zijn dan 16 jaar, tenzij ze toestemming hebben van ouders of voogd.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">2. Verwerkingsdoelen en rechtsgrond</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Uitvoering van de overeenkomst (art. 6.1.b GDPR):</strong> u te
                kunnen bellen of e-mailen, een offerte op te stellen, een afspraak in te
                plannen en de werken uit te voeren.
              </li>
              <li>
                <strong>Wettelijke verplichtingen (art. 6.1.c GDPR):</strong> boekhoudkundige
                verplichtingen, factureringsplicht, fiscale rapportage.
              </li>
              <li>
                <strong>Gerechtvaardigd belang (art. 6.1.f GDPR):</strong> meten via welk
                marketingkanaal nieuwe klanten ons vinden (zoekmachine, advertentie,
                aanbeveling), het optimaliseren van onze advertentiebudgetten en het
                voorkomen van fraude en misbruik. Voor dit doel houden wij
                gepseudonimiseerde technische signalen bij (zie sectie 1). U kunt
                bezwaar maken tegen deze verwerking via info@riory.be.
              </li>
              <li>
                <strong>Toestemming (art. 6.1.a GDPR):</strong> voor analytische en
                marketingcookies — zie ons{" "}
                <Link to="/cookie-policy" className="text-primary hover:underline">
                  cookiebeleid
                </Link>
                . U kunt uw toestemming op elk moment intrekken via de cookie-instellingen
                onderaan de Website.
              </li>
            </ul>

            <h2 className="text-lg font-heading font-bold text-foreground">3. Geautomatiseerde besluitvorming</h2>
            <p>
              Riory bv neemt geen besluiten op basis van geautomatiseerde verwerkingen
              die (aanzienlijke) gevolgen kunnen hebben voor personen. Wij gebruiken o.a.
              de volgende systemen: Google Workspace (e-mail), Simpla CRM, Telavox
              telefonie, Google Analytics 4 (geanonimiseerd) en Google Ads.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">4. Bewaartermijnen</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Klantgegevens (naam, contact, adres, opdracht):</strong> 7 jaar na
                het laatste contact, conform de boekhoudkundige bewaarplicht.
              </li>
              <li>
                <strong>Communicatie (e-mail, formulier-inhoud):</strong> 7 jaar.
              </li>
              <li>
                <strong>Technische / attributie-gegevens (IP-hash, browser-fingerprint,
                analytics-cookies):</strong> maximaal 13 maanden. Daarna worden de
                technische identifiers automatisch geanonimiseerd; de geaggregeerde
                statistieken blijven bewaard maar zijn niet meer aan een persoon te
                koppelen.
              </li>
              <li>
                <strong>Sollicitaties (indien van toepassing):</strong> 1 jaar na sollicitatie.
              </li>
            </ul>

            <h2 className="text-lg font-heading font-bold text-foreground">5. Delen met derden</h2>
            <p>
              Wij delen uw persoonsgegevens uitsluitend met derden indien dit nodig is
              voor de uitvoering van onze overeenkomst met u of om te voldoen aan een
              wettelijke verplichting. Dit kan onder meer betrekking hebben op:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>onze boekhouder (boekhoudkundige verwerking)</li>
              <li>Simpla CRM (klantenadministratie, gevestigd in België)</li>
              <li>Google Ireland Ltd. (Analytics 4 en Ads, voor geaggregeerde rapportage)</li>
              <li>onze IT-dienstverlener voor het beheer van de Website</li>
            </ul>
            <p>
              Met al deze partijen zijn verwerkersovereenkomsten gesloten. Wij verkopen uw
              persoonsgegevens nooit aan derden.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">6. Cookies</h2>
            <p>
              Voor het gebruik van cookies en vergelijkbare technieken verwijzen wij naar
              ons separate{" "}
              <Link to="/cookie-policy" className="text-primary hover:underline">
                cookiebeleid
              </Link>
              . U kunt uw cookie-voorkeuren te allen tijde aanpassen via de
              cookie-instellingenknop onderaan de Website.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">7. Uw rechten</h2>
            <p>U heeft het recht om:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>uw persoonsgegevens in te zien, te corrigeren of te verwijderen</li>
              <li>de verwerking te beperken of bezwaar te maken tegen verwerking op grond van gerechtvaardigd belang</li>
              <li>uw gegevens in een gestructureerd formaat te ontvangen (data-portabiliteit)</li>
              <li>uw toestemming voor analytische/marketingcookies in te trekken</li>
              <li>een klacht in te dienen bij de Belgische Gegevensbeschermingsautoriteit (gegevensbeschermingsautoriteit.be)</li>
            </ul>
            <p>
              Stuur uw verzoek naar{" "}
              <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>{" "}
              — wij reageren binnen 30 dagen.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">8. Beveiliging</h2>
            <p>
              Riory bv neemt de bescherming van uw gegevens serieus en past passende
              technische en organisatorische maatregelen toe om misbruik, verlies,
              onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging
              tegen te gaan. Indien u de indruk heeft dat uw gegevens niet goed beveiligd
              zijn, neem dan contact op via{" "}
              <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.
            </p>

            <h2 className="text-lg font-heading font-bold text-foreground">9. Wijzigingen</h2>
            <p>
              Riory bv behoudt zich het recht voor om dit privacybeleid aan te passen.
              Wijzigingen worden op deze pagina gepubliceerd met een aangepaste datum.
              Wij raden u aan deze pagina periodiek te raadplegen.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
