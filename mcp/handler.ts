// Vercel serverless handler voor https://riory.be/api/mcp
// Stateless Streamable HTTP: elke POST krijgt een verse server + transport.
// Gebundeld naar api/mcp.js door scripts/build-mcp.mjs.

import type { IncomingMessage, ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createRioryMcpServer } from "./server";

type Req = IncomingMessage & { body?: unknown };

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "content-type, accept, authorization, mcp-session-id, mcp-protocol-version, last-event-id",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

async function readBody(req: Req): Promise<unknown> {
  if (req.body !== undefined) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : undefined;
}

function jsonRpcError(res: ServerResponse, status: number, message: string) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ jsonrpc: "2.0", error: { code: -32000, message }, id: null }));
}

export default async function handler(req: Req, res: ServerResponse) {
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    // Stateless server: geen SSE-stream (GET) of sessies (DELETE).
    res.setHeader("Allow", "POST, OPTIONS");
    jsonRpcError(res, 405, "Method not allowed. Gebruik POST (MCP Streamable HTTP).");
    return;
  }

  let body: unknown;
  try {
    body = await readBody(req);
  } catch {
    jsonRpcError(res, 400, "Parse error: ongeldige JSON");
    return;
  }

  const server = createRioryMcpServer({
    userAgent: String(req.headers["user-agent"] || ""),
    dryRun: process.env.RIORY_MCP_DRY_RUN === "1",
  });
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    console.error("[mcp] request failed:", err);
    if (!res.headersSent) jsonRpcError(res, 500, "Internal server error");
  }
}
