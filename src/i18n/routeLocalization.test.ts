import { describe, expect, it } from "vitest";
import {
  getCanonicalLocalizedPath,
  getLocalizedPath,
  getLocalizedRoutes,
} from "./routeLocalization";

describe("route localization", () => {
  it("publishes a Limburg location only at its Dutch canonical route", () => {
    expect(getLocalizedRoutes("/fr/regio/genk")).toEqual([
      { language: "nl", path: "/regio/genk" },
    ]);
    expect(getCanonicalLocalizedPath("/fr/regio/genk")).toBe("/regio/genk");
  });

  it("publishes a Liège location only at its French canonical route", () => {
    expect(getLocalizedRoutes("/regio/vottem")).toEqual([
      { language: "fr", path: "/fr/regio/vottem" },
    ]);
    expect(getCanonicalLocalizedPath("/regio/vottem")).toBe("/fr/regio/vottem");
    expect(getLocalizedPath("/regio/vottem", "nl")).toBeNull();
  });

  it("keeps genuinely translated service routes in all three languages", () => {
    expect(getLocalizedRoutes("/fr/diensten/camera-inspectie")).toEqual([
      { language: "nl", path: "/diensten/camera-inspectie" },
      { language: "en", path: "/en/diensten/camera-inspectie" },
      { language: "fr", path: "/fr/diensten/camera-inspectie" },
    ]);
  });

  it("does not advertise hard-coded Dutch legal pages as translations", () => {
    expect(getLocalizedRoutes("/en/data-protection")).toEqual([
      { language: "nl", path: "/data-protection" },
    ]);
  });

  it("does not invent alternates for unknown routes", () => {
    expect(getLocalizedRoutes("/does-not-exist")).toEqual([]);
    expect(getLocalizedRoutes("/diensten/does-not-exist")).toEqual([]);
    expect(getCanonicalLocalizedPath("/does-not-exist")).toBeNull();
  });
});
