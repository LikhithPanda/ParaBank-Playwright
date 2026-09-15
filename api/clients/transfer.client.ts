import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Handles all transfer-related API requests.
 *
 * Responsibility:
 * - Send transfer requests
 * - Return the raw Playwright APIResponse
 *
 * It does NOT:
 * - Perform assertions
 * - Parse response bodies
 * - Throw custom business exceptions
 */
export class TransferClient {
  private readonly basePath = '/parabank/services/bank';

  constructor(private readonly request: APIRequestContext) {}

  /**
   * Transfer funds between two accounts.
   *
   * Endpoint:
   * POST /services/bank/transfer
   */
  async transferFunds(fromAccountId: number, toAccountId: number, amount: number): Promise<APIResponse> {
    return this.request.post(`${this.basePath}/transfer`, {
      params: {
        fromAccountId,
        toAccountId,
        amount,
      },
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
