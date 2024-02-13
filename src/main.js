import { app } from './app.js'

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Server is running at pid: ${process.pid}, port: ${port}...`)
})

process.on('SIGTERM', () => {
  console.log('Process terminated')
  sql.end()
  server.close()
})
