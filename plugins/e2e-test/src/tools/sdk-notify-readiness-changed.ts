import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const sdkNotifyReadinessChanged = defineTool({
  name: 'sdk_notify_readiness_changed',
  displayName: 'SDK Notify Readiness Changed',
  description:
    'Tests notifyReadinessChanged — calls globalThis.__openTabs._notifyReadinessChanged() ' +
    '(the same closure that the SDK notifyReadinessChanged() delegates to) and returns success',
  summary: 'Test SDK notifyReadinessChanged',
  icon: 'wrench',
  input: z.object({}),
  output: z.object({
    ok: z.boolean().describe('Whether the operation succeeded'),
  }),
  handle: async () => {
    const ot = (globalThis as Record<string, unknown>).__openTabs as Record<string, unknown> | undefined;
    if (!ot) return { ok: false };
    const notify = ot._notifyReadinessChanged as (() => void) | undefined;
    if (typeof notify === 'function') notify();
    return { ok: true };
  },
});
