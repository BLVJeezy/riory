import { Link } from "react-router-dom";
import { MapPin, Check } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export const GENK_EXTRA_FAQ = [
  {
    question: "Hoe snel is een ontstoppingsdienst in Genk ter plaatse?",
    answer:
      "Riory vertrekt vanuit Bilzen en rijdt via de E314 en de N76 naar Genk. In de meeste gevallen zijn we binnen 1 tot 2 uur ter plaatse, ook in Winterslag, Waterschei, Zwartberg en Bret-Gelieren.",
  },
  {
    question: "Komen jullie ook 's nachts en in het weekend naar Genk?",
    answer:
      "Ja. Onze ontstoppingsdienst in Genk is 24/7 bereikbaar, ook op zon- en feestdagen. Bij water dat omhoog komt of een riool dat overloopt, komen we zo snel mogelijk.",
  },
  {
    question: "Wat doe ik als mijn riool in Genk verstopt is en het water stijgt?",
    answer:
      "Stop met water gebruiken (geen toilet doorspoelen, geen vaatwasser of wasmachine), zet waardevolle spullen hoog en bel ons meteen. Probeer geen agressieve chemische ontstopper: die beschadigt leidingen en helpt zelden bij een verstopte hoofdriolering.",
  },
  {
    question: "Waarom raakt de riolering in oudere Genkse woningen vaker verstopt?",
    answer:
      "In de oude mijnwijken en tuinwijken zoals Winterslag, Waterschei en Zwartberg liggen vaak nog oudere gres- of betonleidingen. Wortelingroei, verzakkingen en vet- en kalkafzetting zorgen daar sneller voor terugkerende verstoppingen. Met een camera-inspectie zien we exact waar het probleem zit.",
  },
  {
    question: "Kunnen jullie ook een septische put of regenwaterput in Genk ledigen of reinigen?",
    answer:
      "Ja. Naast het ontstoppen van WC, afvoer en riool, ledigen we septische putten en reinigen we regenwaterputten in heel Genk en omgeving.",
  },
];

const WIJKEN = [
  { naam: "Genk-Centrum", tekst: "Appartementen en handelspanden rond de Stadsplein en de Molenstraat: vaak verstopte gemeenschappelijke afvoeren en keukenleidingen." },
  { naam: "Winterslag", tekst: "Karakteristieke mijnwoningen met oudere rioleringen. Wortelingroei en verzakte leidingen zien we hier regelmatig." },
  { naam: "Waterschei", tekst: "Tuinwijk met lange afvoerleidingen naar de straatkant: ideaal voor een camera-inspectie bij terugkerende problemen." },
  { naam: "Zwartberg", tekst: "Oudere woningen en nieuwbouw door elkaar. We ontstoppen hier zowel WC's als hoofdrioleringen." },
  { naam: "Bret-Gelieren & Langerlo", tekst: "Rustige woonwijken met veel vrijstaande woningen, septische putten en regenwaterputten." },
  { naam: "Sledderlo & Kolderbos", tekst: "Appartementen en rijwoningen: verstopte keukenafvoeren en badkamers zijn hier de meest voorkomende oproepen." },
  { naam: "Termien & Boxbergheide", tekst: "Gezinswoningen waar vet, haar en zeepresten de afvoer van keuken en douche blokkeren." },
  { naam: "Kattevennen, Hoevenzavel & Zwartberg-Noord", tekst: "Ook in de groenere randwijken van Genk staan we snel aan de deur." },
];

const PROBLEMEN = [
  { titel: "WC verstopt in Genk", tekst: "Te veel papier, vochtige doekjes of een doorgespoeld voorwerp. We ontstoppen met een veer of hogedruk, zonder breekwerk." },
  { titel: "Riool verstopt in Genk", tekst: "Water dat omhoog komt in de douche of kelder, gorgelende geluiden of stank: vaak zit de hoofdriolering dicht. We spuiten de leiding vrij met hogedruk." },
  { titel: "Gootsteen en keukenafvoer", tekst: "Vet en etensresten stollen in de leiding. Wij reinigen de volledige afvoer, niet enkel het sifon." },
  { titel: "Douche en bad lopen traag af", tekst: "Haar en zeepresten vormen een prop. We maken de afvoer weer volledig vrij." },
  { titel: "Terugkerende verstoppingen", tekst: "Komt het probleem steeds terug? Met een camera-inspectie zoeken we de echte oorzaak: een breuk, verzakking of wortels." },
  { titel: "Stankoverlast", tekst: "Een rioolgeur in huis wijst vaak op een droge sifon, een lek of een probleem in de riolering. We sporen de bron op." },
];

