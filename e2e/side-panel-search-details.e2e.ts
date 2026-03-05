/**
 * Side panel search interaction detail E2E tests — verify filtering behavior,
 * empty states, and clear button for the search bar in the side panel.
 *
 * These tests exercise the SearchResults component via the live extension
 * by typing into the search input and asserting on the filtered plugin list.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  cleanupTestConfigDir,
  E2E_TEST_PLUGIN_DIR,
  expect,
  launchExtensionContext,
  startMcpServer,
  test,
  writeTestConfig,
} from './fixtures.js';
import { openSidePanel, setupAdapterSymlink, waitForExtensionConnected } from './helpers.js';

test.describe('Side panel search details', () => {
  test('search filters installed plugins by tool name and shows Installed header', async () => {
    const absPluginPath = path.resolve(E2E_TEST_PLUGIN_DIR);
    const configDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opentabs-e2e-sp-search-filter-'));
    writeTestConfig(configDir, {
      localPlugins: [absPluginPath],
      permissions: {
        'e2e-test': { permission: 'auto' },
        browser: { permission: 'auto' },
      },
    });

    const server = await startMcpServer(configDir, false);
    const { context, cleanupDir, extensionDir } = await launchExtensionContext(server.port, server.secret);
    setupAdapterSymlink(configDir, extensionDir);

    try {
      await waitForExtensionConnected(server);

      const sidePanel = await openSidePanel(context);

      // Wait for the e2e-test plugin to appear in the default list
      await expect(sidePanel.getByText('E2E Test')).toBeVisible({ timeout: 30_000 });

      const searchInput = sidePanel.getByPlaceholder('Search plugins and tools...');

      // Type 'echo' — a tool name in the e2e-test plugin
      await searchInput.fill('echo');

      // The 'Installed' section header should appear
      await expect(sidePanel.getByText('Installed')).toBeVisible();

      // The e2e-test plugin card should still be visible (it matched)
      await expect(sidePanel.getByText('E2E Test')).toBeVisible();

      // Clear the search
      await searchInput.fill('');

      // The 'Installed' section header should disappear (default view has no section headers)
      await expect(sidePanel.getByText('Installed')).toBeHidden();

      // All plugins should be visible again — e2e-test plugin still shows
      await expect(sidePanel.getByText('E2E Test')).toBeVisible();

      await sidePanel.close();
    } finally {
      await context.close().catch(() => {});
      await server.kill();
      fs.rmSync(cleanupDir, { recursive: true, force: true });
      cleanupTestConfigDir(configDir);
    }
  });
});
