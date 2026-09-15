import { Locator, Page } from '@playwright/test';
import { AuthenticatedBasePage } from './authenticated-base.page';

// openaccount.htm - submit is an AJAX call, not a real form POST: on success
// #openAccountForm is hidden and #openAccountResult is shown in its place.
export class OpenNewAccountPage extends AuthenticatedBasePage {
  private readonly accountTypeSelect: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly openNewAccountButton: Locator;
  private readonly newAccountIdLink: Locator;

  // Public: the result of clicking "Open New Account" - tests assert on it directly.
  readonly accountOpenedHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Neither <select> has a <label>, so they have no accessible name -
    // attribute selectors are the correct fallback here, not a shortcut.
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    // The button's accessible name comes from its `value` attribute.
    this.openNewAccountButton = page.getByRole('button', { name: 'Open New Account' });
    this.newAccountIdLink = page.locator('#newAccountId');

    this.accountOpenedHeading = page.getByRole('heading', { name: 'Account Opened!' });
  }

  async goto(): Promise<void> {
    // #fromAccountId is populated by an async request after page load, not
    // server-rendered - wait for it so selecting/submitting doesn't race the
    // page's own JS (which would otherwise silently no-op).
    const accountsLoaded = this.page.waitForResponse(
      (response) => /\/customers\/\d+\/accounts$/.test(response.url()) && response.ok(),
    );
    await this.page.goto('/parabank/openaccount.htm');
    await accountsLoaded;
  }

  async selectAccountType(type: 'CHECKING' | 'SAVINGS'): Promise<void> {
    await this.accountTypeSelect.selectOption({ label: type });
  }

  async selectFromAccount(accountId: string): Promise<void> {
    await this.fromAccountSelect.selectOption(accountId);
  }

  async clickOpenNewAccount(): Promise<void> {
    await this.openNewAccountButton.click();
  }

  // Reads the new account number back from the result panel.
  async getNewAccountId(): Promise<string | null> {
    return this.newAccountIdLink.textContent();
  }
}
