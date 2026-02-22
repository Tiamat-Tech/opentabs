import { verifyOfficialPlugin, readInstalledIntegrity, fetchRegistryDist } from './verify-plugin.js';
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('readInstalledIntegrity', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'opentabs-verify-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  test('reads _integrity and _shasum from package.json', async () => {
    const pkgDir = join(tmpDir, 'pkg');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(
      join(pkgDir, 'package.json'),
      JSON.stringify({
        name: '@opentabs-dev/opentabs-plugin-test',
        version: '1.0.0',
        _integrity: 'sha512-abc123',
        _shasum: 'deadbeef',
      }),
    );

    const result = await readInstalledIntegrity(pkgDir);
    expect(result.integrity).toBe('sha512-abc123');
    expect(result.shasum).toBe('deadbeef');
    expect(result.version).toBe('1.0.0');
  });

  test('returns empty object when package.json is missing', async () => {
    const result = await readInstalledIntegrity(join(tmpDir, 'nonexistent'));
    expect(result.integrity).toBeUndefined();
    expect(result.shasum).toBeUndefined();
    expect(result.version).toBeUndefined();
  });

  test('returns undefined fields when _integrity and _shasum are absent', async () => {
    const pkgDir = join(tmpDir, 'no-hash');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: 'test', version: '1.0.0' }));

    const result = await readInstalledIntegrity(pkgDir);
    expect(result.integrity).toBeUndefined();
    expect(result.shasum).toBeUndefined();
    expect(result.version).toBe('1.0.0');
  });
});

describe('fetchRegistryDist', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('returns dist data from registry response', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ dist: { integrity: 'sha512-abc', shasum: 'deadbeef' } }), { status: 200 }),
      ),
    ) as unknown as typeof fetch;

    const result = await fetchRegistryDist('@opentabs-dev/opentabs-plugin-test', '1.0.0');
    expect(result).toEqual({ integrity: 'sha512-abc', shasum: 'deadbeef' });
  });

  test('returns null on 404', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response('Not Found', { status: 404 })),
    ) as unknown as typeof fetch;

    const result = await fetchRegistryDist('@opentabs-dev/opentabs-plugin-test', '99.0.0');
    expect(result).toBeNull();
  });

  test('returns null on network error', async () => {
    globalThis.fetch = mock(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;

    const result = await fetchRegistryDist('@opentabs-dev/opentabs-plugin-test', '1.0.0');
    expect(result).toBeNull();
  });

  test('returns null when response body has no dist field', async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ name: 'test' }), { status: 200 })),
    ) as unknown as typeof fetch;

    const result = await fetchRegistryDist('@opentabs-dev/opentabs-plugin-test', '1.0.0');
    expect(result).toBeNull();
  });
});

describe('verifyOfficialPlugin', () => {
  let tmpDir: string;
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'opentabs-verify-test-'));
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    rmSync(tmpDir, { recursive: true, force: true });
  });

  const writeInstalledPackage = (dir: string, overrides: Record<string, unknown> = {}) => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({
        name: '@opentabs-dev/opentabs-plugin-test',
        version: '1.0.0',
        _integrity: 'sha512-abc123',
        _shasum: 'deadbeef',
        ...overrides,
      }),
    );
  };

  test('verified when integrity hashes match', async () => {
    const pkgDir = join(tmpDir, 'match');
    writeInstalledPackage(pkgDir);

    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ dist: { integrity: 'sha512-abc123', shasum: 'deadbeef' } }), { status: 200 }),
      ),
    ) as unknown as typeof fetch;

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  test('not verified when integrity hashes differ', async () => {
    const pkgDir = join(tmpDir, 'mismatch');
    writeInstalledPackage(pkgDir);

    globalThis.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ dist: { integrity: 'sha512-DIFFERENT', shasum: 'deadbeef' } }), { status: 200 }),
      ),
    ) as unknown as typeof fetch;

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(false);
    expect(result.reason).toContain('Integrity mismatch');
  });

  test('falls back to shasum comparison when integrity is unavailable', async () => {
    const pkgDir = join(tmpDir, 'shasum-only');
    writeInstalledPackage(pkgDir, { _integrity: undefined });

    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ dist: { shasum: 'deadbeef' } }), { status: 200 })),
    ) as unknown as typeof fetch;

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(true);
  });

  test('not verified when shasums differ', async () => {
    const pkgDir = join(tmpDir, 'shasum-mismatch');
    writeInstalledPackage(pkgDir, { _integrity: undefined });

    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ dist: { shasum: 'DIFFERENT' } }), { status: 200 })),
    ) as unknown as typeof fetch;

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(false);
    expect(result.reason).toContain('Shasum mismatch');
  });

  test('verified (skipped) when registry is unreachable', async () => {
    const pkgDir = join(tmpDir, 'unreachable');
    writeInstalledPackage(pkgDir);

    globalThis.fetch = mock(() => Promise.reject(new Error('Network error'))) as unknown as typeof fetch;

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(true);
    expect(result.reason).toContain('unreachable');
  });

  test('not verified when no _integrity or _shasum in installed package', async () => {
    const pkgDir = join(tmpDir, 'no-hash');
    writeInstalledPackage(pkgDir, { _integrity: undefined, _shasum: undefined });

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(false);
    expect(result.reason).toContain('No _integrity or _shasum');
  });

  test('not verified when version cannot be read', async () => {
    const pkgDir = join(tmpDir, 'no-version');
    mkdirSync(pkgDir, { recursive: true });
    writeFileSync(join(pkgDir, 'package.json'), JSON.stringify({ name: 'test' }));

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(false);
    expect(result.reason).toContain('version');
  });

  test('verified (skipped) when hash formats differ between installed and registry', async () => {
    const pkgDir = join(tmpDir, 'format-mismatch');
    writeInstalledPackage(pkgDir, { _shasum: undefined });

    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ dist: { shasum: 'deadbeef' } }), { status: 200 })),
    ) as unknown as typeof fetch;

    const result = await verifyOfficialPlugin(pkgDir, '@opentabs-dev/opentabs-plugin-test');
    expect(result.verified).toBe(true);
    expect(result.reason).toContain('Hash format mismatch');
  });
});
