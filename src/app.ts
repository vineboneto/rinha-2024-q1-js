import Fastify from 'fastify'

const app = Fastify()

app.get('/', (req, reply) => reply.send('Hello World'))

app.post('/clientes/:id/transacoes', async (req, reply) => {
  const { buildClienteController } = await import('./build.js')
  return buildClienteController().createTransacao(req, reply)
})

app.get('/clientes/:id/extrato', async (req, reply) => {
  const { buildClienteController } = await import('./build.js')
  return buildClienteController().loadExtrato(req, reply)
})

export default app
