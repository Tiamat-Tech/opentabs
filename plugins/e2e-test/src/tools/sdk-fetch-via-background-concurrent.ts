import { defineTool, ToolError } from '@opentabs-dev/plugin-sdk';
import type { FetchProxyResponse } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

const responseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  headers: z.record(z.string(), z.string()),
  body: z.string(),
  ok: z.boolean(),
});

export const sdkFetchViaBackgroundConcurrent = defineTool({
  name: 'sdk_fetch_via_background_concurrent',
  displayName: 'SDK Fetch Via Background Concurrent',
  description: 'Tests concurrent fetchViaBackground — makes N parallel cross-origin requests through the extension background',
  icon: 'wrench',
  input: z.object({
    urls: z.array(z.string()).describe('URLs to fetch in parallel'),
    method: z.string().optional().describe('HTTP method for all requests (defaults to GET)'),
    headers: z.record(z.string(), z.string()).optional().describe('Request headers for all requests'),
  }),
  output: z.object({
    responses: z.array(responseSchema).describe('Responses from all parallel requests'),
  }),
  handle: async (params, context) => {
    if (!context?.fetchViaBackground) {
      throw ToolError.internal('fetchViaBackground not available in context');
    }
    const promises: Promise<FetchProxyResponse>[] = params.urls.map(url =>
      context.fetchViaBackground(url, {
        method: params.method ?? 'GET',
        headers: params.headers,
      }),
    );
    const responses = await Promise.all(promises);
    return { responses };
  },
});