const GenkExtraContent = () => {
  const { localizedPath } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto mb-12 md:mb-16 space-y-12 md:space-y-16">
      <section>
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
          Uw ontstoppingsdienst in Genk: lokaal, snel en zonder breekwerk
        </h2>
        <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
          <p>
            Zoekt u een betrouwbare <strong className="text-foreground">ontstoppingsdienst in Genk</strong>? Riory helpt
            particulieren, verhuurders en bedrijven in heel Genk (3600) bij elke verstopping: van een verstopte WC
            tot een volledig dichtgeslibde hoofdriolering. We werken met professionele hogedrukreinigers, ontstoppingsveren
            en een rioolcamera, zodat we het probleem in één keer en zonder kap- of breekwerk oplossen.
          </p>
          <p>
            Genk is een grote stad met heel verschillende woningtypes: van de historische mijnwoningen in Winterslag en
            Waterschei tot moderne appartementen in het centrum. Elk type woning heeft zijn eigen leidingen en zijn eigen
            typische problemen. Omdat we dagelijks in Limburg aan de slag zijn, weten we waar we moeten kijken.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
          Veelvoorkomende verstoppingen in Genk
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROBLEMEN.map((p) => (
            <div key={p.titel} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading font-bold text-foreground mb-2 flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                {p.titel}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{p.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
          Actief in alle wijken van Genk
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          Onze ontstoppingsdienst rijdt dagelijks door heel Genk. Een overzicht van de wijken waar we het vaakst komen:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {WIJKEN.map((w) => (
            <div key={w.naam} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-heading font-bold text-foreground mb-1">Ontstoppingsdienst {w.naam}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{w.tekst}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
          Riool verstopt in Genk? Zo pakken we het aan
        </h2>
        <ol className="space-y-3 text-muted-foreground font-body leading-relaxed list-decimal pl-5">
          <li><strong className="text-foreground">U belt of boekt online</strong> — we vragen kort wat er aan de hand is en geven een realistisch aankomstuur.</li>
          <li><strong className="text-foreground">Diagnose ter plaatse</strong> — we zoeken waar de verstopping zit, indien nodig met de rioolcamera.</li>
          <li><strong className="text-foreground">Ontstoppen</strong> — met een veer of hogedrukreiniger maken we de leiding volledig vrij.</li>
          <li><strong className="text-foreground">Controle en advies</strong> — we testen de afvoer en vertellen u hoe u nieuwe verstoppingen voorkomt.</li>
        </ol>
      </section>

      <section className="rounded-2xl bg-primary/5 border border-primary/20 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4">
          Ook in de buurt van Genk
        </h2>
        <p className="text-muted-foreground font-body leading-relaxed mb-4">
          Naast Genk zijn we dagelijks actief in de omliggende gemeenten. Bekijk ook onze pagina's voor:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ["hasselt", "Hasselt"],
            ["tongeren", "Tongeren"],
            ["riemst", "Riemst"],
          ].map(([slug, naam]) => (
            <Link
              key={slug}
              to={localizedPath(`/regio/${slug}`)}
              className="px-4 py-2 rounded-full border border-border bg-background text-sm font-body hover:border-primary hover:text-primary transition-colors"
            >
              Ontstoppingsdienst {naam}
            </Link>
          ))}
          <Link
            to={localizedPath("/diensten")}
            className="px-4 py-2 rounded-full border border-border bg-background text-sm font-body hover:border-primary hover:text-primary transition-colors"
          >
            Al onze diensten
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GenkExtraContent;
