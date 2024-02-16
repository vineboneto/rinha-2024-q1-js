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
      t.valor,
      t.descricao,
      t.tipo,
      t.realizada_em AT TIME ZONE 'UTC' as realizada_em
    from transacoes t
    where t.id_cliente = ${clienteId}
    order by t.realizada_em desc limit 10
  `

  if (!result) return null

  return result
}

export async function updateSaldoCliente(input, sql) {
  return sql`
    update clientes
    set saldo = ${input.saldo}
    where id = ${input.clienteId}
  `
}

export async function createTransacao(input, sql) {
  return sql`insert into transacoes ${sql(input)}`
}
