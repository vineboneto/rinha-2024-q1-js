import { request, sql, fakeTransacoes } from './setup.js'

describe('Cliente Extrato', () => {
  afterAll(() => {
    sql.end()
  })

  describe('(400) GET /clientes/:id/extrato', () => {
    it('deve retornar 400 se o id eh invalido', async () => {
      const { status } = await request().get('/clientes/a/extrato')

      expect(status).toBe(400)
    })
  })

  describe('(404) GET /clientes/:id/extrato', () => {
    it('deve retornar 404 se o cliente nao foi encontrado', async () => {
      const { status } = await request().get('/clientes/999/extrato')

      expect(status).toBe(404)
    })
  })

  describe.only('(200) GET /clientes/:id/extrato', () => {
    beforeEach(async () => {
      await sql`delete from transacoes`
      await sql`update clientes set saldo = 0`
    })

    afterAll(async () => {
      await sql`delete from transacoes`
      await sql`update clientes set saldo = 0`
    })

    it.only(
      'deve retornar 200 com o extrato do cliente',
      async () => {
        const promises = fakeTransacoes.map((t) => {
          return request().post('/clientes/1/transacoes').send(t)
        })

        await Promise.all(promises)

        const { status, body } = await request().get('/clientes/1/extrato')

        const total = fakeTransacoes.reduce((acc, t) => {
          return t.tipo === 'c' ? acc + t.valor : acc - t.valor
        }, 0)

        expect(body.saldo.total).toEqual(600)
        expect(body.ultimas_transacoes.length).toBe(10)
        expect(status).toBe(200)
      },
      1000 * 20
    )
  })
})
