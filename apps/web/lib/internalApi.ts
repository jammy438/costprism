/**
 * lib/internalApi.ts
 *
 * Shared helper for calling George's FastAPI internal endpoints.
 * All calls go through this so we have one place to add auth headers
 * when George locks down his endpoints in production.
 */

const INTERNAL_API_URL = process.env.INTERNAL_API_URL ?? 'http://localhost:8000'

export async function internalFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = `${INTERNAL_API_URL}${path}`
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add shared secret header here when George locks down endpoints:
      // 'x-internal-secret': process.env.INTERNAL_API_SECRET ?? '',
      ...options?.headers,
    },
  })
}