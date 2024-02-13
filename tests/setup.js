import supertest from 'supertest'
import { uuidv7 } from 'uuidv7'
import postgres from 'postgres'
import { app } from '../src/app.js'

export function request() {
  return supertest(app)
}

export const sql = postgres({
  port: 5432,
  database: 'rinha',
  pass: '1234',
  user: 'postgres',
  host: process.env.DB_HOSTNAME || 'localhost',
})

export const fakeTransacoes = [
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 100,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 200,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 300,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 400,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 500,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 600,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 700,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 800,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 900,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 1000,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 1100,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    id: uuidv7(),
    id_cliente: 1,
    valor: 1200,
    descricao: 'fake',
    tipo: 'c',
  },
]
