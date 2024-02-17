import supertest from 'supertest'
import { request, sql } from './setup.js'

describe('Cliente Transação', () => {
  afterAll(async () => {
    await Promise.all([sql.end(), request.close()])
  })

  beforeAll(async () => {
    await request.ready()
  })

  describe('(422) POST /clientes/:id/transacoes', () => {
    it('deve retornar 422 se o id eh invalido', async () => {
      await request
        .exec()
        .post('/clientes/a/transacoes')
        .send({
          valor: 100,
          descricao: 'Teste',
          tipo: 'c',
        })
        .expect(422)
    })

    it('deve retornar 422 se o valor eh invalido', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 'aaa',
          descricao: 'Teste',
          tipo: 'c',
        })
        .expect(422)
    })

    it('deve retornar 422 se a descricao possui menos de 1 char', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          descricao: '',
          tipo: 'c',
        })
        .expect(422)
    })

    it('deve retornar 422 se a descricao possui mais de 10 char', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          descricao: '12345678910',
          tipo: 'c',
        })
        .expect(422)
    })

    it('deve retornar 422 se o tipo eh diferente de c ou d', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          descricao: '12345678910',
          tipo: 'e',
        })
        .expect(422)
    })

    it('deve retornar 422 se valor nao foi informado', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          descricao: '12345678910',
          tipo: 'e',
        })
        .expect(422)
    })

    it('deve retornar 422 se descricao nao foi informado', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          tipo: 'e',
        })
        .expect(422)
    })

    it('deve retornar 422 se o tipo nao foi informado', async () => {
      await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          descricao: 'Teste',
        })
        .expect(422)
    })
  })

  describe('(404) POST /clientes/:id/transacoes', () => {
    it('deve retornar 404 se o cliente nao foi encontrado', async () => {
      const { status } = await request
        .exec()
        .post('/clientes/999/transacoes')
        .send({
          valor: 100,
          descricao: 'Teste',
          tipo: 'c',
        })

      expect(status).toBe(404)
    })
  })

  describe('(422) POST /clientes/:id/transacoes', () => {
    it('deve retonrar 422 se o saldo exceder o limite /1', async () => {
      const { status } = await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 1000001,
          descricao: 'Teste',
          tipo: 'd',
        })
      expect(status).toBe(422)
    })
  })

  describe('(200) POST /clientes/:id/transacoes', () => {
    beforeEach(async () => {
      await sql`delete from transacoes`
      await sql`update clientes set saldo = 0`
    })

    afterAll(async () => {
      await sql`delete from transacoes`
      await sql`update clientes set saldo = 0`
    })

    it('deve retornar 200 se a transacao foi criada do tipo credito', async () => {
      const { status, body } = await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          descricao: 'Teste',
          tipo: 'c',
        })

      const [result] =
        await sql`select sum(case when tipo = 'c' then valor else -valor end) as saldo from transacoes where id_cliente = 1`

      expect(Number(result.saldo)).toEqual(100)
      expect(status).toBe(200)
      expect(body).toEqual({ limite: 100000, saldo: 100 })
    })

    it('deve retornar 200 se a transacao foi criada do tipo debito', async () => {
      const { status, body } = await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 100,
          descricao: 'Teste',
          tipo: 'd',
        })

      const [result] =
        await sql`select sum(case when tipo = 'c' then valor else -valor end) as saldo from transacoes where id_cliente = 1`

      expect(Number(result.saldo)).toEqual(-100)
      expect(status).toBe(200)
      expect(body).toEqual({ limite: 100000, saldo: -100 })
    })

    it('deve retonrar 422 se o saldo exceder o limite na terceira request', async () => {
      const { status: status1, body: body1 } = await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 50000,
          descricao: 'Teste',
          tipo: 'd',
        })
      const { status: status2, body: body2 } = await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 50000,
          descricao: 'Teste',
          tipo: 'd',
        })
      const { status: status3 } = await request
        .exec()
        .post('/clientes/1/transacoes')
        .send({
          valor: 1,
          descricao: 'Teste',
          tipo: 'd',
        })

      expect(status1).toBe(200)
      expect(body1).toEqual({ limite: 100000, saldo: -50000 })
      expect(status2).toBe(200)
      expect(body2).toEqual({ limite: 100000, saldo: -100000 })
      expect(status3).toBe(422)
    })
  })
})
