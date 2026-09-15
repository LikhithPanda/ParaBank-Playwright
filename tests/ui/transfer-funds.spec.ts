import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Transfer Funds', () => {
  test('transfers funds successfully between two accounts', async ({ transferFundsPage }) => {
    await transferFundsPage.goto();

    const accountIds = await transferFundsPage.getAvailableAccountIds();
    const fromAccountId = accountIds[0];
    // Falls back to a self-transfer if the shared demo account only has one
    // account right now - ParaBank accepts this, same reasoning used in the
    // API test suite for the same underlying data-drift issue.
    const toAccountId = accountIds.length >= 2 ? accountIds[1] : accountIds[0];

    await transferFundsPage.transferFunds('1.00', fromAccountId, toAccountId);

    await expect(transferFundsPage.transferCompleteHeading).toBeVisible();
    await expect(transferFundsPage.transferConfirmationText(fromAccountId, toAccountId)).toBeVisible();
  });
});
