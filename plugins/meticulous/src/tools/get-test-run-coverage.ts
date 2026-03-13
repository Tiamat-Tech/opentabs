import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { graphql, queries } from '../meticulous-api.js';
import { coverageSchema, testRunSchema, mapCoverage, mapTestRun } from './schemas.js';

export const getTestRunCoverage = defineTool({
  name: 'get_test_run_coverage',
  displayName: 'Get Test Run Coverage',
  description:
    'Get code coverage and screenshot coverage data for a test run. Shows which routes have diffs, which were compared without diffs, and which were not compared.',
  summary: 'Get test run coverage',
  icon: 'shield-check',
  group: 'Test Runs',
  input: z.object({
    test_run_id: z.string().describe('Test run ID'),
    pr_mode: z.boolean().optional().default(true).describe('Whether to use PR mode for coverage calculation'),
    replay_id: z.string().optional().describe('Optional replay ID to scope coverage to'),
  }),
  output: z.object({
    test_run: testRunSchema,
    coverage: z.object({
      with_diffs: z.array(coverageSchema).describe('Routes with screenshot diffs'),
      without_diffs: z.array(coverageSchema).describe('Routes compared but without diffs'),
      not_compared: z.array(coverageSchema).describe('Routes not compared'),
      num_unmapped_files: z.number().describe('Number of unmapped source files'),
    }),
  }),
  handle: async ({ test_run_id, pr_mode, replay_id }) => {
    const data = await graphql<{
      testRun: Record<string, unknown> & {
        coverage: {
          screenshotsComparedWithDiffs: Array<Record<string, unknown>>;
          screenshotsComparedButWithoutDiffs: Array<Record<string, unknown>>;
          screenshotsNotCompared: Array<Record<string, unknown>>;
          numUnmappedFiles: number;
        };
      };
    }>(queries.GET_TEST_RUN_COVERAGE, { testRunId: test_run_id, prMode: pr_mode, replayId: replay_id });

    const cov = data.testRun.coverage;
    return {
      test_run: mapTestRun(data.testRun as Parameters<typeof mapTestRun>[0]),
      coverage: {
        with_diffs: (cov.screenshotsComparedWithDiffs ?? []).map(mapCoverage),
        without_diffs: (cov.screenshotsComparedButWithoutDiffs ?? []).map(mapCoverage),
        not_compared: (cov.screenshotsNotCompared ?? []).map(mapCoverage),
        num_unmapped_files: cov.numUnmappedFiles ?? 0,
      },
    };
  },
});
