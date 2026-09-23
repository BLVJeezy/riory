import { next } from "@vercel/functions";
import { ARTICLE_ROUTE_SLUGS, isKnownPublicRoute } from "./src/lib/publicRoutes";

const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  "/index": "/",
  "/en/index": "/en",
  "/fr/index": "/fr",
  "/regio/luik": "/fr/regio/luik",
  "/regio/rocourt": "/fr/regio/rocourt",
  "/regio/juprelle": "/fr/regio/juprelle",
  "/regio/ans": "/fr/regio/ans",
  "/regio/milmort": "/fr/regio/milmort",
  "/regio/vottem": "/fr/regio/vottem",
  "/regio/chenee": "/fr/regio/chenee",
  "/Riorybv_Privacy_Policy_2021.pdf": "/privacy-policy",
  "/Riorybv_Gebruiksvoorwaarden_2021.pdf": "/gebruiksvoorwaarden",
  "/Riorybv_Data_Protection_Notice_2021.pdf": "/data-protection",
  "/wp-content/uploads/2022/06/Riorybv_Data_Protection_Notice_2021.pdf": "/data-protection",
};

const DUTCH_ONLY_LOCALIZED_PREFIXES = [
  "/data-protection",
  "/privacy-policy",
  "/gebruiksvoorwaarden",
  "/algemene-voorwaarden",
  "/cookie-policy",
  "/sollicitatie",
] as const;

const PASSTHROUGH_PREFIXES = [
  "/api/",
  "/assets/",
  "/__l5e/",
  "/.well-known/",
  "/_vercel/",
];
const PASSTHROUGH_FILES = new Set([
  "/favicon.ico",
  "/favicon.svg",
  "/llms.txt",
  "/placeholder.svg",
  "/riory-logo-email.png",
  "/riory-logo.svg",
  "/robots.txt",
  "/sitemap.xml",
]);
const articleSlugs = new Set<string>(ARTICLE_ROUTE_SLUGS);

const withoutTrailingSlash = (pathname: string) =>
  pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

const getLegacyRedirect = (pathname: string): string | undefined => {
  const exactRedirect = LEGACY_REDIRECTS[pathname];
  if (exactRedirect) return exactRedirect;

  const localizedMatch = pathname.match(/^\/(en|fr)(\/.*)$/);
  if (!localizedMatch) return undefined;

  const pathWithoutLanguage = localizedMatch[2];
  if (DUTCH_ONLY_LOCALIZED_PREFIXES.includes(pathWithoutLanguage as (typeof DUTCH_ONLY_LOCALIZED_PREFIXES)[number])) {
    return pathWithoutLanguage;
  }

  const articleMatch = pathWithoutLanguage.match(/^\/artikels\/([^/]+)$/);
  if (pathWithoutLanguage === "/artikels" || (articleMatch && articleSlugs.has(articleMatch[1]))) {
    return pathWithoutLanguage;
  }

  return undefined;
};

const htmlEscape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const notFoundResponse = (pathname: string) => {
  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const language = isFrench ? "fr" : isEnglish ? "en" : "nl-BE";
  const title = isFrench ? "Page introuvable" : isEnglish ? "Page not found" : "Pagina niet gevonden";
  const message = isFrench
    ? "Cette adresse n’existe pas ou a été déplacée."
    : isEnglish
      ? "This address does not exist or has been moved."
      : "Dit adres bestaat niet of werd verplaatst.";
  const backLabel = isFrench ? "Retour à l’accueil" : isEnglish ? "Back to home" : "Terug naar de startpagina";
  const homePath = isFrench ? "/fr" : isEnglish ? "/en" : "/";

  return new Response(
    `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>404 | ${title} | Riory</title>
    <style>body{margin:0;background:#f7f7f5;color:#171717;font-family:Arial,sans-serif}main{min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center}section{max-width:620px}h1{font-size:clamp(2.5rem,8vw,5rem);margin:0 0 12px}p{font-size:1.1rem;line-height:1.6;margin:0 0 24px}a{display:inline-block;background:#dc2626;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700}small{display:block;margin-top:24px;color:#737373;overflow-wrap:anywhere}</style>
  </head>
  <body>
    <main><section><h1>404</h1><p>${message}</p><a href="${homePath}">${backLabel}</a><small>${htmlEscape(pathname)}</small></section></main>
  </body>
</html>`,
    {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=300",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
};

/**
 * Runs before the SPA catch-all rewrite on Vercel. Known client routes continue
 * to index.html; unknown document paths stop here with a real HTTP 404.
 */
export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  const pathname = withoutTrailingSlash(url.pathname);

  const redirectDestination = getLegacyRedirect(pathname);
  if (redirectDestination) {
    const target = new URL(redirectDestination, url.origin);
    target.search = url.search;
    return new Response(null, {
      status: 301,
      headers: {
        Location: target.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  if (
    PASSTHROUGH_FILES.has(pathname) ||
    PASSTHROUGH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return next();
  }

  if (isKnownPublicRoute(pathname)) return next();

  return notFoundResponse(pathname);
}
