// Bouwt de Riory MCP-server naar api/mcp.js (Vercel function op /api/mcp).
//   1. bundelt het in-chat formulier (mcp/widget) tot één zelfstandig HTML-bestand
//   2. bundelt mcp/handler.ts met dat HTML erin; npm-pakketten blijven extern
//      (Vercel traceert ze vanuit node_modules).
//
// Gebruik: npm run build:mcp — en commit daarna api/mcp.js (Vercel deployt dat bestand).

import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...x) => resolve(root, ...x);

function readPublishableKey() {
  if (process.env.VITE_SUPABASE_PUBLISHABLE_KEY) return process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  try {
    const env = readFileSync(p(".env"), "utf8");
    const m = env.match(/^VITE_SUPABASE_PUBLISHABLE_KEY\s*=\s*"?([^"\n]+)"?/m);
    return m ? m[1].trim() : "";
  } catch {
    return "";
  }
}

// 1. Widget
const widgetJs = await build({
  entryPoints: [p("mcp/widget/booking-form.ts")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: true,
  legalComments: "none",
});
const js = widgetJs.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const logo = readFileSync(p("public/riory-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*\?>\s*/, "")
  .replace(/\s+id="Layer_1"/, "");
const html = readFileSync(p("mcp/widget/booking-form.html"), "utf8")
  .replace("<!--RIORY_LOGO-->", () => logo)
  .replace("<!--APP_SCRIPT-->", () => js);
mkdirSync(p("mcp/dist"), { recursive: true });
writeFileSync(p("mcp/dist/booking-form.html"), html);

// 2. Server
const key = readPublishableKey();
if (!key) console.warn("[build-mcp] waarschuwing: geen VITE_SUPABASE_PUBLISHABLE_KEY gevonden");

await build({
  entryPoints: [p("mcp/handler.ts")],
  outfile: p("api/mcp.js"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node20",
  packages: "external",
  define: {
    __BOOKING_WIDGET_HTML__: JSON.stringify(html),
    __RIORY_PUBLISHABLE_KEY__: JSON.stringify(key),
  },
  banner: {
    js: "// GEGENEREERD door scripts/build-mcp.mjs — niet manueel aanpassen. Bron: mcp/*.ts",
  },
});

console.log(
  `[build-mcp] api/mcp.js klaar (widget ${(html.length / 1024).toFixed(1)} kB)`,
);
