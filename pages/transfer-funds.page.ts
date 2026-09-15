import { Locator, Page } from '@playwright/test';
import { AuthenticatedBasePage } from './authenticated-base.page';

// transfer.htm - submit is an AJAX call, not a real form POST: on success
// #showForm is hidden and #showResult is shown in its place.
export class TransferFundsPage extends AuthenticatedBasePage {
  private readonly amountInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly toAccountSelect: Locator;
  private readonly transferButton: Locator;

  // Public: the result of clicking "Transfer" - tests assert on it directly.
  readonly transferCompleteHeading: Locator;

  constructor(page: Page) {
    super(page);

    // No <label> exists for these fields, so they have no accessible name -
    // attribute selectors are the correct fallback here, not a shortcut.
    this.amountInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    // The button's accessible name comes from its `value` attribute.
    this.transferButton = page.getByRole('button', { name: 'Transfer' });

    this.transferCompleteHeading = page.getByRole('heading', { name: 'Transfer Complete!' });
  }

  async goto(): Promise<void> {
    // #fromAccountId/#toAccountId are populated by an async request after
    // page load, not server-rendered - wait for it so selecting/submitting
    // doesn't race the page's own JS (which would otherwise silently no-op).
    const accountsLoaded = this.page.waitForResponse(
      (response) => /\/customers\/\d+\/accounts$/.test(response.url()) && response.ok(),
    );
    await this.page.goto('/parabank/transfer.htm');
    await accountsLoaded;
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectFromAccount(accountId: string): Promise<void> {
    await this.fromAccountSelect.selectOption(accountId);
  }

  async selectToAccount(accountId: string): Promise<void> {
    await this.toAccountSelect.selectOption(accountId);
  }

  async clickTransfer(): Promise<void> {
    await this.transferButton.click();
  }

  // Reads which accounts are actually available (both selects share the
  // same list), so tests can pick real ids instead of hardcoding ones that
  // may not exist on this shared demo server.
  async getAvailableAccountIds(): Promise<string[]> {
    return this.fromAccountSelect.locator('option').evaluateAll((options) =>
      options.map((option) => (option as HTMLOptionElement).value),
    );
  }

  // Convenience method composing the steps above.
  async transferFunds(amount: string, fromAccountId: string, toAccountId: string): Promise<void> {
    await this.enterAmount(amount);
    await this.selectFromAccount(fromAccountId);
    await this.selectToAccount(toAccountId);
    await this.clickTransfer();
  }

  // The confirmation text depends on which accounts were used, so this is a
  // locator-returning method rather than a fixed field - still defined here
  // in the page class, just parameterized since the text is dynamic.
  transferConfirmationText(fromAccountId: string, toAccountId: string): Locator {
    return this.page.getByText(`has been transferred from account #${fromAccountId} to account #${toAccountId}`);
  }
}
