import db from '@adonisjs/lucid/services/db'

/**
 * Lightweight login throttle (D14): after this many consecutive failures for the
 * same kode unik, sign-in is refused until the window has passed.
 */
const MAX_FAILED_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

const TABLE = 'login_attempts'

interface LoginAttemptRow {
  failed_count: number | string
  window_started_at: number | string
}

async function findRow(kodeUnik: string) {
  return (await db.from(TABLE).where('kode_unik', kodeUnik).first()) as LoginAttemptRow | null
}

/**
 * The window start is stored as epoch milliseconds. It is normalised through
 * `Number()` because PostgreSQL returns bigint columns as strings while SQLite
 * returns them as numbers.
 */
function isWindowExpired(row: LoginAttemptRow) {
  return Number(row.window_started_at) + WINDOW_MS <= Date.now()
}

/**
 * Attempts are counted for every submitted kode unik, including ones without a
 * matching user, so the throttle cannot be used to probe which codes exist.
 */
export async function isLockedOut(kodeUnik: string) {
  const row = await findRow(kodeUnik)
  if (!row) return false

  // Lazy cleanup: a lapsed window can never lock anyone out, so drop the stale
  // row now instead of leaving it to bloat the table.
  if (isWindowExpired(row)) {
    await db.from(TABLE).where('kode_unik', kodeUnik).delete()
    return false
  }

  return Number(row.failed_count) >= MAX_FAILED_ATTEMPTS
}

export async function recordFailedAttempt(kodeUnik: string) {
  const now = Date.now()

  /**
   * A single `INSERT ... ON CONFLICT DO UPDATE` keeps the read-modify-write
   * atomic, so concurrent failures for the same kode unik can neither lose an
   * increment nor collide on the unique index. The bare column references in
   * the SET expressions resolve to the existing row on both PostgreSQL and
   * SQLite, and the CASE clauses reset the counter when the window has lapsed.
   */
  await db
    .table(TABLE)
    .insert({ kode_unik: kodeUnik, failed_count: 1, window_started_at: now })
    .onConflict('kode_unik')
    .merge({
      failed_count: db.raw(
        'CASE WHEN window_started_at + ? <= ? THEN 1 ELSE failed_count + 1 END',
        [WINDOW_MS, now]
      ),
      window_started_at: db.raw(
        'CASE WHEN window_started_at + ? <= ? THEN ? ELSE window_started_at END',
        [WINDOW_MS, now, now]
      ),
    })
}

export async function clearFailedAttempts(kodeUnik: string) {
  await db.from(TABLE).where('kode_unik', kodeUnik).delete()
}
