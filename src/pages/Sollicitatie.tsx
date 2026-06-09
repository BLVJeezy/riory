import { useState, useRef } from "react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle } from "lucide-react";

const Sollicitatie = () => {
  useDocumentMeta(
    "Werken bij Riory BV | Solliciteer online | Limburg",
    "Wil je werken bij Riory BV in Limburg? Stuur ons een spontane sollicitatie met je CV. We zijn altijd op zoek naar gemotiveerde techniekers en chauffeurs."
  );

  const [voornaam, setVoornaam] = useState("");
  const [achternaam, setAchternaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [bericht, setBericht] = useState("");
  const [cvBestand, setCvBestand] = useState<File | null>(null);
  const [verzonden, setVerzonden] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBestand = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bestand = e.target.files?.[0];
    if (!bestand) return;
    const toegestaan = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!toegestaan.includes(bestand.type)) {
      setFout("Alleen PDF of Word-bestanden zijn toegestaan.");
      return;
    }
    if (bestand.size > 5 * 1024 * 1024) {
      setFout("Bestand mag maximaal 5 MB zijn.");
      return;
    }
    setFout("");
    setCvBestand(bestand);
  };

  const handleVerzenden = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voornaam || !achternaam || !email) {
      setFout("Vul alle verplichte velden in.");
      return;
    }
    setBezig(true);
    setFout("");

    try {
      let cvPath: string | undefined;
      if (cvBestand) {
        const ext = cvBestand.name.split(".").pop() || "pdf";
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        cvPath = `sollicitaties/${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("quote-attachments")
          .upload(cvPath, cvBestand, { contentType: cvBestand.type });
        if (upErr) throw upErr;
      }

      const { error } = await supabase.functions.invoke("submit-sollicitatie", {
        body: {
          voornaam,
          achternaam,
          email,
          telefoon,
          bericht,
          cvPath,
          cvNaam: cvBestand?.name,
        },
      });
      if (error) throw error;

      setVerzonden(true);
    } catch (err) {
      console.error(err);
      setFout("Verzenden mislukt. Probeer het opnieuw of bel ons.");
    } finally {
      setBezig(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-background">

        {/* Hero */}
        <section className="bg-muted/30 border-b border-border/40 py-12 md:py-16">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <p className="text-primary font-heading font-semibold uppercase tracking-wider text-xs mb-3">
              Carrière bij Riory
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Werken bij Riory BV in Limburg
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Riory is een groeiend Limburgs bedrijf gevestigd in Hoeselt. Wij zijn altijd op zoek naar
              gemotiveerde techniekers en chauffeurs. Stuur ons gerust een spontane sollicitatie —
              wij nemen zo snel mogelijk contact met je op.
            </p>
          </div>
        </section>

        {/* Formulier */}
        <section className="py-10 md:py-14">
          <div className="container max-w-2xl mx-auto px-4">
            {verzonden ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Sollicitatie ontvangen!
                </h3>
                <p className="text-muted-foreground">
                  Bedankt {voornaam}. We bekijken jouw sollicitatie zo snel mogelijk en nemen contact
                  met je op via {email}.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                  Solliciteer online
                </h2>
                <div className="space-y-4">
                  {/* Naam */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Voornaam <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={voornaam}
                        onChange={(e) => setVoornaam(e.target.value)}
                        placeholder="Jan"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Achternaam <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={achternaam}
                        onChange={(e) => setAchternaam(e.target.value)}
                        placeholder="Janssen"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Email + Telefoon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        E-mail <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jan@email.be"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Telefoon
                      </label>
                      <input
                        type="tel"
                        value={telefoon}
                        onChange={(e) => setTelefoon(e.target.value)}
                        placeholder="+32 470 00 00 00"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Motivatie */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Motivatie / bericht
                    </label>
                    <textarea
                      value={bericht}
                      onChange={(e) => setBericht(e.target.value)}
                      rows={4}
                      placeholder="Vertel ons waarom je bij Riory wil werken..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* CV upload */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      CV uploaden <span className="text-muted-foreground text-xs">(PDF of Word, max 5 MB)</span>
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        cvBestand
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleBestand}
                        className="hidden"
                      />
                      {cvBestand ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{cvBestand.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Upload className="w-8 h-8" />
                          <span className="text-sm">Klik om je CV te uploaden</span>
                          <span className="text-xs">PDF of Word</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {fout && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
                      {fout}
                    </p>
                  )}

                  <Button
                    onClick={handleVerzenden}
                    disabled={bezig}
                    variant="cta"
                    size="lg"
                    className="w-full rounded-full"
                  >
                    {bezig ? "Bezig met verzenden..." : "Sollicitatie versturen"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Je gegevens worden vertrouwelijk behandeld en enkel gebruikt voor de selectieprocedure.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Sollicitatie;
