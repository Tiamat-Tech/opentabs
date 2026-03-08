import { z } from 'zod';

// --- App (Page) ---

export const appSchema = z.object({
  id: z.number().describe('Numeric app ID'),
  name: z.string().describe('App name'),
  uuid: z.string().describe('App UUID'),
  folder_id: z.number().describe('Parent folder ID'),
  organization_id: z.number().describe('Organization ID'),
  description: z.string().describe('App description'),
  is_mobile_app: z.boolean().describe('Whether the app is a mobile app'),
  is_global_widget: z.boolean().describe('Whether the app is a global widget (module)'),
  is_form_app: z.boolean().describe('Whether the app is a form app'),
  protected: z.boolean().describe('Whether the app is protected'),
  synced: z.boolean().describe('Whether the app is synced to source control'),
  access_level: z.string().describe('Access level for the current user'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

export interface RawApp {
  id?: number;
  name?: string;
  uuid?: string;
  folderId?: number;
  organizationId?: number;
  description?: string | null;
  isMobileApp?: boolean | null;
  isGlobalWidget?: boolean | null;
  isFormApp?: boolean;
  protected?: boolean;
  synced?: boolean;
  accessLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mapApp = (a: RawApp) => ({
  id: a.id ?? 0,
  name: a.name ?? '',
  uuid: a.uuid ?? '',
  folder_id: a.folderId ?? 0,
  organization_id: a.organizationId ?? 0,
  description: a.description ?? '',
  is_mobile_app: a.isMobileApp ?? false,
  is_global_widget: a.isGlobalWidget ?? false,
  is_form_app: a.isFormApp ?? false,
  protected: a.protected ?? false,
  synced: a.synced ?? false,
  access_level: a.accessLevel ?? '',
  created_at: a.createdAt ?? '',
  updated_at: a.updatedAt ?? '',
});

// --- Folder ---

export const folderSchema = z.object({
  id: z.number().describe('Numeric folder ID'),
  name: z.string().describe('Folder name'),
  display_name: z.string().describe('Folder display name'),
  system_folder: z.boolean().describe('Whether the folder is a system folder'),
  folder_type: z.string().describe('Folder type (app or workflow)'),
  parent_folder_id: z.number().nullable().describe('Parent folder ID, null for root'),
  organization_id: z.number().describe('Organization ID'),
  access_level: z.string().describe('Access level for the current user'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

export interface RawFolder {
  id?: number;
  name?: string;
  displayName?: string;
  systemFolder?: boolean;
  folderType?: string;
  parentFolderId?: number | null;
  organizationId?: number;
  accessLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mapFolder = (f: RawFolder) => ({
  id: f.id ?? 0,
  name: f.name ?? '',
  display_name: f.displayName ?? '',
  system_folder: f.systemFolder ?? false,
  folder_type: f.folderType ?? '',
  parent_folder_id: f.parentFolderId ?? null,
  organization_id: f.organizationId ?? 0,
  access_level: f.accessLevel ?? '',
  created_at: f.createdAt ?? '',
  updated_at: f.updatedAt ?? '',
});

// --- User ---

export const userSchema = z.object({
  id: z.number().describe('Numeric user ID'),
  email: z.string().describe('Email address'),
  first_name: z.string().describe('First name'),
  last_name: z.string().describe('Last name'),
  profile_photo_url: z.string().describe('Profile photo URL'),
  organization_id: z.number().describe('Organization ID'),
  sid: z.string().describe('User SID'),
  enabled: z.boolean().describe('Whether the user account is enabled'),
  user_type: z.string().describe('User type (e.g., default)'),
  seat_type: z.string().describe('Seat type (e.g., internalUser)'),
  email_is_verified: z.boolean().describe('Whether the email is verified'),
  last_logged_in: z.string().describe('ISO 8601 last login timestamp'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
});

export interface RawUser {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string | null;
  organizationId?: number;
  sid?: string;
  enabled?: boolean;
  userType?: string;
  seatType?: string;
  emailIsVerified?: boolean;
  lastLoggedIn?: string;
  createdAt?: string;
}

export const mapUser = (u: RawUser) => ({
  id: u.id ?? 0,
  email: u.email ?? '',
  first_name: u.firstName ?? '',
  last_name: u.lastName ?? '',
  profile_photo_url: u.profilePhotoUrl ?? '',
  organization_id: u.organizationId ?? 0,
  sid: u.sid ?? '',
  enabled: u.enabled ?? false,
  user_type: u.userType ?? '',
  seat_type: u.seatType ?? '',
  email_is_verified: u.emailIsVerified ?? false,
  last_logged_in: u.lastLoggedIn ?? '',
  created_at: u.createdAt ?? '',
});

// --- Organization ---

export const organizationSchema = z.object({
  id: z.number().describe('Numeric organization ID'),
  name: z.string().describe('Organization name'),
  subdomain: z.string().describe('Organization subdomain'),
  sid: z.string().describe('Organization SID'),
  plan_id: z.number().describe('Plan ID'),
  release_management_enabled: z.boolean().describe('Whether release management is enabled'),
  enabled: z.boolean().describe('Whether the organization is enabled'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
});

export interface RawOrganization {
  id?: number;
  name?: string;
  subdomain?: string;
  sid?: string;
  planId?: number;
  releaseManagementEnabled?: boolean;
  enabled?: boolean;
  createdAt?: string;
}

export const mapOrganization = (o: RawOrganization) => ({
  id: o.id ?? 0,
  name: o.name ?? '',
  subdomain: o.subdomain ?? '',
  sid: o.sid ?? '',
  plan_id: o.planId ?? 0,
  release_management_enabled: o.releaseManagementEnabled ?? false,
  enabled: o.enabled ?? false,
  created_at: o.createdAt ?? '',
});

// --- Resource ---

export const resourceSchema = z.object({
  id: z.number().describe('Numeric resource ID'),
  uuid: z.string().describe('Resource UUID'),
  type: z.string().describe('Resource type (e.g., postgresql, restapi, anthropic)'),
  name: z.string().describe('Internal resource name'),
  display_name: z.string().describe('Display name'),
  protected: z.boolean().describe('Whether the resource is protected'),
  synced: z.boolean().describe('Whether the resource is synced to source control'),
  access_level: z.string().describe('Access level for the current user'),
  editor_type: z.string().describe('Editor type for queries'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

export interface RawResource {
  id?: number;
  uuid?: string;
  type?: string;
  name?: string;
  displayName?: string;
  protected?: boolean;
  synced?: boolean;
  accessLevel?: string;
  editorType?: string;
  production?: { createdAt?: string; updatedAt?: string };
}

export const mapResource = (r: RawResource) => ({
  id: r.id ?? 0,
  uuid: r.uuid ?? '',
  type: r.type ?? '',
  name: r.name ?? '',
  display_name: r.displayName ?? '',
  protected: r.protected ?? false,
  synced: r.synced ?? false,
  access_level: r.accessLevel ?? '',
  editor_type: r.editorType ?? '',
  created_at: r.production?.createdAt ?? '',
  updated_at: r.production?.updatedAt ?? '',
});

// --- Workflow ---

export const workflowSchema = z.object({
  id: z.number().describe('Numeric workflow ID'),
  name: z.string().describe('Workflow name'),
  uuid: z.string().describe('Workflow UUID'),
  folder_id: z.number().describe('Parent folder ID'),
  organization_id: z.number().describe('Organization ID'),
  is_enabled: z.boolean().describe('Whether the workflow is enabled'),
  access_level: z.string().describe('Access level for the current user'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

export interface RawWorkflow {
  id?: number;
  name?: string;
  uuid?: string;
  folderId?: number;
  organizationId?: number;
  isEnabled?: boolean;
  accessLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mapWorkflow = (w: RawWorkflow) => ({
  id: w.id ?? 0,
  name: w.name ?? '',
  uuid: w.uuid ?? '',
  folder_id: w.folderId ?? 0,
  organization_id: w.organizationId ?? 0,
  is_enabled: w.isEnabled ?? false,
  access_level: w.accessLevel ?? '',
  created_at: w.createdAt ?? '',
  updated_at: w.updatedAt ?? '',
});

// --- Environment ---

export const environmentSchema = z.object({
  id: z.string().describe('Environment UUID'),
  name: z.string().describe('Environment name (e.g., production, staging)'),
  description: z.string().describe('Environment description'),
  display_color: z.string().describe('Hex display color'),
  is_default: z.boolean().describe('Whether this is the default environment'),
  organization_id: z.number().describe('Organization ID'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

export interface RawEnvironment {
  id?: string;
  name?: string;
  description?: string | null;
  displayColor?: string;
  isDefault?: boolean;
  organizationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const mapEnvironment = (e: RawEnvironment) => ({
  id: e.id ?? '',
  name: e.name ?? '',
  description: e.description ?? '',
  display_color: e.displayColor ?? '',
  is_default: e.isDefault ?? false,
  organization_id: e.organizationId ?? 0,
  created_at: e.createdAt ?? '',
  updated_at: e.updatedAt ?? '',
});

// --- Branch ---

export const branchSchema = z.object({
  name: z.string().describe('Branch name'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
  updated_at: z.string().describe('ISO 8601 last update timestamp'),
});

export interface RawBranch {
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mapBranch = (b: RawBranch) => ({
  name: b.name ?? '',
  created_at: b.createdAt ?? '',
  updated_at: b.updatedAt ?? '',
});

// --- Source Control Settings ---

export const sourceControlSettingsSchema = z.object({
  enable_auto_branch_naming: z.boolean().describe('Whether auto branch naming is enabled'),
  enable_custom_pull_request_template: z.boolean().describe('Whether custom PR templates are enabled'),
  version_control_locked: z.boolean().describe('Whether version control is locked'),
  enable_auto_cleanup_branches: z.boolean().describe('Whether auto branch cleanup is enabled'),
  disable_auto_catch_up_commits: z.boolean().describe('Whether auto catch-up commits are disabled'),
});

export interface RawSourceControlSettings {
  enableAutoBranchNaming?: boolean;
  enableCustomPullRequestTemplate?: boolean;
  versionControlLocked?: boolean;
  enableAutoCleanupBranches?: boolean;
  disableAutoCatchUpCommits?: boolean;
}

export const mapSourceControlSettings = (s: RawSourceControlSettings) => ({
  enable_auto_branch_naming: s.enableAutoBranchNaming ?? false,
  enable_custom_pull_request_template: s.enableCustomPullRequestTemplate ?? false,
  version_control_locked: s.versionControlLocked ?? false,
  enable_auto_cleanup_branches: s.enableAutoCleanupBranches ?? false,
  disable_auto_catch_up_commits: s.disableAutoCatchUpCommits ?? false,
});

// --- User Space ---

export const userSpaceSchema = z.object({
  user_id: z.number().describe('User ID'),
  org_id: z.number().describe('Organization ID'),
  space_name: z.string().describe('Space name'),
  domain: z.string().describe('Space domain'),
  is_parent_org: z.boolean().describe('Whether this is the parent organization'),
});

export interface RawUserSpace {
  userId?: number;
  orgId?: number;
  spaceName?: string;
  domain?: string;
  isParentOrg?: boolean;
}

export const mapUserSpace = (s: RawUserSpace) => ({
  user_id: s.userId ?? 0,
  org_id: s.orgId ?? 0,
  space_name: s.spaceName ?? '',
  domain: s.domain ?? '',
  is_parent_org: s.isParentOrg ?? false,
});

// --- Playground Query ---

export const playgroundQuerySchema = z.object({
  id: z.number().describe('Query ID'),
  name: z.string().describe('Query name'),
  query: z.string().describe('Query text'),
  resource_id: z.number().describe('Resource ID'),
  created_at: z.string().describe('ISO 8601 creation timestamp'),
});

export interface RawPlaygroundQuery {
  id?: number;
  name?: string;
  query?: string;
  resourceId?: number;
  createdAt?: string;
}

export const mapPlaygroundQuery = (q: RawPlaygroundQuery) => ({
  id: q.id ?? 0,
  name: q.name ?? '',
  query: q.query ?? '',
  resource_id: q.resourceId ?? 0,
  created_at: q.createdAt ?? '',
});
