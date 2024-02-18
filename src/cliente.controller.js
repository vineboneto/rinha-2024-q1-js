export class ClienteController {
  /**
   * @param {import('./cliente.repo').ClienteRepository} repo
   **/
  #repo

  /**
   * @param {import('./cliente.repo').ClienteRepository} repo
   **/
  constructor(repo) {
    this.#repo = repo
  }

  /**
   * @param {import('fastify').FastifyRequest} req
   * @param {import('fastify').FastifyReply} reply
   * @returns {Promise<import('fastify').FastifyReply>}
   **/
  async createTransacao(req, reply) {
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

    if (!isValid) return reply.status(422).send()

    const exist = await this.#repo.find(id)

    if (!exist) return reply.status(404).send()

    const valorIncrementado = tipo === 'd' ? -valor : valor

    const [result] = await this.#repo.updateSaldo({ valorIncrementado, id })

    if (!result) return reply.status(422).send()

    return this.#repo
      .createTransacao({ id, descricao, tipo, valor })
      .then(() => reply.send({ saldo: result.saldo, limite: result.limite }))
  }

  /**
   * @param {import('fastify').FastifyRequest} req
   * @param {import('fastify').FastifyReply} reply
   * @returns {Promise<import('fastify').FastifyReply>}
   **/
  async loadExtrato(req, reply) {
    const id = Number(req.params?.id)

    if (!Number.isInteger(id)) return reply.status(422).send()

    const exist = await this.#repo.find(id)

    if (!exist) return reply.status(404).send()

    return this.#repo.loadExtrato(id).then(([result]) => {
      if (!result) return reply.status(404).send()

      const { saldo, limite, extrato } = result

      const output = {
        saldo: {
          total: saldo,
          limite: limite,
          data_extrato: new Date(),
        },
        ultimas_transacoes: extrato || [],
      }

      return reply.send(output)
    })
  }
}
