import { Locator, Page } from '@playwright/test';
import { AuthenticatedBasePage } from './authenticated-base.page';

// requestloan.htm - submit is an AJAX call, not a real form POST: on success
// #requestLoanForm is hidden and #requestLoanResult is shown, with either
// #loanRequestApproved or #loanRequestDenied revealed inside it.
export class RequestLoanPage extends AuthenticatedBasePage {
  private readonly loanAmountInput: Locator;
  private readonly downPaymentInput: Locator;
  private readonly fromAccountSelect: Locator;
  private readonly applyNowButton: Locator;
  private readonly loanStatusText: Locator;
  private readonly loanProviderNameText: Locator;
  private readonly newAccountIdLink: Locator;

  // Public: the result of clicking "Apply Now" - tests assert on it directly.
  readonly loanRequestProcessedHeading: Locator;

  constructor(page: Page) {
    super(page);

    // No <label> exists for these fields, so they have no accessible name -
    // attribute selectors are the correct fallback here, not a shortcut.
    this.loanAmountInput = page.locator('#requestLoanForm #amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountSelect = page.locator('#requestLoanForm #fromAccountId');
    // The button's accessible name comes from its `value` attribute.
    this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });
    this.loanStatusText = page.locator('#loanStatus');
    this.loanProviderNameText = page.locator('#loanProviderName');
    this.newAccountIdLink = page.locator('#newAccountId');

    this.loanRequestProcessedHeading = page.getByRole('heading', { name: 'Loan Request Processed' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/parabank/requestloan.htm');
  }

  async enterLoanAmount(amount: string): Promise<void> {
    await this.loanAmountInput.fill(amount);
  }

  async enterDownPayment(amount: string): Promise<void> {
    await this.downPaymentInput.fill(amount);
  }

  async selectFromAccount(accountId: string): Promise<void> {
    await this.fromAccountSelect.selectOption(accountId);
  }

  async clickApplyNow(): Promise<void> {
    await this.applyNowButton.click();
  }

  // Reads the outcome back from the result panel.
  async getLoanStatus(): Promise<string | null> {
    return this.loanStatusText.textContent();
  }

  async getLoanProviderName(): Promise<string | null> {
    return this.loanProviderNameText.textContent();
  }

  async getNewAccountId(): Promise<string | null> {
    return this.newAccountIdLink.textContent();
  }
}
