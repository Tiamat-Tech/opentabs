import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { graphql, queries } from '../meticulous-api.js';
import { screenshotSchema, mapScreenshot } from './schemas.js';

export const getTestRunTestCases = defineTool({
  name: 'get_test_run_test_cases',
  displayName: 'Get Test Run Test Cases',
  description:
    'Get test case results for a test run. Returns replays that failed (excluding passes) with replay status, accuracy, session ID, and screenshots.',
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
        replay_id: z.string().describe('Replay ID'),
        replay_status: z.string().nullable().describe('Replay status (Success, Failure, etc.)'),
        replay_accurate: z.boolean().nullable().describe('Whether replay was accurate'),
        app_url: z.string().nullable().describe('Application URL used for replay'),
        session_id: z.string().nullable().describe('Source session ID'),
        screenshots: z.array(screenshotSchema),
      }),
    ),
  }),
  handle: async ({ test_run_id, limit, offset }) => {
    const data = await graphql<{
      testRun: {
        testCaseResults: Array<{
          headReplay: {
            id: string;
            status?: string;
            isAccurate?: boolean;
            parameters?: { appUrl?: string };
            screenshotsData: Array<Record<string, unknown>>;
          };
          session?: { id?: string };
        }>;
      };
    }>(queries.GET_TEST_RUN_TEST_CASES, { testRunId: test_run_id, limit, offset });

    return {
      test_cases: (data.testRun.testCaseResults ?? []).map(tc => ({
        replay_id: tc.headReplay?.id ?? '',
        replay_status: tc.headReplay?.status ?? null,
        replay_accurate: tc.headReplay?.isAccurate ?? null,
        app_url: tc.headReplay?.parameters?.appUrl ?? null,
        session_id: tc.session?.id ?? null,
        screenshots: (tc.headReplay?.screenshotsData ?? []).map(mapScreenshot),
      })),
    };
  },
});
