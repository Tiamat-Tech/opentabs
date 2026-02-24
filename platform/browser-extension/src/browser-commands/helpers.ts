import { sendToServer } from '../messaging.js';
import { sanitizeErrorMessage } from '../sanitize-error.js';
import { isBlockedUrlScheme, toErrorMessage } from '@opentabs-dev/shared';

/**
 * Validates that `params.tabId` is a number.
 * Sends a JSON-RPC -32602 error if invalid, returning `null`.
 */
export const requireTabId = (params: Record<string, unknown>, id: string | number): number | null => {
  const tabId = params.tabId;
  if (typeof tabId !== 'number') {
    sendToServer({ jsonrpc: '2.0', error: { code: -32602, message: 'Missing or invalid tabId parameter' }, id });
    return null;
  }
  return tabId;
};

/**
 * Validates that `params.selector` is a non-empty string.
 * Sends a JSON-RPC -32602 error if invalid, returning `null`.
 */
export const requireSelector = (params: Record<string, unknown>, id: string | number): string | null => {
  const selector = params.selector;
  if (typeof selector !== 'string' || selector.length === 0) {
    sendToServer({
      jsonrpc: '2.0',
      error: { code: -32602, message: 'Missing or invalid selector parameter' },
      id,
    });
    return null;
  }
  return selector;
};

/**
 * Validates that `params.url` is a string and not a blocked URL scheme.
 * Sends a JSON-RPC -32602 error if invalid, returning `null`.
 */
export const requireUrl = (params: Record<string, unknown>, id: string | number): string | null => {
  const url = params.url;
  if (typeof url !== 'string') {
    sendToServer({ jsonrpc: '2.0', error: { code: -32602, message: 'Missing or invalid url parameter' }, id });
    return null;
  }
  if (isBlockedUrlScheme(url)) {
    sendToServer({
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'URL scheme not allowed (javascript:, data:, file:, chrome:, blob: are blocked)',
      },
      id,
    });
    return null;
  }
  return url;
};

/**
 * Extracts the first result from `chrome.scripting.executeScript` output.
 * Sends a JSON-RPC -32603 error if no result, or -32602 if the result has an `error` field.
 * Returns the result or `null`.
 */
export const extractScriptResult = (
  results: Array<{ result?: unknown }>,
  id: string | number,
  fallbackMsg = 'No result from script execution',
): Record<string, unknown> | null => {
  const result = results[0]?.result as { error?: string } | undefined;
  if (!result) {
    sendToServer({ jsonrpc: '2.0', error: { code: -32603, message: fallbackMsg }, id });
    return null;
  }
  if (result.error) {
    sendToServer({ jsonrpc: '2.0', error: { code: -32602, message: result.error }, id });
    return null;
  }
  return result as Record<string, unknown>;
};

/** Sends a JSON-RPC -32603 error with a sanitized error message. */
export const sendErrorResult = (id: string | number, err: unknown): void => {
  sendToServer({
    jsonrpc: '2.0',
    error: { code: -32603, message: sanitizeErrorMessage(toErrorMessage(err)) },
    id,
  });
};

/** Sends a JSON-RPC 2.0 success response. */
export const sendSuccessResult = (id: string | number, result: unknown): void => {
  sendToServer({ jsonrpc: '2.0', result, id });
};
