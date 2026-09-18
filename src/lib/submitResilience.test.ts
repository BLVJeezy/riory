import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { withTimeout, writeWithRetry, describeError } from "./submitResilience";

describe("writeWithRetry", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("geeft true bij een geslaagde write", async () => {
    const run = vi.fn().mockResolvedValue({ error: null });
    await expect(writeWithRetry("test", run)).resolves.toBe(true);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("probeert opnieuw bij een netwerkfout en slaagt alsnog", async () => {
    const run = vi
      .fn()
      .mockResolvedValueOnce({ error: { message: "TypeError: Failed to fetch" } })
      .mockResolvedValueOnce({ error: null });
    await expect(writeWithRetry("test", run)).resolves.toBe(true);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it("probeert NIET opnieuw bij een RLS-/validatiefout", async () => {
    const run = vi.fn().mockResolvedValue({
      error: { code: "42501", message: "new row violates row-level security policy" },
    });
    await expect(writeWithRetry("test", run)).resolves.toBe(false);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("gooit niet wanneer de call zelf een exception werpt", async () => {
    const run = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(writeWithRetry("test", run, 2)).resolves.toBe(false);
    expect(run).toHaveBeenCalledTimes(2);
  });
});

describe("withTimeout", () => {
  it("geeft de waarde terug als de belofte op tijd klaar is", async () => {
    await expect(withTimeout(Promise.resolve(true), 1000, false)).resolves.toBe(true);
  });

  it("geeft de fallback terug als het te lang duurt", async () => {
    const traag = new Promise<boolean>((r) => setTimeout(() => r(true), 50));
    await expect(withTimeout(traag, 5, false)).resolves.toBe(false);
  });
});

describe("describeError", () => {
  it("bevat code en boodschap", () => {
    expect(describeError({ code: "42501", message: "denied" })).toContain("code=42501");
    expect(describeError({ code: "42501", message: "denied" })).toContain("denied");
  });
});
