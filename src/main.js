import { app } from './app.js'

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running at pid: ${process.pid}...`)
})

process.on('SIGTERM', () => {
  console.log('Process terminated')
  sql.end()
  server.close()
})
