/**
 * Shared analytics token store and verification.
 * Extracted from route file because Next.js webpack mode
 * doesn't allow non-route exports from route.ts files.
 */

// In-memory token store: token -> expiry timestamp
export const tokenStore = new Map<string, number>();

export function verifyToken(token: string): boolean {
  const expiry = tokenStore.get(token);
  return !!(expiry && expiry > Date.now());
}
