import app from './app.js'
import sql from './db.js'

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`Server is running at pid: ${process.pid}, port: ${port}...`)
})

function gracefulShutdown() {
  console.log('Received kill signal, shutting down gracefully...')
  sql.end()
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    process.exit(0)
  })
}

process.on('SIGTERM', gracefulShutdown)

process.on('SIGINT', gracefulShutdown)
