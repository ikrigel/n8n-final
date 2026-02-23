# Testing Guide

## Overview

This project uses two testing frameworks for comprehensive coverage:

- **Vitest** - Fast unit and integration tests
- **Playwright** - End-to-end UI tests

## Vitest - Unit & Integration Tests

### Setup

Dependencies are already installed:
- `vitest` - Testing framework
- `@testing-library/react` - Component testing utilities
- `jsdom` - DOM environment for Node.js

### Configuration

**vitest.config.ts:**
- Environment: jsdom (browser-like)
- Global test API enabled
- CSS support enabled
- Path alias for `@/` imports

### Running Tests

```bash
# Run all tests once
npm run test:unit

# Run tests in watch mode (re-run on file changes)
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- src/__tests__/lib/webhooks.test.ts

# Run with UI dashboard
npm run test:ui

# Run with coverage report
npm run test:unit -- --coverage
```

### Test Structure

Tests are organized in `src/__tests__/` matching the source structure:

```
src/__tests__/
├── lib/
│   ├── webhooks.test.ts        # Webhook client tests
│   └── localStorage.test.ts    # Storage helper tests
├── hooks/
│   └── useGallery.test.ts      # Gallery hook tests
└── components/
    └── LogsPanel.test.tsx      # Component tests
```

### What's Tested

#### 1. **Webhook Client** (`src/__tests__/lib/webhooks.test.ts`)

Tests for `src/lib/webhooks.ts`:

- `buildWebhookURL()` - Builds correct URLs for test/production
- `sendWebhookRequest()` - Sends POST with correct payload
- Error handling - HTTP and network errors
- Telegram ID inclusion
- `testGetWebhook()` - GET request functionality
- `testPostWebhook()` - POST test payload

**Coverage:** All webhook operations and error cases

#### 2. **LocalStorage Helpers** (`src/__tests__/lib/localStorage.test.ts`)

Tests for `src/lib/localStorage.ts`:

- Config save/load with defaults
- Gallery cache persistence
- Logs storage
- Theme preferences
- Clear all data
- Error handling for invalid JSON

**Coverage:** 100% of storage operations

#### 3. **useGallery Hook** (`src/__tests__/hooks/useGallery.test.ts`)

Tests for `src/hooks/useGallery.ts`:

- Initialize with empty items
- Add items to gallery
- Filter by type (image/video)
- Filter by environment (test/production)
- Search by text in prompt
- Get recent items
- Statistics calculation
- localStorage persistence
- Remove items
- Clear all items

**Coverage:** All gallery operations and filtering

#### 4. **LogsPanel Component** (`src/__tests__/components/LogsPanel.test.tsx`)

Tests for `src/components/logs/LogsPanel.tsx`:

- Render without crashing
- Empty state display
- Filter dropdown
- Clear button
- Display options
- Styling classes

**Coverage:** Component rendering and interactivity

### Writing New Tests

#### Example 1: Testing a Utility Function

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/utils';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    const result = myFunction('');
    expect(result).toBeDefined();
  });
});
```

#### Example 2: Testing a Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('initial');
  });

  it('should update value', () => {
    const { result } = renderHook(() => useMyHook());
    act(() => {
      result.current.setValue('new');
    });
    expect(result.current.value).toBe('new');
  });
});
```

