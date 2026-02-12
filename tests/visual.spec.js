import { test, expect } from '@playwright/test';

test('Button visual regression', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=common-button--primary');
  await expect(page).toHaveScreenshot('button-primary.png');
});

test('Alert visual regression', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=common-alert--success');
  await expect(page).toHaveScreenshot('alert-success.png');
});
