// Gedeelde configuratie voor de Riory MCP-server (boeken via ChatGPT / Claude).
// De Supabase-waarden zijn de publieke (publishable) sleutels die ook in de
// website-bundle zitten; op Vercel worden ze overschreven door de env vars.

import { allLocations } from "../src/data/locations";

declare const __RIORY_PUBLISHABLE_KEY__: string;

export const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://bqcxvvpawbwupornueww.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  // Ingevuld door scripts/build-mcp.mjs vanuit .env (publieke sleutel).
  __RIORY_PUBLISHABLE_KEY__;

export const LEAD_ENDPOINT = "https://riory.invenix.nl/api/lead";
export const OFFICE_EMAIL = "afspraak@riory.be";

export const RIORY = {
  name: "Riory BV",
  website: "https://riory.be",
  bookingPage: "https://riory.be/afspraak",
  termsUrl: "https://riory.be/algemene-voorwaarden",
  privacyUrl: "https://riory.be/privacy-policy",
  phone: "+32 472 50 28 14",
  phoneHref: "tel:+32472502814",
  address: "Natveld 47, 3740 Bilzen-Hoeselt, België",
  availability: "24/7 bereikbaar",
} as const;

// Canonieke (Nederlandstalige) dienstnamen — identiek aan het webformulier,
// zodat database, notificatiemail en Simpla CRM niets nieuws moeten leren.
export const DIENSTEN = [
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
] as const;

export type Dienst = (typeof DIENSTEN)[number];

export const DIENST_OMSCHRIJVING: Record<Dienst, string> = {
  Ontstopping:
    "Verstopte wc, gootsteen, douche, keukenafvoer of riool ontstoppen met hogedruk.",
  "Septische put ledigen": "Septische put / beerput ledigen en reinigen met zuigwagen.",
  "Camera inspectie riool":
    "Camera-inspectie van riolering en afvoeren: oorzaak vinden zonder breekwerk.",
  "Plaatsbepaling afvoeren": "Afvoerleidingen en rioolputten lokaliseren.",
  "Geurhinder/rioolvliegjes": "Rioolgeur, geurdetectie en rioolvliegjes aanpakken.",
  "Periodieke reiniging van afvoeren": "Preventieve reiniging van afvoeren en riolering.",
  "Wateroverlast/pompwerken": "Kelder of ruimte leegpompen bij wateroverlast.",
  "Reinigen van regenput": "Regenput leegmaken en reinigen.",
  Dakgootreiniging: "Dakgoten reinigen.",
  "Herstellingswerken aan afvoeren": "Herstellingen aan afvoeren en riolering.",
};

export const REGENPUT_OPTIES = [
  "Tot 5.000 L",
  "7.500 L",
  "10.000 L",
  "15.000 L",
  "20.000 L",
  "Ik weet het niet",
  "Andere maat",
] as const;

export const KLANT_TYPES = ["particulier", "bedrijf", "vrij_beroep"] as const;

export const WERKGEBIED: string[] = Array.from(
  new Set(allLocations.map((l) => l.city)),
);
