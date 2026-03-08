import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { api } from '../retool-api.js';

const agentSchema = z.object({
  id: z.number().describe('Agent ID'),
  name: z.string().describe('Agent name'),
  uuid: z.string().describe('Agent UUID'),
  description: z.string().describe('Agent description'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

interface RawAgent {
  id?: number;
  name?: string;
  uuid?: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const mapAgent = (a: RawAgent) => ({
  id: a.id ?? 0,
  name: a.name ?? '',
  uuid: a.uuid ?? '',
  description: a.description ?? '',
  created_at: a.createdAt ?? '',
  updated_at: a.updatedAt ?? '',
});

export const listAgents = defineTool({
  name: 'list_agents',
  displayName: 'List Agents',
  description: 'List all AI agents in the Retool organization. Agents are AI-powered assistants built within Retool.',
  summary: 'List all Retool AI agents',
  icon: 'bot',
  group: 'Agents',
  input: z.object({}),
  output: z.object({
    agents: z.array(agentSchema).describe('List of agents'),
  }),
  handle: async () => {
    const data = await api<{ agents: RawAgent[] }>('/api/agents');
    return { agents: (data.agents ?? []).map(mapAgent) };
  },
});
