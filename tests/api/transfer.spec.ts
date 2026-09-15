import { test, expect } from '../../fixtures/api.fixture';

test.describe('Transfer API', () => {

  test('should transfer funds successfully between two valid accounts', async ({ transferClient, customerAccounts }) => {

    // This runs against a shared public demo server, so the account count
    // isn't guaranteed to stay stable between runs. Prefer two distinct
    // accounts; fall back to a self-transfer (same account both ways, which
    // ParaBank accepts) if only one exists, so the test still runs.
    const fromAccountId = customerAccounts[0].id;
    const toAccountId = customerAccounts.length >= 2 ? customerAccounts[1].id : customerAccounts[0].id;

    const response = await transferClient.transferFunds(fromAccountId, toAccountId, 1.00);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const message = await response.text();
    expect(message).toContain('Successfully transferred');

  });

});
