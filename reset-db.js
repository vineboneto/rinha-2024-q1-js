import sql from './src/db.js'

const now = await sql`select now()`

await sql`
  delete from transacoes
`

await sql`
  update clientes set saldo = 0
`

sql.end()
