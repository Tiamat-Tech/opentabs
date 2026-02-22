/**
 * Plugin verification bypass detection — determined once at startup.
 *
 * The --skip-plugin-verification flag (or OPENTABS_SKIP_PLUGIN_VERIFICATION=1
 * env var) disables npm registry signature verification for official plugins.
 * This is intended for air-gapped environments where the npm registry is
 * unreachable.
 */

const cliSkipVerification =
  Bun.argv.includes('--skip-plugin-verification') || Bun.env.OPENTABS_SKIP_PLUGIN_VERIFICATION === '1';

/** Whether the CLI flag or env var requests plugin verification bypass */
export const isSkipPluginVerification = (): boolean => cliSkipVerification;
