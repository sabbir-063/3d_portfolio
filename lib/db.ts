import { neon } from "@neondatabase/serverless";

if (!process.env.DB_URL) {
  // Surfaced at runtime (in the API route), not at build/import of static pages.
  console.warn("DB_URL is not set — comment endpoints will fail until it is configured.");
}

/**
 * Neon serverless SQL client (HTTP-based — no connection pooling needed).
 * Use as a tagged template: sql`SELECT * FROM comments WHERE post_slug = ${slug}`.
 * Interpolated values are sent as bound parameters, so this is injection-safe.
 */
export const sql = neon(process.env.DB_URL ?? "");
