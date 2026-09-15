import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Open New Account', () => {
  test('opens a new checking account successfully', async ({ openNewAccountPage }) => {
    await openNewAccountPage.goto();
    // Relies on the "from account" dropdown's pre-selected default rather
    // than a hardcoded accountId, since the shared demo server's account
    // list isn't stable between runs.
    await openNewAccountPage.selectAccountType('CHECKING');
    await openNewAccountPage.clickOpenNewAccount();

    await expect(openNewAccountPage.accountOpenedHeading).toBeVisible();

    const newAccountId = await openNewAccountPage.getNewAccountId();
    expect(newAccountId).toMatch(/^\d+$/);
  });
});
