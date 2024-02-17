import postgres from 'postgres'

class ConnectionDB {
  static instance = null
  static sql = null

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

  /**
   * @returns {ConnectionDB}
   * */
  static self() {
    if (!ConnectionDB.instance) {
      ConnectionDB.instance = new ConnectionDB()
    }
    return ConnectionDB.instance
  }

  /**
   * @returns {import('postgres').Sql}
   * */
  sql() {
    if (!ConnectionDB.sql) throw new Error('ConnectionDB not initialized')
    return ConnectionDB.sql
  }
}

const sql = ConnectionDB.self().sql()

export default sql
