import { safeParseInt } from './utils.js'

export async function loadCliente(clienteId, sql, { forUpdate = false } = {}) {
  const [result] = await sql`
    select limite, saldo from clientes where id = ${clienteId} 
    ${forUpdate ? sql`for update` : sql``}
  `

  if (!result) return null

  return {
    saldo: safeParseInt(result.saldo),
    limite: safeParseInt(result.limite),
  }
}

export async function loadExtrato(clienteId, sql) {
  const result = await sql`
    select 
      tr.valor,
      tr.descricao,
      tr.tipo,
      tr.realizada_em AT TIME ZONE 'UTC' as realizada_em
    from transacoes tr
    where tr.id_cliente = ${clienteId}
    order by tr.realizada_em desc limit 10
  `

  if (!result) return null

  return result
}

export async function updateSaldoCliente(input, sql) {
  await sql`
    update clientes
    set saldo = ${input.saldo}
    where id = ${input.clienteId}
  `
}

export async function createTransacao(input, sql) {
  await sql`insert into transacoes ${sql(input)}`
}