#### Example 3: Testing a Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render text', () => {
    render(<MyComponent />);
    expect(screen.getByText('expected text')).toBeInTheDocument();
  });

  it('should handle click', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Best Practices

✅ **Do:**
- Test public APIs, not implementation details
- Mock external dependencies (fetch, localStorage, etc.)
- Use descriptive test names
- Test both happy path and error cases
- Keep tests focused and isolated
- Use beforeEach/afterEach for setup/cleanup

❌ **Don't:**
- Test library internals (test React behavior, not React source)
- Create brittle tests that break on refactoring
- Test too many things in one test
- Ignore error cases
- Mock things you're testing
- Create long, complex test files

### Debugging Tests

```bash
# Run in debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs

# Then open chrome://inspect in Chrome

# Or run single test in isolation
npm run test:unit -- --reporter=verbose src/__tests__/lib/webhooks.test.ts
```

### Checking Coverage

```bash
# Generate coverage report
npm run test:unit -- --coverage

# Coverage report will be in coverage/ directory
# Open coverage/index.html in browser
```

**Target Coverage:**
- Statements: 80%+
- Branches: 75%+
- Functions: 80%+
- Lines: 80%+

## Playwright - End-to-End Tests

### Setup

```bash
# Install Playwright browsers
npx playwright install

# Or just for Chrome
npx playwright install chromium
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/navigation.spec.ts

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run with debug mode
npm run test:e2e -- --debug

# Generate test report
npm run test:e2e -- --reporter=html
```

### Test Files Location

Tests are in `tests/` directory:

```
tests/
├── navigation.spec.ts          # Navigation and routing
├── settings-webhook.spec.ts    # Settings and webhooks
├── gallery.spec.ts             # Gallery functionality
└── theme.spec.ts               # Theme switching
```

### What's Tested (E2E)

#### 1. **Navigation** (`tests/navigation.spec.ts`)

- Visit home page
- Check all navigation links work
- Verify page headings on each route
- Check mobile menu functionality

#### 2. **Settings & Webhooks** (`tests/settings-webhook.spec.ts`)

- Navigate to settings
- Toggle environment (test/production)
- Test GET webhook button
- Test POST webhook button
- Verify response displayed
- Check settings persist after reload

#### 3. **Gallery** (`tests/gallery.spec.ts`)

- Pre-seed localStorage with test items
- Visit gallery page
- Test media type filter
- Test environment filter
- Test date range filter
- Test preview modal open/close
- Test download functionality

#### 4. **Theme** (`tests/theme.spec.ts`)

- Visit home page
- Toggle light theme
- Check CSS class applied
- Toggle dark theme
- Toggle auto theme
- Verify theme persists after reload

### Writing E2E Tests

#### Example: Navigation Test

```typescript
import { test, expect } from '@playwright/test';

test('should navigate to all pages', async ({ page }) => {
  // Go to home
  await page.goto('http://localhost:3000');

  // Click Gallery link
  await page.click('a:has-text("Gallery")');

  // Verify we're on gallery
  await expect(page).toHaveURL('**/gallery');
  await expect(page.locator('h1')).toContainText('Gallery');
});
```

#### Example: Form Interaction Test

```typescript
test('should update settings', async ({ page, context }) => {
  await page.goto('http://localhost:3000/settings');

  // Select test environment
  await page.click('label:has-text("test")');

  // Verify selection
  const testInput = page.locator('input[value="test"]');
  await expect(testInput).toBeChecked();

  // Reload and verify persistence
  await page.reload();
  await expect(testInput).toBeChecked();
});
```

### Best Practices for E2E

✅ **Do:**
- Test real user workflows
- Use visible selectors (text, roles)
- Mock API calls when needed
- Keep tests independent
- Use explicit waits (waitForNavigation)
- Reset state between tests

❌ **Don't:**
- Test implementation details
- Use fragile selectors (CSS classes)
- Test every detail (that's for unit tests)
- Make tests dependent on execution order
- Use arbitrary delays (use waitFor instead)
- Test third-party libraries

### Debugging E2E Tests

```bash
# Run with headed browser
npm run test:e2e -- --headed

# Pause on failure
npm run test:e2e -- --headed --debug

# Generate trace for failed tests
npm run test:e2e -- --trace on

# Open trace viewer
npx playwright show-trace trace.zip
```

### Visual Testing (Optional)

For screenshot comparisons:

```typescript
test('should match baseline', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveScreenshot();
});
```

Run with `--update-snapshots` to create baselines:

```bash
npm run test:e2e -- --update-snapshots
```

## CI/CD Integration

### GitHub Actions

Add this to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
```

### Running Tests Locally Before Pushing

```bash
# Run all tests
npm run test:unit && npm run test:e2e

# Or with coverage
npm run test:unit -- --coverage && npm run test:e2e
```

## Troubleshooting

### Tests timing out

```bash
# Increase timeout
npm run test:unit -- --testTimeout=10000
```

### localStorage not working in tests

Use the provided mock in test files:

```typescript
const localStorageMock = { /* ... */ };
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```

### Component not rendering in tests

Ensure context providers are wrapped:

```typescript
const renderWithContext = (component) => {
  return render(
    <YourProvider>
      {component}
    </YourProvider>
  );
};
```

### Playwright can't connect to dev server

Start dev server in separate terminal:

```bash
npm run dev  # Terminal 1
npm run test:e2e  # Terminal 2
```

Or update `playwright.config.ts` with correct port.

## Coverage Goals

Target coverage for production:

- **Utilities/Libs:** 90%+ (critical path)
- **Hooks:** 80%+ (business logic)
- **Components:** 70%+ (UI testing is hard)
- **Pages:** 60%+ (E2E tests cover more)

## Next Steps

1. Run tests: `npm run test:unit`
2. Check coverage: `npm run test:unit -- --coverage`
3. Write tests for new code before shipping
4. Run E2E tests before deployment
5. Monitor test performance in CI/CD

---

For more info:
- [Vitest Docs](https://vitest.dev)
- [Testing Library Docs](https://testing-library.com)
- [Playwright Docs](https://playwright.dev)
