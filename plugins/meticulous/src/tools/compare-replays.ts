import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { graphql, queries } from '../meticulous-api.js';

export const compareReplays = defineTool({
  name: 'compare_replays',
  displayName: 'Compare Replays',
  description:
    'Compare a head replay against a base replay. Returns the timeline comparison data showing differences between the two replays.',
  summary: 'Compare two replays',
  icon: 'columns',
  group: 'Replays',
  input: z.object({
    head_replay_id: z.string().describe('Head (actual/new) replay ID'),
    base_replay_id: z.string().describe('Base (expected/old) replay ID'),
  }),
  output: z.object({
    timeline: z.unknown().describe('Comparison timeline data'),
  }),
  handle: async ({ head_replay_id, base_replay_id }) => {
    const data = await graphql<{ compareReplays: { timeline: unknown } }>(queries.GET_COMPARE_REPLAYS, {
      headReplayId: head_replay_id,
      baseReplayId: base_replay_id,
    });
    return { timeline: data.compareReplays.timeline };
  },
});
