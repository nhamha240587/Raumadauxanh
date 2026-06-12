import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || ''

let _sql: ReturnType<typeof postgres> | null = null

function getDb() {
  if (!_sql) {
    _sql = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      max: 5,
      idle_timeout: 20,
    })
  }
  return _sql
}

export async function initDb() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS course_leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      payment_ref TEXT UNIQUE,
      payment_status TEXT DEFAULT 'pending',
      amount INTEGER DEFAULT 299000,
      paid_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      email_sent BOOLEAN DEFAULT FALSE,
      telegram_sent BOOLEAN DEFAULT FALSE
    )
  `
  await sql`ALTER TABLE course_leads ADD COLUMN IF NOT EXISTS course TEXT DEFAULT 'dua-ca-muoi'`
}

export async function insertCourseLead(data: {
  name: string; email: string; phone: string; paymentRef: string; amount?: number
}) {
  const sql = getDb()
  const amount = data.amount ?? 299000
  const rows = await sql`
    INSERT INTO course_leads (name, email, phone, payment_ref, amount, course)
    VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.paymentRef}, ${amount}, 'rau-ma-dau-xanh')
    ON CONFLICT (payment_ref) DO UPDATE
      SET name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone, amount = EXCLUDED.amount
    RETURNING id
  `
  return rows[0].id as number
}

export async function confirmPayment(paymentRef: string) {
  const sql = getDb()
  await sql`
    UPDATE course_leads
    SET payment_status = 'paid', paid_at = NOW()
    WHERE payment_ref = ${paymentRef}
  `
}

export async function getLeadByRef(paymentRef: string) {
  const sql = getDb()
  const rows = await sql`SELECT * FROM course_leads WHERE payment_ref = ${paymentRef}`
  return rows[0] as CourseLead | undefined
}

export async function markEmailSent(id: number) {
  const sql = getDb()
  await sql`UPDATE course_leads SET email_sent = TRUE WHERE id = ${id}`
}

export async function markTelegramSent(id: number) {
  const sql = getDb()
  await sql`UPDATE course_leads SET telegram_sent = TRUE WHERE id = ${id}`
}

export interface CourseLead {
  id: number; name: string; email: string; phone: string
  payment_ref: string; payment_status: string; amount: number
  paid_at: string | null; created_at: string
  email_sent: boolean; telegram_sent: boolean
}
