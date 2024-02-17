export async function loadCliente(clienteId, sql) {
  const [result] = await sql`
    select limite, saldo from clientes where id = ${clienteId} 
  `

  if (!result) return null

  return { saldo: result.saldo, limite: result.limite }
}

export async function loadExtrato(clienteId, sql) {
  const result = await sql`
    select 
      t.valor,
      t.descricao,
      t.tipo,
      t.realizada_em
    from transacoes t
    where t.id_cliente = ${clienteId}
    order by t.realizada_em desc limit 10
  `

  if (!result) return null

  return result
}
