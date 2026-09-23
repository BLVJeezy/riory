import { allLocations } from "@/data/locations";
import { referenceCategories } from "@/data/references";
import { allServices } from "@/data/services";
import {
  SUPPORTED_LANGUAGES,
  getLangFromPath,
  stripLangPrefix,
  withLangPrefix,
  type Language,
} from "./config";

export interface LocalizedRoute {
  language: Language;
  path: string;
}

const MULTILINGUAL_EXACT_PATHS = new Set([
  "/",
  "/diensten",
  "/afspraak",
  "/prijscalculator",
  "/veelvoorkomende-problemen",
]);

// These pages currently contain one original Dutch version. A translated
// navigation shell alone does not make the page an equivalent translation.
const DUTCH_ONLY_EXACT_PATHS = new Set([
  "/artikels",
  "/data-protection",
  "/privacy-policy",
  "/gebruiksvoorwaarden",
  "/algemene-voorwaarden",
  "/cookie-policy",
  "/sollicitatie",
]);

const DUTCH_ONLY_PREFIXES = ["/artikels/"];

const normalizeBasePath = (pathname: string): string => {
  const basePath = stripLangPrefix(pathname).replace(/\/+$/, "");
  return basePath || "/";
};

const routeForLanguage = (basePath: string, language: Language): LocalizedRoute => ({
  language,
  path: withLangPrefix(basePath, language),
});

/**
 * Returns only routes that contain a complete equivalent version of the page.
 * It intentionally does not treat every /en or /fr SPA route as translated.
 */
export const getLocalizedRoutes = (pathname: string): LocalizedRoute[] => {
  const basePath = normalizeBasePath(pathname);
  const locationMatch = basePath.match(/^\/regio\/([^/]+)$/);

  if (locationMatch) {
    const location = allLocations.find(({ slug }) => slug === locationMatch[1]);
    return location
      ? [routeForLanguage(basePath, location.contentLanguage)]
      : [];
  }

  if (
    MULTILINGUAL_EXACT_PATHS.has(basePath) ||
    (/^\/diensten\/([^/]+)$/.test(basePath) &&
      allServices.some(({ slug }) => basePath === `/diensten/${slug}`)) ||
    (/^\/referenties\/([^/]+)$/.test(basePath) &&
      referenceCategories.some(({ slug }) => basePath === `/referenties/${slug}`))
  ) {
    return SUPPORTED_LANGUAGES.map((language) => routeForLanguage(basePath, language));
  }

  if (
    DUTCH_ONLY_EXACT_PATHS.has(basePath) ||
    DUTCH_ONLY_PREFIXES.some((prefix) => basePath.startsWith(prefix))
  ) {
    return [routeForLanguage(basePath, "nl")];
  }

  return [];
};

export const getLocalizedPath = (
  pathname: string,
  language: Language,
): string | null =>
  getLocalizedRoutes(pathname).find((route) => route.language === language)?.path ?? null;

export const getCanonicalLocalizedPath = (pathname: string): string | null => {
  const routes = getLocalizedRoutes(pathname);
  if (routes.length === 0) return null;

  const currentLanguage = getLangFromPath(pathname);

  return routes.find(({ language }) => language === currentLanguage)?.path ?? routes[0].path;
};
