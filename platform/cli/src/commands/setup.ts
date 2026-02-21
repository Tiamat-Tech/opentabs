/**
 * `opentabs setup` command — copies the browser extension to ~/.opentabs/extension/.
 *
 * The core install logic is in installExtension(), which is also called by
 * `opentabs start` for auto-initialization.
 */

import { EXTENSION_COPY_EXCLUDE_PATTERN } from '@opentabs-dev/shared';
import pc from 'picocolors';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command } from 'commander';

const resolveExtensionDir = (): string => {
  try {
    return dirname(fileURLToPath(import.meta.resolve('@opentabs-dev/browser-extension/package.json')));
  } catch {
    const cliDir = dirname(fileURLToPath(import.meta.url));
    return resolve(cliDir, '..', '..', '..', 'browser-extension');
  }
};

const getCliVersion = async (): Promise<string> => {
  const cliPkgPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'package.json');
  const pkgJson = JSON.parse(await Bun.file(cliPkgPath).text()) as { version: string };
  return pkgJson.version;
};

interface InstallExtensionResult {
  /** Whether the extension was installed or updated (false = already up-to-date) */
  installed: boolean;
  /** Whether this was the first installation (no prior extension directory) */
  firstTime: boolean;
  /** The destination directory */
  extensionDest: string;
  /** The installed version */
  version: string;
}

/**
 * Install or update the browser extension to ~/.opentabs/extension/.
 *
 * Skips installation if the extension is already installed at the current version.
 * The configDir parameter specifies the base directory (defaults to ~/.opentabs).
 */
const installExtension = async (configDir: string): Promise<InstallExtensionResult> => {
  const extensionSrc = resolveExtensionDir();

  // Verify the extension source exists
  if (!(await Bun.file(join(extensionSrc, 'manifest.json')).exists())) {
    throw new Error(`Browser extension not found at ${extensionSrc}. Run bun run build from the project root first.`);
  }

  const version = await getCliVersion();
  const extensionDest = join(configDir, 'extension');
  const versionMarkerPath = join(extensionDest, '.opentabs-version');
  const firstTime = !existsSync(join(extensionDest, 'manifest.json'));

  // Check if already up-to-date
  if (!firstTime) {
    const versionFile = Bun.file(versionMarkerPath);
    if (await versionFile.exists()) {
      const installedVersion = (await versionFile.text()).trim();
      if (installedVersion === version) {
        return { installed: false, firstTime: false, extensionDest, version };
      }
    }
  }

  // Copy extension directory, skipping node_modules, src, .git, tsconfig*
  cpSync(extensionSrc, extensionDest, {
    recursive: true,
    force: true,
    filter: (source: string) => {
      const rel = relative(extensionSrc, source);
      return rel === '' || !EXTENSION_COPY_EXCLUDE_PATTERN.test(rel);
    },
  });

  // Create adapters directory for plugins
  mkdirSync(join(extensionDest, 'adapters'), { recursive: true });

  // Write version marker
  await Bun.write(versionMarkerPath, version);

  // Verify installation
  if (!existsSync(join(extensionDest, 'manifest.json'))) {
    throw new Error('Installation verification failed — manifest.json missing from destination.');
  }

  return { installed: true, firstTime, extensionDest, version };
};

const handleSetup = async (): Promise<void> => {
  const configDir = join(homedir(), '.opentabs');
  mkdirSync(configDir, { recursive: true });

  try {
    const result = await installExtension(configDir);

    if (!result.installed) {
      console.log(pc.dim(`Extension already up-to-date (v${result.version})`));
    } else if (result.firstTime) {
      console.log(pc.green(`Extension installed to ${result.extensionDest} (v${result.version})`));
    } else {
      console.log(pc.green(`Extension updated to v${result.version} at ${result.extensionDest}`));
    }

    console.log('');
    console.log('To load the extension in Chrome:');
    console.log(`  1. Open ${pc.cyan('chrome://extensions/')}`);
    console.log(`  2. Enable "Developer mode" (top-right toggle)`);
    console.log(`  3. Click "Load unpacked" and select: ${pc.cyan(result.extensionDest)}`);
  } catch (err) {
    console.error(pc.red(`Error: ${err instanceof Error ? err.message : String(err)}`));
    process.exit(1);
  }
};

const registerSetupCommand = (program: Command): void => {
  program
    .command('setup')
    .description('Install the browser extension to ~/.opentabs/')
    .addHelpText(
      'after',
      `
Examples:
  $ opentabs setup`,
    )
    .action(() => handleSetup());
};

export { installExtension, registerSetupCommand };
export type { InstallExtensionResult };
