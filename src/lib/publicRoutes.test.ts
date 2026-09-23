import middleware from "../../middleware";
import {
  ARTICLE_ROUTE_SLUGS,
  DUTCH_LOCATION_ROUTE_SLUGS,
  FRENCH_LOCATION_ROUTE_SLUGS,
  REFERENCE_ROUTE_SLUGS,
  SERVICE_ROUTE_SLUGS,
  isKnownPublicRoute,
} from "./publicRoutes";
import { allArticles } from "@/data/articles";
import { allLocations } from "@/data/locations";
import { referenceCategories } from "@/data/references";
import { allServices } from "@/data/services";
import { readFileSync } from "node:fs";

const sorted = (values: readonly string[]) => [...values].sort();
const requestFor = (pathname: string) => new Request(`https://www.riory.be${pathname}`);

describe("public route manifest", () => {
  it("keeps detail-route slugs synchronized with content data", () => {
    expect(sorted(SERVICE_ROUTE_SLUGS)).toEqual(sorted(allServices.map(({ slug }) => slug)));
    expect(sorted(ARTICLE_ROUTE_SLUGS)).toEqual(sorted(allArticles.map(({ slug }) => slug)));
    expect(sorted(REFERENCE_ROUTE_SLUGS)).toEqual(sorted(referenceCategories.map(({ slug }) => slug)));
    expect(sorted([...DUTCH_LOCATION_ROUTE_SLUGS, ...FRENCH_LOCATION_ROUTE_SLUGS])).toEqual(
      sorted(allLocations.map(({ slug }) => slug)),
    );
  });

  it("recognizes static pages, form flows and their supported translations", () => {
    for (const pathname of [
      "/",
      "/diensten",
      "/afspraak",
      "/prijscalculator",
      "/unsubscribe",
      "/unsubscribe/",
      "/admin",
      "/admin/login",
      "/en/diensten",
      "/fr/afspraak",
    ]) {
      expect(isKnownPublicRoute(pathname), pathname).toBe(true);
    }
  });

  it("does not treat untranslated Dutch content as a translated route", () => {
    for (const pathname of [
      "/en/data-protection",
      "/fr/privacy-policy",
      "/en/gebruiksvoorwaarden",
      "/fr/algemene-voorwaarden",
      "/en/cookie-policy",
      "/fr/sollicitatie",
      "/en/artikels",
      `/fr/artikels/${ARTICLE_ROUTE_SLUGS[0]}`,
    ]) {
      expect(isKnownPublicRoute(pathname), pathname).toBe(false);
    }
  });

  it("allows every real detail page in its supported language structure", () => {
    for (const slug of SERVICE_ROUTE_SLUGS) {
      expect(isKnownPublicRoute(`/diensten/${slug}`)).toBe(true);
      expect(isKnownPublicRoute(`/en/diensten/${slug}`)).toBe(true);
      expect(isKnownPublicRoute(`/fr/diensten/${slug}`)).toBe(true);
    }
    for (const slug of DUTCH_LOCATION_ROUTE_SLUGS) {
      expect(isKnownPublicRoute(`/regio/${slug}`)).toBe(true);
      expect(isKnownPublicRoute(`/fr/regio/${slug}`)).toBe(false);
      expect(isKnownPublicRoute(`/en/regio/${slug}`)).toBe(false);
    }
    for (const slug of FRENCH_LOCATION_ROUTE_SLUGS) {
      expect(isKnownPublicRoute(`/fr/regio/${slug}`)).toBe(true);
      expect(isKnownPublicRoute(`/en/regio/${slug}`)).toBe(false);
    }
  });

  it("rejects unknown routes and unknown dynamic slugs", () => {
    for (const pathname of [
      "/does-not-exist",
      "/does-not-exist.html",
      "/diensten/onbestaande-dienst",
      "/artikels/onbestaand-artikel",
      "/referenties/onbestaand-project",
      "/regio/onbestaande-plaats",
      "/en/regio/genk",
      "/fr/regio/genk",
      "/admin/onbestaand",
    ]) {
      expect(isKnownPublicRoute(pathname), pathname).toBe(false);
    }
  });

  it("keeps every sitemap URL canonical, unique and reachable", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url.startsWith("https://www.riory.be/"), url).toBe(true);
      expect(isKnownPublicRoute(new URL(url).pathname), url).toBe(true);
    }
  });
});

