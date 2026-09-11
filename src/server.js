const { host, port } = require('./config/env')
const app = require('./app')

const server = app.listen(port, host, () => {
  console.log(`vemDeco disponível em http://${host}:${port}`)
})

function shutdown(signal) {
  console.log(`${signal} recebido. Encerrando servidor...`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

module.exports = server
