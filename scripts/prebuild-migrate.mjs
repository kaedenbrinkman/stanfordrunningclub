/**
 * Runs before `next build`: clears Payload's dev-push marker and applies pending migrations.
 *
 * If the database was ever used with `pnpm dev` (schema push), Payload stores a row with
 * batch = -1 in `payload_migrations`. `payload migrate` then shows an interactive prompt,
 * which hangs non-interactive builds (e.g. Vercel). This script removes that marker first.
 */
import { spawnSync } from 'node:child_process'
import pg from 'pg'
import 'dotenv/config'

const url = process.env.POSTGRES_URL
const isVercelProd = process.env.VERCEL_ENV === 'production'

if (!url) {
  if (isVercelProd) {
    console.error('[prebuild-migrate] POSTGRES_URL is required for production builds.')
    process.exit(1)
  }
  console.log('[prebuild-migrate] POSTGRES_URL not set, skipping migrations.')
  process.exit(0)
}

const client = new pg.Client({ connectionString: url })
await client.connect()
try {
  const { rows } = await client.query(`SELECT to_regclass('public.payload_migrations') AS t`)
  if (rows[0]?.t) {
    const res = await client.query('DELETE FROM payload_migrations WHERE batch = -1')
    if (res.rowCount) console.log(`[prebuild-migrate] Removed ${res.rowCount} dev-mode marker row(s).`)
  }
} finally {
  await client.end()
}

const result = spawnSync('pnpm', ['payload', 'migrate'], { stdio: 'inherit', env: process.env })
process.exit(result.status ?? 1)
