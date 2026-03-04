/**
 * Permission bypass detection — determined once at startup.
 *
 * The --dangerously-skip-permissions flag (or OPENTABS_SKIP_PERMISSIONS=1
 * env var) bypasses approval prompts for tools set to 'ask' mode, converting
 * them to 'auto'. Tools set to 'off' remain disabled — this flag does not
 * enable disabled tools. It exists for CI/testing environments where no
 * human is available to approve tool calls.
 */

const cliSkipPermissions =
  process.argv.includes('--dangerously-skip-permissions') || process.env.OPENTABS_SKIP_PERMISSIONS === '1';

/** Whether the CLI flag or env var requests permission bypass */
export const isCliSkipPermissions = (): boolean => cliSkipPermissions;
