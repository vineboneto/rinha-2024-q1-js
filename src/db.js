import postgres from 'postgres'

export default postgres({
  port: 7999,
  database: 'rinha',
  pass: '1234',
  user: 'postgres',
})
