import express from 'express'
import sql from './db.js'
import * as clienteRepo from './cliente.db.js'

const app = express()

app.use(express.json())

const safe = (fn) => async (req, res) => {
  try {
    return fn(req, res)
  } catch (err) {
    return res.status(500).json()
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

    const id = parseInt(input?.id?.trim())
    const valor = parseInt(input?.valor)
    const descricao = input.descricao?.trim()
    const tipo = input.tipo?.trim()

    const isValid =
      !isNaN(valor) &&
      valor > 0 &&
      !!tipo &&
      (tipo === 'c' || tipo === 'd') &&
      !!descricao &&
      descricao?.length <= 10

    if (!isValid) return response(400)

    const cliente = await clienteRepo.loadCliente(id, sql)

    if (!cliente) return response(404)

    const isDebito = tipo === 'd'

    const valorIncrementado = isDebito ? -valor : valor

    const [result] = await sql`
        update clientes
        set saldo = saldo + ${valorIncrementado}
        where 
        id = ${id} and saldo + ${valorIncrementado * -1} <= limite
        returning saldo
    `

    if (!result) return response(422)

    await sql`insert into transacoes ${sql({
      id_cliente: id,
      valor,
      descricao,
      tipo,
    })}`

    return response(200, { limite: cliente.limite, saldo: result.saldo })
  })
)

app.get(
  '/clientes/:id/extrato',
  safe(async (req, res) => {
    const response = (status, body = undefined) => res.status(status).json(body)

    const id = parseInt(req.params?.id?.trim())

    if (isNaN(id)) return response(400)

    const [extrato, cliente] = await Promise.all([
      clienteRepo.loadExtrato(id, sql),
      clienteRepo.loadCliente(id, sql),
    ])

    if (!cliente) {
      return response(404)
    }

    return response(200, {
      saldo: {
        total: cliente.saldo,
        limite: cliente.limite,
        data_extrato: new Date(),
      },
      ultimas_transacoes: extrato,
    })
  })
)

export default app
