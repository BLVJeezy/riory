// In-chat afspraakformulier (MCP App) voor Riory.
// Draait in een sandboxed iframe binnen ChatGPT / Claude / ... en praat met de
// host via @modelcontextprotocol/ext-apps. Versturen = server-tool
// `riory_submit_booking`, exact dezelfde pijplijn als het webformulier.

import { App, applyDocumentTheme } from "@modelcontextprotocol/ext-apps";

// ── Types & constanten ────────────────────────────────────────────────────
type Lang = "nl" | "fr" | "en";
type KlantType = "particulier" | "bedrijf" | "vrij_beroep";

const DIENSTEN = [
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
const REGENPUT = ["Tot 5.000 L", "7.500 L", "10.000 L", "15.000 L", "20.000 L", "Ik weet het niet", "Andere maat"];
const LINKS = {
  nl: "https://riory.be/algemene-voorwaarden",
  fr: "https://riory.be/fr/algemene-voorwaarden",
  en: "https://riory.be/en/algemene-voorwaarden",
};
const PHONE = "+32 472 50 28 14";

const T = {
  nl: {
    diensten: DIENSTEN,
    s1: "Wat is het probleem?", s1sub: "Kies de dienst en beschrijf kort wat er aan de hand is.",
    dienst: "Dienst", urgentQ: "Binnen 24 uur geholpen worden?", urgentYes: "Ja, urgent", urgentYesSub: "Extra kosten mogelijk",
    urgentNo: "Nee", urgentNoSub: "Riory plant een moment in", beschrijving: "Omschrijving",
    beschrijvingPh: "Bv. wc op het gelijkvloers loopt niet meer door sinds gisteren…",
    regenput: "Grootte van de regenput", andereMaat: "Welke maat?", dakgoot: "Meters dakgoot per hoogte",
    v1: "1 verdiep", v2: "2 verdiepen", v3: "3 verdiepen", offerteQ: "Wat wenst u?", offerte: "Eerst een offerte", afspraak: "Meteen een afspraak",
    s2: "Uw gegevens", s2sub: "Zodat Riory u kan contacteren en factureren.",
    klant: "U bent", particulier: "Particulier", bedrijf: "Bedrijf", vrij_beroep: "Vrij beroep",
    voornaam: "Voornaam", naam: "Naam", email: "E-mail", telefoon: "Telefoon", straat: "Straat", huisnummer: "Nr.",
    postcode: "Postcode", plaats: "Gemeente", adres: "Adres", ouder: "Woning ouder dan 10 jaar? (6% btw)", ja: "Ja", nee: "Nee",
    bedrijfsnaam: "Bedrijfsnaam", btw: "BTW-nummer", kbo: "KBO-nummer", factEmail: "Facturatie-e-mail",
    werfAnders: "Het werkadres is een ander adres", werf: "Werkadres", contactpersoon: "Contactpersoon ter plaatse",
    werfTel: "Telefoon ter plaatse", project: "Projectnaam (optioneel)",
    s3: "Controleren & versturen", s3sub: "Kijk alles na. Riory bevestigt het tijdstip telefonisch of per mail.",
    akkoord: "Ik ga akkoord met de", voorwaarden: "algemene voorwaarden",
    next: "Verder", back: "Terug", submit: "Afspraak aanvragen", sending: "Versturen…",
    missing: "Vul de verplichte velden in.", failed: "Versturen is niet gelukt. Probeer opnieuw of bel",
    doneT: "Aanvraag ontvangen!", doneSub: "Riory neemt snel contact met u op om het tijdstip te bevestigen. U krijgt ook een bevestigingsmail.",
    ref: "Referentie", urgentCall: "Dringend? Bel meteen", callUs: "Liever bellen?", test: "TEST",
    sumDienst: "Dienst", sumUrgent: "Urgent", sumKlant: "Klant", sumContact: "Contact", sumAdres: "Adres", sumWerf: "Werkadres", sumBeschr: "Omschrijving",
    chatMsg: "Ik heb net een afspraak aangevraagd bij Riory",
  },
  fr: {
    diensten: ["Débouchage", "Vidange de fosse septique", "Inspection caméra d'égout", "Localisation de canalisations", "Odeurs/moucherons d'égout", "Nettoyage périodique des canalisations", "Inondation/pompage", "Nettoyage de citerne d'eau de pluie", "Nettoyage de gouttière", "Travaux de réparation"],
    s1: "Quel est le problème ?", s1sub: "Choisissez le service et décrivez brièvement la situation.",
    dienst: "Service", urgentQ: "Intervention dans les 24 h ?", urgentYes: "Oui, urgent", urgentYesSub: "Frais supplémentaires possibles",
    urgentNo: "Non", urgentNoSub: "Riory planifie un moment", beschrijving: "Description",
    beschrijvingPh: "Ex. le WC du rez-de-chaussée est bouché depuis hier…",
    regenput: "Taille de la citerne", andereMaat: "Quelle taille ?", dakgoot: "Mètres de gouttière par hauteur",
    v1: "1 étage", v2: "2 étages", v3: "3 étages", offerteQ: "Que souhaitez-vous ?", offerte: "D'abord un devis", afspraak: "Directement un rendez-vous",
    s2: "Vos coordonnées", s2sub: "Pour que Riory puisse vous contacter et facturer.",
    klant: "Vous êtes", particulier: "Particulier", bedrijf: "Entreprise", vrij_beroep: "Profession libérale",
    voornaam: "Prénom", naam: "Nom", email: "E-mail", telefoon: "Téléphone", straat: "Rue", huisnummer: "N°",
    postcode: "Code postal", plaats: "Commune", adres: "Adresse", ouder: "Habitation de plus de 10 ans ? (TVA 6%)", ja: "Oui", nee: "Non",
    bedrijfsnaam: "Nom de l'entreprise", btw: "Numéro de TVA", kbo: "Numéro BCE", factEmail: "E-mail de facturation",
    werfAnders: "L'adresse d'intervention est différente", werf: "Adresse d'intervention", contactpersoon: "Personne de contact sur place",
    werfTel: "Téléphone sur place", project: "Nom du projet (facultatif)",
    s3: "Vérifier & envoyer", s3sub: "Vérifiez tout. Riory confirme l'heure par téléphone ou e-mail.",
    akkoord: "J'accepte les", voorwaarden: "conditions générales",
    next: "Suivant", back: "Retour", submit: "Demander un rendez-vous", sending: "Envoi…",
    missing: "Veuillez remplir les champs obligatoires.", failed: "L'envoi a échoué. Réessayez ou appelez le",
    doneT: "Demande reçue !", doneSub: "Riory vous contactera rapidement pour confirmer l'heure. Vous recevrez aussi un e-mail de confirmation.",
    ref: "Référence", urgentCall: "Urgent ? Appelez directement", callUs: "Vous préférez appeler ?", test: "TEST",
    sumDienst: "Service", sumUrgent: "Urgent", sumKlant: "Client", sumContact: "Contact", sumAdres: "Adresse", sumWerf: "Adresse d'intervention", sumBeschr: "Description",
    chatMsg: "Je viens de demander un rendez-vous chez Riory",
  },
  en: {
    diensten: ["Unblocking", "Septic tank emptying", "Sewer camera inspection", "Pipe location", "Odour/drain flies", "Periodic drain cleaning", "Flooding/pumping", "Rainwater tank cleaning", "Gutter cleaning", "Drain repair work"],
    s1: "What's the problem?", s1sub: "Pick the service and briefly describe what's going on.",
    dienst: "Service", urgentQ: "Need help within 24 hours?", urgentYes: "Yes, urgent", urgentYesSub: "Extra charges may apply",
    urgentNo: "No", urgentNoSub: "Riory schedules a time", beschrijving: "Description",
    beschrijvingPh: "E.g. the ground-floor toilet hasn't drained since yesterday…",
    regenput: "Rainwater tank size", andereMaat: "Which size?", dakgoot: "Metres of gutter per height",
    v1: "1 storey", v2: "2 storeys", v3: "3 storeys", offerteQ: "What would you like?", offerte: "A quote first", afspraak: "An appointment right away",
    s2: "Your details", s2sub: "So Riory can contact and invoice you.",
    klant: "You are", particulier: "Individual", bedrijf: "Company", vrij_beroep: "Self-employed",
    voornaam: "First name", naam: "Last name", email: "Email", telefoon: "Phone", straat: "Street", huisnummer: "No.",
    postcode: "Postcode", plaats: "Town", adres: "Address", ouder: "Property older than 10 years? (6% VAT)", ja: "Yes", nee: "No",
    bedrijfsnaam: "Company name", btw: "VAT number", kbo: "Company number (KBO)", factEmail: "Billing email",
    werfAnders: "The job is at a different address", werf: "Job address", contactpersoon: "On-site contact person",
    werfTel: "On-site phone", project: "Project name (optional)",
    s3: "Review & send", s3sub: "Check everything. Riory confirms the time by phone or email.",
    akkoord: "I agree to the", voorwaarden: "terms and conditions",
    next: "Next", back: "Back", submit: "Request appointment", sending: "Sending…",
    missing: "Please fill in the required fields.", failed: "Sending failed. Try again or call",
    doneT: "Request received!", doneSub: "Riory will contact you shortly to confirm the time. You'll also get a confirmation email.",
    ref: "Reference", urgentCall: "Urgent? Call now", callUs: "Prefer to call?", test: "TEST",
    sumDienst: "Service", sumUrgent: "Urgent", sumKlant: "Customer", sumContact: "Contact", sumAdres: "Address", sumWerf: "Job address", sumBeschr: "Description",
    chatMsg: "I just requested an appointment with Riory",
  },
} as const;

type Dict = (typeof T)[Lang];

// ── State ────────────────────────────────────────────────────────────────
const S = {
  step: 0 as 0 | 1 | 2 | 3,
  lang: "nl" as Lang,
  dienst: "",
  urgent: null as boolean | null,
  beschrijving: "",
  regenput_grootte: "",
  regenput_andere_maat: "",
  dak1: "", dak2: "", dak3: "",
  wil_offerte: null as boolean | null,
  klant_type: "particulier" as KlantType,
  voornaam: "", naam: "", email: "", telefoon: "",
  straat: "", huisnummer: "", postcode: "", plaats: "",
  woning_ouder: null as boolean | null,
  bedrijfsnaam: "", btw_nummer: "", kbo_nummer: "", facturatie_email: "",
  werfadres_anders: false,
  werf_straat: "", werf_huisnummer: "", werf_postcode: "", werf_plaats: "",
  werf_contactpersoon: "", werf_telefoon: "", werf_projectnaam: "",
  akkoord: false,
  sending: false,
  error: "",
  invalid: new Set<string>(),
  touchedLang: false,
  result: null as null | { referentie: string; testmodus?: boolean },
};

type Field = keyof typeof S;

// ── Helpers ──────────────────────────────────────────────────────────────
const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const t = (): Dict => T[S.lang];
const dienstLabel = (d: string) => {
  const i = DIENSTEN.indexOf(d);
  return i >= 0 ? t().diensten[i] : d;
};
const phoneOk = (v: string) => {
  const n = v.replace(/\D/g, "").length;
  return n >= 8 && n <= 15;
};
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const blank = (v: string) => v.trim() === "";
const isRegenput = () => S.dienst === "Reinigen van regenput";
const isDakgoot = () => S.dienst === "Dakgootreiniging";
const isZakelijk = () => S.klant_type !== "particulier";

function langFromLocale(locale?: string): Lang {
  const l = (locale || "").toLowerCase();
  if (l.startsWith("fr")) return "fr";
  if (l.startsWith("en")) return "en";
  return "nl";
}

// ── Validatie per stap ───────────────────────────────────────────────────
function invalidFields(step: number): string[] {
  const bad: string[] = [];
  const chk = (cond: boolean, f: string) => cond && bad.push(f);
  if (step === 0) {
    chk(!S.dienst, "dienst");
    if (isRegenput()) {
      chk(!S.regenput_grootte, "regenput_grootte");
      chk(S.regenput_grootte === "Andere maat" && blank(S.regenput_andere_maat), "regenput_andere_maat");
      chk(S.wil_offerte === null, "wil_offerte");
    } else if (isDakgoot()) {
      chk((+S.dak1 || 0) + (+S.dak2 || 0) + (+S.dak3 || 0) <= 0, "dak");
      chk(S.wil_offerte === null, "wil_offerte");
    } else {
      chk(S.urgent === null, "urgent");
    }
    chk(blank(S.beschrijving), "beschrijving");
  }
  if (step === 1) {
    chk(blank(S.voornaam), "voornaam");
    chk(blank(S.naam), "naam");
    chk(!emailOk(S.email), "email");
    chk(!phoneOk(S.telefoon), "telefoon");
    chk(blank(S.straat), "straat");
    chk(blank(S.huisnummer), "huisnummer");
    chk(S.postcode.replace(/\D/g, "").length < 4, "postcode");
    chk(blank(S.plaats), "plaats");
    if (S.klant_type === "particulier") chk(S.woning_ouder === null, "woning_ouder");
    if (isZakelijk()) {
      chk(blank(S.bedrijfsnaam), "bedrijfsnaam");
      chk(blank(S.kbo_nummer), "kbo_nummer");
      chk(!emailOk(S.facturatie_email), "facturatie_email");
    }
    if (S.klant_type === "bedrijf") chk(blank(S.btw_nummer), "btw_nummer");
    if (S.werfadres_anders) {
      for (const f of ["werf_straat", "werf_huisnummer", "werf_postcode", "werf_plaats", "werf_contactpersoon"] as const)
        chk(blank(S[f]), f);
      chk(!phoneOk(S.werf_telefoon), "werf_telefoon");
    }
  }
  if (step === 2) chk(!S.akkoord, "akkoord");
  return bad;
}

// ── Rendering ────────────────────────────────────────────────────────────
const view = document.getElementById("view")!;
const langs = document.getElementById("langs")!;

function input(f: Field, label: string, opts: { type?: string; req?: boolean; full?: boolean; ph?: string; auto?: string; mode?: string } = {}) {
  const { type = "text", req = true, full = false, ph = "", auto = "", mode = "" } = opts;
  const cls = S.invalid.has(f) ? "invalid" : "";
  return `<label class="f${full ? " full" : ""}">${esc(label)}${req ? ' <span class="req">*</span>' : ""}
    <input type="${type}" data-f="${f}" value="${esc(S[f])}" class="${cls}" placeholder="${esc(ph)}"${auto ? ` autocomplete="${auto}"` : ""}${mode ? ` inputmode="${mode}"` : ""} /></label>`;
}

function optBtn(group: string, value: string, label: string, sub: string, pressed: boolean) {
  return `<button type="button" class="opt${S.invalid.has(group) ? " invalid" : ""}" data-set="${group}" data-v="${esc(value)}" aria-pressed="${pressed}">${esc(label)}${sub ? `<small>${esc(sub)}</small>` : ""}</button>`;
}

function progress() {
  return `<div class="progress">${[0, 1, 2].map((i) => `<span class="${i <= S.step ? "on" : ""}"></span>`).join("")}</div>`;
}

function actions(primaryLabel: string, showBack: boolean) {
  return `<div class="error" ${S.error ? "" : "hidden"}>${esc(S.error)}</div>
    <div class="actions">
      ${showBack ? `<button type="button" class="btn ghost" data-act="back">← ${esc(t().back)}</button>` : `<span class="call">${esc(t().callUs)} <button type="button" class="link" data-act="call">${PHONE}</button></span>`}
      <button type="button" class="btn primary" data-act="next" ${S.sending ? "disabled" : ""}>${esc(S.sending ? t().sending : primaryLabel)}</button>
    </div>`;
}

function stepProblem() {
  const d = t();
  let specific = "";
  if (isRegenput()) {
    specific = `<div class="section-label">${esc(d.regenput)} *</div>
      <div class="chips">${REGENPUT.map((r) => `<button type="button" class="chip${S.invalid.has("regenput_grootte") ? " invalid" : ""}" data-set="regenput_grootte" data-v="${esc(r)}" aria-pressed="${S.regenput_grootte === r}">${esc(r)}</button>`).join("")}</div>
      ${S.regenput_grootte === "Andere maat" ? `<div style="margin-top:10px">${input("regenput_andere_maat", d.andereMaat)}</div>` : ""}`;
  } else if (isDakgoot()) {
    specific = `<div class="section-label">${esc(d.dakgoot)} *</div>
      <div class="grid" style="grid-template-columns:repeat(3,1fr)">
        ${input("dak1", d.v1, { type: "number", req: false, mode: "decimal" })}
        ${input("dak2", d.v2, { type: "number", req: false, mode: "decimal" })}
        ${input("dak3", d.v3, { type: "number", req: false, mode: "decimal" })}
      </div>${S.invalid.has("dak") ? `<div class="error">${esc(d.dakgoot)}</div>` : ""}`;
  } else if (S.dienst) {
    specific = `<div class="section-label">${esc(d.urgentQ)} *</div>
      <div class="seg">
        ${optBtn("urgent", "1", d.urgentYes, d.urgentYesSub, S.urgent === true)}
        ${optBtn("urgent", "0", d.urgentNo, d.urgentNoSub, S.urgent === false)}
      </div>`;
  }
  if (isRegenput() || isDakgoot()) {
    specific += `<div class="section-label">${esc(d.offerteQ)} *</div>
      <div class="seg">
        ${optBtn("wil_offerte", "1", d.offerte, "", S.wil_offerte === true)}
        ${optBtn("wil_offerte", "0", d.afspraak, "", S.wil_offerte === false)}
      </div>`;
  }
  return `${progress()}<h2>${esc(d.s1)}</h2><p class="sub">${esc(d.s1sub)}</p>
    <div class="section-label">${esc(d.dienst)} *</div>
    <div class="chips">${DIENSTEN.map((x) => `<button type="button" class="chip${S.invalid.has("dienst") ? " invalid" : ""}" data-set="dienst" data-v="${esc(x)}" aria-pressed="${S.dienst === x}">${esc(dienstLabel(x))}</button>`).join("")}</div>
    ${specific}
    <div class="section-label">${esc(d.beschrijving)} *</div>
    <textarea data-f="beschrijving" class="${S.invalid.has("beschrijving") ? "invalid" : ""}" placeholder="${esc(d.beschrijvingPh)}">${esc(S.beschrijving)}</textarea>
    ${actions(d.next + " →", false)}`;
}

function stepDetails() {
  const d = t();
  const types: KlantType[] = ["particulier", "bedrijf", "vrij_beroep"];
  return `${progress()}<h2>${esc(d.s2)}</h2><p class="sub">${esc(d.s2sub)}</p>
    <div class="section-label">${esc(d.klant)}</div>
    <div class="seg">${types.map((k) => optBtn("klant_type", k, d[k], "", S.klant_type === k)).join("")}</div>
    ${isZakelijk() ? `<div class="grid" style="margin-top:12px">
      ${input("bedrijfsnaam", d.bedrijfsnaam, { full: true, auto: "organization" })}
      ${S.klant_type === "bedrijf" ? input("btw_nummer", d.btw, { ph: "BE0123.456.789" }) : ""}
      ${input("kbo_nummer", d.kbo, { full: S.klant_type !== "bedrijf" })}
      ${input("facturatie_email", d.factEmail, { type: "email", full: true })}
    </div>` : ""}
    <div class="grid" style="margin-top:12px">
      ${input("voornaam", d.voornaam, { auto: "given-name" })}
      ${input("naam", d.naam, { auto: "family-name" })}
      ${input("email", d.email, { type: "email", auto: "email" })}
      ${input("telefoon", d.telefoon, { type: "tel", auto: "tel", ph: "04xx xx xx xx" })}
    </div>
    <div class="section-label">${esc(d.adres)}</div>
    <div class="grid-addr">${input("straat", d.straat, { auto: "address-line1" })}${input("huisnummer", d.huisnummer)}</div>
    <div class="grid" style="margin-top:10px;grid-template-columns:1fr 2fr">${input("postcode", d.postcode, { auto: "postal-code", mode: "numeric" })}${input("plaats", d.plaats, { auto: "address-level2" })}</div>
    ${S.klant_type === "particulier" ? `<div class="section-label">${esc(d.ouder)} *</div>
      <div class="seg">${optBtn("woning_ouder", "1", d.ja, "", S.woning_ouder === true)}${optBtn("woning_ouder", "0", d.nee, "", S.woning_ouder === false)}</div>` : ""}
    <label class="check"><input type="checkbox" data-f="werfadres_anders" ${S.werfadres_anders ? "checked" : ""}/> <span>${esc(d.werfAnders)}</span></label>
    ${S.werfadres_anders ? `<div class="section-label">${esc(d.werf)}</div>
      <div class="grid-addr">${input("werf_straat", d.straat)}${input("werf_huisnummer", d.huisnummer)}</div>
      <div class="grid" style="margin-top:10px">
        ${input("werf_postcode", d.postcode, { mode: "numeric" })}${input("werf_plaats", d.plaats)}
        ${input("werf_contactpersoon", d.contactpersoon)}${input("werf_telefoon", d.werfTel, { type: "tel" })}
        ${isZakelijk() ? input("werf_projectnaam", d.project, { req: false, full: true }) : ""}
      </div>` : ""}
    ${actions(d.next + " →", true)}`;
}

function stepConfirm() {
  const d = t();
  const row = (k: string, v: string) => (v ? `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>` : "");
  const extra = isRegenput()
    ? `\n${d.regenput}: ${S.regenput_grootte === "Andere maat" ? S.regenput_andere_maat : S.regenput_grootte} · ${S.wil_offerte ? d.offerte : d.afspraak}`
    : isDakgoot()
      ? `\n${d.v1}: ${S.dak1 || 0} m · ${d.v2}: ${S.dak2 || 0} m · ${d.v3}: ${S.dak3 || 0} m · ${S.wil_offerte ? d.offerte : d.afspraak}`
      : "";
  return `${progress()}<h2>${esc(d.s3)}</h2><p class="sub">${esc(d.s3sub)}</p>
    <dl class="summary">
      ${row(d.sumDienst, dienstLabel(S.dienst) + extra)}
      ${!isRegenput() && !isDakgoot() ? row(d.sumUrgent, S.urgent ? d.urgentYes : d.urgentNo) : ""}
      ${row(d.sumKlant, d[S.klant_type] + (isZakelijk() ? ` — ${S.bedrijfsnaam}` : ""))}
      ${row(d.sumContact, `${S.voornaam} ${S.naam}\n${S.email}\n${S.telefoon}`)}
      ${row(d.sumAdres, `${S.straat} ${S.huisnummer}, ${S.postcode} ${S.plaats}`)}
      ${S.werfadres_anders ? row(d.sumWerf, `${S.werf_straat} ${S.werf_huisnummer}, ${S.werf_postcode} ${S.werf_plaats}\n${S.werf_contactpersoon} · ${S.werf_telefoon}`) : ""}
      ${row(d.sumBeschr, S.beschrijving)}
    </dl>
    <label class="check${S.invalid.has("akkoord") ? " invalid" : ""}" style="${S.invalid.has("akkoord") ? "outline:1.5px solid var(--r-danger)" : ""}">
      <input type="checkbox" data-f="akkoord" ${S.akkoord ? "checked" : ""}/>
      <span>${esc(d.akkoord)} <button type="button" class="link" data-act="terms">${esc(d.voorwaarden)}</button> *</span>
    </label>
    ${actions(d.submit, true)}`;
}

function stepDone() {
  const d = t();
  const r = S.result!;
  return `<div class="done">
    <div class="tick">✓</div>
    <h2>${esc(d.doneT)}${r.testmodus ? `<span class="test">${esc(d.test)}</span>` : ""}</h2>
    <div class="ref">${esc(d.ref)}: ${esc(r.referentie)}</div>
    <p class="sub" style="margin:6px auto 12px;max-width:420px">${esc(d.doneSub)}</p>
    <span class="call">${esc(S.urgent ? d.urgentCall : d.callUs)} <button type="button" class="link" data-act="call">${PHONE}</button></span>
  </div>`;
}

function render() {
  document.documentElement.lang = S.lang;
  langs.innerHTML = (["nl", "fr", "en"] as Lang[])
    .map((l) => `<button type="button" data-lang="${l}" aria-pressed="${S.lang === l}">${l.toUpperCase()}</button>`)
    .join("");
  langs.hidden = S.step === 3;
  view.innerHTML = [stepProblem, stepDetails, stepConfirm, stepDone][S.step]();
}

// ── Events ───────────────────────────────────────────────────────────────
view.addEventListener("input", (e) => {
  const el = e.target as HTMLInputElement;
  const f = el.dataset.f as Field | undefined;
  if (!f) return;
  if (el.type === "checkbox") return;
  (S as Record<string, unknown>)[f] = el.value;
  if (S.invalid.delete(f)) el.classList.remove("invalid");
});

view.addEventListener("change", (e) => {
  const el = e.target as HTMLInputElement;
  const f = el.dataset.f as Field | undefined;
  if (!f || el.type !== "checkbox") return;
  (S as Record<string, unknown>)[f] = el.checked;
  S.invalid.delete(f);
  if (f === "werfadres_anders") render();
});

view.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest("button") as HTMLButtonElement | null;
  if (!btn) return;
  const set = btn.dataset.set;
  if (set) {
    const v = btn.dataset.v ?? "";
    if (set === "urgent" || set === "wil_offerte" || set === "woning_ouder") (S as Record<string, unknown>)[set] = v === "1";
    else (S as Record<string, unknown>)[set] = v;
    S.invalid.delete(set);
    if (set === "dienst") {
      S.invalid.delete("dienst");
      if (!isRegenput() && !isDakgoot()) S.wil_offerte = null;
    }
    S.error = "";
    render();
    return;
  }
  const act = btn.dataset.act;
  if (act === "back" && S.step > 0) {
    S.step = (S.step - 1) as 0 | 1 | 2;
    S.error = "";
    render();
  } else if (act === "next") {
    void next();
  } else if (act === "terms") {
    void app.openLink({ url: LINKS[S.lang] }).catch(() => {});
  } else if (act === "call") {
    void app.openLink({ url: "tel:+32472502814" }).catch(() => {});
  }
});

