/**
 * Sanitize error messages before returning them to external clients.
 * Strips absolute file paths, URLs, localhost references, and IP addresses
 * to prevent leaking internal system details. Truncates to 500 characters.
 */

const MAX_LENGTH = 500;

const sanitizeErrorMessage = (message: string): string => {
  let sanitized = message
    // Windows absolute paths: C:\path\to\file or C:/path/to/file
    .replace(/[a-z]:[/\\][^\s,;)}\]]+/gi, '[PATH]')
    // Unix absolute paths: /path/to/file (at least 2 segments to avoid false positives like "/")
    .replace(/\/[a-z0-9._-]+(?:\/[a-z0-9._-]+)+/gi, '[PATH]')
    // Full URLs with protocol
    .replace(/https?:\/\/[^\s,;)}\]]+/gi, '[URL]')
    // localhost with port
    .replace(/localhost:\d+/gi, '[LOCALHOST]')
    // IPv4 addresses
    .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[IP]');

  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.slice(0, MAX_LENGTH - 3) + '...';
  }

  return sanitized;
};

export { sanitizeErrorMessage };
