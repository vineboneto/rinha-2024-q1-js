import Fastify from 'fastify'
import sql from './db.js'

const app = Fastify()

class ClienteService {
  /**
   *
   * @param {number} id
   * @returns {Promise<boolean>}
   */

  #map = new Map()

  constructor() {}

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
}

const cliente = new ClienteService()

app.get('/', (req, reply) => {
  return reply.send('Hello World')
})

app.post('/clientes/:id/transacoes', async (req, reply) => {
  const response = (status, body = undefined) => reply.status(status).send(body)

  const input = { ...req.params, ...req.body }

  const id = Number(input?.id)
  const valor = Number(input?.valor)
  const descricao = input?.descricao
  const tipo = input?.tipo

  const isValid =
    Number.isInteger(id) &&
    Number.isInteger(valor) &&
    valor > 0 &&
    (tipo === 'c' || tipo === 'd') &&
    typeof descricao === 'string' &&
    descricao?.length >= 1 &&
    descricao?.length <= 10

  if (!isValid) return response(422)

  const exist = await cliente.find(id)

  if (!exist) return response(404)

  const valorIncrementado = tipo === 'd' ? -valor : valor

  const [result] = await sql`
    update clientes
    set saldo = saldo + ${valorIncrementado}
    where id = ${id} and (saldo + ${valorIncrementado}) * -1 <= limite
    returning saldo, limite
  `

  if (!result) return response(422)

  return sql`insert into transacoes ${sql({
    id_cliente: id,
    valor,
    descricao,
    tipo,
  })}`.then(() => {
    return reply.send({ saldo: result.saldo, limite: result.limite })
  })
})

app.get('/clientes/:id/extrato', async (req, reply) => {
  const response = (status, body = undefined) => reply.status(status).send(body)

  const id = Number(req.params?.id)

  if (!Number.isInteger(id)) return response(422)

  const exist = await cliente.find(id)

  if (!exist) return response(404)

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
  ]).then(([cliente, extrato]) => {
    if (!cliente) return response(404)

    const [{ saldo, limite }] = cliente

    return reply.send({
      saldo: {
        total: saldo,
        limite: limite,
        data_extrato: new Date(),
      },
      ultimas_transacoes: extrato,
    })
  })
})

export default app