langs.addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest("button") as HTMLButtonElement | null;
  if (!b?.dataset.lang) return;
  S.lang = b.dataset.lang as Lang;
  S.touchedLang = true;
  render();
});

async function next() {
  const bad = invalidFields(S.step);
  if (bad.length) {
    S.invalid = new Set(bad);
    S.error = t().missing;
    render();
    const first = view.querySelector(".invalid") as HTMLElement | null;
    first?.focus?.();
    return;
  }
  S.invalid.clear();
  S.error = "";
  if (S.step < 2) {
    S.step = (S.step + 1) as 1 | 2;
    render();
    window.scrollTo?.({ top: 0 });
    return;
  }
  await submit();
}

function payload() {
  const opt = (v: string) => (v.trim() ? v.trim() : undefined);
  const num = (v: string) => (v.trim() ? Math.max(0, Number(v.replace(",", "."))) || 0 : undefined);
  const zak = isZakelijk();
  return {
    dienst: S.dienst,
    urgent: isRegenput() || isDakgoot() ? false : S.urgent === true,
    klant_type: S.klant_type,
    voornaam: S.voornaam.trim(),
    naam: S.naam.trim(),
    email: S.email.trim(),
    telefoon: S.telefoon.trim(),
    straat: S.straat.trim(),
    huisnummer: S.huisnummer.trim(),
    postcode: S.postcode.trim(),
    plaats: S.plaats.trim(),
    beschrijving: S.beschrijving.trim(),
    akkoord_voorwaarden: S.akkoord,
    woning_ouder_dan_10_jaar: S.klant_type === "particulier" ? S.woning_ouder === true : undefined,
    bedrijfsnaam: zak ? opt(S.bedrijfsnaam) : undefined,
    btw_nummer: S.klant_type === "bedrijf" ? opt(S.btw_nummer) : undefined,
    kbo_nummer: zak ? opt(S.kbo_nummer) : undefined,
    facturatie_email: zak ? opt(S.facturatie_email) : undefined,
    werfadres_anders: S.werfadres_anders,
    ...(S.werfadres_anders
      ? {
          werf_straat: opt(S.werf_straat),
          werf_huisnummer: opt(S.werf_huisnummer),
          werf_postcode: opt(S.werf_postcode),
          werf_plaats: opt(S.werf_plaats),
          werf_contactpersoon: opt(S.werf_contactpersoon),
          werf_telefoon: opt(S.werf_telefoon),
          werf_projectnaam: zak ? opt(S.werf_projectnaam) : undefined,
        }
      : {}),
    ...(isRegenput()
      ? { regenput_grootte: S.regenput_grootte, regenput_andere_maat: opt(S.regenput_andere_maat), wil_offerte: S.wil_offerte === true }
      : {}),
    ...(isDakgoot()
      ? {
          dakgoot_meters_1_verdiep: num(S.dak1),
          dakgoot_meters_2_verdiepen: num(S.dak2),
          dakgoot_meters_3_verdiepen: num(S.dak3),
          wil_offerte: S.wil_offerte === true,
        }
      : {}),
    bron_app: app.getHostVersion()?.name,
  };
}

