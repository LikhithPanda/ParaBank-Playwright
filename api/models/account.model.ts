// Response models for ParaBank Account endpoints.
// Mirrors the `Account` schema from the ParaBank OpenAPI spec.

/**
 * Account returned by:
 * - GET /customers/{customerId}/accounts (as an array)
 * - GET /accounts/{accountId} (as a single object)
 */
export interface Account {
  id: number;
  customerId: number;
  type: 'CHECKING' | 'SAVINGS' | 'LOAN';
  balance: number;
}
