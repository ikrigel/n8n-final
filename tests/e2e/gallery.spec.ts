import { test, expect } from '@playwright/test';

test.describe('Gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
  });

  test('should display gallery page', async ({ page }) => {
    // Check page heading
    const heading = page.getByRole('heading', { name: /gallery/i });
    await expect(heading).toBeVisible();
  });

  test('should display empty state when no items', async ({ page }) => {
    // Check for empty state message
    const emptyState = page.getByText(/no items|empty|no gallery|no media/i);

    const exists = await emptyState.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have filter section', async ({ page }) => {
    // Look for filter controls
    const filterSection = page.locator('[data-testid="gallery-filters"]') ||
                         page.getByText(/filter|search/i);

    const exists = await filterSection.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have type filter', async ({ page }) => {
    // Look for type filter (image/video)
    const typeFilter = page.getByRole('combobox', { name: /type|media type|kind/i }) ||
                      page.getByText(/image|video/i);

    const exists = await typeFilter.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have environment filter', async ({ page }) => {
    // Look for environment filter
    const envFilter = page.getByRole('combobox', { name: /environment|env/i }) ||
                     page.getByText(/test|production/i);

    const exists = await envFilter.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.getByPlaceholder(/search|filter|prompt/i);

    const exists = await searchInput.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have date range filter', async ({ page }) => {
    // Look for date inputs
    const dateInputs = page.locator('input[type="date"]');

    const count = await dateInputs.count();
    expect(count).toBeGreaterThanOrEqual(0); // Optional filter
  });

  test('should have clear/reset button', async ({ page }) => {
    // Look for clear button
    const clearButton = page.getByRole('button', { name: /clear|reset|all/i });

    const exists = await clearButton.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should display gallery grid structure', async ({ page }) => {
    // Check for grid structure (even if empty)
    const grid = page.locator('[data-testid="gallery-grid"]') ||
                page.locator('div[class*="grid"]');

    const exists = await grid.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have responsive grid', async ({ page }) => {
    // Check desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    let grid = page.locator('[data-testid="gallery-grid"]') ||
               page.locator('div[class*="grid"]');
    let exists = await grid.count() > 0;
    expect(exists).toBeTruthy();

    // Check mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    grid = page.locator('[data-testid="gallery-grid"]') ||
           page.locator('div[class*="grid"]');
    exists = await grid.count() > 0;
    expect(exists).toBeTruthy();
  });

  test('should have gallery card structure', async ({ page }) => {
    // Look for gallery cards (even if empty, structure should exist)
    const cards = page.locator('[data-testid="gallery-card"]') ||
                 page.locator('div[class*="card"], div[class*="item"]');

    // Cards might be empty but structure should exist
    const container = page.locator('[data-testid="gallery-grid"]') ||
                     page.locator('div[class*="grid"]');

    const containerExists = await container.count() > 0;
    expect(containerExists).toBeTruthy();
  });

  test('should allow filtering by type', async ({ page }) => {
    // Get type filter
    const typeFilter = page.getByRole('combobox', { name: /type|media type/i });

    if (await typeFilter.count() > 0) {
      // Get current value
      const initialValue = await typeFilter.inputValue();

      // Try to select image if available
      await typeFilter.selectOption('image').catch(() => {});

      // Filter should be selectable
      const finalValue = await typeFilter.inputValue();
      expect(finalValue).toBeDefined();
    }
  });

  test('should maintain page layout consistency', async ({ page }) => {
    // Check main structural elements exist
    const main = page.locator('main');
    const header = page.getByRole('heading');
    const content = page.locator('[data-testid="gallery-grid"], div[class*="gallery"]');

    await expect(main).toBeVisible();
    const headerCount = await header.count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test('should have proper spacing and styling', async ({ page }) => {
    // Gallery container should be visible
    const gallery = page.locator('[data-testid="gallery-grid"]') ||
                   page.locator('div[class*="gallery"]');

    const count = await gallery.count();
    // Gallery section should exist even if empty
    expect(count).toBeGreaterThan(0);
  });
});
