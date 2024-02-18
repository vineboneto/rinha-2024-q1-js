import sql from './db.js'

export class ClienteRepository {
  #map = null

  constructor(map) {
    this.#map = map
  }

  async createTransacao({ id, valor, descricao, tipo }) {
    return sql`insert into transacoes ${sql({
      id_cliente: id,
      valor,
      descricao,
      tipo,
    })}`
  }

  async updateSaldo({ valorIncrementado, id }) {
    return sql`
      update clientes
      set saldo = saldo + ${valorIncrementado}
      where id = ${id} and (saldo + ${valorIncrementado}) * -1 <= limite
      returning saldo, limite
    `
  }

  /**
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async find(id) {
    const is404 = this.#map.get(id)

    if (is404 === true) {
      return false
    }

    if (is404 === undefined) {
      let [cliente] = await sql`select id from clientes where id = ${id}`

      if (!cliente) {
        this.#map.set(id, true)
        return false
      }

      this.#map.set(id, false)
    }

    return true
  }

  async loadExtrato(id) {
    return Promise.all([
      sql`
        select limite, saldo from clientes where id = ${id} 
      `,
      sql`
        select 
          t.valor,
          t.descricao,
          t.tipo,
          t.realizada_em
        from transacoes t
        where t.id_cliente = ${id}
        order by t.realizada_em desc limit 10
      `,
    ])
  }
}