import { test, expect } from '@playwright/test';

// Test navigation and page routing
test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the app
    await page.goto('http://localhost:3000');
  });

  test('should display navigation bar', async ({ page }) => {
    // Check if nav bar is visible
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  test('should navigate to gallery page', async ({ page }) => {
    // Click gallery link
    const galleryLink = page.getByRole('link', { name: /gallery/i });
    await galleryLink.click();

    // Check URL changed
    await expect(page).toHaveURL(/\/gallery/);

    // Check page content
    await expect(page.getByText(/gallery/i)).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    // Click settings link
    const settingsLink = page.getByRole('link', { name: /settings/i });
    await settingsLink.click();

    // Check URL changed
    await expect(page).toHaveURL(/\/settings/);

    // Check page content
    await expect(page.getByText(/settings|webhook|environment/i)).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    // Click about link
    const aboutLink = page.getByRole('link', { name: /about/i });
    await aboutLink.click();

    // Check URL changed
    await expect(page).toHaveURL(/\/about/);

    // Check page content
    await expect(page.getByText(/about|n8n/i)).toBeVisible();
  });

  test('should navigate to help page', async ({ page }) => {
    // Click help link
    const helpLink = page.getByRole('link', { name: /help/i });
    await helpLink.click();

    // Check URL changed
    await expect(page).toHaveURL(/\/help/);

    // Check page content
    await expect(page.getByText(/help|faq|documentation/i)).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Go to another page
    await page.goto('http://localhost:3000/gallery');

    // Click dashboard/home link
    const homeLink = page.getByRole('link', { name: /dashboard|home/i });
    await homeLink.click();

    // Check URL is home
    await expect(page).toHaveURL(/\/$/);
  });

  test('should toggle mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile menu might be hidden initially
    const menuButton = page.getByRole('button', { name: /menu|toggle/i });
    if (await menuButton.isVisible()) {
      // Click to open
      await menuButton.click();

      // Navigation links should be visible
      const galleryLink = page.getByRole('link', { name: /gallery/i });
      await expect(galleryLink).toBeVisible();
    }
  });

  test('should display user menu in navbar', async ({ page }) => {
    // Check if user menu or user profile is visible
    const userMenu = page.locator('[data-testid="user-menu"]') ||
                    page.getByRole('button', { name: /user|profile|account/i });

    // User menu should exist (either visible or in DOM)
    const menuExists = await userMenu.count() > 0;
    expect(menuExists).toBeTruthy();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check main landmarks
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check nav has proper role
    const nav = page.locator('nav');
    const navRole = await nav.getAttribute('role');
    expect(['navigation', null]).toContain(navRole); // null means it's <nav> element
  });
});
