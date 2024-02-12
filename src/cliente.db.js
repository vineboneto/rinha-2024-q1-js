import { uuidv7 } from 'uuidv7'
import { safeParseInt } from './utils.js'

export async function loadSaldo(clienteId, sql) {
  const [result] = await sql`
    with saldo as (
      select
        sum(
          case
            when tipo = 'c' then -valor
            when tipo = 'd' then valor
          end
        ) as saldo
      from transacoes
      where id_cliente = ${clienteId}
    ),
    limite as (
      select limite from clientes where id = ${clienteId}
    )
    select
      saldo.saldo,
      limite.limite
    from saldo, limite
  `

  if (!result) return null

  return {
    saldo: safeParseInt(result.saldo),
    limite: safeParseInt(result.limite),
  }
}

export async function loadExtrato(input, sql) {
  const result = await sql`
    select 
      tr.valor,
      tr.descricao,
      tr.tipo,
      tr.realizada_em
    from transacoes tr
    order by tr.realizada_em desc limit 10
  `

  if (!result) return null

  return result
}

export async function createTransacao(input, sql) {
  await sql`insert into transacoes ${sql(input)}`
}
