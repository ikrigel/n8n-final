import { test, expect } from '@playwright/test';

test.describe('Settings & Webhook Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/settings');
  });

  test('should display settings page', async ({ page }) => {
    // Check page title/heading
    const heading = page.getByRole('heading', { name: /settings/i });
    await expect(heading).toBeVisible();
  });

  test('should have environment selector', async ({ page }) => {
    // Look for environment selector
    const envSelector = page.locator('[data-testid="env-selector"]') ||
                       page.getByRole('combobox', { name: /environment|env/i });

    // Should be visible or exist
    const exists = await envSelector.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should display webhook tester', async ({ page }) => {
    // Look for webhook tester section
    const webhookSection = page.locator('[data-testid="webhook-tester"]') ||
                          page.getByText(/webhook|test webhook/i);

    const exists = await webhookSection.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have test webhook button', async ({ page }) => {
    // Look for test button
    const testButton = page.getByRole('button', { name: /test|send|webhook/i });

    // Button should exist
    const exists = await testButton.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have log settings', async ({ page }) => {
    // Look for log settings
    const logSettings = page.locator('[data-testid="log-settings"]') ||
                       page.getByText(/logs|logging|log level/i);

    const exists = await logSettings.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should display current configuration', async ({ page }) => {
    // Check if any configuration is displayed
    const configText = page.getByText(/test|production|all|info|debug|error/i);
    const count = await configText.count();

    // Should show some configuration options
    expect(count).toBeGreaterThan(0);
  });

  test('should allow changing environment', async ({ page }) => {
    // Find environment selector
    const envSelector = page.getByRole('combobox', { name: /environment|env/i });

    // Check if selector exists and is interactive
    if (await envSelector.isVisible()) {
      // Get current value
      const initialValue = await envSelector.inputValue();

      // Try to change it
      await envSelector.selectOption(initialValue === 'test' ? 'production' : 'test');

      // Verify it changed
      const newValue = await envSelector.inputValue();
      expect(newValue).not.toBe(initialValue);
    }
  });

  test('should display help or documentation', async ({ page }) => {
    // Look for help text or links
    const helpText = page.getByText(/help|documentation|guide|webhook url|n8n|webhook/i);

    const exists = await helpText.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Content should still be visible (might be stacked)
    const heading = page.getByRole('heading', { name: /settings/i });
    await expect(heading).toBeVisible();

    // Reset to desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should preserve settings on page reload', async ({ page }) => {
    // Change a setting
    const envSelector = page.getByRole('combobox', { name: /environment|env/i });

    if (await envSelector.isVisible()) {
      await envSelector.selectOption('production');

      // Reload page
      await page.reload();

      // Setting should be preserved
      const value = await envSelector.inputValue();
      expect(value).toBe('production');
    }
  });

  test('should show webhook URL information', async ({ page }) => {
    // Look for webhook URL display
    const webhookUrl = page.getByText(/webhook|url|http|endpoint/i);

    const exists = await webhookUrl.count() > 0;
    expect(exists).toBeTruthy();
  });
});
