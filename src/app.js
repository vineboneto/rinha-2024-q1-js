import Fastify from 'fastify'
import { ClienteRepository } from './cliente.repo.js'
import { ClienteController } from './cliente.controller.js'

const app = Fastify()
const repo = new ClienteRepository()
const controller = new ClienteController(repo)

app.get('/', (req, reply) => {
  return reply.send('Hello World')
})

app.post('/clientes/:id/transacoes', (req, reply) =>
  controller.createTransacao(req, reply)
)

app.get('/clientes/:id/extrato', (req, reply) =>
  controller.loadExtrato(req, reply)
)

export default app
