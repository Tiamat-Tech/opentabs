/**
 * Official plugin verification module.
 *
 * Verifies that plugins in the @opentabs-dev/ scope match what is published
 * on the npm registry by comparing the installed package's integrity hash
 * against the registry's published integrity value.
 *
 * This is a best-effort check that catches the common case of npm package
 * hijacking. It does NOT provide full supply chain security (that would
 * require signing keys).
 */

import { log } from './logger.js';
import { join } from 'node:path';

interface VerificationResult {
  /** Whether the plugin passed verification */
  verified: boolean;
  /** Human-readable reason when verification fails or is skipped */
  reason?: string;
}

/**
 * Read the installed package's integrity hash from its package.json.
 *
 * npm and bun both write _integrity (subresource integrity format, e.g.,
 * "sha512-...") into the installed package.json. Falls back to _shasum
 * (hex SHA-1) if _integrity is not present.
 */
const readInstalledIntegrity = async (
  packagePath: string,
): Promise<{ integrity?: string; shasum?: string; version?: string }> => {
  try {
    const pkgJson: unknown = await Bun.file(join(packagePath, 'package.json')).json();
    if (pkgJson === null || typeof pkgJson !== 'object') return {};
    const pkg = pkgJson as Record<string, unknown>;
    return {
      integrity: typeof pkg._integrity === 'string' ? pkg._integrity : undefined,
      shasum: typeof pkg._shasum === 'string' ? pkg._shasum : undefined,
      version: typeof pkg.version === 'string' ? pkg.version : undefined,
    };
  } catch {
    return {};
  }
};

/**
 * Fetch the registry metadata for a specific package version.
 *
 * Uses the abbreviated registry endpoint to minimize data transfer.
 * Returns the dist object containing integrity and shasum fields.
 */
const fetchRegistryDist = async (
  npmPackageName: string,
  version: string,
): Promise<{ integrity?: string; shasum?: string } | null> => {
  const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(npmPackageName).replace('%40', '@')}/${version}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(registryUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (data === null || typeof data !== 'object') return null;

    const record = data as Record<string, unknown>;
    const dist = record.dist;
    if (dist === null || typeof dist !== 'object') return null;

    const distRecord = dist as Record<string, unknown>;
    return {
      integrity: typeof distRecord.integrity === 'string' ? distRecord.integrity : undefined,
      shasum: typeof distRecord.shasum === 'string' ? distRecord.shasum : undefined,
    };
  } catch {
    return null;
  }
};

/**
 * Verify that an official plugin's installed files match what is published
 * on the npm registry.
 *
 * Compares the _integrity or _shasum field from the installed package.json
 * against the npm registry's published dist metadata for the same version.
 *
 * @param packagePath - Absolute path to the installed plugin directory
 * @param npmPackageName - The npm package name (e.g., "@opentabs-dev/opentabs-plugin-slack")
 */
const verifyOfficialPlugin = async (packagePath: string, npmPackageName: string): Promise<VerificationResult> => {
  const installed = await readInstalledIntegrity(packagePath);

  if (!installed.version) {
    return { verified: false, reason: 'Could not read version from installed package.json' };
  }

  if (!installed.integrity && !installed.shasum) {
    return {
      verified: false,
      reason:
        'No _integrity or _shasum found in installed package.json — package may not have been installed via npm/bun',
    };
  }

  const registryDist = await fetchRegistryDist(npmPackageName, installed.version);

  if (registryDist === null) {
    log.warn(
      `Could not reach npm registry to verify ${npmPackageName}@${installed.version} — loading at original tier`,
    );
    return { verified: true, reason: 'Registry unreachable — verification skipped' };
  }

  // Prefer integrity (SRI hash, usually sha512) over shasum (SHA-1)
  if (installed.integrity && registryDist.integrity) {
    if (installed.integrity === registryDist.integrity) {
      return { verified: true };
    }
    return {
      verified: false,
      reason: `Integrity mismatch: installed=${installed.integrity}, registry=${registryDist.integrity}`,
    };
  }

  // Fall back to shasum comparison
  if (installed.shasum && registryDist.shasum) {
    if (installed.shasum === registryDist.shasum) {
      return { verified: true };
    }
    return {
      verified: false,
      reason: `Shasum mismatch: installed=${installed.shasum}, registry=${registryDist.shasum}`,
    };
  }

  // One side has integrity, the other has shasum — can't compare directly
  return { verified: true, reason: 'Hash format mismatch between installed and registry — verification skipped' };
};

export { verifyOfficialPlugin, readInstalledIntegrity, fetchRegistryDist };
export type { VerificationResult };
