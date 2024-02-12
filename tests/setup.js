import supertest from 'supertest'
import { app } from '../src/app.js'

export function request() {
  return supertest(app)
}
