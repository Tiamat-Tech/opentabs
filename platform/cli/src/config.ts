/**
 * Config file helpers shared across CLI commands.
 */

import { chmod, rename, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, dirname, resolve, isAbsolute } from 'node:path';

export const getConfigDir = (): string => Bun.env.OPENTABS_CONFIG_DIR || join(homedir(), '.opentabs');

export const getConfigPath = (): string => join(getConfigDir(), 'config.json');

export const getLogFilePath = (): string => join(getConfigDir(), 'server.log');

export const readConfig = async (configPath: string): Promise<Record<string, unknown> | null> => {
  const configFile = Bun.file(configPath);
  if (!(await configFile.exists())) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(await configFile.text());
  } catch (err) {
    console.error(`Invalid JSON in config: ${err instanceof Error ? err.message : String(err)}`);
    console.error(`File: ${configPath}`);
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    console.error(
      `Invalid config at ${configPath}: expected a JSON object, got ${Array.isArray(parsed) ? 'array' : String(parsed)}`,
    );
    return null;
  }
  return parsed as Record<string, unknown>;
};

export const getLocalPluginsFromConfig = (config: Record<string, unknown>): string[] =>
  Array.isArray(config.localPlugins)
    ? (config.localPlugins as unknown[]).filter((p): p is string => typeof p === 'string')
    : [];

export const resolvePluginPath = (pluginPath: string, configPath: string): string =>
  isAbsolute(pluginPath) ? pluginPath : resolve(dirname(configPath), pluginPath);

/**
 * Write config atomically: write to a temp file in the same directory,
 * set restrictive permissions, then rename over the target. The rename
 * is atomic on POSIX filesystems, so readers never see a partially-written file.
 */
export const atomicWriteConfig = async (configPath: string, content: string): Promise<void> => {
  const tmpPath = configPath + '.tmp';
  try {
    await Bun.write(tmpPath, content);
    await chmod(tmpPath, 0o600).catch(() => {});
    await rename(tmpPath, configPath);
  } catch (err) {
    await unlink(tmpPath).catch(() => {});
    throw err;
  }
};

export const isConnectionRefused = (err: unknown): boolean => {
  if (!(err instanceof TypeError)) return false;
  const cause = (err as TypeError & { cause?: { code?: string } }).cause;
  return cause?.code === 'ECONNREFUSED';
};
