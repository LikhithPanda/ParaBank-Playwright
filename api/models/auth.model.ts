// Response models for the ParaBank Login endpoint (GET /login/{username}/{password}).
// Mirrors the `Customer` schema from the ParaBank OpenAPI spec.

/**
 * Customer returned after a successful login.
 */
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}
