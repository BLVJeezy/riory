import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Send,
  AlertTriangle,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Building2,
  Briefcase,
  Home,
  Users,
} from "lucide-react";

const diensten = [
  "Ontstopping",
  "Septische put ledigen",
  "Camera inspectie riool",
  "Plaatsbepaling afvoeren",
  "Geurhinder/rioolvliegjes",
  "Periodieke reiniging van afvoeren",
  "Wateroverlast/pompwerken",
  "Reinigen van regenput",
  "Dakgootreiniging",
  "Herstellingswerken aan afvoeren",
];

const gevondenOpties = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "mond_aan_mond", label: "Mond-aan-mondreclame" },
  { value: "installateur", label: "Doorverwezen door installateur" },
  { value: "reclame", label: "Reclameborden / voertuigen" },
  { value: "andere", label: "Andere" },
];

type KlantType = "particulier" | "bedrijf" | "vrij_beroep" | "syndicus";

const TOTAL_STEPS = 7;

const stepLabels = [
  "Dienst",
  "Voorwaarden",
  "Urgentie",
  "Klanttype",
  "Gegevens",
  "Omschrijving",
  "Afronden",
];

const INPUT_CLASS =
  "w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";
const ICON_INPUT_CLASS =
  "w-full h-12 pl-11 pr-4 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow";

