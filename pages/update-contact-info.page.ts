import { Locator, Page } from '@playwright/test';
import { AuthenticatedBasePage } from './authenticated-base.page';

// updateprofile.htm - submit is an AJAX call, not a real form POST: on
// success #updateProfileForm is hidden and #updateProfileResult is shown.
// Field `name` attributes contain literal dots (e.g. "customer.firstName"),
// so attribute selectors are used instead of #id selectors to avoid
// CSS-escaping the dots.
export class UpdateContactInfoPage extends AuthenticatedBasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly streetInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneNumberInput: Locator;
  private readonly updateProfileButton: Locator;

  // Public: the result of clicking "Update Profile" - tests assert on these directly.
  readonly profileUpdatedHeading: Locator;
  readonly profileUpdatedMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.streetInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[name="customer.phoneNumber"]');
    // The button's accessible name comes from its `value` attribute.
    this.updateProfileButton = page.getByRole('button', { name: 'Update Profile' });

    this.profileUpdatedHeading = page.getByRole('heading', { name: 'Profile Updated' });
    this.profileUpdatedMessage = page.getByText('Your updated address and phone number have been added to the system.');
  }

  async goto(): Promise<void> {
    // Fields are pre-filled by an async request after page load, not
    // server-rendered - wait for it, otherwise typing into a field can be
    // immediately overwritten by the async autofill landing afterward.
    const customerLoaded = this.page.waitForResponse(
      (response) => /\/customers\/\d+$/.test(response.url()) && response.ok(),
    );
    await this.page.goto('/parabank/updateprofile.htm');
    await customerLoaded;
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async enterStreet(street: string): Promise<void> {
    await this.streetInput.fill(street);
  }

  async enterCity(city: string): Promise<void> {
    await this.cityInput.fill(city);
  }

  async enterState(state: string): Promise<void> {
    await this.stateInput.fill(state);
  }

  async enterZipCode(zipCode: string): Promise<void> {
    await this.zipCodeInput.fill(zipCode);
  }

  async enterPhoneNumber(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.fill(phoneNumber);
  }

  async clickUpdateProfile(): Promise<void> {
    await this.updateProfileButton.click();
  }

  // Convenience method composing the field entry steps above.
  async updateContactInfo(details: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  }): Promise<void> {
    await this.enterFirstName(details.firstName);
    await this.enterLastName(details.lastName);
    await this.enterStreet(details.street);
    await this.enterCity(details.city);
    await this.enterState(details.state);
    await this.enterZipCode(details.zipCode);
    await this.enterPhoneNumber(details.phoneNumber);
    await this.clickUpdateProfile();
  }
}
