import postgres from 'postgres'

const sql = postgres({
  port: 5432,
  database: 'rinha',
  pass: '1234',
  user: 'postgres',
  host: process.env.DB_HOSTNAME || 'localhost',
})

export { sql }
