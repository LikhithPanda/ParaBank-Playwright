import { Locator, Page } from '@playwright/test';

// The "Account Services" left-hand menu (#leftPanel), present unchanged on
// every authenticated page. Composed into each authenticated Page Object
// rather than inherited, since LoginPage has no post-login chrome at all.
export class NavigationMenu {
  private readonly openNewAccountLink: Locator;
  private readonly accountsOverviewLink: Locator;
  private readonly transferFundsLink: Locator;
  private readonly billPayLink: Locator;
  private readonly findTransactionsLink: Locator;
  private readonly updateContactInfoLink: Locator;
  private readonly requestLoanLink: Locator;
  private readonly logOutLink: Locator;

  constructor(private readonly page: Page) {
    const menu = page.locator('#leftPanel');
    this.openNewAccountLink = menu.getByRole('link', { name: 'Open New Account' });
    this.accountsOverviewLink = menu.getByRole('link', { name: 'Accounts Overview' });
    this.transferFundsLink = menu.getByRole('link', { name: 'Transfer Funds' });
    this.billPayLink = menu.getByRole('link', { name: 'Bill Pay' });
    this.findTransactionsLink = menu.getByRole('link', { name: 'Find Transactions' });
    this.updateContactInfoLink = menu.getByRole('link', { name: 'Update Contact Info' });
    this.requestLoanLink = menu.getByRole('link', { name: 'Request Loan' });
    this.logOutLink = menu.getByRole('link', { name: 'Log Out' });
  }

  async goToOpenNewAccount(): Promise<void> {
    await this.openNewAccountLink.click();
  }

  async goToAccountsOverview(): Promise<void> {
    await this.accountsOverviewLink.click();
  }

  async goToTransferFunds(): Promise<void> {
    await this.transferFundsLink.click();
  }

  async goToBillPay(): Promise<void> {
    await this.billPayLink.click();
  }

  async goToFindTransactions(): Promise<void> {
    await this.findTransactionsLink.click();
  }

  async goToUpdateContactInfo(): Promise<void> {
    await this.updateContactInfoLink.click();
  }

  async goToRequestLoan(): Promise<void> {
    await this.requestLoanLink.click();
  }

  async logOut(): Promise<void> {
    await this.logOutLink.click();
  }
}
