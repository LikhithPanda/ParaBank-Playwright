import { test, expect } from '../../fixtures/api.fixture';
import { Account } from '../../api/models/account.model';

test.describe('Account API', () => {

  test('should get customer accounts', async ({ accountClient, customerId }) => {

    const response = await accountClient.getCustomerAccounts(customerId);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const accounts = await response.json() as Account[];

    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts[0].customerId).toBe(customerId);

  });

  test('should get account details', async ({ accountClient, customerId, customerAccounts }) => {

    // Reuse the customer's first account as a known-valid accountId.
    const accountId = customerAccounts[0].id;

    const response = await accountClient.getAccountDetails(accountId);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const account = await response.json() as Account;

    expect(account.id).toBe(accountId);
    expect(account.customerId).toBe(customerId);

  });

});