const OptionCard = ({ selected, onClick, icon, label, description }: {
  selected: boolean; onClick: () => void; icon: React.ReactNode; label: string; description?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
      selected
        ? "border-primary bg-primary/5 shadow-md"
        : "border-border hover:border-primary/40 hover:bg-muted/50"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div>
        <p className="font-heading font-semibold text-foreground text-sm">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {selected && <Check className="w-5 h-5 text-primary ml-auto" />}
    </div>
  </button>
);

const InputField = ({ label, required, icon, ...props }: {
  label: string; required?: boolean; icon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground mb-1.5">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">{icon}</span>}
      <input {...props} className={icon ? ICON_INPUT_CLASS : INPUT_CLASS} />
    </div>
  </div>
);

const AppointmentForm = () => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [akkoord, setAkkoord] = useState(false);

  // Step 2
  const [dienst, setDienst] = useState("");

  // Step 3
  const [urgent, setUrgent] = useState<boolean | null>(null);

  // Step 4
  const [klantType, setKlantType] = useState<KlantType | "">("");

  // Step 5: conditionele vragen + gegevens
  const [woningOuder, setWoningOuder] = useState<boolean | null>(null);
  const [werfIsFacturatie, setWerfIsFacturatie] = useState<boolean | null>(null);

  const [fact, setFact] = useState({
    naam: "", voornaam: "", bedrijfsnaam: "", btw_nummer: "", kbo_nummer: "",
    straat: "", huisnummer: "", postcode: "", plaats: "",
    email: "", facturatie_email: "", telefoon: "",
  });

  const [werf, setWerf] = useState({
    projectnaam: "", contactpersoon: "", straat: "", huisnummer: "",
    postcode: "", plaats: "", telefoon: "",
  });

  const [syndicus, setSyndicus] = useState({
    naam: "", voornaam: "", kantoor: "", straat: "", huisnummer: "",
    postcode: "", plaats: "", telefoon: "", email: "", facturatie_email: "",
    naam_vme: "", kbo_nummer: "",
  });

  // Step 6
  const [beschrijving, setBeschrijving] = useState("");

  // Step 7
  const [gevondenVia, setGevondenVia] = useState("");
  const [gevondenDetail, setGevondenDetail] = useState("");

  const handleFactChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFact((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleWerfChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setWerf((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSyndicusChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSyndicus((p) => ({ ...p, [e.target.name]: e.target.value }));

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return dienst !== "";
      case 1: return akkoord;
      case 2: return urgent !== null;
      case 3: return klantType !== "";
      case 4: {
        if (!fact.naam || !fact.voornaam || !fact.email || !fact.telefoon || !fact.straat || !fact.huisnummer || !fact.postcode || !fact.plaats) return false;
        if (klantType === "syndicus") {
          if (!syndicus.naam || !syndicus.voornaam || !syndicus.kantoor || !syndicus.email) return false;
        }
        if (werfIsFacturatie === false) {
          if (!werf.straat || !werf.huisnummer || !werf.postcode || !werf.plaats) return false;
        }
        return true;
      }
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const next = () => {
    if (canProceed() && step < TOTAL_STEPS - 1) {
      const scrollY = window.scrollY;
      setStep(step + 1);
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    }
  };
  const prev = () => {
    if (step > 0) {
      const scrollY = window.scrollY;
      setStep(step - 1);
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const appointmentId = crypto.randomUUID();
      const { error } = await supabase.from("appointments").insert({
        id: appointmentId,
        dienst,
        urgent: urgent ?? false,
        klant_type: klantType,
        woning_ouder_dan_10_jaar: woningOuder,
        werfadres_is_facturatieadres: werfIsFacturatie,
        fact_naam: fact.naam || null,
        fact_voornaam: fact.voornaam || null,
        fact_bedrijfsnaam: fact.bedrijfsnaam || null,
        fact_btw_nummer: fact.btw_nummer || null,
        fact_kbo_nummer: fact.kbo_nummer || null,
        fact_straat: fact.straat || null,
        fact_huisnummer: fact.huisnummer || null,
        fact_postcode: fact.postcode || null,
        fact_plaats: fact.plaats || null,
        fact_email: fact.email,
        fact_facturatie_email: fact.facturatie_email || null,
        fact_telefoon: fact.telefoon || null,
        werf_projectnaam: werf.projectnaam || null,
        werf_contactpersoon: werf.contactpersoon || null,
        werf_straat: werf.straat || null,
        werf_huisnummer: werf.huisnummer || null,
        werf_postcode: werf.postcode || null,
        werf_plaats: werf.plaats || null,
        werf_telefoon: werf.telefoon || null,
        syndicus_naam: klantType === "syndicus" ? (syndicus.naam || null) : null,
        syndicus_voornaam: klantType === "syndicus" ? (syndicus.voornaam || null) : null,
        syndicus_kantoor: klantType === "syndicus" ? (syndicus.kantoor || null) : null,
        syndicus_straat: klantType === "syndicus" ? (syndicus.straat || null) : null,
        syndicus_huisnummer: klantType === "syndicus" ? (syndicus.huisnummer || null) : null,
        syndicus_postcode: klantType === "syndicus" ? (syndicus.postcode || null) : null,
        syndicus_plaats: klantType === "syndicus" ? (syndicus.plaats || null) : null,
        syndicus_telefoon: klantType === "syndicus" ? (syndicus.telefoon || null) : null,
        syndicus_email: klantType === "syndicus" ? (syndicus.email || null) : null,
        syndicus_facturatie_email: klantType === "syndicus" ? (syndicus.facturatie_email || null) : null,
        syndicus_naam_vme: klantType === "syndicus" ? (syndicus.naam_vme || null) : null,
        syndicus_kbo_nummer: klantType === "syndicus" ? (syndicus.kbo_nummer || null) : null,
        beschrijving: beschrijving || null,
        gevonden_via: gevondenVia || null,
        gevonden_detail: gevondenDetail || null,
      });
      if (error) throw error;

      // Send notification email
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "appointment-notification",
          recipientEmail: "jasonbalongo@gmail.com",
          idempotencyKey: `appointment-${appointmentId}`,
          templateData: {
            dienst,
            urgent: urgent ?? false,
            klantType,
            woningOuder: woningOuder ?? false,
            naam: fact.naam || undefined,
            voornaam: fact.voornaam || undefined,
            bedrijfsnaam: fact.bedrijfsnaam || undefined,
            btwNummer: fact.btw_nummer || undefined,
            kboNummer: fact.kbo_nummer || undefined,
            email: fact.email || undefined,
            facturatieEmail: fact.facturatie_email || undefined,
            telefoon: fact.telefoon || undefined,
            straat: fact.straat || undefined,
            huisnummer: fact.huisnummer || undefined,
            postcode: fact.postcode || undefined,
            plaats: fact.plaats || undefined,
            werfStraat: werf.straat || undefined,
            werfHuisnummer: werf.huisnummer || undefined,
            werfPostcode: werf.postcode || undefined,
            werfPlaats: werf.plaats || undefined,
            werfTelefoon: werf.telefoon || undefined,
            werfContactpersoon: werf.contactpersoon || undefined,
            werfProjectnaam: werf.projectnaam || undefined,
            syndicusNaam: syndicus.naam || undefined,
            syndicusVoornaam: syndicus.voornaam || undefined,
            syndicusKantoor: syndicus.kantoor || undefined,
            syndicusStraat: syndicus.straat || undefined,
            syndicusHuisnummer: syndicus.huisnummer || undefined,
            syndicusPostcode: syndicus.postcode || undefined,
            syndicusPlaats: syndicus.plaats || undefined,
            syndicusTelefoon: syndicus.telefoon || undefined,
            syndicusEmail: syndicus.email || undefined,
            syndicusFacturatieEmail: syndicus.facturatie_email || undefined,
            syndicusNaamVme: syndicus.naam_vme || undefined,
            syndicusKboNummer: syndicus.kbo_nummer || undefined,
            beschrijving: beschrijving || undefined,
            gevondenVia: gevondenVia || undefined,
            gevondenDetail: gevondenDetail || undefined,
          },
        },
      }).catch((err) => console.error("Email notification failed:", err));

      toast.success("Uw afspraak is succesvol ingediend! Wij nemen spoedig contact op.");
      // Reset
      setStep(0);
      setAkkoord(false);
      setDienst("");
      setUrgent(null);
      setKlantType("");
      setWoningOuder(null);
      setWerfIsFacturatie(null);
      setFact({ naam: "", voornaam: "", bedrijfsnaam: "", btw_nummer: "", kbo_nummer: "", straat: "", huisnummer: "", postcode: "", plaats: "", email: "", facturatie_email: "", telefoon: "" });
      setWerf({ projectnaam: "", contactpersoon: "", straat: "", huisnummer: "", postcode: "", plaats: "", telefoon: "" });
      setSyndicus({ naam: "", voornaam: "", kantoor: "", straat: "", huisnummer: "", postcode: "", plaats: "", telefoon: "", email: "", facturatie_email: "", naam_vme: "", kbo_nummer: "" });
      setBeschrijving("");
      setGevondenVia("");
      setGevondenDetail("");
    } catch (err) {
      console.error("Error submitting appointment:", err);
      toast.error("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };


  const renderStep = () => {
    switch (step) {
      // STEP 0: Dienst kiezen
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">Kies een dienst</h3>
              <p className="text-sm text-muted-foreground mt-1">Selecteer de gewenste dienst.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diensten.map((d) => (
                <OptionCard
                  key={d}
                  selected={dienst === d}
                  onClick={() => setDienst(d)}
                  icon={<FileText className="w-4 h-4" />}
                  label={d}
                />
              ))}
            </div>
          </div>
        );

      // STEP 1: Akkoord
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-heading font-bold text-foreground">Algemene Voorwaarden</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Lees en accepteer onze algemene voorwaarden om verder te gaan.
              </p>
            </div>
            <label className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={akkoord}
                onChange={(e) => setAkkoord(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground font-body">
                Ik ga akkoord met de <a href="/algemene-voorwaarden" target="_blank" className="text-primary underline font-semibold">algemene voorwaarden</a>.
              </span>
            </label>
          </div>
        );

      // STEP 2: Urgentie
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <AlertTriangle className="w-12 h-12 text-[hsl(var(--urgent))] mx-auto mb-3" />
              <h3 className="text-lg font-heading font-bold text-foreground">Hoge urgentie?</h3>
              <p className="text-sm text-muted-foreground mt-1">Heeft u binnen 24 uur interventie nodig?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <OptionCard
                selected={urgent === true}
                onClick={() => setUrgent(true)}
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Ja, urgent"
                description="Extra kosten kunnen aangerekend worden"
              />
              <OptionCard
                selected={urgent === false}
                onClick={() => setUrgent(false)}
                icon={<Check className="w-4 h-4" />}
                label="Nee"
              />
            </div>
          </div>
        );

      // STEP 3: Klanttype
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">Wat voor klant bent u?</h3>
              <p className="text-sm text-muted-foreground mt-1">Selecteer uw klanttype.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              <OptionCard selected={klantType === "particulier"} onClick={() => setKlantType("particulier")} icon={<Home className="w-4 h-4" />} label="Particulier" />
              <OptionCard selected={klantType === "bedrijf"} onClick={() => setKlantType("bedrijf")} icon={<Building2 className="w-4 h-4" />} label="Bedrijf" />
              <OptionCard selected={klantType === "vrij_beroep"} onClick={() => setKlantType("vrij_beroep")} icon={<Briefcase className="w-4 h-4" />} label="Vrij Beroep" />
              <OptionCard selected={klantType === "syndicus"} onClick={() => setKlantType("syndicus")} icon={<Users className="w-4 h-4" />} label="Syndicus" />
            </div>
          </div>
        );

      // STEP 4: Gegevens
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">Uw gegevens</h3>
            </div>

            {/* Conditionele vraag: woning ouder dan 10 jaar */}
            {(klantType === "particulier" || klantType === "syndicus") && (
              <div className="space-y-2">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
                  Woning ouder dan 10 jaar? <span className="text-muted-foreground font-normal normal-case">(BTW 6%)</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setWoningOuder(true)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${woningOuder === true ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>Ja</button>
                  <button type="button" onClick={() => setWoningOuder(false)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${woningOuder === false ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>Nee</button>
                </div>
              </div>
            )}

            {/* Werfadres = facturatieadres */}
            <div className="space-y-2">
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
                Is het werfadres hetzelfde als het facturatieadres?
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setWerfIsFacturatie(true)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${werfIsFacturatie === true ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>Ja</button>
                <button type="button" onClick={() => setWerfIsFacturatie(false)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${werfIsFacturatie === false ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>Nee</button>
              </div>
            </div>

            {/* Facturatiegegevens */}
            <div>
              <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Facturatiegegevens
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Naam" required name="naam" value={fact.naam} onChange={handleFactChange} icon={<User className="w-4 h-4" />} placeholder="Naam" maxLength={100} />
                <InputField label="Voornaam" required name="voornaam" value={fact.voornaam} onChange={handleFactChange} icon={<User className="w-4 h-4" />} placeholder="Voornaam" maxLength={100} />

                {(klantType === "bedrijf" || klantType === "vrij_beroep") && (
                  <>
                    <InputField label="Bedrijfsnaam" name="bedrijfsnaam" value={fact.bedrijfsnaam} onChange={handleFactChange} icon={<Building2 className="w-4 h-4" />} placeholder="Bedrijfsnaam" maxLength={200} />
                    {klantType === "bedrijf" && (
                      <InputField label="BTW-nummer" name="btw_nummer" value={fact.btw_nummer} onChange={handleFactChange} placeholder="BE0xxx.xxx.xxx" maxLength={20} />
                    )}
                    {klantType === "vrij_beroep" && (
                      <InputField label="KBO-nummer" name="kbo_nummer" value={fact.kbo_nummer} onChange={handleFactChange} placeholder="0xxx.xxx.xxx" maxLength={20} />
                    )}
                  </>
                )}

                <InputField label="Straat" required name="straat" value={fact.straat} onChange={handleFactChange} icon={<MapPin className="w-4 h-4" />} placeholder="Straatnaam" maxLength={200} />
                <InputField label="Huisnummer" required name="huisnummer" value={fact.huisnummer} onChange={handleFactChange} placeholder="Nr." maxLength={10} />
                <InputField label="Postcode" required name="postcode" value={fact.postcode} onChange={handleFactChange} placeholder="1234" maxLength={10} />
                <InputField label="Plaats" required name="plaats" value={fact.plaats} onChange={handleFactChange} placeholder="Gemeente" maxLength={100} />
                <InputField label="Email" required name="email" value={fact.email} onChange={handleFactChange} icon={<Mail className="w-4 h-4" />} placeholder="uw@email.be" type="email" maxLength={255} />
                {(klantType === "bedrijf" || klantType === "vrij_beroep") && (
                  <InputField label="Facturatie-email" name="facturatie_email" value={fact.facturatie_email} onChange={handleFactChange} icon={<Mail className="w-4 h-4" />} placeholder="facturatie@bedrijf.be" type="email" maxLength={255} />
                )}
                <InputField label="Telefoon" required name="telefoon" value={fact.telefoon} onChange={handleFactChange} icon={<Phone className="w-4 h-4" />} placeholder="+32 4XX XX XX XX" maxLength={20} />
              </div>
            </div>

            {/* Werfadres indien anders */}
            {werfIsFacturatie === false && (
              <div>
                <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Werfadres
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(klantType === "bedrijf" || klantType === "vrij_beroep") && (
                    <InputField label="Projectnaam" name="projectnaam" value={werf.projectnaam} onChange={handleWerfChange} placeholder="Projectnaam" maxLength={200} />
                  )}
                  <InputField label="Contactpersoon" name="contactpersoon" value={werf.contactpersoon} onChange={handleWerfChange} icon={<User className="w-4 h-4" />} placeholder="Contactpersoon" maxLength={100} />
                  <InputField label="Straat" required name="straat" value={werf.straat} onChange={handleWerfChange} icon={<MapPin className="w-4 h-4" />} placeholder="Straatnaam" maxLength={200} />
                  <InputField label="Huisnummer" required name="huisnummer" value={werf.huisnummer} onChange={handleWerfChange} placeholder="Nr." maxLength={10} />
                  <InputField label="Postcode" required name="postcode" value={werf.postcode} onChange={handleWerfChange} placeholder="1234" maxLength={10} />
                  <InputField label="Plaats" required name="plaats" value={werf.plaats} onChange={handleWerfChange} placeholder="Gemeente" maxLength={100} />
                  <InputField label="Telefoon" name="telefoon" value={werf.telefoon} onChange={handleWerfChange} icon={<Phone className="w-4 h-4" />} placeholder="+32 4XX XX XX XX" maxLength={20} />
                </div>
              </div>
            )}

            {/* Syndicus gegevens */}
            {klantType === "syndicus" && (
              <div>
                <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Gegevens Syndicus
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Naam VME" name="naam_vme" value={syndicus.naam_vme} onChange={handleSyndicusChange} placeholder="Naam VME" maxLength={200} />
                  <InputField label="KBO-nummer" name="kbo_nummer" value={syndicus.kbo_nummer} onChange={handleSyndicusChange} placeholder="0xxx.xxx.xxx" maxLength={20} />
                  <InputField label="Naam" required name="naam" value={syndicus.naam} onChange={handleSyndicusChange} icon={<User className="w-4 h-4" />} placeholder="Naam syndicus" maxLength={100} />
                  <InputField label="Voornaam" required name="voornaam" value={syndicus.voornaam} onChange={handleSyndicusChange} icon={<User className="w-4 h-4" />} placeholder="Voornaam" maxLength={100} />
                  <InputField label="Naam kantoor" required name="kantoor" value={syndicus.kantoor} onChange={handleSyndicusChange} icon={<Building2 className="w-4 h-4" />} placeholder="Kantoor" maxLength={200} />
                  <InputField label="Straat" name="straat" value={syndicus.straat} onChange={handleSyndicusChange} icon={<MapPin className="w-4 h-4" />} placeholder="Straatnaam" maxLength={200} />
                  <InputField label="Huisnummer" name="huisnummer" value={syndicus.huisnummer} onChange={handleSyndicusChange} placeholder="Nr." maxLength={10} />
                  <InputField label="Postcode" name="postcode" value={syndicus.postcode} onChange={handleSyndicusChange} placeholder="1234" maxLength={10} />
                  <InputField label="Plaats" name="plaats" value={syndicus.plaats} onChange={handleSyndicusChange} placeholder="Gemeente" maxLength={100} />
                  <InputField label="Telefoon" name="telefoon" value={syndicus.telefoon} onChange={handleSyndicusChange} icon={<Phone className="w-4 h-4" />} placeholder="+32 4XX XX XX XX" maxLength={20} />
                  <InputField label="Algemeen mailadres" required name="email" value={syndicus.email} onChange={handleSyndicusChange} icon={<Mail className="w-4 h-4" />} placeholder="info@syndicus.be" type="email" maxLength={255} />
                  <InputField label="Facturatie mailadres" name="facturatie_email" value={syndicus.facturatie_email} onChange={handleSyndicusChange} icon={<Mail className="w-4 h-4" />} placeholder="facturatie@syndicus.be" type="email" maxLength={255} />
                </div>
              </div>
            )}
          </div>
        );

      // STEP 5: Omschrijving
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">Omschrijving</h3>
              <p className="text-sm text-muted-foreground mt-1">Geef een korte omschrijving van het probleem.</p>
            </div>
            <textarea
              value={beschrijving}
              onChange={(e) => setBeschrijving(e.target.value)}
              rows={5}
              placeholder="Beschrijf kort uw probleem of situatie..."
              maxLength={2000}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground font-body text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-shadow"
            />
          </div>
        );

      // STEP 6: Hoe gevonden + verzenden
      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">Hoe hebt u ons gevonden?</h3>
              <p className="text-sm text-muted-foreground mt-1">Dit helpt ons om onze diensten te verbeteren.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gevondenOpties.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={gevondenVia === opt.value}
                  onClick={() => setGevondenVia(opt.value)}
                  icon={<Check className="w-4 h-4" />}
                  label={opt.label}
                />
              ))}
            </div>
            {(gevondenVia === "mond_aan_mond" || gevondenVia === "installateur" || gevondenVia === "andere") && (
              <InputField
                label={gevondenVia === "mond_aan_mond" ? "Wie?" : gevondenVia === "installateur" ? "Welke installateur?" : "Specificeer"}
                name="gevondenDetail"
                value={gevondenDetail}
                onChange={(e) => setGevondenDetail(e.target.value)}
                placeholder="Vul in..."
                maxLength={200}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="offerte" className="section-padding bg-surface">
      <div className="section-container px-6 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-foreground mb-3">
            Maak een Afspraak
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground font-body max-w-lg mx-auto mb-5">
            Plan snel een afspraak voor ontstopping, camera‑inspectie of put‑lediging. Riory reageert onmiddellijk en biedt snelle, professionele service.
          </p>
          <a
            href="tel:+32472502814"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6),0_0_40px_hsl(var(--urgent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8),0_0_60px_hsl(var(--urgent)/0.4)] transition-shadow animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            URGENT? BEL NU
          </a>
        </div>

        <div className="bg-background rounded-xl p-4 sm:p-8 md:p-10 border border-border max-w-3xl mx-auto shadow-sm">
          {/* Stepper - compact on mobile */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: progress bar + label */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                  Stap {step + 1}/{TOTAL_STEPS}: {stepLabels[step]}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Desktop: full stepper */}
            <div className="hidden sm:flex items-center justify-between overflow-x-auto pb-2">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i < step
                          ? "bg-primary text-primary-foreground"
                          : i === step
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 font-heading font-semibold uppercase tracking-wider whitespace-nowrap ${
                      i <= step ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < TOTAL_STEPS - 1 && (
                    <div className={`w-10 h-0.5 mx-1 ${i < step ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[280px]">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prev}
              disabled={step === 0}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Vorige
            </Button>

            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                variant="cta"
                onClick={next}
                disabled={!canProceed()}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                Volgende
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="cta"
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Send className="w-4 h-4" />
                {submitting ? "VERZENDEN..." : "AFSPRAAK MAKEN"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