async function submit() {
  S.sending = true;
  render();
  try {
    const res = await app.callServerTool({ name: "riory_submit_booking", arguments: payload() });
    const sc = (res.structuredContent || {}) as { ok?: boolean; referentie?: string; testmodus?: boolean };
    if (res.isError || !sc.ok || !sc.referentie) {
      const text = res.content?.find((c) => c.type === "text") as { text?: string } | undefined;
      throw new Error(text?.text || "submit failed");
    }
    S.result = { referentie: sc.referentie, testmodus: sc.testmodus };
    S.step = 3;
    S.sending = false;
    render();
    // Laat het model weten dat de boeking rond is, zodat het niet opnieuw vraagt.
    void app
      .updateModelContext({
        content: [
          {
            type: "text",
            text: `De gebruiker heeft via het Riory-formulier een afspraak aangevraagd (referentie ${sc.referentie}, dienst: ${S.dienst}${S.urgent ? ", urgent" : ""}). Riory neemt contact op om het tijdstip te bevestigen. Niet opnieuw boeken.`,
          },
        ],
      })
      .catch(() => {});
  } catch (err) {
    console.error(err);
    S.sending = false;
    S.error = `${t().failed} ${PHONE}.`;
    render();
  }
}

// ── Prefill vanuit het gesprek ───────────────────────────────────────────
type Prefill = Partial<{
  dienst: string; urgent: boolean; klant_type: KlantType; voornaam: string; naam: string; email: string;
  telefoon: string; straat: string; huisnummer: string; postcode: string; plaats: string; beschrijving: string;
}>;

