import { parseManifest } from './manifest-schema.js';
import { describe, expect, test } from 'bun:test';

/** Minimal valid tool for reuse across tests */
const validTool = {
  name: 'test_tool',
  description: 'A test tool',
  input_schema: { type: 'object' },
  output_schema: { type: 'object' },
};

/** Minimal valid manifest object */
const validManifestObj = {
  name: 'test-plugin',
  version: '1.0.0',
  description: 'A test plugin',
  url_patterns: ['*://example.com/*'],
  tools: [validTool],
};

/** Minimal valid manifest JSON for testing. Override fields as needed. */
const makeManifest = (overrides: Record<string, unknown> = {}): string =>
  JSON.stringify({ ...validManifestObj, ...overrides });

describe('parseManifest', () => {
  test('parses valid manifest', () => {
    const manifest = parseManifest(makeManifest(), 'test.json');
    expect(manifest.name).toBe('test-plugin');
    expect(manifest.tools).toHaveLength(1);
  });

  test('rejects invalid JSON', () => {
    expect(() => parseManifest('{bad', 'test.json')).toThrow('Invalid JSON');
  });

  test('rejects missing required fields', () => {
    expect(() => parseManifest(JSON.stringify({}), 'test.json')).toThrow('Invalid plugin manifest');
  });

  test('throws with path-specific error when "name" is missing', () => {
    const { name: _, ...noName } = validManifestObj;
    expect(() => parseManifest(JSON.stringify(noName), '/test/path')).toThrow(/name/);
  });

  test('throws with path-specific error when "version" is missing', () => {
    const { version: _, ...noVersion } = validManifestObj;
    expect(() => parseManifest(JSON.stringify(noVersion), '/test/path')).toThrow(/version/);
  });

  test('throws with path-specific error when "description" is missing', () => {
    const { description: _, ...noDesc } = validManifestObj;
    expect(() => parseManifest(JSON.stringify(noDesc), '/test/path')).toThrow(/description/);
  });

  test('throws when url_patterns array is empty', () => {
    expect(() => parseManifest(makeManifest({ url_patterns: [] }), '/test/path')).toThrow(/At least one URL pattern/);
  });

  test('throws when tools array is empty', () => {
    expect(() => parseManifest(makeManifest({ tools: [] }), '/test/path')).toThrow(/At least one tool/);
  });

  test('throws when tool is missing name field', () => {
    const { name: _, ...toolNoName } = validTool;
    expect(() => parseManifest(makeManifest({ tools: [toolNoName] }), '/test/path')).toThrow(/tools\.0\.name/);
  });

  test('throws when tool is missing description field', () => {
    const { description: _, ...toolNoDesc } = validTool;
    expect(() => parseManifest(makeManifest({ tools: [toolNoDesc] }), '/test/path')).toThrow(/tools\.0\.description/);
  });

  test('throws when tool is missing input_schema', () => {
    const { input_schema: _, ...toolNoInput } = validTool;
    expect(() => parseManifest(makeManifest({ tools: [toolNoInput] }), '/test/path')).toThrow(/tools\.0\.input_schema/);
  });

  test('throws when tool is missing output_schema', () => {
    const { output_schema: _, ...toolNoOutput } = validTool;
    expect(() => parseManifest(makeManifest({ tools: [toolNoOutput] }), '/test/path')).toThrow(
      /tools\.0\.output_schema/,
    );
  });

  test('allows extra fields to pass through (looseObject)', () => {
    const result = parseManifest(makeManifest({ customField: 'hello', anotherField: 42 }), '/test/path');
    expect(result.name).toBe('test-plugin');
    expect((result as unknown as Record<string, unknown>)['customField']).toBe('hello');
    expect((result as unknown as Record<string, unknown>)['anotherField']).toBe(42);
  });

  test('returns displayName when present in manifest', () => {
    const result = parseManifest(makeManifest({ displayName: 'Test Plugin' }), '/test/path');
    expect(result.displayName).toBe('Test Plugin');
  });

  test('returns adapterHash when present in manifest', () => {
    const result = parseManifest(makeManifest({ adapterHash: 'sha256-abc123' }), '/test/path');
    expect(result.adapterHash).toBe('sha256-abc123');
  });

  test('includes sourcePath in error messages', () => {
    expect(() => parseManifest('invalid', '/my/custom/path')).toThrow(/\/my\/custom\/path/);
  });

  describe('description length limits', () => {
    test('rejects tool description exceeding 1000 characters', () => {
      const longDesc = 'a'.repeat(1001);
      const raw = makeManifest({
        tools: [
          {
            name: 'test_tool',
            description: longDesc,
            input_schema: { type: 'object' },
            output_schema: { type: 'object' },
          },
        ],
      });
      expect(() => parseManifest(raw, 'test.json')).toThrow('Tool description must be at most 1000 characters');
    });

    test('accepts tool description at exactly 1000 characters', () => {
      const exactDesc = 'a'.repeat(1000);
      const raw = makeManifest({
        tools: [
          {
            name: 'test_tool',
            description: exactDesc,
            input_schema: { type: 'object' },
            output_schema: { type: 'object' },
          },
        ],
      });
      const manifest = parseManifest(raw, 'test.json');
      const firstTool = manifest.tools[0];
      expect(firstTool).toBeDefined();
      expect(firstTool?.description).toBe(exactDesc);
    });

    test('rejects plugin description exceeding 500 characters', () => {
      const longDesc = 'b'.repeat(501);
      const raw = makeManifest({ description: longDesc });
      expect(() => parseManifest(raw, 'test.json')).toThrow('Plugin description must be at most 500 characters');
    });

    test('accepts plugin description at exactly 500 characters', () => {
      const exactDesc = 'b'.repeat(500);
      const raw = makeManifest({ description: exactDesc });
      const manifest = parseManifest(raw, 'test.json');
      expect(manifest.description).toBe(exactDesc);
    });
  });
});
