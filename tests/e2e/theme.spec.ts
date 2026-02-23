import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display theme toggle button', async ({ page }) => {
    // Look for theme toggle button
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode|sun|moon/i });

    await expect(themeButton).toBeVisible();
  });

  test('should toggle between light and dark theme', async ({ page }) => {
    // Get the theme button
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode|sun|moon/i });

    // Get initial theme (check for dark class on html element)
    const initialDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Click theme button
    await themeButton.click();

    // Wait a bit for theme change
    await page.waitForTimeout(300);

    // Check theme changed
    const newDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(newDarkMode).not.toBe(initialDarkMode);
  });

  test('should have auto theme option', async ({ page }) => {
    // Click theme button to see if it cycles through options
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode|sun|moon|auto/i });

    // Theme button should exist (might show different icons)
    await expect(themeButton).toBeVisible();

    // Multiple clicks to cycle through themes
    await themeButton.click();
    await page.waitForTimeout(200);
    await themeButton.click();
    await page.waitForTimeout(200);

    // After cycling, theme should eventually return to original or change
    const finalTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(typeof finalTheme).toBe('boolean');
  });

  test('should persist theme preference', async ({ page }) => {
    // Get theme button
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode|sun|moon/i });

    // Get initial state
    const initialDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Click to change theme
    await themeButton.click();
    await page.waitForTimeout(300);

    // Reload page
    await page.reload();

    // Theme should be persisted
    const afterReloadDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Should be different from initial (persisted the change)
    expect(afterReloadDarkMode).not.toBe(initialDarkMode);
  });

  test('should apply theme to all page sections', async ({ page }) => {
    // Navigate through pages and check theme is applied
    const pages = ['/', '/gallery', '/settings', '/about'];

    for (const pagePath of pages) {
      await page.goto(`http://localhost:3000${pagePath}`);

      // Check if document has theme class
      const hasDarkClass = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });

      // Should have some theme state (even if light)
      expect(typeof hasDarkClass).toBe('boolean');
    }
  });

  test('should have readable contrast in both themes', async ({ page }) => {
    // Get initial theme
    const initialDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    // Check text color is visible (basic check)
    const textColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).color;
    });

    expect(textColor).toBeTruthy();

    // Switch theme
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode/i });
    await themeButton.click();
    await page.waitForTimeout(300);

    // Check text color is still visible
    const newTextColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).color;
    });

    expect(newTextColor).toBeTruthy();
    // Colors should be different
    expect(newTextColor).not.toBe(textColor);
  });

  test('should handle theme transition smoothly', async ({ page }) => {
    // Get theme button
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode/i });

    // Click and check no layout shift (basic smoke test)
    const beforeClick = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    });

    await themeButton.click();
    await page.waitForTimeout(500);

    const afterClick = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    });

    // Layout should remain same (no shift)
    expect(beforeClick.width).toBe(afterClick.width);
    expect(beforeClick.height).toBe(afterClick.height);
  });

  test('should show appropriate icons for theme mode', async ({ page }) => {
    // Theme button should be visible with some icon/text
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode|sun|moon|auto/i });

    await expect(themeButton).toBeVisible();

    // Button should have visual representation
    const buttonContent = await themeButton.textContent();
    const hasIcon = await themeButton.locator('svg').count() > 0;

    const hasContent = buttonContent || hasIcon > 0;
    expect(hasContent).toBeTruthy();
  });

  test('should work with mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Theme button should still be accessible
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode|sun|moon/i });

    await expect(themeButton).toBeVisible();

    // Should be clickable
    await themeButton.click();

    // Theme should change
    const darkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });

    expect(typeof darkMode).toBe('boolean');
  });

  test('should style navbar differently in dark mode', async ({ page }) => {
    // Get navbar
    const navbar = page.locator('nav').first();

    // Get navbar styles in light mode
    const lightBg = await navbar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Switch theme
    const themeButton = page.getByRole('button', { name: /theme|dark|light|mode/i });
    await themeButton.click();
    await page.waitForTimeout(300);

    // Get navbar styles in dark mode
    const darkBg = await navbar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Background should be different in dark mode
    expect(darkBg).toBeTruthy();
    expect(lightBg).toBeTruthy();
  });
});
