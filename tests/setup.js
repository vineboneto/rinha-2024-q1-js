import supertest from 'supertest'
import postgres from 'postgres'
import { app } from '../src/app.js'
import sql from '../src/db.js'

export function request() {
  return supertest(app)
}

export { sql }

export const fakeTransacoes = [
  {
    valor: 100,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    valor: 200,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    valor: 300,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    valor: 400,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    valor: 500,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    valor: 600,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    valor: 700,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    valor: 800,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    valor: 900,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    valor: 1000,
    descricao: 'fake',
    tipo: 'c',
  },
  {
    valor: 1100,
    descricao: 'fake',
    tipo: 'd',
  },
  {
    valor: 1200,
    descricao: 'fake',
    tipo: 'c',
  },
]
