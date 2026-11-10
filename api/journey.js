// Customer journey voor /admin/werkingsproces.
// 1. Controleert of de aanroeper een ingelogde Riory-admin is (Supabase-token + has_role).
// 2. Haalt de journey-feed op bij de werkbonnen-app met de gedeelde geheime sleutel.
// De sleutel (JOURNEY_API_TOKEN) staat enkel op de server en komt nooit in de browser.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://bqcxvvpawbwupornueww.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY ||
  // Publieke (publishable) sleutel, staat ook in de frontend-bundle.
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY3h2dnBhd2J3dXBvcm51ZXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTQyNTUsImV4cCI6MjA4ODY3MDI1NX0.4XUjKVlt6mk98sIpvR06Zo2m5gL5txCpa3EQIvWmWrc";
const FEED_URL = process.env.JOURNEY_FEED_URL || "https://werkbonnenriory.lovable.app/api/public/journey";

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "private, no-store");
  res.end(JSON.stringify(body));
};

async function isAdmin(accessToken) {
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` };
  const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers });
  if (!u.ok) return false;
  const user = await u.json();
  if (!user?.id) return false;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/has_role`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ _user_id: user.id, _role: "admin" }),
  });
  return r.ok && (await r.json()) === true;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Methode niet toegestaan." });

  const token = String(req.headers.authorization || "").match(/^Bearer (\S{10,4096})$/)?.[1];
  if (!token) return send(res, 401, { error: "Niet ingelogd." });
  if (!SUPABASE_KEY) return send(res, 500, { error: "Supabase-sleutel ontbreekt op de server." });

  try {
    if (!(await isAdmin(token))) return send(res, 403, { error: "Geen admin." });
  } catch {
    return send(res, 502, { error: "Login kon niet gecontroleerd worden." });
  }

  const secret = process.env.JOURNEY_API_TOKEN || process.env.journey_api_key || process.env.JOURNEY_API_KEY;
  if (!secret) return send(res, 503, { error: "Koppeling met de werkbonnen-app is nog niet ingesteld.", code: "not_configured" });

  const url = new URL(req.url, "http://x");
  const from = url.searchParams.get("from");
  if (!from || Number.isNaN(Date.parse(from))) return send(res, 400, { error: "Ongeldige periode." });

  try {
    const r = await fetch(FEED_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: new Date(from).toISOString() }),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) return send(res, r.status === 401 ? 502 : r.status, { error: body.error || "Werkbonnen-app gaf een fout.", code: r.status === 503 ? "not_configured" : r.status === 401 ? "bad_token" : undefined });
    return send(res, 200, body);
  } catch {
    return send(res, 502, { error: "Werkbonnen-app niet bereikbaar." });
  }
}
