import { defineTool, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const sdkFetchViaBackground = defineTool({
  name: 'sdk_fetch_via_background',
  displayName: 'SDK Fetch Via Background',
  description: 'Tests fetchViaBackground — makes a cross-origin request through the extension background service worker',
  icon: 'wrench',
  input: z.object({
    url: z.string().describe('The URL to fetch'),
    method: z.string().optional().describe('HTTP method (defaults to GET)'),
    headers: z.record(z.string(), z.string()).optional().describe('Request headers'),
    body: z.string().optional().describe('Request body'),
  }),
  output: z.object({
    status: z.number().describe('HTTP status code'),
    statusText: z.string().describe('HTTP status text'),
    headers: z.record(z.string(), z.string()).describe('Response headers'),
    body: z.string().describe('Response body as text'),
    ok: z.boolean().describe('Whether the response status was 2xx'),
  }),
  handle: async (params, context) => {
    if (!context?.fetchViaBackground) {
      throw ToolError.internal('fetchViaBackground not available in context');
    }
    const response = await context.fetchViaBackground(params.url, {
      method: params.method ?? 'GET',
      headers: params.headers,
      body: params.body,
    });
    return response;
  },
});
