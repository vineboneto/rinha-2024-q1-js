import { ClienteController } from './cliente.controller'
import { ClienteRepository } from './cliente.repo'

export function buildClienteController(): ClienteController {
  const repo = new ClienteRepository()
  const controller = new ClienteController(repo)
  return controller
}
