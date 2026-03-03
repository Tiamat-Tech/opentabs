/**
 * Cross-origin test server for fetchViaBackground E2E tests.
 *
 * Runs on a different port from the main test server to create a
 * cross-origin scenario. The e2e-test plugin is injected into a page
 * on the main test server, and fetchViaBackground routes requests
 * through the Chrome extension's background service worker to this
 * cross-origin server — attaching HttpOnly cookies automatically.
 *
 * Endpoints:
 *   POST /api/echo-with-cookies — returns cookies, body, method, and headers
 *   GET  /api/simple             — returns { ok: true }
 *   POST /control/set-cookie     — sets an HttpOnly cookie on the response
 *   GET  /control/cookies        — returns all cookies received in the request
 *
 * CORS: responds to OPTIONS preflight with credentials and custom headers.
 *
 * Start: `npx tsx e2e/cross-origin-test-server.ts`
 * Port: ephemeral (PORT=0)
 */

import './orphan-guard.js';
import type { IncomingMessage, ServerResponse } from 'node:http';
import http from 'node:http';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PORT = process.env.PORT !== undefined ? Number(process.env.PORT) : 0;

/** Parse the Cookie header into a key-value record. */
const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) cookies[name] = rest.join('=');
  }
  return cookies;
};

/** Read the full request body as a string. */
const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise(resolve => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: unknown) => {
      if (Buffer.isBuffer(chunk)) chunks.push(chunk);
      else if (typeof chunk === 'string') chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });

/** Collect all request headers into a flat record. */
const flatHeaders = (req: IncomingMessage): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') result[key] = value;
    else if (Array.isArray(value)) result[key] = value.join(', ');
  }
  return result;
};

/** Write CORS headers for the given origin. */
const setCorsHeaders = (res: ServerResponse, origin: string | undefined): void => {
  res.setHeader('Access-Control-Allow-Origin', origin ?? '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, useraccount, linear-client-id');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
};

/** Send a JSON response with CORS headers. */
const sendJson = (
  res: ServerResponse,
  origin: string | undefined,
  data: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
) => {
  setCorsHeaders(res, origin);
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extraHeaders };
  res.writeHead(status, headers);
  res.end(JSON.stringify(data));
};

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname;
  const origin = req.headers.origin;

  // --- CORS preflight ---
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res, origin);
    res.writeHead(204);
    res.end();
    return;
  }

  // --- POST /api/echo-with-cookies ---
  if (path === '/api/echo-with-cookies' && req.method === 'POST') {
    const body = await readBody(req);
    const cookies = parseCookies(req.headers.cookie);
    const headers = flatHeaders(req);
    sendJson(res, origin, { cookies, body, method: req.method, headers });
    return;
  }

  // --- GET /api/simple ---
  if (path === '/api/simple' && req.method === 'GET') {
    sendJson(res, origin, { ok: true });
    return;
  }

  // --- POST /control/set-cookie ---
  if (path === '/control/set-cookie' && req.method === 'POST') {
    const raw = await readBody(req);
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // ignore
    }
    const name = typeof body.name === 'string' ? body.name : 'test';
    const value = typeof body.value === 'string' ? body.value : 'default';
    const httpOnly = body.httpOnly !== false;
    const sameSite = typeof body.sameSite === 'string' ? body.sameSite : 'None';

    const cookieParts = [`${name}=${value}`, `SameSite=${sameSite}`, 'Path=/'];
    if (httpOnly) cookieParts.push('HttpOnly');

    sendJson(res, origin, { ok: true }, 200, { 'Set-Cookie': cookieParts.join('; ') });
    return;
  }

  // --- GET /control/cookies ---
  if (path === '/control/cookies' && req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie);
    sendJson(res, origin, { ok: true, cookies });
    return;
  }

  // --- 404 ---
  res.writeHead(404);
  res.end('Not found');
};

const server = http.createServer((req, res) => {
  handler(req, res).catch((err: unknown) => {
    console.error('[cross-origin-test-server] Handler error:', err);
    if (!res.headersSent) {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  });
});

server.listen(PORT, () => {
  const addr = server.address();
  const actualPort = typeof addr === 'object' && addr !== null ? addr.port : PORT;
  console.log(`[cross-origin-test-server] Listening on http://localhost:${String(actualPort)}`);
});

const shutdown = () => {
  server.close();
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { server };
