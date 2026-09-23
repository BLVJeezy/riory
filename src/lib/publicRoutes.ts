/**
 * Public route manifest shared by Vercel's routing middleware and its tests.
 *
 * Keep the slug lists in sync with the matching objects in src/data. The
 * route tests deliberately fail when a data slug is added without being made
 * reachable here, preventing a valid detail page from becoming a server-side
 * 404 after a later content update.
 */
export const SERVICE_ROUTE_SLUGS = [
  "camera-inspectie",
  "ontstoppingen-en-geurdetectie",
  "septische-put-ledigen",
  "leegpompen-en-reinigen",
  "wc-verstopt",
  "keukenafvoer-verstopt",
  "doucheputje-verstopt",
  "riool-verstopt",
  "gootsteen-verstopt",
  "lekkende-kraan",
  "lekkage-opsporen",
  "dakgootreiniging",
  "rioolreparatie",
  "rioolvliegjes",
] as const;

export const ARTICLE_ROUTE_SLUGS = [
  "malafide-loodgieters-herkennen",
  "vrijwilligers-noodweer-opruimen-solidariteit",
  "helden-van-hier-helpende-handen",
] as const;

export const REFERENCE_ROUTE_SLUGS = [
  "dakgootreinigingen",
  "ledigen-van-septische-putten",
  "leegpompen-en-reinigen",
  "ontstoppingen-en-geurdetectie",
] as const;

export const DUTCH_LOCATION_ROUTE_SLUGS = [
  "hasselt",
  "genk",
  "hoeselt",
  "tongeren",
  "maasmechelen",
  "sint-truiden",
  "diepenbeek",
  "riemst",
  "wellen",
  "zutendaal",
  "vreren",
  "vliermaal",
  "kortessem",
  "alken",
  "borgloon",
] as const;

export const FRENCH_LOCATION_ROUTE_SLUGS = [
  "luik",
  "rocourt",
  "juprelle",
  "ans",
  "milmort",
  "vottem",
  "chenee",
] as const;

const LOCALIZED_STATIC_ROUTES = new Set([
  "/",
  "/index",
  "/diensten",
  "/afspraak",
  "/prijscalculator",
  "/veelvoorkomende-problemen",
  "/unsubscribe",
]);

const DUTCH_ONLY_STATIC_ROUTES = new Set([
  "/artikels",
  "/data-protection",
  "/privacy-policy",
  "/gebruiksvoorwaarden",
  "/algemene-voorwaarden",
  "/cookie-policy",
  "/sollicitatie",
]);

const UNLOCALIZED_STATIC_ROUTES = new Set(["/admin", "/admin/login"]);
const LANGUAGE_PREFIXES = new Set(["en", "fr"]);
const serviceSlugs = new Set<string>(SERVICE_ROUTE_SLUGS);
const articleSlugs = new Set<string>(ARTICLE_ROUTE_SLUGS);
const referenceSlugs = new Set<string>(REFERENCE_ROUTE_SLUGS);
const dutchLocationSlugs = new Set<string>(DUTCH_LOCATION_ROUTE_SLUGS);
const frenchLocationSlugs = new Set<string>(FRENCH_LOCATION_ROUTE_SLUGS);

const normalizePathname = (pathname: string) => {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

/** Returns true only for public client routes that have real page content. */
export const isKnownPublicRoute = (rawPathname: string): boolean => {
  const pathname = normalizePathname(rawPathname);

  if (UNLOCALIZED_STATIC_ROUTES.has(pathname)) return true;

  const segments = pathname.split("/").filter(Boolean);
  const maybeLanguage = segments[0];
  const language = LANGUAGE_PREFIXES.has(maybeLanguage) ? maybeLanguage : null;
  const routeSegments = language ? segments.slice(1) : segments;
  const routePath = `/${routeSegments.join("/")}`;

  if (LOCALIZED_STATIC_ROUTES.has(routePath)) return true;
  if (language === null && DUTCH_ONLY_STATIC_ROUTES.has(routePath)) return true;

  if (routeSegments.length !== 2) return false;

  const [section, slug] = routeSegments;

  if (section === "diensten") return serviceSlugs.has(slug);
  if (section === "artikels") return language === null && articleSlugs.has(slug);
  if (section === "referenties") return referenceSlugs.has(slug);

  if (section === "regio") {
    // Limburg pages are canonically Dutch without a language prefix. Liège
    // pages are canonically French under /fr; no invented translations.
    if (language === "fr") return frenchLocationSlugs.has(slug);
    if (language === null) return dutchLocationSlugs.has(slug);
    return false;
  }

  return false;
};
