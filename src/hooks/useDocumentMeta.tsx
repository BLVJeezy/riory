import { useEffect } from "react";

const DEFAULT_TITLE = "24/7 Ontstopping-, riool- & ruimdienst Bilzen-Hoeselt, Limburg | Riory";
const DEFAULT_DESCRIPTION = "Riool verstopt in Bilzen, Hasselt of Limburg? Riory staat 24/7 klaar: ontstopping, septische put ledigen, camera inspectie riool & leegpompen. Bel nu!";

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
