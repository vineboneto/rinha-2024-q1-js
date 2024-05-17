import postgres from 'postgres'

const sql = postgres({
  port: 5432,
  database: 'rinha',
  password: '1234',
  username: 'postgres',
  max: 4,
  host: process.env.DB_HOSTNAME || 'localhost',
})

const now = await sql`select now()`

console.log(await sql`select * from clientes`)

await sql`
  delete from transacoes
`

await sql`
  update clientes set saldo = 0
`

sql.end()
