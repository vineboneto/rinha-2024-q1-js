import postgres from 'postgres'

const sql = postgres({
  port: 7999,
  database: 'rinha',
  pass: '1234',
  user: 'postgres',
})

export { sql }
