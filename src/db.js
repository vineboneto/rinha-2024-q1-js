import postgres from 'postgres'

class ConnectionDB {
  static instance = null
  #sql = null

  constructor() {
    this.#sql = postgres({
      port: 5432,
      database: 'rinha',
      pass: '1234',
      user: 'postgres',
      host: process.env.DB_HOSTNAME || 'localhost',
    })
  }

  /**
   * @returns {ConnectionDB}
   * */
  static self() {
    if (!ConnectionDB.instance) {
      this.instance = new ConnectionDB()
    }
    return this.instance
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
