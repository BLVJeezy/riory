import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SubmitResultOverlay from "@/components/SubmitResultOverlay";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendLead } from "@/lib/attribution";
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

const InViewBlock = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

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
  const { t } = useTranslation();
  const stepLabels = t("appointmentForm.stepLabels", { returnObjects: true }) as string[];
  const tDiensten = t("appointmentForm.diensten", { returnObjects: true }) as string[];
  const tGevondenLabels = t("appointmentForm.gevondenOpties", { returnObjects: true }) as Record<string, string>;
  const tFields = t("appointmentForm.fields", { returnObjects: true }) as Record<string, string>;
  const tPh = t("appointmentForm.placeholders", { returnObjects: true }) as Record<string, string>;
  const tDetail = t("appointmentForm.detailLabels", { returnObjects: true }) as Record<string, string>;
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Step 1
  const [akkoord, setAkkoord] = useState(false);

  // Step 2
  const [dienst, setDienst] = useState("");

  // Step 3
  const [urgent, setUrgent] = useState<boolean | null>(null);
  const [wiltOfferte, setWiltOfferte] = useState<boolean | null>(null);
  const [regenputGrootte, setRegenputGrootte] = useState("");
  const [dakgootMetersForm, setDakgootMetersForm] = useState({ v1: "", v2: "", v3: "" });

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

  // Telefoonnummer: minstens 8 cijfers (gebruiker geeft eigen nummer in)
  const isValidBePhone = (val: string) => {
    const digits = val.replace(/[^\d]/g, "");
    return digits.length >= 8 && digits.length <= 15;
  };
  const handlePhoneChange = (setter: (fn: (p: any) => any) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/[^\d+\s()-]/g, "").slice(0, 20);
      setter((p: any) => ({ ...p, [e.target.name]: v }));
    };

  // Step 6
  const [beschrijving, setBeschrijving] = useState("");

  // Step 7
  const [gevondenVia, setGevondenVia] = useState("");
  const [gevondenDetail, setGevondenDetail] = useState("");

  // Prefill from URL params (from prijscalculator)
  useEffect(() => {
    const paramDienst = searchParams.get("dienst");
    const paramStraat = searchParams.get("straat");
    const paramHuisnummer = searchParams.get("huisnummer");
    const paramPostcode = searchParams.get("postcode");
    const paramPlaats = searchParams.get("plaats");

    if (paramDienst && diensten.includes(paramDienst)) {
      setDienst(paramDienst);
    }
    if (paramStraat || paramHuisnummer || paramPostcode || paramPlaats) {
      setWerf((p) => ({
        ...p,
        straat: paramStraat || p.straat,
        huisnummer: paramHuisnummer || p.huisnummer,
        postcode: paramPostcode || p.postcode,
        plaats: paramPlaats || p.plaats,
      }));
    }
  }, [searchParams]);

  const handleFactChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFact((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleWerfChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setWerf((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSyndicusChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSyndicus((p) => ({ ...p, [e.target.name]: e.target.value }));

  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    const req = (cond: boolean, label: string) => { if (cond) missing.push(label); };
    switch (step) {
      case 0:
        req(!dienst, tFields.service ?? "Dienst");
        break;
      case 1:
        req(!akkoord, t("appointmentForm.step1Terms"));
        break;
      case 2:
        if (dienst === "Reinigen van regenput") {
          req(!regenputGrootte, "Grootte van de regenput");
        } else if (dienst === "Dakgootreiniging") {
          const m1 = parseFloat(dakgootMetersForm.v1) || 0;
          const m2 = parseFloat(dakgootMetersForm.v2) || 0;
          const m3 = parseFloat(dakgootMetersForm.v3) || 0;
          req(m1 + m2 + m3 === 0, "Meters dakgoot per verdieping");
        } else {
          req(urgent === null, t("appointmentForm.step2Title"));
        }
        break;
      case 3:
        req(!klantType, t("appointmentForm.step3Title"));
        break;
      case 4: {
        if (klantType === "syndicus") {
          req(woningOuder === null, t("appointmentForm.olderThan10"));
          req(!syndicus.naam_vme, tFields.vmeName);
          req(!syndicus.kbo_nummer, `VME ${tFields.kbo}`);
          req(!fact.straat, `VME ${tFields.street}`);
          req(!fact.huisnummer, `VME ${tFields.houseNumber}`);
          req(!fact.postcode, `VME ${tFields.postcode}`);
          req(!fact.plaats, `VME ${tFields.city}`);
          req(!isValidBePhone(fact.telefoon), `VME ${tFields.phoneContact}`);
          req(!syndicus.naam, `Syndicus ${tFields.name}`);
          req(!syndicus.voornaam, `Syndicus ${tFields.firstName}`);
          req(!syndicus.kantoor, tFields.officeName);
          req(!syndicus.straat, `Syndicus ${tFields.street}`);
          req(!syndicus.huisnummer, `Syndicus ${tFields.houseNumber}`);
          req(!syndicus.postcode, `Syndicus ${tFields.postcode}`);
          req(!syndicus.plaats, `Syndicus ${tFields.city}`);
          req(!isValidBePhone(syndicus.telefoon), `Syndicus ${tFields.phone}`);
          req(!syndicus.email, `Syndicus ${tFields.generalEmail}`);
          req(!syndicus.facturatie_email, tFields.billingEmailLong);
        } else if (klantType) {
          if (klantType === "particulier") req(woningOuder === null, t("appointmentForm.olderThan10"));
          req(werfIsFacturatie === null, t("appointmentForm.siteEqualsBilling"));
          req(!fact.naam, tFields.name);
          req(!fact.voornaam, tFields.firstName);
          req(!fact.email, tFields.email);
          req(!isValidBePhone(fact.telefoon), `${tFields.phone}`);
          req(!fact.straat, tFields.street);
          req(!fact.huisnummer, tFields.houseNumber);
          req(!fact.postcode, tFields.postcode);
          req(!fact.plaats, tFields.city);
          if (klantType === "bedrijf" || klantType === "vrij_beroep") {
            req(!fact.bedrijfsnaam, tFields.companyName);
            req(!fact.facturatie_email, tFields.billingEmail);
            if (klantType === "bedrijf") req(!fact.btw_nummer, tFields.vat);
            if (klantType === "vrij_beroep") req(!fact.kbo_nummer, tFields.kbo);
          }
          if (werfIsFacturatie === false) {
            if (klantType === "bedrijf" || klantType === "vrij_beroep") req(!werf.projectnaam, `Werf ${tFields.projectName}`);
            req(!werf.contactpersoon, `Werf ${tFields.contactPerson}`);
            req(!werf.straat, `Werf ${tFields.street}`);
            req(!werf.huisnummer, `Werf ${tFields.houseNumber}`);
            req(!werf.postcode, `Werf ${tFields.postcode}`);
            req(!werf.plaats, `Werf ${tFields.city}`);
            req(!isValidBePhone(werf.telefoon), `Werf ${tFields.phone}`);
          }
        } else {
          missing.push(t("appointmentForm.step3Title"));
        }
        break;
      }
      case 5:
        req(beschrijving.trim().length === 0, t("appointmentForm.step5Title"));
        break;
      case 6:
        req(!gevondenVia, t("appointmentForm.step6Title"));
        if ((gevondenVia === "mond_aan_mond" || gevondenVia === "installateur" || gevondenVia === "andere")) {
          req(!gevondenDetail.trim(), tDetail[gevondenVia] ?? "");
        }
        break;
    }
    return missing;
  };

  const canProceed = (): boolean => getMissingFields().length === 0;

  const scrollToForm = useCallback(() => {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }, []);

  const showMissingToast = (missing: string[]) => {
    toast.error(t("appointmentForm.fillAllRequired", { defaultValue: "Vul alle verplichte velden in" }), {
      description: missing.slice(0, 8).join(" • ") + (missing.length > 8 ? ` • +${missing.length - 8}` : ""),
    });
  };

  const next = () => {
    const missing = getMissingFields();
    if (missing.length > 0) {
      showMissingToast(missing);
      return;
    }
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      scrollToForm();
    }
  };
  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      scrollToForm();
    }
  };

  // Returns the phone only if it contains actual subscriber digits (more than just the dial-code prefix like "+32")
  const cleanPhone = (val?: string | null): string | undefined => {
    if (!val) return undefined;
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    const digits = trimmed.replace(/\D/g, "");
    // Country dial codes are 1-3 digits; require at least 4 extra digits to count as a real number
    if (digits.length <= 3) return undefined;
    return trimmed;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const extraInfo = dienst === "Reinigen van regenput" && regenputGrootte
        ? `Grootte regenput: ${regenputGrootte}\n\n`
        : dienst === "Dakgootreiniging" && (dakgootMetersForm.v1 || dakgootMetersForm.v2 || dakgootMetersForm.v3)
        ? `Dakgoot meters — 1 verdiep: ${dakgootMetersForm.v1 || "0"}m, 2 verdiepen: ${dakgootMetersForm.v2 || "0"}m, 3 verdiepen: ${dakgootMetersForm.v3 || "0"}m\n\n`
        : "";
      const fullBeschrijving = extraInfo + (beschrijving || "");

      const appointmentId = crypto.randomUUID();
      // For syndicus, use syndicus email as fact_email (required field)
      const effectiveFactEmail = klantType === "syndicus" ? syndicus.email : fact.email;

      // Stuur attribution-lead ALS EERSTE, vóór Supabase. Als Supabase later
      // faalt, hebben we de lead alsnog in onze pijplijn (geen verloren leads).
      sendLead({
        type: "appointment",
        appointmentId,
        dienst,
        urgent: urgent ?? false,
        klantType,
        naam: fact.naam || undefined,
        voornaam: fact.voornaam || undefined,
        bedrijfsnaam: fact.bedrijfsnaam || undefined,
        email: effectiveFactEmail || undefined,
        telefoon: cleanPhone(fact.telefoon),
        straat: fact.straat || undefined,
        huisnummer: fact.huisnummer || undefined,
        postcode: fact.postcode || undefined,
        plaats: fact.plaats || undefined,
        werfStraat: werf.straat || undefined,
        werfHuisnummer: werf.huisnummer || undefined,
        werfPostcode: werf.postcode || undefined,
        werfPlaats: werf.plaats || undefined,
        werfTelefoon: cleanPhone(werf.telefoon),
        syndicusKantoor: klantType === "syndicus" ? (syndicus.kantoor || undefined) : undefined,
        syndicusEmail: klantType === "syndicus" ? (syndicus.email || undefined) : undefined,
        syndicusTelefoon: klantType === "syndicus" ? cleanPhone(syndicus.telefoon) : undefined,
        beschrijving: beschrijving || undefined,
        gevondenVia: gevondenVia || undefined,
        gevondenDetail: gevondenDetail || undefined,
      });

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
        fact_email: effectiveFactEmail,
        fact_facturatie_email: fact.facturatie_email || null,
        fact_telefoon: cleanPhone(fact.telefoon) ?? null,
        werf_projectnaam: werf.projectnaam || null,
        werf_contactpersoon: werf.contactpersoon || null,
        werf_straat: werf.straat || null,
        werf_huisnummer: werf.huisnummer || null,
        werf_postcode: werf.postcode || null,
        werf_plaats: werf.plaats || null,
        werf_telefoon: cleanPhone(werf.telefoon) ?? null,
        syndicus_naam: klantType === "syndicus" ? (syndicus.naam || null) : null,
        syndicus_voornaam: klantType === "syndicus" ? (syndicus.voornaam || null) : null,
        syndicus_kantoor: klantType === "syndicus" ? (syndicus.kantoor || null) : null,
        syndicus_straat: klantType === "syndicus" ? (syndicus.straat || null) : null,
        syndicus_huisnummer: klantType === "syndicus" ? (syndicus.huisnummer || null) : null,
        syndicus_postcode: klantType === "syndicus" ? (syndicus.postcode || null) : null,
        syndicus_plaats: klantType === "syndicus" ? (syndicus.plaats || null) : null,
        syndicus_telefoon: klantType === "syndicus" ? (cleanPhone(syndicus.telefoon) ?? null) : null,
        syndicus_email: klantType === "syndicus" ? (syndicus.email || null) : null,
        syndicus_facturatie_email: klantType === "syndicus" ? (syndicus.facturatie_email || null) : null,
        syndicus_naam_vme: klantType === "syndicus" ? (syndicus.naam_vme || null) : null,
        syndicus_kbo_nummer: klantType === "syndicus" ? (syndicus.kbo_nummer || null) : null,
        beschrijving: fullBeschrijving || null,
        gevonden_via: gevondenVia || null,
        gevonden_detail: gevondenDetail || null,
        wilt_offerte: (dienst === "Reinigen van regenput" || dienst === "Dakgootreiniging") ? (wiltOfferte ?? null) : null,
      });
      if (error) throw error;

      // Send notification email
      const klantReplyTo = klantType === "syndicus" ? syndicus.email : fact.email;
      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "appointment-notification",
          recipientEmail: "afspraak@riory.be",
          replyToEmail: klantReplyTo || undefined,
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
            telefoon: cleanPhone(fact.telefoon),
            straat: fact.straat || undefined,
            huisnummer: fact.huisnummer || undefined,
            postcode: fact.postcode || undefined,
            plaats: fact.plaats || undefined,
            werfStraat: werf.straat || undefined,
            werfHuisnummer: werf.huisnummer || undefined,
            werfPostcode: werf.postcode || undefined,
            werfPlaats: werf.plaats || undefined,
            werfTelefoon: cleanPhone(werf.telefoon),
            werfContactpersoon: werf.contactpersoon || undefined,
            werfProjectnaam: werf.projectnaam || undefined,
            syndicusNaam: syndicus.naam || undefined,
            syndicusVoornaam: syndicus.voornaam || undefined,
            syndicusKantoor: syndicus.kantoor || undefined,
            syndicusStraat: syndicus.straat || undefined,
            syndicusHuisnummer: syndicus.huisnummer || undefined,
            syndicusPostcode: syndicus.postcode || undefined,
            syndicusPlaats: syndicus.plaats || undefined,
            syndicusTelefoon: cleanPhone(syndicus.telefoon),
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

      // Send confirmation email to customer
      if (effectiveFactEmail) {
        const customerVoornaam = klantType === "syndicus" ? syndicus.voornaam : fact.voornaam;
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "afspraak-confirmation",
            recipientEmail: effectiveFactEmail,
            idempotencyKey: `afspraak-confirm-${appointmentId}`,
            templateData: {
              voornaam: customerVoornaam || undefined,
              dienst,
              urgent: urgent ?? false,
            },
          },
        }).catch((err) => console.error("Customer confirmation email failed:", err));
      }

      // Send to Simpla CRM (fire-and-forget; failures are queued for retry)
      supabase.functions.invoke("send-to-simpla", {
        body: {
          appointmentId,
          payload: {
            dienst,
            urgent: urgent ?? false,
            klantType,
            woningOuder: woningOuder ?? false,
            naam: fact.naam || undefined,
            voornaam: fact.voornaam || undefined,
            bedrijfsnaam: fact.bedrijfsnaam || undefined,
            btwNummer: fact.btw_nummer || undefined,
            kboNummer: fact.kbo_nummer || undefined,
            email: effectiveFactEmail,
            facturatieEmail: fact.facturatie_email || undefined,
            telefoon: cleanPhone(fact.telefoon),
            straat: fact.straat || undefined,
            huisnummer: fact.huisnummer || undefined,
            postcode: fact.postcode || undefined,
            plaats: fact.plaats || undefined,
            werfStraat: werf.straat || undefined,
            werfHuisnummer: werf.huisnummer || undefined,
            werfPostcode: werf.postcode || undefined,
            werfPlaats: werf.plaats || undefined,
            werfTelefoon: cleanPhone(werf.telefoon),
            werfContactpersoon: werf.contactpersoon || undefined,
            werfProjectnaam: werf.projectnaam || undefined,
            syndicusNaam: syndicus.naam || undefined,
            syndicusVoornaam: syndicus.voornaam || undefined,
            syndicusKantoor: syndicus.kantoor || undefined,
            syndicusStraat: syndicus.straat || undefined,
            syndicusHuisnummer: syndicus.huisnummer || undefined,
            syndicusPostcode: syndicus.postcode || undefined,
            syndicusPlaats: syndicus.plaats || undefined,
            syndicusTelefoon: cleanPhone(syndicus.telefoon),
            syndicusEmail: syndicus.email || undefined,
            syndicusFacturatieEmail: syndicus.facturatie_email || undefined,
            syndicusNaamVme: syndicus.naam_vme || undefined,
            syndicusKboNummer: syndicus.kbo_nummer || undefined,
            beschrijving: beschrijving || undefined,
            gevondenVia: gevondenVia || undefined,
            gevondenDetail: gevondenDetail || undefined,
          },
        },
      }).catch((err) => console.error("Simpla send failed (queued for retry):", err));

      // sendLead is al bovenaan handleSubmit aangeroepen (vóór Supabase),
      // zodat een mislukte DB-write geen verloren lead oplevert.

      setSubmitResult("success");
      // Reset
      setStep(0);
      setAkkoord(false);
      setDienst("");
      setUrgent(null);
      setWiltOfferte(null);
      setRegenputGrootte("");
      setDakgootMetersForm({ v1: "", v2: "", v3: "" });
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
      setRetryCount((c) => c + 1);
      setSubmitResult("error");
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
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step0Title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("appointmentForm.step0Sub")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diensten.map((d, i) => (
                <OptionCard
                  key={d}
                  selected={dienst === d}
                  onClick={() => setDienst(d)}
                  icon={<FileText className="w-4 h-4" />}
                  label={tDiensten[i] ?? d}
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
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step1Title")}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t("appointmentForm.step1Sub")}
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
                {t("appointmentForm.step1Agree")} <a href="/algemene-voorwaarden" target="_blank" className="text-primary underline font-semibold">{t("appointmentForm.step1Terms")}</a>.
              </span>
            </label>
          </div>
        );

      // STEP 2: Dienst-specifieke vragen of Urgentie
      case 2:
        // REGENPUT: grootte kiezen
        if (dienst === "Reinigen van regenput") {
          const regenputOpties = [
            "Tot 5.000 L",
            "7.500 L",
            "10.000 L",
            "15.000 L",
            "20.000 L",
            "Ik weet het niet",
            "Andere maat",
          ];
          return (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Hoe groot is uw regenput?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Dit helpt ons een correcte prijs te berekenen.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                {regenputOpties.map((opt) => (
                  <OptionCard
                    key={opt}
                    selected={regenputGrootte === opt}
                    onClick={() => setRegenputGrootte(opt)}
                    icon={<Check className="w-4 h-4" />}
                    label={opt}
                  />
                ))}
              </div>
            </div>
          );
        }

        // DAKGOOT: meters per verdieping
        if (dienst === "Dakgootreiniging") {
          return (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-heading font-bold text-foreground">
                  Geschatte meters per verdieping
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Geldig tot 3 verdiepen of 10 meter hoogte. Minimum 10m te reinigen.
                </p>
              </div>
              <div className="grid gap-3 max-w-sm mx-auto">
                {[
                  { key: "v1", label: "1 verdiep", prijs: "€ 8,50/m" },
                  { key: "v2", label: "2 verdiepen", prijs: "€ 9,50/m" },
                  { key: "v3", label: "3 verdiepen", prijs: "€ 11,00/m" },
                ].map(({ key, label, prijs }) => (
                  <div key={key} className="flex items-center gap-3">
                    <label className="w-28 text-sm font-medium text-foreground">{label}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="meter"
                      value={dakgootMetersForm[key as "v1" | "v2" | "v3"]}
                      onChange={(e) => setDakgootMetersForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-24 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <span className="text-xs text-muted-foreground">{prijs}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // ALLE ANDERE DIENSTEN: urgentievraag
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <AlertTriangle className="w-12 h-12 text-[hsl(var(--urgent))] mx-auto mb-3" />
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step2Title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("appointmentForm.step2Sub")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <OptionCard
                selected={urgent === true}
                onClick={() => setUrgent(true)}
                icon={<AlertTriangle className="w-4 h-4" />}
                label={t("appointmentForm.yesUrgent")}
                description={t("appointmentForm.yesUrgentSub")}
              />
              <OptionCard
                selected={urgent === false}
                onClick={() => setUrgent(false)}
                icon={<Check className="w-4 h-4" />}
                label={t("appointmentForm.no")}
              />
            </div>
          </div>
        );

      // STEP 3: Klanttype
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step3Title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("appointmentForm.step3Sub")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              <OptionCard selected={klantType === "particulier"} onClick={() => setKlantType("particulier")} icon={<Home className="w-4 h-4" />} label={t("appointmentForm.particulier")} />
              <OptionCard selected={klantType === "bedrijf"} onClick={() => setKlantType("bedrijf")} icon={<Building2 className="w-4 h-4" />} label={t("appointmentForm.bedrijf")} />
              <OptionCard selected={klantType === "vrij_beroep"} onClick={() => setKlantType("vrij_beroep")} icon={<Briefcase className="w-4 h-4" />} label={t("appointmentForm.vrijBeroep")} />
              <OptionCard selected={klantType === "syndicus"} onClick={() => setKlantType("syndicus")} icon={<Users className="w-4 h-4" />} label={t("appointmentForm.syndicus")} />
            </div>
          </div>
        );

      // STEP 4: Gegevens
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step4Title")}</h3>
            </div>

            {/* Conditionele vraag: woning ouder dan 10 jaar */}
            {(klantType === "particulier" || klantType === "syndicus") && (
              <div className="space-y-2">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
                  {t("appointmentForm.olderThan10")} <span className="text-primary">*</span> <span className="text-muted-foreground font-normal normal-case">{t("appointmentForm.vat6")}</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setWoningOuder(true)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${woningOuder === true ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>{t("appointmentForm.yes")}</button>
                  <button type="button" onClick={() => setWoningOuder(false)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${woningOuder === false ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>{t("appointmentForm.no")}</button>
                </div>
              </div>
            )}

            {/* Werfadres = facturatieadres (niet voor syndicus) */}
            {klantType !== "syndicus" && (
              <div className="space-y-2">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-foreground">
                  {t("appointmentForm.siteEqualsBilling")} <span className="text-primary">*</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setWerfIsFacturatie(true)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${werfIsFacturatie === true ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>{t("appointmentForm.yes")}</button>
                  <button type="button" onClick={() => setWerfIsFacturatie(false)} className={`px-6 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${werfIsFacturatie === false ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>{t("appointmentForm.no")}</button>
                </div>
              </div>
            )}

            {/* Facturatiegegevens (niet-syndicus) */}
            {klantType !== "syndicus" && (
              <div>
                <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> {t("appointmentForm.billingDetails")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={tFields.name} required name="naam" value={fact.naam} onChange={handleFactChange} icon={<User className="w-4 h-4" />} placeholder={tPh.name} maxLength={100} />
                  <InputField label={tFields.firstName} required name="voornaam" value={fact.voornaam} onChange={handleFactChange} icon={<User className="w-4 h-4" />} placeholder={tPh.firstName} maxLength={100} />

                  {(klantType === "bedrijf" || klantType === "vrij_beroep") && (
                    <>
                      <InputField label={tFields.companyName} required name="bedrijfsnaam" value={fact.bedrijfsnaam} onChange={handleFactChange} icon={<Building2 className="w-4 h-4" />} placeholder={tPh.companyName} maxLength={200} />
                      {klantType === "bedrijf" && (
                        <InputField label={tFields.vat} required name="btw_nummer" value={fact.btw_nummer} onChange={handleFactChange} placeholder="BE0xxx.xxx.xxx" maxLength={20} />
                      )}
                      {klantType === "vrij_beroep" && (
                        <InputField label={tFields.kbo} required name="kbo_nummer" value={fact.kbo_nummer} onChange={handleFactChange} placeholder="0xxx.xxx.xxx" maxLength={20} />
                      )}
                    </>
                  )}

                  <InputField label={tFields.street} required name="straat" value={fact.straat} onChange={handleFactChange} icon={<MapPin className="w-4 h-4" />} placeholder={tPh.street} maxLength={200} />
                  <InputField label={tFields.houseNumber} required name="huisnummer" value={fact.huisnummer} onChange={handleFactChange} placeholder={tPh.houseNumber} maxLength={10} />
                  <InputField label={tFields.postcode} required name="postcode" value={fact.postcode} onChange={handleFactChange} placeholder={tPh.postcode} maxLength={10} />
                  <InputField label={tFields.city} required name="plaats" value={fact.plaats} onChange={handleFactChange} placeholder={tPh.city} maxLength={100} />
                  <InputField label={tFields.email} required name="email" value={fact.email} onChange={handleFactChange} icon={<Mail className="w-4 h-4" />} placeholder={tPh.email} type="email" maxLength={255} />
                  {(klantType === "bedrijf" || klantType === "vrij_beroep") && (
                    <InputField label={tFields.billingEmail} required name="facturatie_email" value={fact.facturatie_email} onChange={handleFactChange} icon={<Mail className="w-4 h-4" />} placeholder={tPh.billingEmail} type="email" maxLength={255} />
                  )}
                  <InputField label={tFields.phone} required name="telefoon" value={fact.telefoon} onChange={handlePhoneChange(setFact)} icon={<Phone className="w-4 h-4" />} placeholder="bv. 0472 50 28 14" type="tel" maxLength={20} />
                </div>
              </div>
            )}

            {/* Werfadres indien anders (niet voor syndicus) */}
            {klantType !== "syndicus" && werfIsFacturatie === false && (
              <div>
                <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> {t("appointmentForm.siteAddress")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(klantType === "bedrijf" || klantType === "vrij_beroep") && (
                    <InputField label={tFields.projectName} required name="projectnaam" value={werf.projectnaam} onChange={handleWerfChange} placeholder={tPh.projectName} maxLength={200} />
                  )}
                  <InputField label={tFields.contactPerson} required name="contactpersoon" value={werf.contactpersoon} onChange={handleWerfChange} icon={<User className="w-4 h-4" />} placeholder={tPh.contactPerson} maxLength={100} />
                  <InputField label={tFields.street} required name="straat" value={werf.straat} onChange={handleWerfChange} icon={<MapPin className="w-4 h-4" />} placeholder={tPh.street} maxLength={200} />
                  <InputField label={tFields.houseNumber} required name="huisnummer" value={werf.huisnummer} onChange={handleWerfChange} placeholder={tPh.houseNumber} maxLength={10} />
                  <InputField label={tFields.postcode} required name="postcode" value={werf.postcode} onChange={handleWerfChange} placeholder={tPh.postcode} maxLength={10} />
                  <InputField label={tFields.city} required name="plaats" value={werf.plaats} onChange={handleWerfChange} placeholder={tPh.city} maxLength={100} />
                  <InputField label={tFields.phone} required name="telefoon" value={werf.telefoon} onChange={handlePhoneChange(setWerf)} icon={<Phone className="w-4 h-4" />} placeholder="bv. 0472 50 28 14" type="tel" maxLength={20} />
                </div>
              </div>
            )}

            {/* Syndicus: Facturatiegegevens (VME info) */}
            {klantType === "syndicus" && (
              <div>
                <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> {t("appointmentForm.billingDetails")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={tFields.vmeName} required name="naam_vme" value={syndicus.naam_vme} onChange={handleSyndicusChange} placeholder={tPh.vmeName} maxLength={200} />
                  <InputField label={tFields.kbo} required name="kbo_nummer" value={syndicus.kbo_nummer} onChange={handleSyndicusChange} placeholder="0xxx.xxx.xxx" maxLength={20} />
                  <InputField label={tFields.street} required name="straat" value={fact.straat} onChange={handleFactChange} icon={<MapPin className="w-4 h-4" />} placeholder={tPh.street} maxLength={200} />
                  <InputField label={tFields.houseNumber} required name="huisnummer" value={fact.huisnummer} onChange={handleFactChange} placeholder={tPh.houseNumber} maxLength={10} />
                  <InputField label={tFields.postcode} required name="postcode" value={fact.postcode} onChange={handleFactChange} placeholder={tPh.postcode} maxLength={10} />
                  <InputField label={tFields.city} required name="plaats" value={fact.plaats} onChange={handleFactChange} placeholder={tPh.city} maxLength={100} />
                  <InputField label={tFields.phoneContact} required name="telefoon" value={fact.telefoon} onChange={handlePhoneChange(setFact)} icon={<Phone className="w-4 h-4" />} placeholder="bv. 0472 50 28 14" type="tel" maxLength={20} />
                </div>
              </div>
            )}

            {/* Syndicus: Gegevens Syndicus */}
            {klantType === "syndicus" && (
              <div>
                <h4 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> {t("appointmentForm.syndicusDetails")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label={tFields.name} required name="naam" value={syndicus.naam} onChange={handleSyndicusChange} icon={<User className="w-4 h-4" />} placeholder={tPh.syndicusName} maxLength={100} />
                  <InputField label={tFields.firstName} required name="voornaam" value={syndicus.voornaam} onChange={handleSyndicusChange} icon={<User className="w-4 h-4" />} placeholder={tPh.firstName} maxLength={100} />
                  <InputField label={tFields.officeName} required name="kantoor" value={syndicus.kantoor} onChange={handleSyndicusChange} icon={<Building2 className="w-4 h-4" />} placeholder={tPh.officeName} maxLength={200} />
                  <InputField label={tFields.street} required name="straat" value={syndicus.straat} onChange={handleSyndicusChange} icon={<MapPin className="w-4 h-4" />} placeholder={tPh.street} maxLength={200} />
                  <InputField label={tFields.houseNumber} required name="huisnummer" value={syndicus.huisnummer} onChange={handleSyndicusChange} placeholder={tPh.houseNumber} maxLength={10} />
                  <InputField label={tFields.postcode} required name="postcode" value={syndicus.postcode} onChange={handleSyndicusChange} placeholder={tPh.postcode} maxLength={10} />
                  <InputField label={tFields.city} required name="plaats" value={syndicus.plaats} onChange={handleSyndicusChange} placeholder={tPh.city} maxLength={100} />
                  <InputField label={tFields.phone} required name="telefoon" value={syndicus.telefoon} onChange={handlePhoneChange(setSyndicus)} icon={<Phone className="w-4 h-4" />} placeholder="bv. 0472 50 28 14" type="tel" maxLength={20} />
                  <InputField label={tFields.generalEmail} required name="email" value={syndicus.email} onChange={handleSyndicusChange} icon={<Mail className="w-4 h-4" />} placeholder={tPh.syndicusEmail} type="email" maxLength={255} />
                  <InputField label={tFields.billingEmailLong} required name="facturatie_email" value={syndicus.facturatie_email} onChange={handleSyndicusChange} icon={<Mail className="w-4 h-4" />} placeholder={tPh.syndicusBillingEmail} type="email" maxLength={255} />
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
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step5Title")} <span className="text-primary">*</span></h3>
              <p className="text-sm text-muted-foreground mt-1">{t("appointmentForm.step5Sub")}</p>
            </div>
            <textarea
              value={beschrijving}
              onChange={(e) => setBeschrijving(e.target.value)}
              rows={5}
              placeholder={t("appointmentForm.step5Placeholder")}
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
              <h3 className="text-lg font-heading font-bold text-foreground">{t("appointmentForm.step6Title")} <span className="text-primary">*</span></h3>
              <p className="text-sm text-muted-foreground mt-1">{t("appointmentForm.step6Sub")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gevondenOpties.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={gevondenVia === opt.value}
                  onClick={() => setGevondenVia(opt.value)}
                  icon={<Check className="w-4 h-4" />}
                  label={tGevondenLabels[opt.value] ?? opt.label}
                />
              ))}
            </div>
            {(gevondenVia === "mond_aan_mond" || gevondenVia === "installateur" || gevondenVia === "andere") && (
              <InputField
                label={tDetail[gevondenVia] ?? ""}
                name="gevondenDetail"
                value={gevondenDetail}
                onChange={(e) => setGevondenDetail(e.target.value)}
                placeholder={t("appointmentForm.fillIn")}
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
    <section id="offerte" className="section-padding bg-charcoal scroll-mt-8" ref={formRef}>
      <div className="section-container px-6 md:px-8">
        <InViewBlock className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold uppercase text-primary-foreground mb-3">
            {t("appointmentForm.sectionTitle")}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-primary-foreground/70 font-body max-w-lg mx-auto mb-5">
            {t("appointmentForm.intro")}
          </p>
          <a
            href="tel:+32472502814"
            data-track-cta="appointment_form_urgent_tel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--urgent))] text-[hsl(var(--urgent-foreground))] font-heading font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_hsl(var(--urgent)/0.6),0_0_40px_hsl(var(--urgent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--urgent)/0.8),0_0_60px_hsl(var(--urgent)/0.4)] transition-shadow animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            {t("appointmentForm.urgentCta")}
          </a>
        </InViewBlock>

        <InViewBlock delay={150} className="bg-background rounded-2xl p-4 sm:p-8 md:p-10 border-4 border-primary max-w-3xl mx-auto shadow-[0_0_60px_hsl(var(--primary)/0.45),0_25px_80px_-10px_hsl(var(--primary)/0.4)] ring-4 ring-primary/20">
          {/* Stepper - compact on mobile */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: progress bar + label */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-semibold uppercase tracking-wider text-primary">
                  {t("appointmentForm.stepPrefix")} {step + 1}/{TOTAL_STEPS}: {stepLabels[step]}
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
              {t("appointmentForm.previous")}
            </Button>

            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                variant="cta"
                onClick={next}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                {t("appointmentForm.nextStep")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="cta"
                onClick={() => {
                  const missing = getMissingFields();
                  if (missing.length > 0) { showMissingToast(missing); return; }
                  handleSubmit();
                }}
                disabled={submitting}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Send className="w-4 h-4" />
                {submitting ? t("appointmentForm.submitting") : t("appointmentForm.submitCta")}
              </Button>
            )}
          </div>
        </InViewBlock>
      </div>
      <SubmitResultOverlay
        status={submitResult}
        retryCount={retryCount}
        onClose={() => setSubmitResult(null)}
        onRetry={() => setSubmitResult(null)}
        onStartOver={() => {
          setRetryCount(0);
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
        }}
        successTitle={t("appointmentForm.successTitle")}
        successMessage={t("appointmentForm.successMessage")}
        errorTitle={t("appointmentForm.errorTitle")}
        errorMessage={t("appointmentForm.errorMessage")}
      />
    </section>
  );
};

export default AppointmentForm;
