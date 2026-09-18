// Hulpfuncties om aanvragen (afspraak/offerte) betrouwbaar te versturen.
//
// Achtergrond: tot nu toe hing een aanvraag volledig af van één enkele
// Supabase-insert. Faalde die (netwerkfout, tijdelijke 5xx, RLS/kolomfout),
// dan kreeg de bezoeker "Er ging iets mis" én werd er geen enkele
// notificatie verstuurd — de lead was dus definitief verloren.
//
// Deze helpers doen twee dingen:
//   1. tijdelijke fouten opnieuw proberen (met korte backoff);
//   2. de echte foutreden zichtbaar loggen, zodat een probleem in productie
//      niet stil blijft.

type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
};

const asError = (err: unknown): SupabaseLikeError =>
  (err && typeof err === "object" ? (err as SupabaseLikeError) : { message: String(err) });

export function describeError(err: unknown): string {
  const e = asError(err);
  return [e.code && `code=${e.code}`, e.status && `status=${e.status}`, e.message, e.details, e.hint]
    .filter(Boolean)
    .join(" | ");
}

// Een fout is "tijdelijk" als er geen PostgREST-foutcode is (netwerk/DNS/CORS)
// of als de server een 5xx teruggaf. Een RLS- of validatiefout (4xx / code als
// 42501, 23502, ...) heeft geen zin om te herhalen.
function isTransient(err: unknown): boolean {
  const e = asError(err);
  if (typeof e.status === "number") return e.status >= 500 || e.status === 429;
  if (!e.code) return true;
  return /^5/.test(e.code) || e.code === "PGRST001";
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Wacht maximaal `ms` op een belofte. De onderliggende request wordt NIET
 * afgebroken (hij mag in de achtergrond afronden); we stoppen enkel met
 * wachten zodat een traag kanaal het formulier niet blokkeert.
 */
export function withTimeout<T>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    wait(ms).then(() => fallback),
  ]);
}

/**
 * Voert een Supabase-write uit en probeert bij tijdelijke fouten opnieuw.
 * Gooit nooit; geeft `true` terug als de write gelukt is.
 */
export async function writeWithRetry(
  label: string,
  run: () => PromiseLike<{ error: unknown | null }>,
  attempts = 3,
): Promise<boolean> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    let error: unknown = null;
    try {
      ({ error } = await run());
    } catch (err) {
      error = err;
    }

    if (!error) return true;

    console.error(`${label}: poging ${attempt}/${attempts} mislukt — ${describeError(error)}`);

    if (attempt === attempts || !isTransient(error)) return false;
    await wait(attempt * 400);
  }
  return false;
}
