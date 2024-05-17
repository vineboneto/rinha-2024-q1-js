import app from './app'
import sql from './db'

const port = Number(process.env.PORT) || 3000

app.listen({
  host: '0.0.0.0',
  port,
  listenTextResolver: (address) => {
    console.log(
      `Server is running at pid: ${process.pid}, address: ${address}...`
    )
    return address
  },
})

function gracefulShutdown() {
  console.log('Received kill signal, shutting down gracefully...')
  sql.end()
  app.close(() => {
    process.exit(0)
  })
}

process.on('SIGTERM', gracefulShutdown)

process.on('SIGINT', gracefulShutdown)
