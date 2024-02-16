import express from 'express'
import sql from './db.js'
import * as clienteRepo from './cliente.db.js'

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

    const id = parseInt(input.id?.trim())
    const valor = input.valor
    const descricao = input.descricao?.trim()
    const tipo = input.tipo?.trim()

    const isValid =
      Number.isSafeInteger(valor) &&
      valor > 0 &&
      tipo?.length === 1 &&
      ['c', 'd'].includes(tipo) &&
      descricao?.length > 0 &&
      descricao?.length <= 10

    if (!isValid) return response(400)

    const output = sql.begin(async (tx) => {
      const cliente = await clienteRepo.loadCliente(id, tx)

      if (!cliente) return response(404)

      const { limite, saldo } = cliente

      const isDebito = tipo === 'd'

      const novoSaldo = saldo + (isDebito ? -valor : valor)

      if (isDebito && Math.abs(novoSaldo) > limite) return response(422)

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

    if (!Number.isSafeInteger(id)) return response(404)

    const extrato = await clienteRepo.loadExtrato(id, sql)

    if (!extrato || extrato.length === 0) return response(404)

    return response(200, {
      saldo: {
        total: extrato[0].saldo,
        limite: extrato[0].limite,
        data_extrato: new Date(),
      },
      ultimas_transacoes: extrato.map(({ saldo, limite, ...rest }) => ({
        ...rest,
      })),
    })
  })
)

export default app
