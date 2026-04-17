import { useEffect } from "react";

const DEFAULT_TITLE = "Ontstopping & Rioolservice Limburg 24/7 | Riory Bilzen";
const DEFAULT_DESCRIPTION = "Riool verstopt? Riory is 24/7 bereikbaar in Bilzen, Hoeselt, Hasselt, Genk & Tongeren. ✓ Binnen 2u ter plaatse ✓ Vaste prijzen ✓ 4.9★ Reviews. Bel nu!";
const SITE_URL = "https://riory.be";

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

const setOrCreateLink = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export const useDocumentMeta = (title?: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";
    const prevCanonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || SITE_URL;

    const finalTitle = title || DEFAULT_TITLE;
    const finalDesc = description || DEFAULT_DESCRIPTION;
    const canonicalUrl = `${SITE_URL}${window.location.pathname}`;

    document.title = finalTitle;
    if (metaDesc) metaDesc.setAttribute("content", finalDesc);

    setMeta('meta[property="og:title"]', "content", finalTitle);
    setMeta('meta[property="og:description"]', "content", finalDesc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "content", finalTitle);
    setMeta('meta[name="twitter:description"]', "content", finalDesc);

    setOrCreateLink("canonical", canonicalUrl);

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
      setOrCreateLink("canonical", prevCanonical);
    };
  }, [title, description]);
};
