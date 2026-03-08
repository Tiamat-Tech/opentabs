import { defineTool } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { api } from '../retool-api.js';

const resourceFolderSchema = z.object({
  id: z.number().describe('Resource folder ID'),
  name: z.string().describe('Folder name'),
  parent_folder_id: z.number().nullable().describe('Parent folder ID'),
  organization_id: z.number().describe('Organization ID'),
  system_folder: z.boolean().describe('Whether the folder is a system folder'),
  access_level: z.string().describe('Access level for the current user'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

interface RawResourceFolder {
  id?: number;
  name?: string;
  parentFolderId?: number | null;
  organizationId?: number;
  systemFolder?: boolean;
  accessLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

const mapResourceFolder = (f: RawResourceFolder) => ({
  id: f.id ?? 0,
  name: f.name ?? '',
  parent_folder_id: f.parentFolderId ?? null,
  organization_id: f.organizationId ?? 0,
  system_folder: f.systemFolder ?? false,
  access_level: f.accessLevel ?? '',
  created_at: f.createdAt ?? '',
  updated_at: f.updatedAt ?? '',
});

export const createResourceFolder = defineTool({
  name: 'create_resource_folder',
  displayName: 'Create Resource Folder',
  description: 'Create a new folder for organizing resources (data sources). Requires a parent resource folder ID.',
  summary: 'Create a new resource folder',
  icon: 'folder-plus',
  group: 'Resources',
  input: z.object({
    name: z.string().describe('Name for the new resource folder'),
    parent_resource_folder_id: z.number().describe('Parent resource folder ID'),
  }),
  output: z.object({ folder: resourceFolderSchema }),
  handle: async params => {
    const data = await api<RawResourceFolder>('/api/resourceFolders/createResourceFolder', {
      method: 'POST',
      body: {
        resourceFolderName: params.name,
        parentResourceFolderId: params.parent_resource_folder_id,
      },
    });
    return { folder: mapResourceFolder(data ?? {}) };
  },
});
