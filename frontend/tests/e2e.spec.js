import { test, expect } from '@playwright/test';

test('user can sign up, log in, and access orders', async ({ page }) => {
  const email = `playwright_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@example.com`;
  const password = 'Pass1234!';

  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.goto('/signup');
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

  await page.getByLabel('Full Name').fill('Playwright User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByText('Hello, Playwright User!')).toBeVisible();

  await page.getByRole('link', { name: /Orders/i }).click();
  await expect(page).toHaveURL(/\/orders/);

  await page.getByRole('button', { name: 'Add Demo Order' }).click();
  await expect(page.getByText('Demo Grocery Pack')).toBeVisible();
});
