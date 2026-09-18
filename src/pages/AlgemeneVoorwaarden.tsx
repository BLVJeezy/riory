import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

const Artikel = ({ nummer, titel }: { nummer: string; titel: string }) => (
  <h2 className="text-lg font-heading font-bold text-foreground pt-2">
    Artikel {nummer} {titel}
  </h2>
);

const Tabel = ({ kop, rijen }: { kop: string[]; rijen: string[][] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr>
          {kop.map((k) => (
            <th
              key={k}
              className="text-left font-heading font-semibold text-foreground border-b border-border py-2 pr-4 align-bottom"
            >
              {k}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rijen.map((rij) => (
          <tr key={rij[0]}>
            {rij.map((cel, i) => (
              <td
                key={i}
                className={`border-b border-border py-2 pr-4 align-top ${i === 0 ? "text-foreground" : ""}`}
              >
                {/* vaste spatie na het euroteken zodat een bedrag op smalle schermen niet afbreekt */}
                {cel.replace(/€ /g, "€ ")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AlgemeneVoorwaarden = () => {
  usePageView("/algemene-voorwaarden");
  useDocumentMeta(
    "Algemene Voorwaarden | Riory",
    "Raadpleeg de algemene voorwaarden van Riory bv voor onze diensten en werkzaamheden.",
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

          <h1 className="text-2xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            Algemene Voorwaarden
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-8">
            Ontstopping, reiniging, lediging, inspectie en onderhoud — versie 18 september 2026
          </p>

          <div className="prose prose-sm md:prose-base max-w-none text-foreground/80 font-body space-y-6">
            <p>
              Deze voorwaarden regelen alle diensten van Riory, waaronder ontstoppingen, inspecties,
              herstellingen, periodieke reinigingen, reiniging van regenputten, lediging van septische
              putten en dakgootreiniging. Zij zijn opgesteld voor zowel consumenten als ondernemingen.
              Waar dwingend recht aan een consument meer bescherming geeft, blijft dat recht onverkort
              gelden. Een duidelijke en wettige regeling beschermt Riory beter dan een beding dat wegens
              zijn eenzijdigheid buiten toepassing zou worden gelaten.
            </p>

            <Artikel nummer="1" titel="Identiteit begrippen en toepassingsgebied" />
            <p>1.1 Riory BV, met maatschappelijke zetel te Natveld 47, 3740 Bilzen-Hoeselt en ondernemingsnummer BE 0840.931.404, wordt hierna "Riory" genoemd. De natuurlijke persoon of rechtspersoon die een interventie vraagt, aanvaardt of laat uitvoeren, wordt hierna de "Klant" genoemd.</p>
            <p>1.2 Deze voorwaarden zijn van toepassing op iedere aanvraag, prijsopgave, offerte, opdracht, werkbon, interventie, levering en factuur van Riory. Zij omvatten onder meer ontstopping en reiniging van afvoeren en rioleringen, camera-inspectie en plaatsbepaling, geuronderzoek, pomp- en wateroverlastwerken, herstellingen, periodiek onderhoud, reiniging van regenputten, lediging van septische putten en dakgootreiniging. Een afwijking is slechts geldig wanneer Riory die uitdrukkelijk en schriftelijk heeft aanvaard. Een bijzondere schriftelijke afspraak heeft voorrang voor het onderdeel waarop zij uitdrukkelijk afwijkt.</p>
            <p>1.3 Voor een Klant die handelt voor beroepsdoeleinden gelden de bepalingen aangeduid als B2B. Voor een natuurlijke persoon die hoofdzakelijk buiten zijn handels-, bedrijfs-, ambachts- of beroepsactiviteit handelt, gelden de bepalingen aangeduid als consument of B2C. De Klant meldt zijn hoedanigheid vóór de opdracht. Riory mag redelijkerwijs uitgaan van een beroepsopdracht wanneer de Klant een ondernemingsnummer opgeeft en een factuur voor beroepsgebruik vraagt, tenzij uit de omstandigheden duidelijk anders blijkt.</p>
            <p>1.4 B2B: algemene of aankoopvoorwaarden van de Klant worden uitgesloten, ook wanneer zij later worden meegedeeld. B2C: dwingende consumentenrechten blijven steeds gelden.</p>

            <Artikel nummer="2" titel="Informatie aanvaarding en bewijs van de opdracht" />
            <p>2.1 De Klant dient zijn aanvraag in via het online afspraakformulier van Riory, tenzij Riory uitdrukkelijk een andere schriftelijke werkwijze toestaat. Vóór verzending krijgt de Klant de voornaamste kenmerken van de gekozen dienst, de prijs of objectieve berekeningswijze, de toepasselijke toeslagen en deze voorwaarden ter beschikking. Het formulier kan slechts worden verzonden nadat de Klant deze voorwaarden door een actieve keuze heeft aanvaard.</p>
            <p>2.2 De verzonden aanvraag geldt als een bindend aanbod van de Klant binnen de gekozen dienst en de vooraf getoonde prijs- of tariefregeling. De overeenkomst ontstaat wanneer Riory de opdracht aanvaardt door een planning te bevestigen, een technieker of onderaannemer te verzenden of met de uitvoering te beginnen, naargelang wat het eerst plaatsvindt. Riory mag een aanvraag weigeren wegens capaciteit, veiligheid, werkgebied, technische ongeschiktheid, foutieve informatie of een andere redelijke grond.</p>
            <p>2.3 Riory bevestigt de aanvaarde opdracht op een duurzame gegevensdrager en mag het ingevulde formulier, de aanvaarde versie van deze voorwaarden, de meegedeelde prijsinformatie, elektronische loggegevens, berichten, de werkbon, foto's, tijdsregistraties en betalingsgegevens gebruiken als bewijs, met behoud van de wettelijke bewijsregels voor consumenten.</p>
            <p>2.4 De persoon die de opdracht geeft, verklaart bevoegd te zijn om Riory toegang te geven en de gevraagde werken te laten uitvoeren.</p>
            <p>2.5 De opdrachtgever blijft schuldenaar, ook wanneer hij verzoekt de factuur aan een eigenaar, huurder, verzekeraar, syndicus of andere derde te richten, tenzij die derde de betalingsverplichting uitdrukkelijk en schriftelijk overneemt en Riory dit aanvaardt.</p>
            <p>2.6 De Klant wijst desgevallend een aanwezige contactpersoon aan die praktische beslissingen mag nemen en noodzakelijke meerwerken mag goedkeuren. Riory hoeft instructies van onbevoegde of tegenstrijdig handelende personen niet te volgen.</p>
            <p>2.7 Een schriftelijke offerte blijft dertig kalenderdagen geldig, tenzij de offerte een andere geldigheidsduur vermeldt. Zij is beperkt tot de uitdrukkelijk omschreven prestaties en de informatie die op dat ogenblik beschikbaar is.</p>

            <Artikel nummer="3" titel="Herroepingsrecht bij dringende en geplande diensten" />
            <p>3.1 B2C: bij een overeenkomst op afstand beschikt de consument in beginsel over het wettelijke herroepingsrecht, behalve wanneer een wettelijke uitzondering geldt. Riory verstrekt de wettelijk vereiste informatie over dat recht vóór de opdracht en bevestigt de overeenkomst op een duurzame gegevensdrager.</p>
            <p>3.2 Voor een overeenkomst waarbij een consument Riory specifiek heeft verzocht hem te bezoeken voor een dringende herstelling of dringend onderhoud, waaronder een acute verstopping, terugslag, overstromingsrisico of uitval van een noodzakelijke afvoer, bestaat geen herroepingsrecht voor de specifiek gevraagde dringende werkzaamheden en voor de vervangstukken die daarvoor noodzakelijk worden gebruikt.</p>
            <p>3.3 De uitzondering voor dringende herstellingen geldt niet automatisch voor aanvullende diensten of andere goederen waar de consument niet uitdrukkelijk om heeft gevraagd. Riory voert zulke bijkomende prestaties pas uit na een afzonderlijk en aantoonbaar akkoord over de aard en de prijs of berekeningswijze.</p>
            <p>3.4 Reiniging van een regenput, lediging van een septische put, dakgootreiniging en ander gepland onderhoud gelden niet louter door hun aard als een dringende herstelling. Wanneer de consument wenst dat zo'n dienst tijdens de herroepingstermijn aanvangt, begint Riory pas na zijn afzonderlijke uitdrukkelijke verzoek. Bij een geldige herroeping na de start is de consument het evenredige bedrag verschuldigd voor de reeds correct uitgevoerde prestaties, voor zover hij vooraf overeenkomstig de wet werd geïnformeerd.</p>
            <p>3.5 Wanneer een niet-dringende dienst tijdens de herroepingstermijn volledig is uitgevoerd, verliest de consument zijn herroepingsrecht alleen indien hij vooraf uitdrukkelijk met de volledige uitvoering heeft ingestemd en heeft erkend dat hij daardoor zijn herroepingsrecht verliest. Indien niet aan de wettelijke voorwaarden is voldaan, blijft het dwingende recht van toepassing.</p>
            <p>3.6 B2B: ondernemingen beschikken niet over het wettelijke consumentenherroepingsrecht. Annulering of beëindiging wordt geregeld door artikel 12 en de bijzondere offerte of opdrachtbevestiging.</p>

            <Artikel nummer="4" titel="Prijzen tijdsregistratie en meerwerken" />
            <p>4.1 Riory deelt vóór de opdracht de totaalprijs mee of, wanneer die door de aard van de interventie redelijkerwijs niet vooraf kan worden berekend, de objectieve berekeningswijze. Die kan onder meer bestaan uit een minimuminterventie, tijdseenheden, verplaatsing, kilometers, gebruikte machines, camera- of rookinspectie, materialen, afvalverwerking en aangekondigde urgentie-, avond-, nacht-, wacht- of weekendtoeslagen.</p>
            <p>4.2 De basistarieven worden berekend exclusief btw. Bijlage 1 vermeldt de bedragen exclusief btw en inclusief 21% en 6% btw. Het tarief van 6% geldt uitsluitend wanneer aan de wettelijke voorwaarden is voldaan; de vermelding ervan houdt geen toezegging in. Voor consumenten deelt Riory vóór de opdracht de toepasselijke prijs inclusief btw of de berekeningswijze inclusief btw mee. Voor ondernemingen gelden de bedragen exclusief btw, tenzij anders vermeld. Wettelijke belastingwijzigingen worden volgens de wet toegepast.</p>
            <p>4.3 Wanneer geen vaste prijs is overeengekomen, wordt gefactureerd volgens de vooraf meegedeelde tarieven en de werkelijk bestede of gebruikte hoeveelheden. Interventietijd omvat de ter plaatse noodzakelijke diagnose, voorbereiding, uitvoering, controle, opruiming en administratieve afsluiting. Afronding per begonnen tijdseenheid geldt alleen wanneer die eenheid vooraf werd meegedeeld.</p>
            <p>4.4 Een raming is geen vaste prijs en geen resultaatsbelofte. Onvoorziene omstandigheden, verborgen gebreken, ontbrekende toegang, foutieve informatie of een wijziging van de opdracht kunnen de benodigde tijd en middelen beïnvloeden. Riory meldt de gevolgen zodra die redelijkerwijs blijken en vraagt vóór niet-noodzakelijke meerwerken een aanvullend akkoord.</p>
            <p>4.5 Een bijkomende prestatie of kost wordt bij een consument slechts aangerekend wanneer hij daar vooraf uitdrukkelijk mee heeft ingestemd. Indien geen akkoord wordt bereikt, mag Riory de interventie veilig stilleggen; de reeds uitgevoerde prestaties, verplaatsing en gebruikte materialen blijven verschuldigd.</p>
            <p>4.6 Wachttijd of vergeefse verplaatsing die ontstaat doordat de plaats niet toegankelijk, niet veilig of niet klaar is, kan aan het vooraf meegedeelde tarief worden aangerekend. Riory noteert de reden op de werkbon. Bijlage 1 maakt integraal deel uit van deze voorwaarden en bevat de standaardtarieven en berekeningsregels.</p>

            <Artikel nummer="5" titel="Uitvoering en aard van de verbintenis" />
            <p>5.1 Riory voert de opdracht zorgvuldig en volgens de regels van goed vakmanschap uit. Tenzij uitdrukkelijk schriftelijk een bepaald resultaat werd gewaarborgd, rust op Riory een inspanningsverbintenis. De betaling is verschuldigd voor de correct geleverde tijd, middelen en expertise, ook wanneer het beoogde resultaat niet volledig of niet blijvend kan worden bereikt door een oorzaak buiten een toerekenbare tekortkoming van Riory.</p>
            <p>5.2 Riory kiest de technisch verantwoorde uitvoeringsmethode op basis van de beschikbare informatie en de toestand ter plaatse. Riory mag tijdens de interventie van methode veranderen wanneer dat redelijkerwijs nodig is voor veiligheid, diagnose of beperking van schade.</p>
            <p>5.3 Riory mag werknemers, zelfstandige hulppersonen en onderaannemers inschakelen zonder voorafgaande toestemming van de Klant. Zij mogen de bepalingen van deze voorwaarden inroepen voor de prestaties waaraan zij meewerken.</p>
            <p>5.4 Aankomst- en uitvoeringstijden zijn streeftijden. Verkeer, eerdere noodinterventies, weersomstandigheden, ziekte, defect materieel, onveilige situaties en andere omstandigheden buiten de redelijke controle van Riory kunnen vertraging veroorzaken. Riory informeert de Klant zodra dat redelijkerwijs mogelijk is.</p>
            <p>5.5 Riory mag de werkzaamheden weigeren of onmiddellijk veilig stilleggen bij gevaar, agressie, ontoereikende toegang, vermoed asbest of andere gevaarlijke stoffen, niet-gemelde chemicaliën, een technisch onverantwoorde opdracht, wettelijke belemmeringen of een ernstige contractuele tekortkoming van de Klant. De reeds gemaakte kosten en prestaties blijven verschuldigd voor zover de oorzaak niet aan Riory toerekenbaar is.</p>

            <Artikel nummer="6" titel="Verplichtingen van de Klant" />
            <p>6.1 De Klant verstrekt vóór en tijdens de interventie juiste en volledige informatie over de klachten, eerdere ingrepen, gebruikte ontstoppingsproducten, gekende breuken of verzakkingen, materiaal en ouderdom van leidingen, de inhoud en geraamde capaciteit van putten, pompen, afsluiters, daken en dakgoten, ondergrondse nutsleidingen, constructies en andere relevante risico's.</p>
            <p>6.2 De Klant zorgt voor vrije, veilige en normale toegang tot de werkzone, putdeksels, aansluitpunten, dakgoten en regenpijpen, voldoende verlichting, beschikbare nutsvoorzieningen wanneer nodig, veilige parkeer- en opstelruimte en een draagkrachtige ondergrond voor voertuigen, zuigwagens, ladders of hoogtewerkers. Hij verwijdert of beschermt vooraf meubels, goederen, vloerbekleding en andere kwetsbare zaken.</p>
            <p>6.3 De Klant houdt kinderen, huisdieren en onbevoegde personen buiten de werkzone, volgt veiligheidsinstructies en komt niet tussen in de werkzaamheden. Hij gebruikt de betrokken installatie niet wanneer Riory dit tijdelijk verbiedt.</p>
            <p>6.4 De Klant verkrijgt de vereiste toestemming van eigenaar, verhuurder, mede-eigendom, beheerder of andere rechthebbenden. Voor graaf-, zaag- of breekwerken verstrekt hij alle beschikbare plannen en markeringen. Dit doet geen afbreuk aan wettelijke verplichtingen die rechtstreeks op Riory rusten.</p>
            <p>6.5 De Klant neemt redelijke maatregelen om schade te voorkomen of te beperken, onder meer door tijdig de watertoevoer af te sluiten, niet verder door te spoelen en het advies van Riory te volgen. Extra tijd, schade of kosten die aantoonbaar voortvloeien uit onjuiste informatie, ontbrekende toegang, inmenging of het niet volgen van veiligheidsinstructies zijn ten laste van de Klant, behoudens dwingend recht.</p>

            <Artikel nummer="7" titel="Technische beperkingen per dienst" />
            <p>7.1 Ontstoppings- en reinigingstechnieken oefenen mechanische of hydraulische krachten uit. Bij oude, broze, gecorrodeerde, verkeerd geplaatste, verzakte, reeds gebroken of anderszins gebrekkige leidingen kan normaal en zorgvuldig gebruik van professioneel materieel een bestaand gebrek zichtbaar maken of verergeren. Riory is niet aansprakelijk voor schade die uitsluitend uit zo'n vooraf bestaand of verborgen gebrek voortvloeit en niet door een fout van Riory is veroorzaakt.</p>
            <p>7.2 De Klant aanvaardt de normale neveneffecten van de overeengekomen interventie, zoals tijdelijk lawaai, trillingen, geur, spat- of afvalwater, beperkte vervuiling van de onmiddellijke werkzone en het moeten openen of demonteren van bereikbare onderdelen. Riory beperkt deze gevolgen redelijkerwijs; herstel van afwerking of onderdelen is alleen inbegrepen wanneer dat uitdrukkelijk is overeengekomen.</p>
            <p>7.3 Een camera-inspectie geeft enkel een beeld van het op dat ogenblik bereikbare en zichtbare leidinggedeelte. Zij is geen volledige structurele keuring, stabiliteitsstudie of garantie dat alle gebreken, zijtakken, lekken of toekomstige verstoppingen worden vastgesteld. Ligging en diepte zijn indicatief tenzij een afzonderlijke, geschikte detectie werd overeengekomen.</p>
            <p>7.4 Een tijdelijke doorgang, drukherstel of vermindering van waterpeil is niet noodzakelijk een definitieve herstelling. Structurele oorzaken zoals onvoldoende helling, wortelgroei, breuk, verzakking, foutieve aansluiting, vet- of kalkafzetting en vreemde voorwerpen kunnen een afzonderlijke herstelling vereisen.</p>
            <p>7.5 Riory geeft geen resultaatgarantie voor niet-standaard, slecht bereikbare of niet-inspecteerbare leidingen, noch wanneer veilig verder werken technisch onverantwoord is. De tot dan correct uitgevoerde prestaties blijven verschuldigd.</p>
            <p>7.6 Bij reiniging van een regenput omvat de opdracht uitsluitend de overeengekomen lediging en reiniging van de bereikbare delen. Zij is geen structurele keuring, dichtheidsproef, wateranalyse of garantie van drinkbaarheid. Desinfectie, herstel van de put, leidingen, pomp, filters of niveauregeling is alleen inbegrepen wanneer dit uitdrukkelijk werd overeengekomen. Verkleuring, aanslag of een beperkte resthoeveelheid die technisch niet veilig kan worden verwijderd, geldt niet als een gebrek.</p>
            <p>7.7 Bij lediging van een septische put wordt de prijs mede bepaald door de vooraf gemelde inhoud, het volume, de bereikbaarheid, de benodigde slanglengte, de aard van het slib en de wettelijk vereiste verwerking. Meerinhoud, verdicht slib, vreemde voorwerpen, chemicaliën, niet-huishoudelijk of gevaarlijk afval en bijkomende verwerkingskosten mogen volgens de vooraf meegedeelde berekeningswijze worden aangerekend. De lediging houdt geen garantie in over de werking, conformiteit of waterdichtheid van de put, afvoer of nabehandeling.</p>
            <p>7.8 Dakgootreiniging omvat uitsluitend de overeengekomen en veilig bereikbare goten en afvoerpunten. Doorspuiten van regenpijpen, herstel van lekken, bevestigingen, dakbedekking, voegen of afvoeren is alleen inbegrepen wanneer dit afzonderlijk werd overeengekomen. Riory mag de werken uitstellen, aanpassen of stilleggen bij wind, regen, vorst, een onveilige ondergrond, onvoldoende valbeveiliging of een broze of gebrekkige dakconstructie. Een benodigde hoogtewerker, stelling of bijkomende beveiliging wordt volgens de vooraf meegedeelde prijsregeling aangerekend.</p>
            <p>7.9 Bij periodieke reiniging, putlediging en dakgootreiniging beoordeelt Riory het resultaat op het ogenblik van oplevering. Nieuwe vervuiling, slibvorming, bladval, neerslag, gebruik, terugstroming of een technisch gebrek na de uitvoering valt niet onder een resultaatsgarantie, tenzij Riory schriftelijk een specifieke garantie heeft toegekend.</p>

            <Artikel nummer="8" titel="Werkbon vaststellingen en beeldmateriaal" />
            <p>8.1 Riory mag voor uitvoering, diagnose, kwaliteitscontrole, facturatie, bewijs, verzekerings- en geschillendossiers technische foto's, video's en meetgegevens van de installatie en werkzone maken en bewaren zolang dat voor die doeleinden of een wettelijke bewaarplicht noodzakelijk is.</p>
            <p>8.2 De werkbon kan onder meer de aankomst- en eindtijd, gebruikte techniek en materialen, vaststellingen, waarschuwingen, aanbevelingen, goedgekeurde meerwerken en de staat bij vertrek vermelden. Een handtekening bevestigt deze feitelijke gegevens en de ontvangst van de vermelde informatie, maar ontneemt een consument geen dwingende rechten.</p>
            <p>8.3 Weigering of onmogelijkheid om de werkbon te ondertekenen maakt de uitgevoerde prestaties niet kosteloos. Riory kan de uitvoering met andere bewijsmiddelen aantonen.</p>
            <p>8.4 Verslagen, camerabeelden en adviezen zijn opgesteld voor de concrete opdracht en toestand op de datum van de interventie. Derden mogen er zonder schriftelijke bevestiging van Riory niet op vertrouwen als volledige bouwkundige of structurele beoordeling.</p>
            <p>8.5 Riory gebruikt herkenbare beelden van personen, woningen of identificeerbare kenmerken niet voor reclame zonder afzonderlijke toestemming. Geanonimiseerde technische beelden kunnen worden gebruikt voor opleiding of communicatie voor zover de toepasselijke privacyregels worden nageleefd.</p>

            <Artikel nummer="9" titel="Controle klachten en herstelmogelijkheid" />
            <p>
              9.1 De Klant controleert de werken zodra dat redelijkerwijs mogelijk is en meldt een klacht
              gemotiveerd op een duurzame gegevensdrager aan{" "}
              <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>, met
              factuur- of werkbonnummer en, indien mogelijk, foto's of andere nuttige gegevens.
            </p>
            <p>9.2 B2B: zichtbare gebreken worden op de werkbon vermeld of uiterlijk binnen acht kalenderdagen na uitvoering gemeld. Verborgen gebreken worden uiterlijk binnen acht kalenderdagen na ontdekking gemeld. Bij gebrek aan tijdig protest gelden de prestaties als aanvaard, behoudens bedrog, opzet, grove fout en dwingend recht.</p>
            <p>9.3 B2C: de consument meldt een gebrek zo spoedig als redelijkerwijs mogelijk. Geen enkele termijn in deze voorwaarden beperkt dwingende consumentenrechten of vormt een onredelijk korte vervaltermijn.</p>
            <p>9.4 De Klant geeft Riory een redelijke mogelijkheid om de situatie te onderzoeken en, wanneer Riory verantwoordelijk is, zelf een passend herstel voor te stellen of uit te voeren. Behoudens dringende schadebeperking laat de Klant vóór die controle geen derde ingrijpen. Kosten van een derde zijn slechts verhaalbaar voor zover de wet dit toelaat en Riory een redelijke herstelmogelijkheid kreeg of een onmiddellijke interventie objectief noodzakelijk was.</p>
            <p>9.5 Een klacht schort de betaling van het niet-betwiste deel van de factuur niet op. Voor B2B schort een klacht de betalingsverplichting niet op, behoudens schriftelijk akkoord van Riory of een dwingende wettelijke regel.</p>

            <Artikel nummer="10" titel="Commerciële garantie en herinterventie" />
            <p>10.1 Tenzij de werkbon of offerte uitdrukkelijk een commerciële garantie vermeldt, verleent Riory geen resultaats- of herhalingsgarantie. Een nieuwe of terugkerende verstopping, vervuiling, slibvorming of ophoping bewijst op zichzelf niet dat de oorspronkelijke interventie gebrekkig was.</p>
            <p>10.2 Wanneer schriftelijk een garantie wordt toegekend, geldt uitsluitend de daarin vermelde duur en omvang. Bij gebrek aan nadere omschrijving is zij beperkt tot één herinterventie van maximaal één arbeidsuur binnen twee maanden voor exact dezelfde verstopping in hetzelfde bereikbare leidinggedeelte, op voorwaarde dat na de eerste interventie een passende camera-inspectie door Riory werd uitgevoerd en geregistreerd. Verplaatsing, bijkomende camera-inspectie, materialen, graaf- of breekwerken en prestaties van derden zijn niet inbegrepen, tenzij schriftelijk anders bepaald.</p>
            <p>10.3 Riory verleent in geen geval garantie voor zover het probleem niet door de uitvoering van Riory werd veroorzaakt. De commerciële garantie geldt onder meer niet bij structurele fouten, breuk, verzakking, wortels, onvoldoende helling, foutieve aansluiting, vet, kalk, vochtige doekjes, hygiëneproducten, vreemde voorwerpen, verkeerd gebruik, niet opgevolgd advies, een tussenkomst door de Klant of een derde, of een ander nieuw feit na de interventie.</p>
            <p>10.4 Deze commerciële regeling beperkt geen wettelijke rechten die dwingend van toepassing zijn.</p>
            <p>10.5 Voor reiniging van regenputten, lediging van septische putten, dakgootreiniging en periodiek onderhoud geldt geen standaard herinterventiegarantie. Een eventuele specifieke onderhouds- of resultaatgarantie geldt alleen wanneer zij met duur en omvang uitdrukkelijk op de offerte of werkbon is vermeld.</p>

            <Artikel nummer="11" titel="Facturatie en betaling" />
            <p>11.1 Alle facturen zijn betaalbaar uiterlijk op de vervaldag die op de factuur is vermeld, behoudens andersluidende schriftelijke overeenkomst. Bij gebreke aan een uitdrukkelijk vermelde betalingstermijn is de factuur betaalbaar binnen vijftien kalenderdagen na factuurdatum. Betaling gebeurt door overschrijving op het rekeningnummer van Riory zoals vermeld op de factuur, tenzij schriftelijk anders overeengekomen.</p>
            <p>11.2 Een verzoek om de factuur te splitsen, aan een derde te richten of voor te leggen aan een verzekeraar schort de vervaldag niet op en bevrijdt de Klant niet zolang Riory geen volledige betaling heeft ontvangen.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Ondernemingen</h3>
            <p>11.3 B2B: bij niet-betaling op de vervaldag is de Klant van rechtswege en zonder ingebrekestelling een verwijlinterest van 10 procent per jaar verschuldigd op het openstaande bedrag, vanaf de vervaldag tot de volledige betaling. Tevens is een forfaitaire schadevergoeding verschuldigd van 10 procent van het openstaande bedrag, met een minimum van 150 euro, onverminderd het recht van Riory om hogere werkelijk bewezen schade en wettelijk verhaalbare gerechtskosten te vorderen.</p>
            <p>11.4 B2B: Riory mag betalingen toerekenen op kosten, interesten en vervolgens hoofdsom binnen de grenzen van de wet. Schuldvergelijking of inhouding is slechts toegestaan voor een opeisbare en onbetwiste tegenvordering of na schriftelijk akkoord van Riory.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Consumenten</h3>
            <p>11.5 B2C: bij niet-betaling op de vervaldag verzendt Riory eerst een kosteloze herinnering op een duurzame gegevensdrager. Een schadebeding kan pas worden toegepast na het verstrijken van minstens veertien kalenderdagen, te rekenen vanaf de kalenderdag na elektronische verzending of vanaf de derde werkdag na verzending per post. De herinnering bevat de wettelijk vereiste gegevens.</p>
            <p>11.6 B2C: wanneer na die termijn niet volledig is betaald, is op het openstaande saldo een verwijlinterest verschuldigd tegen maximaal de op dat ogenblik wettelijk toegelaten rentevoet voor betalingsachterstand bij handelstransacties. Voor zover Riory op dat ogenblik een kmo is, kan die interest, na het ongebruikt verstrijken van de wachttijd, worden berekend vanaf de kalenderdag die volgt op de verzending van de herinnering; anders vanaf het einde van de wachttijd.</p>
            <p>11.7 B2C: daarnaast is, voor zover uitdrukkelijk toegestaan door Boek XIX van het Wetboek van economisch recht, de volgende forfaitaire vergoeding verschuldigd:</p>
            <Tabel
              kop={["Openstaand saldo", "Maximale forfaitaire vergoeding"]}
              rijen={[
                ["Tot en met 150 euro", "20 euro"],
                ["Van 150,01 tot en met 500 euro", "30 euro plus 10 procent van de schijf boven 150 euro"],
                [
                  "Meer dan 500 euro",
                  "65 euro plus 5 procent van de schijf boven 500 euro, met een maximum van 2.000 euro",
                ],
              ]}
            />
            <p>Andere buitengerechtelijke bedragen worden aan een consument niet aangerekend wanneer de wet dit verbiedt.</p>
            <p>11.8 B2C wederkerigheid: indien Riory door een toerekenbare tekortkoming een wezenlijke overeengekomen prestatie definitief niet uitvoert of een opeisbaar en onbetwist bedrag moet terugbetalen, en Riory dit niet herstelt of betaalt binnen veertien kalenderdagen na een duidelijke schriftelijke ingebrekestelling van de consument, heeft de consument recht op een gelijkwaardige verwijlinterest en forfaitaire vergoeding volgens dezelfde berekeningswijze, berekend op de waarde van de niet-uitgevoerde prestatie of het terug te betalen bedrag, binnen de grenzen van het toepasselijke recht.</p>

            <Artikel nummer="12" titel="Annulering opschorting en overmacht" />
            <p>12.1 Bij annulering vóór vertrek is de Klant de reeds specifiek gemaakte en niet-recupereerbare kosten verschuldigd. Bij annulering nadat een technieker of onderaannemer is vertrokken, bij afwezigheid of bij ontbrekende toegang zijn de vooraf meegedeelde verplaatsings-, wacht- en interventiekosten verschuldigd.</p>
            <p>12.2 B2B: wanneer de Klant een aanvaarde opdracht annuleert, is bovendien een forfaitaire vergoeding verschuldigd van 30 procent van de geraamde of overeengekomen prijs met een minimum van 150 euro, behoudens bewijs van hogere schade. Reeds uitgevoerde prestaties en geleverde of bestelde materialen worden afzonderlijk volledig aangerekend.</p>
            <p>12.3 B2C: de consument betaalt bij beëindiging enkel de reeds uitgevoerde prestaties, gebruikte of specifiek bestelde materialen, gemaakte verplaatsing en een redelijke vergoeding voor aantoonbaar verlies, voor zover de wet dit toestaat. Een vergoeding mag niet kennelijk onevenredig zijn.</p>
            <p>12.4 Riory mag verdere prestaties opschorten bij niet-betaling, gebrek aan noodzakelijke medewerking, onveilige omstandigheden of een andere ernstige tekortkoming van de Klant. Waar de omstandigheden dit toelaten, krijgt de Klant eerst een redelijke termijn om de tekortkoming te verhelpen. Bij onmiddellijk gevaar is geen voorafgaande termijn vereist.</p>
            <p>12.5 Geen partij is aansprakelijk voor vertraging of niet-uitvoering door overmacht of een gebeurtenis buiten haar redelijke controle die de uitvoering tijdelijk of blijvend onmogelijk maakt. Riory mag de interventie herplannen of het niet-uitgevoerde deel beëindigen. Een ontvangen voorschot voor definitief niet-uitgevoerde prestaties wordt terugbetaald, na verrekening van reeds geleverde prestaties en niet-recupereerbare kosten.</p>

            <Artikel nummer="13" titel="Aansprakelijkheid en schadebeperking" />
            <p>13.1 Riory is uitsluitend aansprakelijk voor bewezen directe schade die het noodzakelijke gevolg is van een aan Riory toerekenbare contractuele tekortkoming. De Klant bewijst de tekortkoming, de schade en het oorzakelijk verband, behoudens een dwingende afwijkende bewijsregel.</p>
            <p>13.2 Voor zover wettelijk toegelaten is Riory niet aansprakelijk voor indirecte of gevolgschade, zoals winstderving, bedrijfsonderbreking, gebruiksderving, gemiste huur, verlies van gegevens, verlies van goederen of aanspraken van derden, behalve wanneer die uitsluiting volgens dwingend recht niet is toegestaan.</p>
            <p>13.3 Voor zover wettelijk toegelaten is de totale aansprakelijkheid van Riory per schadegeval en per samenhangende reeks schadegevallen beperkt tot het bedrag dat haar aansprakelijkheidsverzekeraar voor het betrokken geval daadwerkelijk uitkeert, vermeerderd met het toepasselijke eigen risico. Indien zonder fout van Riory geen verzekeringsdekking bestaat, is de aansprakelijkheid beperkt tot het netto factuurbedrag van de prestaties die de schade hebben veroorzaakt.</p>
            <p>13.4 De beperkingen van dit artikel gelden niet voor schade door opzet of grove fout van Riory of haar aangestelden of lasthebbers, voor overlijden of aantasting van de fysieke of psychische integriteit, voor het niet-uitvoeren van een van de voornaamste prestaties behoudens overmacht, of in andere gevallen waarin beperking dwingend verboden is.</p>
            <p>13.5 Riory is niet aansprakelijk voor schade door een vooraf bestaand of verborgen gebrek, normale slijtage, foutieve plannen of informatie, handelen van de Klant of een niet door Riory aangestelde derde, of het niet naleven van waarschuwingen, behalve in de mate waarin een bewezen fout van Riory zelf tot de schade heeft bijgedragen.</p>
            <p>13.6 De Klant meldt een schadegeval onmiddellijk, neemt redelijke maatregelen om verdere schade te beperken en bewaart de toestand en relevante bewijsstukken voor inspectie. Vermijdbare schade door het niet naleven van deze verplichting komt niet ten laste van Riory voor zover de wet dit toelaat.</p>
            <p>13.7 B2B: de Klant vrijwaart Riory tegen aanspraken van derden die voortvloeien uit onbevoegde opdrachtverlening, foutieve of onvolledige informatie, inmenging in de werken of een tekortkoming van de Klant, behalve voor het aandeel dat door een fout van Riory werd veroorzaakt. B2C: deze vrijwaring geldt uitsluitend binnen de grenzen van het dwingende recht en voor schade die aan de consument toerekenbaar is.</p>

            <Artikel nummer="14" titel="Buitencontractuele vorderingen en hulppersonen" />
            <p>14.1 Voor zover wettelijk toegelaten komen Riory en de Klant overeen dat schade die verband houdt met de niet-nakoming van de overeenkomst uitsluitend volgens het contractuele aansprakelijkheidsrecht en deze voorwaarden wordt beoordeeld. De Klant stelt voor die schade geen buitencontractuele vordering in tegen Riory wanneer dit contractueel kan worden uitgesloten.</p>
            <p>14.2 Voor zover wettelijk toegelaten doet de Klant afstand van buitencontractuele vorderingen tegen de hulppersonen van Riory die aan de uitvoering meewerken, waaronder bestuurders, werknemers, aangestelden en zelfstandige onderaannemers. Deze hulppersonen zijn derden-begunstigden van dit beding en mogen alle relevante verweermiddelen, uitsluitingen en beperkingen uit de overeenkomst inroepen.</p>
            <p>14.3 Dit artikel geldt niet voor vorderingen wegens aantasting van de fysieke of psychische integriteit, een fout begaan met het opzet schade te veroorzaken, of wanneer een dwingende wettelijke bepaling de vordering of aansprakelijkheid beschermt.</p>

            <Artikel nummer="15" titel="Persoonsgegevens en communicatie" />
            <p>15.1 Riory verwerkt contact-, opdracht-, facturatie- en technische gegevens voor klantenbeheer, uitvoering, veiligheid, bewijs, facturatie, invordering en naleving van wettelijke verplichtingen. Verdere informatie staat in de privacyverklaring van Riory.</p>
            <p>15.2 De Klant deelt wijzigingen van contact- of facturatiegegevens onmiddellijk mee. Berichten worden geldig verzonden naar de laatst meegedeelde contactgegevens, zonder afbreuk te doen aan wettelijke regels die een bijzondere verzendwijze opleggen.</p>
            <p>15.3 Elektronische documenten, bevestigingen en handtekeningen hebben de bewijswaarde die de wet eraan toekent. Riory bewaart ze gedurende de termijn die redelijkerwijs nodig is voor uitvoering, garantie, aansprakelijkheid, boekhouding en invordering.</p>

            <Artikel nummer="16" titel="Slotbepalingen toepasselijk recht en bevoegde rechter" />
            <p>16.1 Belgisch recht is van toepassing.</p>
            <p>16.2 B2B: uitsluitend de rechtbanken bevoegd voor de maatschappelijke zetel van Riory zijn bevoegd, onverminderd het recht van Riory om te dagvaarden voor een andere wettelijk bevoegde rechtbank. B2C: uitsluitend de rechter die volgens de dwingende wettelijke bevoegdheidsregels bevoegd is, kan worden aangewezen.</p>
            <p>16.3 Indien een bepaling geheel of gedeeltelijk ongeldig of niet-afdwingbaar is, blijven de overige bepalingen gelden voor zover de overeenkomst zonder die bepaling kan voortbestaan. Voor consumenten treedt de toepasselijke dwingende wettelijke regeling in de plaats voor zover de wet dat bepaalt; een onrechtmatig beding wordt niet tegen de consument toegepast. Voor B2B wordt de ongeldige bepaling, voor zover wettelijk mogelijk, beperkt tot wat geldig en afdwingbaar is.</p>
            <p>16.4 Het niet onmiddellijk uitoefenen van een recht door Riory houdt geen afstand van dat recht in. Een afstand is slechts geldig wanneer zij uitdrukkelijk en schriftelijk gebeurt.</p>
            <p>16.5 Deze versie geldt voor overeenkomsten gesloten vanaf 18 september 2026. Een latere versie geldt alleen voor toekomstige opdrachten nadat zij tijdig aan de Klant beschikbaar werd gesteld. Wijzigingen tijdens een lopende opdracht vereisen het uitdrukkelijke akkoord van beide partijen, tenzij een dwingende wetswijziging onmiddellijke toepassing vereist.</p>

            <h2 className="text-lg font-heading font-bold text-foreground pt-4">Bijlage 1 Tarieven en berekeningsregels</h2>
            <p>Deze bijlage maakt deel uit van de algemene voorwaarden van 18 september 2026. Een uitdrukkelijk overeengekomen bijzondere offerte heeft voorrang voor de betrokken prestaties. Alle bedragen zijn in euro. De kolom met 6% btw geldt uitsluitend indien dat tarief wettelijk van toepassing is op de betrokken prestatie. Anders geldt 21%. Het btw-tarief wordt bepaald op basis van de aard van de werken en de toepasselijke wettelijke voorwaarden, niet uitsluitend op basis van de ouderdom van de woning.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Interventie en bijkomende werktijd</h3>
            <Tabel
              kop={["Prestatie", "Excl. btw", "Incl. 21%", "Incl. 6%*"]}
              rijen={[
                ["Interventie met eerste uur inbegrepen", "€ 165,00", "€ 199,65", "€ 174,90"],
                ["Daarna per begonnen kwartier", "€ 41,25", "€ 49,91", "€ 43,73"],
                ["Interventie met eerste uur bij +50%", "€ 247,50", "€ 299,48", "€ 262,35"],
                ["Daarna per begonnen kwartier bij +50%", "€ 61,88", "€ 74,87", "€ 65,59"],
                ["Interventie met eerste uur bij +100%", "€ 330,00", "€ 399,30", "€ 349,80"],
                ["Daarna per begonnen kwartier bij +100%", "€ 82,50", "€ 99,83", "€ 87,45"],
              ]}
            />
            <p>Het interventiebedrag omvat het eerste werkuur. Na het eerste uur wordt elk begonnen kwartier aangerekend op basis van het uurtarief van € 165,00 excl. btw, verhoogd met de toepasselijke tijdstoeslag. Kilometervergoeding, eventuele reistijd en overeengekomen cameratoeslag komen daar afzonderlijk bij.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Avond nacht weekend en feestdagen</h3>
            <Tabel
              kop={["Periode", "Toeslag op interventie en werktijd"]}
              rijen={[
                ["Maandag t/m vrijdag van 08.00 tot 16.00 uur, behalve feestdagen", "Geen"],
                ["Maandag t/m donderdag van 16.00 tot 22.00 uur, behalve feestdagen", "+50%"],
                ["Nachten van maandag op dinsdag t/m donderdag op vrijdag, van 22.00 tot 08.00 uur", "+100%"],
                ["Vrijdag 16.00 uur tot maandag 08.00 uur", "+100%"],
                ["Belgische wettelijke feestdagen, van 00.00 tot 24.00 uur", "+100%"],
              ]}
            />
            <p>De tijdstoeslag geldt uitsluitend op het interventiebedrag met het eerste uur en op de bijkomende werkkwartieren. Zij geldt niet op reistijd, kilometervergoeding of cameratoeslagen. Bij overlap geldt één toepasselijke toeslag; toeslagen worden niet opgeteld. De toepasselijke tariefregeling wordt vóór de opdracht meegedeeld.</p>
            <p className="text-sm text-muted-foreground">* 6% uitsluitend indien wettelijk van toepassing. Bedragen in de tabellen zijn afgerond op twee decimalen. Bij +50% is de exacte grondslag per werkkwartier € 61,875 excl. btw. De berekening gebeurt met de ongeronde grondslag; afronding gebeurt op de factuur. Daardoor kan een totaal afwijken van de som van afgeronde eenheidsprijzen.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Verplaatsing en camera</h3>
            <Tabel
              kop={["Prestatie", "Excl. btw", "Incl. 21%", "Incl. 6%*"]}
              rijen={[
                ["Kilometervergoeding per kilometer", "€ 1,45", "€ 1,75", "€ 1,54"],
                ["Reistijd per begonnen kwartier", "€ 25,00", "€ 30,25", "€ 26,50"],
                ["Reistijd per uur als berekeningsbasis", "€ 100,00", "€ 121,00", "€ 106,00"],
                ["Cameratoeslag 32 t/m 75 mm", "€ 100,00", "€ 121,00", "€ 106,00"],
                ["Cameratoeslag meer dan 75 t/m 110 mm", "€ 125,00", "€ 151,25", "€ 132,50"],
                ["Cameratoeslag 125 t/m 250 mm", "€ 150,00", "€ 181,50", "€ 159,00"],
              ]}
            />

            <h3 className="text-base font-heading font-bold text-foreground">Kilometers en reistijd volgens Maps</h3>
            <p>De kilometervergoeding wordt automatisch via Maps berekend voor de heenrit vanaf de maatschappelijke zetel van Riory naar het interventieadres en de terugrit naar die zetel. De som van beide afstanden wordt vermenigvuldigd met € 1,45 excl. btw per kilometer. De zetel is vermeld in artikel 1.1.</p>
            <p>Wanneer de volgens Maps berekende enkele heenrit meer dan 30 minuten bedraagt, wordt daarnaast de volledige via Maps berekende reistijd voor heen en terug aangerekend. Niet alleen het gedeelte boven 30 minuten is betalend. Het tarief bedraagt € 100,00 excl. btw per uur, aangerekend per begonnen kwartier van de totale reistijd: € 25,00 excl. btw per begonnen kwartier.</p>
            <p>Bij een berekende enkele heenrit van maximaal 30 minuten wordt geen reistijdvergoeding volgens deze regeling aangerekend; de kilometervergoeding blijft verschuldigd. De berekening steunt op de routeafstand en reistijd uit Maps, niet op de werkelijk gereden tijd. Riory deelt de gebruikte afstand, reistijd en daaruit volgende verplaatsingskost vóór de opdracht mee en bewaart de berekening bij de opdrachtgegevens.</p>
            <p>Voorbeeld: Maps berekent 40 minuten heen en 40 minuten terug. De totale reistijd van 80 minuten wordt aangerekend als zes begonnen kwartieren: € 150,00 excl. btw, of € 181,50 incl. 21% btw (€ 159,00 incl. 6% indien wettelijk van toepassing). De kilometervergoeding en interventie worden afzonderlijk toegevoegd.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Toepassing van de cameratoeslag</h3>
            <p>De cameratoeslag wordt bepaald door de leidingdiameter volgens de tabel en komt bovenop het interventietarief. Voor 75 mm geldt € 100,00 excl. btw; voor 110 mm geldt € 125,00 excl. btw. Voor diameters die niet in de tabel zijn opgenomen, wordt de cameratoeslag vooraf afzonderlijk overeengekomen. Er geldt geen avond-, nacht-, weekend- of feestdagverhoging op de cameratoeslag.</p>

            <h3 className="text-base font-heading font-bold text-foreground">Overige diensten en kosten</h3>
            <p>Voor prestaties waarvoor deze lijst geen prijs vastlegt, waaronder afzonderlijk aangeboden regenputreiniging, lediging van septische putten en dakgootreiniging, geldt de vooraf meegedeelde en aanvaarde offerte of prijsberekening. Deze bijlage stelt daarvoor geen forfaitair totaalbedrag vast. Bijkomende materialen, bijzondere machines of andere kosten worden alleen aangerekend volgens de vooraf meegedeelde en overeengekomen prijsregeling.</p>
            <p className="text-sm text-muted-foreground">* 6% uitsluitend indien wettelijk van toepassing. Het bedrag inclusief btw per kilometer is een afgeronde weergave. Het kilometertotaal wordt berekend op basis van € 1,45 excl. btw per kilometer; vervolgens wordt de toepasselijke btw berekend en afgerond op de factuur.</p>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                Riory BV — Natveld 47, 3740 Bilzen-Hoeselt<br />
                BE 0840.931.404 — RPR Tongeren<br />
                0472 50 28 14 —{" "}
                <a href="mailto:info@riory.be" className="text-primary hover:underline">info@riory.be</a>
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
