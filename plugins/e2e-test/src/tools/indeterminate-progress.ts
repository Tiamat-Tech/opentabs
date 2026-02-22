import { defineTool, sleep } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const indeterminateProgress = defineTool({
  name: 'indeterminate_progress',
  displayName: 'Indeterminate Progress',
  description:
    'Reports progress without total for indeterminate operations. Used for E2E testing of the indeterminate progress pipeline.',
  icon: 'loader',
  input: z.object({}),
  output: z.object({
    ok: z.boolean().describe('Whether the operation completed successfully'),
  }),
  handle: async (_params, context) => {
    // Use progress: 0, total: 0 as the indeterminate sentinel — the adapter
    // fills these values when progress/total are omitted. The published SDK
    // (v0.0.16) has progress and total as required fields, so we pass the
    // sentinel values explicitly to match what would happen at runtime when
    // the optional-fields version is published.
    context?.reportProgress({ progress: 0, total: 0, message: 'Step 1: Initializing...' });
    await sleep(100);
    context?.reportProgress({ progress: 0, total: 0, message: 'Step 2: Processing...' });
    await sleep(100);
    context?.reportProgress({ progress: 0, total: 0, message: 'Step 3: Finishing...' });
    return { ok: true };
  },
});
