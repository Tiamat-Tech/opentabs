import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { graphql, queries } from '../meticulous-api.js';
import { screenshotSchema, mapScreenshot } from './schemas.js';

export const getTestRunTestCases = defineTool({
  name: 'get_test_run_test_cases',
  displayName: 'Get Test Run Test Cases',
  description: 'Get test case results for a test run. Returns replays that failed, excluding passes.',
  summary: 'Get failed test case results',
  icon: 'list-checks',
  group: 'Test Runs',
  input: z.object({
    test_run_id: z.string().describe('Test run ID'),
    limit: z.number().optional().default(100).describe('Max results to return'),
    offset: z.number().optional().default(0).describe('Offset for pagination'),
  }),
  output: z.object({
    test_cases: z.array(
      z.object({
        replay_id: z.string(),
        screenshots: z.array(screenshotSchema),
      }),
    ),
  }),
  handle: async ({ test_run_id, limit, offset }) => {
    const data = await graphql<{
      testRun: {
        testCaseResults: Array<{ headReplay: { id: string; screenshotsData: Array<Record<string, unknown>> } }>;
      };
    }>(queries.GET_TEST_RUN_TEST_CASES, { testRunId: test_run_id, limit, offset });

    return {
      test_cases: (data.testRun.testCaseResults ?? []).map(tc => ({
        replay_id: tc.headReplay?.id ?? '',
        screenshots: (tc.headReplay?.screenshotsData ?? []).map(mapScreenshot),
      })),
    };
  },
});
