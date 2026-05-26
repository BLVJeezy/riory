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
          <p className="text-sm text-muted-foreground mb-8">Laatst bijgewerkt: 26 mei 2026</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none font-body space-y-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">1. Inleiding</h2>
            <p className="text-muted-foreground">
              Riory bv hecht veel belang aan de bescherming van uw privacy en de transparante verwerking van uw persoonsgegevens. Dit Privacy & Cookiebeleid legt uit welke cookies en vergelijkbare technieken wij gebruiken, waarom, en hoe u uw voorkeuren kunt beheren.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">2. Wat zijn cookies?</h2>
            <p className="text-muted-foreground">
              Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt. Ze helpen ons om de website correct te laten functioneren, de gebruikerservaring te verbeteren en het gebruik van de website te analyseren. Naast cookies maken wij in beperkte mate gebruik van sessionStorage en gepseudonimiseerde server-side identificatoren (zie sectie 4).
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">3. Welke cookies gebruiken wij?</h2>
            <p className="text-muted-foreground">Wij maken gebruik van drie categorieën cookies. U beheert uw voorkeuren via de cookie-banner of de instellingenknop onderaan de Website.</p>

            <h3 className="text-lg font-heading font-semibold text-foreground">3.1 Strikt noodzakelijk (altijd actief, geen toestemming nodig)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><code className="bg-muted px-1 rounded">cookieyes-consent</code> — uw cookie-voorkeuren. Bewaartermijn: 1 jaar.</li>
              <li><code className="bg-muted px-1 rounded">riory_visitor_id</code> (sessionStorage, geen cookie) — een per-tab identificator die helpt om binnen één browsersessie acties aan elkaar te koppelen. Wordt automatisch verwijderd zodra u de tab sluit.</li>
            </ul>

            <h3 className="text-lg font-heading font-semibold text-foreground">3.2 Analytisch (toestemming vereist)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><code className="bg-muted px-1 rounded">_ga, _ga_*</code> — Google Analytics 4. Geanonimiseerde meting van paginabezoeken, sessies en herkomst. Bewaartermijn: 13 maanden.</li>
              <li><code className="bg-muted px-1 rounded">riory_attr</code> — Riory's eigen first-touch attributie-cookie. Bevat het kanaal waarmee u onze Website voor het eerst vond (gclid, utm_source/medium/campaign/content/term, landing pagina, referrer). Bewaartermijn: 90 dagen. Gebruikt om te bepalen welke marketingkanalen klanten opleveren.</li>
            </ul>

            <h3 className="text-lg font-heading font-semibold text-foreground">3.3 Marketing (toestemming vereist)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Google Ads conversion-tracking — wanneer u via een advertentie binnenkomt en converteert. Bewaartermijn: 90 dagen.</li>
            </ul>

            <h2 className="text-xl font-heading font-semibold text-foreground">4. Gepseudonimiseerde server-side identificatie (legitimate interest)</h2>
            <p className="text-muted-foreground">
              Wanneer u onze formulieren gebruikt of op een telefoonlink klikt, registreert onze server een gehashte combinatie van uw IP-adres, browser-type en taalinstelling. Deze "fingerprint" is technisch noodzakelijk om te kunnen meten via welk kanaal u onze Website bereikt heeft, ook wanneer u cookies weigert. Wij verwerken deze data op grond van ons <strong>gerechtvaardigd belang</strong> (artikel 6.1.f GDPR): inzicht in de effectiviteit van onze marketing en fraudepreventie. De hashes zijn niet omkeerbaar naar uw IP-adres en worden na maximaal 13 maanden geanonimiseerd of verwijderd. U heeft het recht om hiertegen bezwaar te maken via info@riory.be.
            </p>

            <h2 className="text-xl font-heading font-semibold text-foreground">5. Bewaartermijn</h2>
            <p className="text-muted-foreground">
              Sessiecookies worden verwijderd zodra u uw browser sluit. Voor andere cookies hanteren wij maximaal 13 maanden (analytische cookies) of 90 dagen (Riory's attributie-cookie). De CookieYes-voorkeurencookie wordt 1 jaar bewaard. Server-side gehashte identificatoren worden na maximaal 13 maanden geanonimiseerd.
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
