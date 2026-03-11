// ---------------------------------------------------------------------------
// Push-based readiness notification
// ---------------------------------------------------------------------------

/**
 * Signals the Chrome extension that the plugin's readiness state may have
 * changed. The extension re-probes `isReady()` immediately instead of waiting
 * for the next 30-second poll cycle.
 *
 * Call this when you detect an auth state change (login/logout) in an SPA
 * flow where the URL does not change.
 *
 * Safe to call in Node.js (test/build contexts) — no-ops silently.
 */
export const notifyReadinessChanged = (): void => {
  try {
    const ot = (globalThis as Record<string, unknown>).__openTabs as Record<string, unknown> | undefined;
    if (!ot) return;
    const notify = ot._notifyReadinessChanged as (() => void) | undefined;
    if (typeof notify === 'function') notify();
  } catch {
    // no-op outside browser
  }
};
