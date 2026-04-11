import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const AlgemeneVoorwaarden = () => {
  usePageView("/algemene-voorwaarden");
  useDocumentMeta("Algemene Voorwaarden | Riory", "Raadpleeg de algemene voorwaarden van Riory bv voor onze diensten en werkzaamheden.");

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
            Algemene Voorwaarden
          </h1>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 1. Toepassing algemene voorwaarden</h2>
            <p>1.1 Deze algemene voorwaarden zijn van toepassing op alle offertes, prijslijsten, bestellingen en facturen van BV Riory, met maatschappelijke zetel te 3740 Bilzen, Toekomststraat 19 en met ondernemingsnummer: 0840.931.404 (hierna "Riory"). Door het afsluiten van een overeenkomst met Riory aanvaardt de Klant deze algemene voorwaarden integraal.</p>
            <p>1.2 De algemene voorwaarden sluiten de toepassing van enige algemene voorwaarden van de Klant uit en primeren steeds op de algemene voorwaarden van de Klant.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 2. Afsluiten van de overeenkomst</h2>
            <p>2.1 Gelet op het dringend karakter van de dienstverlening worden de overeenkomsten doorgaans telefonisch afgesloten. Desgevallend komt de overeenkomst tot stand na bevestiging vanwege Riory dat de aanvraag in de planning werd opgenomen.</p>
            <p>2.2 Voor werken aan een regenput zal Riory een offerte opstellen, dewelke steeds vrijblijvend is tot integrale aanvaarding ervan door de Klant. De overeenkomst komt tot stand wanneer de Klant de offerte ongewijzigd en binnen de geldigheidstermijn voor akkoord ondertekend terugzendt aan Riory.</p>
            <p>2.3 Bestellingen en offertes zijn strikt beperkt tot hun voorwerp en zijn gebaseerd op informatie die beschikbaar is op het ogenblik van het opstellen van de bestelling of de offerte.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 3. Annulering van de bestelling</h2>
            <p>3.1 De annulering van een bestelling is slechts mogelijk mits betaling van een schadevergoeding van 30% van de overeengekomen prijs, met een minimum van € 150,00, tenzij Riory een hogere schade aantoont.</p>
            <p>3.2 De Klant, dewelke handelt in zijn hoedanigheid van consument, geniet van dezelfde voorwaarden indien Riory de bestelling annuleert.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 4. Prijzen</h2>
            <p>4.1 Alle prijzen worden vermeld in de offerte, prijslijsten of de werkbon.</p>
            <p>4.2 Verkeerde, gewijzigde of nieuwe omstandigheden kunnen aanleiding geven tot eenzijdige wijziging van de voorwaarden en/of de prijs.</p>
            <p>4.3 Alle werken die niet specifiek werden vermeld in de offerte zullen aanleiding geven tot een prijsvermeerdering.</p>
            <p>4.4 De vermelde prijzen zijn inclusief 1 uur aan dienstverlening; na het eerste uur zullen de geleverde diensten per begonnen 15 min in regie in rekening worden gebracht.</p>
            <p>4.5 Diensten die na 16u00 geleverd worden of urgente interventies worden aan 150% van de medegedeelde prijzen aangerekend.</p>
            <p>4.6 Diensten die in het weekend worden geleverd (vanaf vrijdag om 16u00) worden aan 200% van de medegedeelde prijzen aangerekend.</p>
            <p>4.7 Tenzij anders bepaald in een offerte, zijn camera-onderzoeken nooit inbegrepen en worden enkel tegen een meerprijs uitgevoerd.</p>
            <p>4.8 Indien de veiligheid of de hoogte van het gebouw het gebruik van een hoogtewerker noodzaken, zal deze als meerprijs aangerekend worden.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 5. Uitvoering werken</h2>
            <p>5.1 Riory verbindt zich ertoe alle redelijke inspanningen te leveren om de overeenkomst met zorg uit te voeren. Op Riory rust een inspanningsverbintenis.</p>
            <p>5.2 De Klant verbindt zich ertoe op geen enkele wijze tussen te komen voor, tijdens en na de werkzaamheden van Riory, tenzij op uitdrukkelijk instructie van Riory.</p>
            <p>5.3 Riory spant zich in de reiniging zo goed als mogelijk uit te voeren. Riory is niet verantwoordelijk voor enige beschadiging indien de reinigingsmaterialen overbelast worden.</p>
            <p>5.4 Indien Riory graafwerken dient uit te voeren, is de Klant verantwoordelijk voor het verstrekken van alle nodige plannen en informatie.</p>
            <p>5.5 Opgegeven uitvoeringstermijnen zijn steeds indicatief en binden Riory niet.</p>
            <p>5.6 Meerwerken worden uitsluitend uitgevoerd in regie aan het tarief vermeld op de offerte.</p>
            <p>5.7–5.12 Na uitvoering van de werken zal Riory – indien van toepassing – de door hem gemaakte openingen afdichten. De Klant dient ervoor te zorgen dat de werken onmiddellijk kunnen worden aangevat. Voor buizen met een diameter kleiner dan 40 mm of groter dan 300 mm kan geen garantie gegeven worden op een gunstig resultaat.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 6. Betalingsmodaliteiten</h2>
            <p>6.1 Alle facturen zijn betaalbaar binnen de termijn vermeld op de factuur.</p>
            <p>6.2 Indien de Klant nalaat over te gaan tot betaling op de vervaldag, is de Klant van rechtswege een nalatigheidsintrest aan 10% per jaar verschuldigd, alsook een forfaitaire schadevergoeding van 10% van het factuurbedrag met een minimum van € 150,00.</p>
            <p>6.3 Elke vertraging in de betaling kan aanleiding geven om nog uit te voeren leveringen en werken op te schorten of te ontbinden.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 7. Klachten – protest van de factuur</h2>
            <p>7.1 Elk protest dient per aangetekende brief aan Riory te worden bezorgd binnen een termijn van acht kalenderdagen met een gedetailleerde omschrijving van de klacht.</p>
            <p>7.2 In geval van protest dient de Klant de werf ter beschikking te houden voor Riory met het oog op inspectie.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 8. Garantie</h2>
            <p>8.1 Er wordt een garantietermijn van twee maanden geboden bij ontstoppingswerken uitgevoerd met camera-inspectie. Zonder camera-inspectie kan er geen garantie geboden worden.</p>
            <p>8.2 Riory verleent in geen enkel geval garantie bij structurele fouten, verstoppingen wegens vochtige doekjes, hygiënische producten, vet, verzakkingen, breuken of fouten in de riolering.</p>
            <p>8.3 De garantie is beperkt tot 1 uur interventie; na het eerste uur zullen de geleverde diensten per begonnen 15 min in regie in rekening worden gebracht.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 9. Aansprakelijkheid</h2>
            <p>9.1 Riory kan niet aansprakelijk worden gesteld voor enige fout, behoudens ingeval van grove fouten, bedrog of opzet. Riory is in geen geval aansprakelijk voor enige onrechtstreekse schade.</p>
            <p>9.2 De aansprakelijkheid van Riory is beperkt tot de terugbetaling van de prijs ofwel het opnieuw uitvoeren van de diensten, naar keuze van Riory.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 10. Beëindiging</h2>
            <p>10.1 Een beëindiging van de aan Riory toevertrouwde opdracht is slechts mogelijk mits uitdrukkelijk akkoord, waarbij de Klant steeds gehouden is de reeds uitgevoerde werken en kosten integraal te voldoen, vermeerderd met een vergoeding gelijk aan 50% van de totale prijs excl. BTW.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 11. Nietigheid</h2>
            <p>11.1 Indien één der artikelen van deze algemene voorwaarden nietig zou blijken te zijn, stemmen Partijen er mee in deze bepaling te vervangen door een geldige bepaling.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 12. Toepasselijk recht en bevoegde rechtbank</h2>
            <p>12.1 Het Belgisch recht is van toepassing. Elk geschil zal worden beslecht door de bevoegde rechtbank bevoegd voor het rechtsgebied waar Riory haar maatschappelijke zetel heeft.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">Artikel 13. Overige</h2>
            <p>13.1 Riory behoudt zich het recht voor om beeldmateriaal van de werf te gebruiken als publiciteitsmateriaal.</p>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                Riory bv — Natveld 47, B-3740 Bilzen-Hoeselt<br />
                BTW BE 0840.931.404 RPR Tongeren<br />
                E-mail: <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AlgemeneVoorwaarden;
