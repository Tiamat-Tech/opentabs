/**
 * Playwright global teardown — kills orphaned test server processes.
 *
 * When tests crash, time out, or are interrupted, subprocess servers
 * (MCP servers, test servers) may survive because their parent's
 * cleanup code never ran. This teardown sweeps for any bun processes
 * started from temp directories matching the E2E naming convention
 * and kills them.
 *
 * Uses platform-specific process discovery: pgrep on Unix,
 * wmic on Windows. Killing uses Node.js process.kill() which works
 * cross-platform.
 */

import { execSync } from 'node:child_process';

/**
 * Unix: use pgrep to find processes by command-line pattern.
 * Returns an empty array when no processes match (pgrep exits 1).
 */
const findPidsUnix = (pattern: string): number[] => {
  try {
    const output = execSync(`pgrep -f "${pattern}"`, { encoding: 'utf-8' });
    return output
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(Number)
      .filter(pid => !Number.isNaN(pid) && pid !== process.pid);
  } catch {
    return [];
  }
};

/**
 * Windows: use wmic to find processes whose command line contains the
 * pattern. Falls back to an empty list if wmic is unavailable or no
 * processes match.
 */
const findPidsWindows = (pattern: string): number[] => {
  try {
    const cmd = `wmic process where "CommandLine like '%${pattern}%'" get ProcessId /format:list`;
    const output = execSync(cmd, { encoding: 'utf-8' });
    return output
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('ProcessId='))
      .map(line => Number(line.split('=')[1]))
      .filter(pid => !Number.isNaN(pid) && pid !== process.pid);
  } catch {
    return [];
  }
};

/**
 * Find PIDs of processes whose command line contains the E2E naming
 * convention pattern, then force-kill them via Node.js process.kill().
 */
const killOrphanedProcesses = (): void => {
  const pids = process.platform === 'win32' ? findPidsWindows('opentabs-e2e-') : findPidsUnix('opentabs-e2e-');

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Process may have exited between discovery and kill — ignore.
    }
  }
};

export default function globalTeardown(): void {
  killOrphanedProcesses();
}
