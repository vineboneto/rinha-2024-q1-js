import express from 'express'
import { uuidv7 } from 'uuidv7'
import sql from './db.js'
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

    const output = await sql.begin(async (tx) => {
      const [limite, saldo] = await Promise.all([
        cliente.loadLimite(id, tx),
        cliente.loadSaldo(id, tx),
      ])

      if ([limite, saldo].includes(null)) return response(404)

      const novoSaldo = saldo + (tipo === 'c' ? -valor : valor)

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

    return output
  })
)

export { app }
