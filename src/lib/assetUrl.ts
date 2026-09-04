/**
 * CDN-assets worden geserveerd vanaf de Lovable-hosting (/__l5e/...).
 * Op een custom domein (bv. www.riory.be) wordt dat pad niet doorgegeven,
 * waardoor afbeeldingen leeg blijven. Daarom maken we het pad daar absoluut
 * naar de Lovable-host.
 */
const ASSET_ORIGIN = "https://riory.lovable.app";

export const assetUrl = (url: string): string => {
  if (!url.startsWith("/__l5e/")) return url;
  if (typeof window === "undefined") return `${ASSET_ORIGIN}${url}`;
  const host = window.location.hostname;
  const servedHere = host === "localhost" || host === "127.0.0.1" || host.endsWith("lovable.app");
  return servedHere ? url : `${ASSET_ORIGIN}${url}`;
};