describe("Vercel routing middleware", () => {
  it("continues to the SPA for valid pages and query-driven flows", () => {
    for (const pathname of [
      "/diensten/riool-verstopt",
      "/unsubscribe?token=signed-token",
      "/admin/login",
    ]) {
      const response = middleware(requestFor(pathname));
      expect(response.status, pathname).toBe(200);
      expect(response.headers.get("x-middleware-next"), pathname).toBe("1");
    }
  });

  it("passes through API calls and real static assets", () => {
    for (const pathname of [
      "/api/health",
      "/assets/index-123.js",
      "/__l5e/assets-v1/example/image.webp",
      "/_vercel/insights/script.js",
      "/robots.txt",
      "/sitemap.xml",
    ]) {
      expect(middleware(requestFor(pathname)).headers.get("x-middleware-next"), pathname).toBe("1");
    }
  });

  it("returns a real noindex HTTP 404 for unknown paths", async () => {
    const response = middleware(requestFor("/does-not-exist-seo-audit-938472"));

    expect(response?.status).toBe(404);
    expect(response?.headers.get("content-type")).toContain("text/html");
    expect(response?.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(await response?.text()).toContain("Pagina niet gevonden");
  });

  it("permanently redirects legacy region pages and preserves query strings", () => {
    const response = middleware(requestFor("/regio/vottem?utm_source=legacy"));

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(
      "https://www.riory.be/fr/regio/vottem?utm_source=legacy",
    );
  });

  it("permanently redirects obsolete legal PDFs to their current HTML pages", () => {
    const expected = new Map([
      ["/Riorybv_Privacy_Policy_2021.pdf", "/privacy-policy"],
      ["/Riorybv_Gebruiksvoorwaarden_2021.pdf", "/gebruiksvoorwaarden"],
      ["/Riorybv_Data_Protection_Notice_2021.pdf", "/data-protection"],
      [
        "/wp-content/uploads/2022/06/Riorybv_Data_Protection_Notice_2021.pdf",
        "/data-protection",
      ],
    ]);

    for (const [source, destination] of expected) {
      const response = middleware(requestFor(source));
      expect(response?.status, source).toBe(301);
      expect(response?.headers.get("location"), source).toBe(`https://www.riory.be${destination}`);
    }
  });

  it("permanently redirects index aliases to their canonical home pages", () => {
    const expected = new Map([
      ["/index", "/"],
      ["/en/index", "/en"],
      ["/fr/index", "/fr"],
    ]);

    for (const [source, destination] of expected) {
      const response = middleware(requestFor(source));
      expect(response.status, source).toBe(301);
      expect(response.headers.get("location"), source).toBe(`https://www.riory.be${destination}`);
    }
  });

  it("permanently redirects untranslated prefixed content to its Dutch canonical", () => {
    const expected = new Map([
      ["/en/data-protection", "/data-protection"],
      ["/fr/privacy-policy", "/privacy-policy"],
      ["/en/gebruiksvoorwaarden", "/gebruiksvoorwaarden"],
      ["/fr/algemene-voorwaarden", "/algemene-voorwaarden"],
      ["/en/cookie-policy", "/cookie-policy"],
      ["/fr/sollicitatie", "/sollicitatie"],
      ["/en/artikels", "/artikels"],
      [
        "/fr/artikels/malafide-loodgieters-herkennen",
        "/artikels/malafide-loodgieters-herkennen",
      ],
    ]);

    for (const [source, destination] of expected) {
      const response = middleware(requestFor(source));
      expect(response?.status, source).toBe(301);
      expect(response?.headers.get("location"), source).toBe(`https://www.riory.be${destination}`);
    }
  });

  it("does not redirect unknown translated article slugs into a second 404 request", () => {
    const response = middleware(requestFor("/fr/artikels/onbestaand-artikel"));

    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
});
