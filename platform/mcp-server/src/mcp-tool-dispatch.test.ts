import { sanitizeOutput, formatStructuredError, formatZodError, truncateParamsPreview } from './mcp-tool-dispatch.js';
import { describe, expect, test } from 'vitest';
import { z } from 'zod';

describe('sanitizeOutput', () => {
  describe('primitives passthrough', () => {
    test('returns string unchanged', () => {
      expect(sanitizeOutput('hello')).toBe('hello');
    });

    test('returns number unchanged', () => {
      expect(sanitizeOutput(42)).toBe(42);
    });

    test('returns boolean unchanged', () => {
      expect(sanitizeOutput(false)).toBe(false);
    });

    test('returns null unchanged', () => {
      expect(sanitizeOutput(null)).toBeNull();
    });

    test('returns undefined unchanged', () => {
      expect(sanitizeOutput(undefined)).toBeUndefined();
    });
  });

  describe('nested objects', () => {
    test('returns plain object unchanged when no dangerous keys', () => {
      expect(sanitizeOutput({ a: 1, b: 'two' })).toEqual({ a: 1, b: 'two' });
    });

    test('returns deeply nested objects recursively sanitized', () => {
      expect(sanitizeOutput({ outer: { inner: { value: 42 } } })).toEqual({
        outer: { inner: { value: 42 } },
      });
    });
  });

  describe('arrays', () => {
    test('returns array with items recursively sanitized', () => {
      expect(sanitizeOutput([1, 'two', { a: 3 }])).toEqual([1, 'two', { a: 3 }]);
    });

    test('sanitizes dangerous keys inside array items', () => {
      expect(sanitizeOutput([{ __proto__: 'x', safe: 1 }])).toEqual([{ safe: 1 }]);
    });
  });

  describe('dangerous key removal', () => {
    test('removes __proto__ key', () => {
      expect(sanitizeOutput({ __proto__: 'bad', safe: 1 })).toEqual({ safe: 1 });
    });

    test('removes constructor key', () => {
      expect(sanitizeOutput({ constructor: 'bad', safe: 1 })).toEqual({ safe: 1 });
    });

    test('removes prototype key', () => {
      expect(sanitizeOutput({ prototype: 'bad', safe: 1 })).toEqual({ safe: 1 });
    });

    test('removes all dangerous keys from the same object', () => {
      expect(sanitizeOutput({ __proto__: 'bad', constructor: 'bad', prototype: 'bad', ok: 1 })).toEqual({ ok: 1 });
    });

    test('removes dangerous keys recursively in nested objects', () => {
      expect(sanitizeOutput({ nested: { __proto__: 'bad', ok: 2 } })).toEqual({
        nested: { ok: 2 },
      });
    });
  });

  describe('depth limit', () => {
    test('returns [Object too deep] when depth exceeds 50', () => {
      expect(sanitizeOutput({ key: 'value' }, 51)).toBe('[Object too deep]');
    });

    test('does not truncate at depth exactly 50', () => {
      expect(sanitizeOutput({ key: 'value' }, 50)).toEqual({ key: 'value' });
    });
  });
});

describe('formatStructuredError', () => {
  test('code-only format (no data) produces [CODE] message', () => {
    expect(formatStructuredError('NOT_FOUND', 'Resource not found')).toBe('[NOT_FOUND] Resource not found');
  });

  test('data with no structured fields produces legacy [CODE] message', () => {
    expect(formatStructuredError('UNKNOWN', 'An error occurred', { otherField: 'value' })).toBe(
      '[UNKNOWN] An error occurred',
    );
  });

  test('with category produces structured format', () => {
    const result = formatStructuredError('RATE_LIMIT', 'Too many requests', { category: 'rate_limit' });
    expect(result).toContain('[ERROR code=RATE_LIMIT category=rate_limit]');
    expect(result).toContain('Too many requests');
    expect(result).toContain('```json');
    expect(result).toContain('"category":"rate_limit"');
  });

  test('with retryable=true produces structured format', () => {
    const result = formatStructuredError('TRANSIENT', 'Try again', { retryable: true });
    expect(result).toContain('[ERROR code=TRANSIENT retryable=true]');
    expect(result).toContain('Try again');
    expect(result).toContain('"retryable":true');
  });

  test('with retryable=false produces structured format', () => {
    const result = formatStructuredError('PERMANENT', 'Do not retry', { retryable: false });
    expect(result).toContain('[ERROR code=PERMANENT retryable=false]');
    expect(result).toContain('"retryable":false');
  });

  test('with retryAfterMs produces structured format', () => {
    const result = formatStructuredError('THROTTLED', 'Slow down', { retryAfterMs: 5000 });
    expect(result).toContain('[ERROR code=THROTTLED retryAfterMs=5000]');
    expect(result).toContain('"retryAfterMs":5000');
  });

  test('all fields present produces full structured format', () => {
    const result = formatStructuredError('RATE_LIMIT', 'Too many requests', {
      category: 'rate_limit',
      retryable: true,
      retryAfterMs: 60000,
    });
    expect(result).toContain('[ERROR code=RATE_LIMIT category=rate_limit retryable=true retryAfterMs=60000]');
    expect(result).toContain('Too many requests');
    expect(result).toContain('"code":"RATE_LIMIT"');
    expect(result).toContain('"category":"rate_limit"');
    expect(result).toContain('"retryable":true');
    expect(result).toContain('"retryAfterMs":60000');
  });
});

describe('formatZodError', () => {
  test('single issue with path', () => {
    const result = z.object({ name: z.string() }).safeParse({ name: 123 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toMatch(/^Invalid arguments:/);
      expect(formatted).toContain('  - name:');
    }
  });

  test('multiple issues list all failing fields', () => {
    const result = z.object({ a: z.string(), b: z.number() }).safeParse({ a: 1, b: 'two' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toMatch(/^Invalid arguments:/);
      expect(formatted).toContain('  - a:');
      expect(formatted).toContain('  - b:');
    }
  });

  test('root-level issue shows (root) as path', () => {
    const result = z.string().safeParse(42);
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('  - (root):');
    }
  });

  test('nested path joins segments with dot', () => {
    const result = z.object({ user: z.object({ age: z.number() }) }).safeParse({ user: { age: 'old' } });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('  - user.age:');
    }
  });
});

describe('truncateParamsPreview', () => {
  test('short args passthrough without truncation', () => {
    const args = { key: 'value' };
    const json = JSON.stringify(args, null, 2);
    expect(json.length).toBeLessThanOrEqual(200);
    expect(truncateParamsPreview(args)).toBe(json);
  });

  test('truncates at 200 characters and appends ellipsis', () => {
    const args = { data: 'x'.repeat(300) };
    const result = truncateParamsPreview(args);
    const json = JSON.stringify(args, null, 2);
    expect(result).toBe(json.slice(0, 200) + '…');
  });

  test('does not truncate when json is exactly 200 chars', () => {
    const prefix = '{\n  "data": "';
    const suffix = '"\n}';
    const valueLen = 200 - prefix.length - suffix.length;
    const args = { data: 'x'.repeat(valueLen) };
    const json = JSON.stringify(args, null, 2);
    expect(json).toHaveLength(200);
    expect(truncateParamsPreview(args)).toBe(json);
  });
});
