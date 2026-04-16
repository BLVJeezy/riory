import { useEffect } from "react";

const DEFAULT_TITLE = "Ontstopping & Rioolservice Limburg 24/7 | Riory Bilzen";
const DEFAULT_DESCRIPTION = "Riool verstopt? Riory is 24/7 bereikbaar in Bilzen, Hoeselt, Hasselt, Genk & Tongeren. ✓ Binnen 2 uur ter plaatse ✓ Vaste prijzen ✓ 4.9★ Google Reviews. Bel nu!";

export const useDocumentMeta = (title?: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";

    document.title = title || DEFAULT_TITLE;
    if (metaDesc) {
      metaDesc.setAttribute("content", description || DEFAULT_DESCRIPTION);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    const twDesc = document.querySelector('meta[name="twitter:description"]');

    if (ogTitle) ogTitle.setAttribute("content", title || DEFAULT_TITLE);
    if (ogDesc) ogDesc.setAttribute("content", description || DEFAULT_DESCRIPTION);
    if (twTitle) twTitle.setAttribute("content", title || DEFAULT_TITLE);
    if (twDesc) twDesc.setAttribute("content", description || DEFAULT_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
    };
  }, [title, description]);
};
