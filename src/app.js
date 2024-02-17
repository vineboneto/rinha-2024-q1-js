import express from 'express'
import sql from './db.js'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  return res.json('Hello World')
})

app.post('/clientes/:id/transacoes', async (req, res) => {
  const response = (status, body = undefined) => res.status(status).json(body)

  const input = { ...req.params, ...req.body }

  const id = Number(input?.id)
  const valor = Number(input?.valor)
  const descricao = input.descricao
  const tipo = input.tipo

  const isValid =
    Number.isInteger(id) &&
    Number.isInteger(valor) &&
    valor > 0 &&
    (tipo === 'c' || tipo === 'd') &&
    typeof descricao === 'string' &&
    descricao?.length >= 1 &&
    descricao?.length <= 10

  if (!isValid) return response(422)

  if (id > 5) return response(404)

  const valorIncrementado = tipo === 'd' ? -valor : valor

  const [result] = await sql`
      update clientes
      set saldo = saldo + ${valorIncrementado}
      where id = ${id} and (saldo + ${valorIncrementado}) * -1 <= limite
      returning saldo, limite
    `

  if (!result) return response(422)

  sql`insert into transacoes ${sql({
    id_cliente: id,
    valor,
    descricao,
    tipo,
  })}`.then(() => {
    res.json({ saldo: result.saldo, limite: result.limite })
    res.end()
  })
})

app.get('/clientes/:id/extrato', async (req, res) => {
  const response = (status, body = undefined) => res.status(status).json(body)

  const id = Number(req.params?.id)

  if (!Number.isInteger(id)) return response(422)

  if (id > 5) return response(404)

  Promise.all([
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
    const [{ saldo, limite }] = cliente

    res.json({
      saldo: {
        total: saldo,
        limite: limite,
        data_extrato: new Date(),
      },
      ultimas_transacoes: extrato,
    })
    res.end()
  })
})

export default app
