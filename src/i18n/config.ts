import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nl from "./locales/nl.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

export const SUPPORTED_LANGUAGES = ["nl", "en", "fr"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const getLangFromPath = (pathname: string): Language => {
  const seg = pathname.split("/")[1];
  if (seg === "en" || seg === "fr") return seg;
  return "nl";
};

export const stripLangPrefix = (pathname: string): string => {
  const seg = pathname.split("/")[1];
  if (seg === "en" || seg === "fr") {
    const rest = pathname.slice(3); // remove "/en" or "/fr"
    return rest === "" ? "/" : rest;
  }
  return pathname;
};

export const withLangPrefix = (path: string, lang: Language): string => {
  // path always starts with "/"
  if (lang === "nl") return path;
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
};

i18n.use(initReactI18next).init({
  resources: {
    nl: { translation: nl },
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: "nl",
  fallbackLng: "nl",
  interpolation: { escapeValue: false },
});

export default i18n;
