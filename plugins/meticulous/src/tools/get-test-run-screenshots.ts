import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { graphql, queries } from '../meticulous-api.js';
import { diffResultSchema, screenshotSchema, mapDiffResult, mapScreenshot } from './schemas.js';

export const getTestRunScreenshots = defineTool({
  name: 'get_test_run_screenshots',
  displayName: 'Get Test Run Screenshots',
  description:
    'Get screenshot diffs and test case screenshots for a test run. Returns visual regression results with base, head, and diff image URLs.',
  summary: 'Get test run screenshot diffs',
  icon: 'image',
  group: 'Test Runs',
  input: z.object({
    test_run_id: z.string().describe('Test run ID'),
    replay_diff_limit: z.number().optional().default(50).describe('Max replay diffs to return'),
    replay_diff_offset: z.number().optional().default(0).describe('Offset for replay diffs pagination'),
    test_case_limit: z.number().optional().default(50).describe('Max test case results to return'),
    test_case_offset: z.number().optional().default(0).describe('Offset for test case pagination'),
  }),
  output: z.object({
    diffs: z.array(
      z.object({
        replay_diff_id: z.string(),
        screenshot_diffs: z.array(diffResultSchema),
      }),
    ),
    test_case_screenshots: z.array(
      z.object({
        replay_id: z.string(),
        screenshots: z.array(screenshotSchema),
      }),
    ),
  }),
  handle: async ({ test_run_id, replay_diff_limit, replay_diff_offset, test_case_limit, test_case_offset }) => {
    const data = await graphql<{
      testRun: {
        replayDiffs: Array<{ id: string; screenshotDiffResults: Array<Record<string, unknown>> }>;
        testCaseResults: Array<{ headReplay: { id: string; screenshotsData: Array<Record<string, unknown>> } }>;
      };
    }>(queries.GET_TEST_RUN_SCREENSHOTS, {
      testRunId: test_run_id,
      replayDiffLimit: replay_diff_limit,
      replayDiffOffset: replay_diff_offset,
      testCaseResultLimit: test_case_limit,
      testCaseResultOffset: test_case_offset,
    });

    return {
      diffs: (data.testRun.replayDiffs ?? []).map(rd => ({
        replay_diff_id: rd.id,
        screenshot_diffs: (rd.screenshotDiffResults ?? []).map(mapDiffResult),
      })),
      test_case_screenshots: (data.testRun.testCaseResults ?? []).map(tc => ({
        replay_id: tc.headReplay?.id ?? '',
        screenshots: (tc.headReplay?.screenshotsData ?? []).map(mapScreenshot),
      })),
    };
  },
});
