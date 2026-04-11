import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const DataProtection = () => {
  usePageView("/data-protection");
  useDocumentMeta("Data Protection Notice | Riory", "Data protection notice van Riory bv conform de GDPR-wetgeving.");

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
            Data Protection Notice
          </h1>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <h2 className="text-lg font-heading font-bold text-foreground">1. Inleiding</h2>
            <p>Riory bv met maatschappelijke zetel te Toekomststraat 19 3740 te Bilzen en ingeschreven in de Kruispuntbank van Ondernemingen met ondernemingsnummer BE 0840.931.404 hecht veel belang aan een veilige, transparante en vertrouwelijke verzameling en verwerking van uw persoonsgegevens. In het bijzonder willen wij de gegevens van o.a. onze klanten, onderaannemers en leveranciers beschermen tegen onder meer verlies, lekken, fouten, onterechte toegangen of onrechtmatige verwerkingen. Wij willen u door middel van deze Data Protection Notice informeren over de verzameling en verwerking van uw persoonsgegevens.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">2. Toepassingsgebied</h2>
            <p>Deze Data Protection Notice heeft betrekking op alle diensten die door ons worden verstrekt en in het algemeen op alle activiteiten die wij uitvoeren.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">3. Verwerkingsverantwoordelijke</h2>
            <p>Riory bv, met maatschappelijke zetel te Toekomststraat 19 3740 te Bilzen en met ondernemingsnummer BE0774.844.116 is de verwerkingsverantwoordelijke van uw persoonsgegevens. Bij de verzameling en verwerking van uw persoonsgegevens respecteren wij de Belgische regelgeving inzake bescherming van persoonsgegevens, evenals de Algemene Verordening Gegevensbescherming ("GDPR") vanaf haar inwerkingtreding op 25 mei 2018.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">4. Persoonsgegevens</h2>
            <p>Naargelang uw activiteiten en uw relatie tot onze onderneming, deelt u ons de volgende persoonsgegevens mee: uw identiteits- en contactgegevens (naam, aanspreektitel, adres, e-mail-adres, telefoon- en gsm-nummer). U bent niet verplicht om uw persoonsgegevens mee te delen, maar u begrijpt dat het verlenen van bepaalde diensten of het samenwerken onmogelijk wordt wanneer u niet instemt met de verzameling en verwerking eraan.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">5. Verwerkingsdoeleinden en rechtsgrond</h2>
            <h3 className="text-base font-heading font-semibold text-foreground">5.1 Klantgegevens</h3>
            <p>In het kader van onze dienstverlening verzamelen en verwerken wij de identiteits- en contactgegevens van onze klanten en opdrachtgevers. De doeleinden zijn de uitvoering van de overeenkomsten, het klantenbeheer, de boekhouding en direct marketingactiviteiten.</p>

            <h3 className="text-base font-heading font-semibold text-foreground">5.2 Gegevens van leveranciers en onderaannemers</h3>
            <p>Wij verzamelen en verwerken de identiteits- en contactgegevens van onze leveranciers en onderaannemers. De doeleinden zijn de uitvoering van de overeenkomst, het beheer van de leveranciers/onderaannemers en de boekhouding.</p>

            <h3 className="text-base font-heading font-semibold text-foreground">5.3 Gegevens van personeel</h3>
            <p>Wij verwerken de persoonsgegevens van onze werknemers in het kader van ons personeelsbeheer en de loonadministratie.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">6. Duur van de verwerking</h2>
            <p>De persoonsgegevens worden door ons bewaard en verwerkt voor een periode die noodzakelijk is in functie van de doeleinden van de verwerking. Klantengegevens en gegevens van leveranciers of onderaannemers zullen na een termijn van 1 maand na de beëindiging van de overeenkomst uit onze systemen worden verwijderd.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">7. Rechten</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Recht op toegang en inzage:</strong> u heeft het recht om kosteloos kennis te nemen van de gegevens die wij over u hebben.</li>
              <li><strong>Recht op rectificatie:</strong> u heeft het recht om rectificatie van uw onjuiste persoonsgegevens te verkrijgen.</li>
              <li><strong>Recht op gegevenswissing of beperking:</strong> u heeft het recht om ons te verzoeken uw persoonsgegevens te wissen of de verwerking ervan te beperken.</li>
              <li><strong>Recht op overdraagbaarheid:</strong> u heeft het recht de persoonsgegevens in een gestructureerde, gangbare en machineleesbare vorm te verkrijgen.</li>
              <li><strong>Recht van bezwaar:</strong> u heeft het recht bezwaar te maken tegen de verwerking van uw persoonsgegevens.</li>
              <li><strong>Recht van intrekking van de toestemming:</strong> u beschikt over het recht uw toestemming in te trekken.</li>
            </ul>
            <p>U kan voormelde rechten uitoefenen door u te wenden tot <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">8. Doorgifte aan derden</h2>
            <p>Bepaalde persoonsgegevens die door ons worden verzameld, zullen worden doorgegeven aan derde dienstverleners, zoals onze IT-leverancier, boekhouder en revisor. Wij zullen uw persoonsgegevens in geen geval verkopen of commercieel ter beschikking stellen aan direct marketingbureaus.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">9. Technische en organisatorische maatregelen</h2>
            <p>Wij nemen de nodige technische en organisatorische maatregelen om uw persoonsgegevens volgens een afdoend veiligheidsniveau te verwerken en deze te beschermen tegen vernietiging, verlies, vervalsing of wijziging.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">10. Toegang door derden</h2>
            <p>Met het oog op de verwerking van uw persoonsgegevens, verlenen wij toegang tot uw persoonsgegevens aan onze werknemers, medewerkers en aangestelden. Wij garanderen een gelijkaardig niveau van bescherming.</p>

            <h2 className="text-lg font-heading font-bold text-foreground">11. Nog vragen?</h2>
            <p>Indien u verdere vragen of opmerkingen heeft, kan u contact opnemen met Riory bv per post naar Toekomststraat 19 3740 te Bilzen of per e-mail aan <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DataProtection;
