import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Login', () => {
  test('logs in successfully with valid credentials', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);

    await expect(page).toHaveURL(/overview\.htm/);
    await expect(loginPage.accountsOverviewHeading).toBeVisible();
  });

  // Quarantined 2026-09-02: ParaBank's live demo server currently logs in
  // with ANY username/password (verified against several bogus combos,
  // including a valid username with a wrong password) instead of rejecting
  // them - a server-side defect on Parasoft's end, not something fixable
  // here. Re-enable once the demo server rejects invalid credentials again.
  test.fixme('shows an error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('not_a_real_user_xyz', 'wrong_password');

    await expect(loginPage.errorHeading).toBeVisible();
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