let prefilled = false;
function applyPrefill(p?: Prefill | null) {
  if (!p || prefilled || S.step !== 0) return;
  prefilled = true;
  if (p.dienst && DIENSTEN.includes(p.dienst)) S.dienst = p.dienst;
  if (typeof p.urgent === "boolean") S.urgent = p.urgent;
  if (p.klant_type && ["particulier", "bedrijf", "vrij_beroep"].includes(p.klant_type)) S.klant_type = p.klant_type;
  for (const k of ["voornaam", "naam", "email", "telefoon", "straat", "huisnummer", "postcode", "plaats", "beschrijving"] as const) {
    const v = p[k];
    if (typeof v === "string" && v.trim() && !String(S[k]).trim()) S[k] = v.trim().slice(0, k === "beschrijving" ? 4000 : 200);
  }
  render();
}

// ── Host-verbinding ──────────────────────────────────────────────────────
const app = new App({ name: "Riory afspraakformulier", version: "1.0.0" }, {}, { autoResize: true });

app.ontoolinput = (params) => applyPrefill(params.arguments as Prefill);
app.ontoolresult = (params) => {
  const sc = params.structuredContent as { prefill?: Prefill } | undefined;
  applyPrefill(sc?.prefill);
};
app.onhostcontextchanged = (ctx) => {
  if (ctx.theme) {
    applyDocumentTheme(ctx.theme);
    document.documentElement.dataset.theme = ctx.theme;
  }
  if (ctx.locale && !S.touchedLang) {
    S.lang = langFromLocale(ctx.locale);
    render();
  }
};

render();
app
  .connect()
  .then(() => {
    const ctx = app.getHostContext();
    if (ctx?.theme) {
      applyDocumentTheme(ctx.theme);
      document.documentElement.dataset.theme = ctx.theme;
    }
    if (ctx?.locale) S.lang = langFromLocale(ctx.locale);
    render();
  })
  .catch((err) => console.error("MCP App connect failed", err));
