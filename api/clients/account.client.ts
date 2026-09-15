import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Handles all account-related API requests.
 *
 * Responsibility:
 * - Send account requests
 * - Return the raw Playwright APIResponse
 *
 * It does NOT:
 * - Perform assertions
 * - Parse response bodies
 * - Throw custom business exceptions
 */
export class AccountClient {
  private readonly basePath = '/parabank/services/bank';

  constructor(private readonly request: APIRequestContext) {}

  /**
   * Get all accounts belonging to a customer.
   *
   * Endpoint:
   * GET /services/bank/customers/{customerId}/accounts
   */
  async getCustomerAccounts(customerId: number): Promise<APIResponse> {
    return this.request.get(`${this.basePath}/customers/${customerId}/accounts`, {
      headers: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * Get details for a single account.
   *
   * Endpoint:
   * GET /services/bank/accounts/{accountId}
   */
  async getAccountDetails(accountId: number): Promise<APIResponse> {
    return this.request.get(`${this.basePath}/accounts/${accountId}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
