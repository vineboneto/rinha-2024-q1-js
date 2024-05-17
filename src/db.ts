import postgres from 'postgres'

class ConnectionDB {
  static instance: ConnectionDB | null = null
  static sql: postgres.Sql | null = null

  constructor() {
    ConnectionDB.sql = postgres({
      port: 5432,
      database: 'rinha',
      password: '1234',
      username: 'postgres',
      max: 4,
      host: process.env.DB_HOSTNAME || 'localhost',
    })
  }

  static self() {
    if (!ConnectionDB.instance) {
      ConnectionDB.instance = new ConnectionDB()
    }
    return ConnectionDB.instance
  }

  sql() {
    if (!ConnectionDB.sql) throw new Error('ConnectionDB not initialized')
    return ConnectionDB.sql
  }
}

const sql = ConnectionDB.self().sql()

export default sql
