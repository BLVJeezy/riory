// Lokale testserver voor de Riory MCP-endpoint.
//   npm run mcp:dev  →  http://localhost:8787/api/mcp  (testmodus: er wordt niets echt geboekt)
// Zet RIORY_MCP_DRY_RUN=0 om de echte pijplijn te gebruiken.

import { createServer } from "node:http";

process.env.RIORY_MCP_DRY_RUN ??= "1";
const { default: handler } = await import("../api/mcp.js");
const port = Number(process.env.PORT || 8787);

createServer((req, res) => {
  if (!req.url?.startsWith("/api/mcp")) {
    res.statusCode = 404;
    res.end("Not found — gebruik /api/mcp");
    return;
  }
  handler(req, res);
}).listen(port, () => {
  console.log(
    `Riory MCP op http://localhost:${port}/api/mcp (testmodus: ${process.env.RIORY_MCP_DRY_RUN === "1" ? "aan" : "UIT"})`,
  );
});
