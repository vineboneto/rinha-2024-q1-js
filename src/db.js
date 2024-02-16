import postgres from 'postgres'

class ConnectionDB {
  static instance = null
  #sql = null

  constructor() {
    this.#sql = postgres({
      port: 5432,
      database: 'rinha',
      password: '1234',
      username: 'postgres',
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
    if (!this.#sql) throw new Error('ConnectionDB not initialized')
    return this.#sql
  }
}

const sql = ConnectionDB.self().sql()

export default sql
