import express from 'express'
import { uuidv7 } from 'uuidv7'
import { sql } from './db.js'
import * as cliente from './cliente.db.js'

const app = express()
app.use(express.json())

const safe = (fn) => async (req, res) => {
  try {
    return fn(req, res)
  } catch (err) {
    return res.status(500).send()
  }
}

app.get(
  '/',
  safe((req, res) => {
    return res.json('Hello World')
  })
)

app.get(
  '/clientes/:id/extrato',
  safe(async (req, res) => {
    const response = (status, body = undefined) => res.status(status).json(body)

    const id = parseInt(req.params.id)

    if (isNaN(id)) return response(400)

    const [saldo, transacoes] = await Promise.all([
      cliente.loadSaldo(id, sql),
      cliente.loadExtrato(id, sql),
    ])

    if (!saldo) return response(404)

    return response(200, {
      saldo: {
        total: saldo.saldo,
        limite: saldo.limite,
        data_extrato: new Date(),
      },
      ultimas_transacoes: transacoes,
    })
  })
)

app.post(
  '/clientes/:id/transacoes',
  safe(async (req, res) => {
    const response = (status, body = undefined) => res.status(status).json(body)

    const input = { ...req.params, ...req.body }

    const id = parseInt(input.id)
    const valor = parseInt(input.valor)
    const descricao = input.descricao
    const tipo = input.tipo

    if (isNaN(id)) return response(400)
    if (isNaN(valor) || valor < 1) return response(400)
    if (!descricao || descricao.length < 1 || descricao.length > 10)
      return response(400)

    if (!['c', 'd'].includes(tipo)) return response(400)

    return sql.begin(async (tx) => {
      const result = await cliente.loadSaldo(id, tx)

      if (!result) return response(404)

      const { limite, saldo } = result

      const novoSaldo = saldo + (tipo === 'c' ? +valor : -valor)

      if (Math.abs(novoSaldo) > limite) return response(422)

      const novaTransacao = {
        id: uuidv7(),
        valor,
        descricao,
        tipo,
        id_cliente: id,
      }

      await cliente.createTransacao(novaTransacao, tx)

      const body = { limite, saldo: novoSaldo }

      return response(200, body)
    })
  })
)

export { app }
