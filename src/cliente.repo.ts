import sql from './db'

export class ClienteRepository {
  async createTransacao({
    id,
    valor,
    descricao,
    tipo,
  }: {
    id: number
    valor: number
    descricao: string
    tipo: 'c' | 'd'
  }) {
    return sql`insert into transacoes ${sql({
      id_cliente: id,
      valor,
      descricao,
      tipo,
    })}`
  }

  async updateSaldo({
    valorIncrementado,
    id,
  }: {
    valorIncrementado: number
    id: number
  }) {
    return sql`
      update clientes
      set saldo = saldo + ${valorIncrementado}
      where id = ${id} and (saldo + ${valorIncrementado}) * -1 <= limite
      returning saldo, limite
    `
  }

  async find(id: number) {
    let [cliente] = await sql`select id from clientes where id = ${id}`

    if (!cliente) {
      return false
    }

    return true
  }

  async loadExtrato(id: number) {
    return sql`
      select
        c.limite,
        c.saldo,
        (select json_agg(f.*) from (
          select 
              t.valor,
              t.descricao,
              t.tipo,
              t.realizada_em
            from transacoes t
            where t.id_cliente = c.id
            order by t.realizada_em desc limit 10
          ) as f
        ) as extrato
      from clientes c where c.id = ${id}
    `
  }
}
