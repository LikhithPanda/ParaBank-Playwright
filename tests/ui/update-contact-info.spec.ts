import { test, expect } from '../../fixtures/pages.fixture';

test.describe('Update Contact Information', () => {
  test('updates contact info successfully', async ({ updateContactInfoPage }) => {
    await updateContactInfoPage.goto();
    await updateContactInfoPage.updateContactInfo({
      firstName: 'John',
      lastName: 'Smith',
      street: '123 Test Street',
      city: 'Testville',
      state: 'CA',
      zipCode: '90210',
      phoneNumber: '555-123-4567',
    });

    await expect(updateContactInfoPage.profileUpdatedHeading).toBeVisible();
    await expect(updateContactInfoPage.profileUpdatedMessage).toBeVisible();
  });
});
