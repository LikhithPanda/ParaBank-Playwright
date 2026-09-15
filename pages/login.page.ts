import { Locator, Page } from '@playwright/test';

// login.htm form (rendered on index.htm). No post-login chrome exists here,
// so this page has no NavigationMenu.
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  // Public (not private): these are the two outcomes of login(), and tests
  // assert on them directly - e.g. expect(loginPage.errorHeading).toBeVisible().
  readonly accountsOverviewHeading: Locator;
  readonly errorHeading: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    const form = page.locator('form[name="login"]');
    // No <label> exists for these inputs, so they have no accessible name -
    // attribute selectors are the correct fallback here, not a shortcut.
    this.usernameInput = form.locator('input[name="username"]');
    this.passwordInput = form.locator('input[name="password"]');
    // The submit button's accessible name comes from its `value` attribute.
    this.loginButton = page.getByRole('button', { name: 'Log In' });

    this.accountsOverviewHeading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.errorHeading = page.getByRole('heading', { name: 'Error!' });
    this.errorMessage = page.getByText('The username and password could not be verified.');
  }

  async goto(): Promise<void> {
    await this.page.goto('/parabank/index.htm');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  // Convenience method composing the three steps above - the common case
  // for every scenario that needs to start from a logged-in state.
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
