import { APIRequestContext, APIResponse } from "@playwright/test";

/**
 * Handles all authentication-related API requests.
 *
 * Responsibility:
 * - Send authentication requests
 * - Return the raw Playwright APIResponse
 *
 * It does NOT:
 * - Perform assertions
 * - Parse response bodies
 * - Throw custom business exceptions
 */
export class AuthClient {
  private readonly basePath = "/parabank/services/bank";

  constructor(private readonly request: APIRequestContext) {}

  /**
   * Login using username and password.
   *
   * Endpoint:
   * GET /services/bank/login/{username}/{password}
   */
  async login(username: string, password: string): Promise<APIResponse> {
    return this.request.get(`${this.basePath}/login/${username}/${password}`, {
      headers: {
        Accept: "application/json",
      },
    });
  }
}
