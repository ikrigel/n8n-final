# E2E Tests with Playwright

This directory contains end-to-end tests for the N8N SPA Frontend application using Playwright.

## Test Structure

- **navigation.spec.ts** - Tests for page navigation, routing, and navigation bar
- **settings-webhook.spec.ts** - Tests for settings page and webhook functionality
- **gallery.spec.ts** - Tests for gallery page, filters, and display
- **theme.spec.ts** - Tests for theme switching and dark/light mode

## Prerequisites

- Node.js 18+
- npm dependencies installed (`npm install`)
- Development server can start on `http://localhost:3000`

## Running E2E Tests

### Run all E2E tests

```bash
npm run test:e2e
```

### Run tests for a specific file

```bash
npx playwright test tests/e2e/navigation.spec.ts
```

### Run tests in headed mode (see browser)

```bash
npx playwright test --headed
```

### Run tests in headed mode with slow motion (good for debugging)

```bash
npx playwright test --headed --headed-slow-mo 1000
```

### Debug tests

```bash
npx playwright test --debug
```

### Run single test

```bash
npx playwright test -g "should display navigation bar"
```

## Viewing Test Reports

After running tests, open the HTML report:

```bash
npx playwright show-report
```

## Test Categories

### Navigation Tests
- Display navigation bar
- Navigate to Gallery, Settings, About, Help pages
- Mobile menu toggle
- User menu in navbar
- Accessible navigation elements

### Settings & Webhook Tests
- Display settings page
- Environment selector functionality
- Webhook tester presence
- Log settings display
- Configuration display and persistence
- Mobile responsiveness
- Webhook URL information

### Gallery Tests
- Display gallery page
- Empty state message
- Filter section (type, environment, date, search)
- Gallery grid structure
- Responsive design (desktop/mobile)
- Filter functionality
- Card display structure

### Theme Tests
- Theme toggle button visibility
- Toggle between light and dark themes
- Auto theme option
- Theme persistence across page reloads
- Theme application to all pages
- Contrast and readability in both themes
- Smooth theme transitions
- Mobile viewport support
- Icon/visual representation changes

## Configuration

### Browser Support

Playwright tests run on:
- Chromium (default)
- Firefox
- Safari (optional, see playwright.config.ts)

To test on all browsers:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Timeout Settings

Default timeouts (in playwright.config.ts):
- Test timeout: 30s
- Navigation timeout: 30s
- Action timeout: 10s

Increase timeout for specific test:

```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000);
  // test code
});
```

## Writing New Tests

### Basic test structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/page');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: /click/i });

    // Act
    await button.click();

    // Assert
    await expect(page).toHaveURL(/\/expected/);
  });
});
```

### Common selectors

```typescript
// By role (recommended)
page.getByRole('button', { name: /text/i })
page.getByRole('heading', { name: /text/i })
page.getByRole('combobox')
page.getByRole('link', { name: /text/i })

// By placeholder
page.getByPlaceholder(/search/i)

// By text
page.getByText(/text/i)

// By test ID (add data-testid to elements)
page.locator('[data-testid="element-id"]')

// CSS/XPath
page.locator('div.class > p')
page.locator('//button[contains(text(), "Click")]')
```

## Best Practices

1. **Use semantic selectors** - Prefer role-based selectors over classes
2. **Add data-testid** - Add `data-testid` attributes to elements used in tests
3. **Wait for visibility** - Use `toBeVisible()` instead of just checking existence
4. **Mock external APIs** - Use `page.route()` for API mocking if needed
5. **Test user workflows** - Test complete user journeys, not isolated components
6. **Keep tests independent** - Each test should be able to run in isolation
7. **Use descriptive names** - Test names should describe what is being tested

## Debugging Failed Tests

1. **View trace file** - Playwright records traces for failed tests
2. **Use --debug flag** - Step through test execution
3. **Add console.log** - Use `page.evaluate()` to run JS in the page
4. **Screenshot on failure** - Add `await page.screenshot()` before assertions
5. **Check Network tab** - Monitor API calls with `page.on('response')`

## CI/CD Integration

In GitHub Actions (or similar CI):

```bash
# Install dependencies
npm ci

# Run E2E tests (dev server starts automatically)
npm run test:e2e

# Or run with specific reporter for CI
npx playwright test --reporter=github
```

## Troubleshooting

### Port 3000 already in use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux

# Or change in playwright.config.ts
webServer: {
  url: 'http://localhost:3001',
}
```

### Tests timeout

- Increase timeout in specific test: `test.setTimeout(60000)`
- Check if dev server is running: `curl http://localhost:3000`
- Try running tests with `--headed` to see what's happening

### Flaky tests

- Use `waitForNavigation()` instead of `click()` when navigating
- Wait for elements to be stable: `await page.waitForLoadState('networkidle')`
- Use explicit waits instead of fixed delays

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-page)
- [Best Practices](https://playwright.dev/docs/best-practices)
