import { test as base } from '@playwright/test';
import { AuthClient } from '../api/clients/auth.client';
import { AccountClient } from '../api/clients/account.client';
import { TransferClient } from '../api/clients/transfer.client';
import { Customer } from '../api/models/auth.model';
import { Account } from '../api/models/account.model';

// Wires each API client into Playwright's fixture system, so tests receive
// them ready-made instead of constructing `new AccountClient(request)` in
// every test - mirrors pages.fixture.ts on the UI side.
type ApiFixtures = {
  authClient: AuthClient;
  accountClient: AccountClient;
  transferClient: TransferClient;
  // Logs in once per test and hands back the resulting customerId.
  // auth.spec.ts doesn't use this - it exercises the login endpoint itself
  // (including invalid credentials), so it calls authClient.login() directly.
  customerId: number;
  // The logged-in customer's own accounts, fetched once per test.
  customerAccounts: Account[];
};

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  accountClient: async ({ request }, use) => {
    await use(new AccountClient(request));
  },
  transferClient: async ({ request }, use) => {
    await use(new TransferClient(request));
  },

  customerId: async ({ authClient }, use) => {
    const loginResponse = await authClient.login(process.env.USERNAME!, process.env.PASSWORD!);
    const customer = await loginResponse.json() as Customer;
    await use(customer.id);
  },

  customerAccounts: async ({ accountClient, customerId }, use) => {
    const accountsResponse = await accountClient.getCustomerAccounts(customerId);
    const accounts = await accountsResponse.json() as Account[];
    await use(accounts);
  },
});

export { expect } from '@playwright/test';
