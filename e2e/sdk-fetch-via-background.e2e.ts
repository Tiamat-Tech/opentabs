/**
 * E2E tests for fetchViaBackground cross-origin proxy.
 *
 * Verifies the full proxy chain: MAIN world CustomEvent → ISOLATED world
 * relay → background service worker → chrome.cookies.getAll → cross-origin
 * fetch → response chain. Each test calls the sdk_fetch_via_background (or
 * sdk_fetch_via_background_concurrent) tool via the MCP client, targeting
 * a cross-origin test server on a different port.
 *
 * The crossOriginServer fixture provides a second HTTP server (different
 * port from testServer) with CORS enabled. Playwright's addCookies() sets
 * HttpOnly cookies on the cross-origin server's URL to simulate real-world
 * authenticated cross-origin requests.
 */

import { expect, test } from './fixtures.js';
import { callToolExpectSuccess, setupToolTest } from './helpers.js';

// ---------------------------------------------------------------------------
// fetchViaBackground — full stack E2E tests
// ---------------------------------------------------------------------------

test.describe('fetchViaBackground', () => {
  test('basic cross-origin fetch returns status, body, and ok', async ({
    mcpServer,
    testServer,
    crossOriginServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    const output = await callToolExpectSuccess(mcpClient, mcpServer, 'e2e-test_sdk_fetch_via_background', {
      url: `${crossOriginServer.url}/api/simple`,
    });

    expect(output.ok).toBe(true);
    expect(output.status).toBe(200);
    const body = JSON.parse(output.body as string) as Record<string, unknown>;
    expect(body.ok).toBe(true);

    await page.close();
  });

  test('cookies attached — HttpOnly cookies forwarded to cross-origin server', async ({
    mcpServer,
    testServer,
    crossOriginServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    // Set HttpOnly cookie on the cross-origin server's domain via Playwright.
    // Use sameSite: 'Lax' because SameSite=None requires Secure, which
    // requires HTTPS — our test servers run on plain HTTP.
    const context = page.context();
    await context.addCookies([
      {
        name: 'session',
        value: 'test-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
      },
    ]);

    const output = await callToolExpectSuccess(mcpClient, mcpServer, 'e2e-test_sdk_fetch_via_background', {
      url: `${crossOriginServer.url}/api/echo-with-cookies`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });

    expect(output.ok).toBe(true);
    expect(output.status).toBe(200);

    const responseBody = JSON.parse(output.body as string) as {
      cookies: Record<string, string>;
      body: string;
      method: string;
    };
    expect(responseBody.cookies.session).toBe('test-session-token');

    await page.close();
  });

  test('custom headers forwarded to cross-origin server', async ({
    mcpServer,
    testServer,
    crossOriginServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    const output = await callToolExpectSuccess(mcpClient, mcpServer, 'e2e-test_sdk_fetch_via_background', {
      url: `${crossOriginServer.url}/api/echo-with-cookies`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        useraccount: 'test-user-123',
      },
      body: JSON.stringify({ data: 'hello' }),
    });

    expect(output.ok).toBe(true);
    expect(output.status).toBe(200);

    const responseBody = JSON.parse(output.body as string) as {
      headers: Record<string, string>;
    };
    expect(responseBody.headers['content-type']).toBe('application/json');
    expect(responseBody.headers.useraccount).toBe('test-user-123');

    await page.close();
  });

  test('POST with JSON body received by cross-origin server', async ({
    mcpServer,
    testServer,
    crossOriginServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    const payload = { message: 'hello world', count: 42 };
    const output = await callToolExpectSuccess(mcpClient, mcpServer, 'e2e-test_sdk_fetch_via_background', {
      url: `${crossOriginServer.url}/api/echo-with-cookies`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(output.ok).toBe(true);
    expect(output.status).toBe(200);

    const responseBody = JSON.parse(output.body as string) as {
      body: string;
      method: string;
    };
    expect(responseBody.method).toBe('POST');
    const receivedPayload = JSON.parse(responseBody.body) as Record<string, unknown>;
    expect(receivedPayload.message).toBe('hello world');
    expect(receivedPayload.count).toBe(42);

    await page.close();
  });

  test('domain validation rejects non-matching domain', async ({
    mcpServer,
    testServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    // Use a domain that does NOT share a registrable domain with localhost
    const result = await mcpClient.callTool('e2e-test_sdk_fetch_via_background', {
      url: 'https://evil.example.com/api/test',
    });

    expect(result.isError).toBe(true);
    expect(result.content).toContain('Fetch proxy denied');

    await page.close();
  });

  test('concurrent requests all succeed', async ({
    mcpServer,
    testServer,
    crossOriginServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    const urls = Array.from({ length: 5 }, () => `${crossOriginServer.url}/api/simple`);
    const output = await callToolExpectSuccess(mcpClient, mcpServer, 'e2e-test_sdk_fetch_via_background_concurrent', {
      urls,
    });

    const responses = output.responses as Array<{ status: number; ok: boolean; body: string }>;
    expect(responses).toHaveLength(5);
    for (const resp of responses) {
      expect(resp.ok).toBe(true);
      expect(resp.status).toBe(200);
      const body = JSON.parse(resp.body) as Record<string, unknown>;
      expect(body.ok).toBe(true);
    }

    await page.close();
  });

  test('network error propagated for unreachable URL', async ({
    mcpServer,
    testServer,
    extensionContext,
    mcpClient,
  }) => {
    const page = await setupToolTest(mcpServer, testServer, extensionContext, mcpClient);

    // Port 1 is almost certainly not listening
    const result = await mcpClient.callTool('e2e-test_sdk_fetch_via_background', {
      url: 'http://localhost:1/never',
    });

    expect(result.isError).toBe(true);
    // The error should propagate — either a network error or connection refused
    expect(result.content.length).toBeGreaterThan(0);

    await page.close();
  });
});
