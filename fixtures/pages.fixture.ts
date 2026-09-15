import { Page, test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { OpenNewAccountPage } from '../pages/open-new-account.page';
import { TransferFundsPage } from '../pages/transfer-funds.page';
import { UpdateContactInfoPage } from '../pages/update-contact-info.page';
import { RequestLoanPage } from '../pages/request-loan.page';

// Wires each Page Object into Playwright's fixture system, so tests receive
// them ready-made (e.g. `test('...', async ({ loginPage }) => {...})`)
// instead of constructing `new LoginPage(page)` in every test.
type PageFixtures = {
  loginPage: LoginPage;
  // Logs in once per test and hands back the same `page`, already
  // authenticated. login.spec.ts doesn't use this - it exercises the login
  // flow itself (including invalid credentials), so it depends on the
  // plain `loginPage` fixture directly instead.
  authenticatedPage: Page;
  openNewAccountPage: OpenNewAccountPage;
  transferFundsPage: TransferFundsPage;
  updateContactInfoPage: UpdateContactInfoPage;
  requestLoanPage: RequestLoanPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
    await use(page);
  },

  openNewAccountPage: async ({ authenticatedPage }, use) => {
    await use(new OpenNewAccountPage(authenticatedPage));
  },
  transferFundsPage: async ({ authenticatedPage }, use) => {
    await use(new TransferFundsPage(authenticatedPage));
  },
  updateContactInfoPage: async ({ authenticatedPage }, use) => {
    await use(new UpdateContactInfoPage(authenticatedPage));
  },
  requestLoanPage: async ({ authenticatedPage }, use) => {
    await use(new RequestLoanPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
