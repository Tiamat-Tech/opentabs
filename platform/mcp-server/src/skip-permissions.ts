/**
 * Permission bypass detection — determined once at startup.
 *
 * The --dangerously-skip-permissions flag (or OPENTABS_SKIP_PERMISSIONS=1
 * env var) bypasses all browser tool permission prompts. This is a
 * dangerous option that disables human-in-the-loop safety for sensitive
 * browser operations. It exists for CI/testing environments where no human
 * is available to approve tool calls.
 */

const cliSkipPermissions =
  process.argv.includes('--dangerously-skip-permissions') || process.env.OPENTABS_SKIP_PERMISSIONS === '1';

/** Whether the CLI flag or env var requests permission bypass */
export const isCliSkipPermissions = (): boolean => cliSkipPermissions;
