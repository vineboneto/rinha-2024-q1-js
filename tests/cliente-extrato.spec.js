import { request, sql, fakeTransacoes } from './setup.js'

describe('Cliente Extrato', () => {
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

  describe('(200) GET /clientes/:id/extrato', () => {
    beforeEach(async () => {
      await sql`delete from transacoes`
    })

    afterAll(async () => {
      await sql`delete from transacoes`
    })

    it('deve retornar 200 com o extrato do cliente', async () => {
      await sql`insert into transacoes ${sql(fakeTransacoes)}`

      const { status, body } = await request().get('/clientes/1/extrato')

      const total = fakeTransacoes.reduce((acc, t) => {
        if (t.tipo === 'c') return acc + t.valor
        return acc - t.valor
      }, 0)

      expect(body).toEqual({
        saldo: {
          total,
          limite: 100000,
          data_extrato: expect.any(String),
        },
        ultimas_transacoes: fakeTransacoes.slice(0, 10).map((t, i) => {
          const { id_cliente, id, ...rest } = t
          return {
            ...rest,
            realizada_em: body.ultimas_transacoes[i].realizada_em,
          }
        }),
      })
      expect(body.ultimas_transacoes.length).toBe(10)
      expect(status).toBe(200)
    })
  })
})
