import express from 'express'
import sql from './db.js'
import * as clienteRepo from './cliente.db.js'

class ValidationError extends Error {
  constructor(status = 400, message = undefined) {
    super(message)
    this.status = status
    this.name = 'ValidationError'
  }
}

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
      const cliente = await clienteRepo.loadCliente(id, tx, {
        forUpdate: true,
      })

      if (!cliente) return response(404)

      const { limite, saldo } = cliente

      const novoSaldo = saldo + (tipo === 'c' ? +valor : -valor)

      if (Math.abs(novoSaldo) > limite) return response(422)

      const novaTransacao = {
        valor,
        descricao,
        tipo,
        id_cliente: id,
      }

      await Promise.all([
        clienteRepo.updateSaldoCliente({ clienteId: id, saldo: novoSaldo }, tx),
        clienteRepo.createTransacao(novaTransacao, tx),
      ])

      return response(200, { limite, saldo: novoSaldo })
    })

    return output
  })
)

app.get(
  '/clientes/:id/extrato',
  safe(async (req, res) => {
    const response = (status, body = undefined) => res.status(status).json(body)

    const id = parseInt(req.params.id)

    if (isNaN(id)) return response(400)

    const [cliente, transacoes] = await Promise.all([
      clienteRepo.loadCliente(id, sql),
      clienteRepo.loadExtrato(id, sql),
    ])

    if (!cliente) return response(404)

    return response(200, {
      saldo: {
        total: cliente.saldo,
        limite: cliente.limite,
        data_extrato: new Date(),
      },
      ultimas_transacoes: transacoes,
    })
  })
)

export { app }
