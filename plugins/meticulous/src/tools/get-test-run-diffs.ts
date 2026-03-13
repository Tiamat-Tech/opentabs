import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { graphql, queries } from '../meticulous-api.js';
import { diffResultSchema, replayInfoSchema, mapDiffResult, mapReplayInfo } from './schemas.js';

export const getTestRunDiffs = defineTool({
  name: 'get_test_run_diffs',
  displayName: 'Get Test Run Diffs',
  description:
    'Get replay diffs (visual differences) for a test run with pagination. Each diff includes head and base replay IDs for use with compare_replays. Screenshot diff results include base/head/diff image URLs for visual comparison.',
  summary: 'Get replay diffs for a test run',
  icon: 'diff',
  group: 'Test Runs',
  input: z.object({
    test_run_id: z.string().describe('Test run ID'),
    limit: z.number().optional().default(100).describe('Max results to return'),
    offset: z.number().optional().default(0).describe('Offset for pagination'),
  }),
  output: z.object({
    diffs: z.array(
      z.object({
        replay_diff_id: z.string().describe('Replay diff ID'),
        head_replay: replayInfoSchema.describe('Head (actual) replay'),
        base_replay: replayInfoSchema.describe('Base (expected) replay'),
        screenshot_diffs: z.array(diffResultSchema),
      }),
    ),
  }),
  handle: async ({ test_run_id, limit, offset }) => {
    const data = await graphql<{
      testRun: {
        replayDiffs: Array<{
          id: string;
          headReplay: Record<string, unknown>;
          baseReplay: Record<string, unknown>;
          screenshotDiffResults: Array<Record<string, unknown>>;
        }>;
      };
    }>(queries.GET_TEST_RUN_DIFFS, { testRunId: test_run_id, limit, offset });

    return {
      diffs: (data.testRun.replayDiffs ?? []).map(rd => ({
        replay_diff_id: rd.id,
        head_replay: mapReplayInfo(rd.headReplay ?? {}),
        base_replay: mapReplayInfo(rd.baseReplay ?? {}),
        screenshot_diffs: (rd.screenshotDiffResults ?? []).map(mapDiffResult),
      })),
    };
  },
});
