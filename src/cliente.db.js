import { uuidv7 } from 'uuidv7'
import { safeParseInt } from './utils.js'

export async function loadLimite(clienteId, sql) {
  const [result] = await sql`
    select limite from clientes where id = ${clienteId}
  `

  if (!result) return null

  return safeParseInt(result.limite)
}

export async function loadSaldo(clienteId, sql) {
  const [result] = await sql`
    select
      sum(
        case
          when tipo = 'c' then -valor
          when tipo = 'd' then valor
        end
      ) as saldo
    from transacoes
    where id_cliente = ${clienteId}
  `

  if (!result) return null

  return safeParseInt(result.saldo)
}

export async function createTransacao(input, sql) {
  await sql`insert into transacoes ${sql(input)}`
}
