import { test, expect } from '../../fixtures/api.fixture';
import { Customer } from '../../api/models/auth.model';

test.describe('Authentication API', () => {

  test('should login successfully with valid credentials', async ({ authClient }) => {
    const response = await authClient.login(
      process.env.USERNAME!,
      process.env.PASSWORD!,
    );

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const customer = (await response.json()) as Customer;

    expect(customer.id).toBeGreaterThan(0);
    expect(customer.firstName).toBeTruthy();
    expect(customer.lastName).toBeTruthy();
  });

  test('should reject an invalid username', async ({ authClient }) => {
    const response = await authClient.login(
      'invalid_user',
      process.env.PASSWORD!,
    );

    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();

    const error = await response.text();

    expect(error).toContain('Invalid username and/or password');
  });

  test('should reject an invalid password', async ({ authClient }) => {
    const response = await authClient.login(
      process.env.USERNAME!,
      'wrong_password',
    );

    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();

    const error = await response.text();

    expect(error).toContain('Invalid username and/or password');
  });
});
