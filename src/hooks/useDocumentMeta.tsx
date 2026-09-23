import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLangFromPath, type Language } from "@/i18n/config";
import {
  getCanonicalLocalizedPath,
  getLocalizedRoutes,
} from "@/i18n/routeLocalization";

const DEFAULT_TITLES: Record<Language, string> = {
  nl: "Ontstopping & Rioolservice Limburg 24/7 | Riory Bilzen",
  en: "Drain Unblocking & Sewer Service Limburg 24/7 | Riory Bilzen",
  fr: "Débouchage & Service d'Égout Limbourg 24/7 | Riory Bilzen",
};

const DEFAULT_DESCRIPTIONS: Record<Language, string> = {
  nl: "Riool verstopt? Riory is 24/7 bereikbaar in Bilzen, Hoeselt, Hasselt, Genk & Tongeren. ✓ Binnen 2u ter plaatse ✓ Vaste prijzen ✓ 4.9★ Reviews. Bel nu!",
  en: "Blocked drain? Riory is available 24/7 in Bilzen, Hoeselt, Hasselt, Genk & Tongeren. ✓ On site within 2h ✓ Fixed prices ✓ 4.9★ Reviews. Call now!",
  fr: "Égout bouché ? Riory est disponible 24/7 à Bilzen, Hoeselt, Hasselt, Genk & Tongres. ✓ Sur place en 2h ✓ Prix fixes ✓ 4.9★ Avis. Appelez !",
};

const SITE_URL = "https://www.riory.be";

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

const setOrCreateLink = (rel: string, href: string, hreflang?: string) => {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.querySelector(sel) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    if (hreflang) link.setAttribute("hreflang", hreflang);
    document.head.appendChild(link);
  }
  link.dataset.rioryManaged = "true";
  link.setAttribute("href", href);
};

const removeHreflangLinks = () => {
  document
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((link) => link.remove());
};

export const useDocumentMeta = (
  title?: string,
  description?: string,
) => {
  const location = useLocation();

  useEffect(() => {
    const lang = getLangFromPath(location.pathname);

    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";

    const finalTitle = title || DEFAULT_TITLES[lang];
    const finalDesc = description || DEFAULT_DESCRIPTIONS[lang];
    // Strip trailing slash (except homepage) and ignore query params/UTM
    const cleanPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const canonicalPath = getCanonicalLocalizedPath(cleanPath) ?? cleanPath;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.title = finalTitle;
    if (metaDesc) metaDesc.setAttribute("content", finalDesc);

    setMeta('meta[property="og:title"]', "content", finalTitle);
    setMeta('meta[property="og:description"]', "content", finalDesc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:locale"]', "content", lang === "fr" ? "fr_BE" : lang === "en" ? "en_US" : "nl_BE");
    setMeta('meta[name="twitter:title"]', "content", finalTitle);
    setMeta('meta[name="twitter:description"]', "content", finalDesc);

    setOrCreateLink("canonical", canonicalUrl);

    // Only advertise complete equivalent pages. Single-language pages do not
    // need a self-only hreflang annotation.
    removeHreflangLinks();
    const localizedRoutes = getLocalizedRoutes(cleanPath);
    if (localizedRoutes.length > 1) {
      localizedRoutes.forEach(({ language, path }) => {
        const hreflang = language === "nl" ? "nl-BE" : language === "fr" ? "fr-BE" : "en";
        setOrCreateLink("alternate", `${SITE_URL}${path}`, hreflang);
      });

      const defaultRoute = localizedRoutes.find(({ language }) => language === "nl") ?? localizedRoutes[0];
      setOrCreateLink("alternate", `${SITE_URL}${defaultRoute.path}`, "x-default");
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
    };
  }, [title, description, location.pathname]);
};
