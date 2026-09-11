const path = require('node:path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const parsedPort = Number.parseInt(process.env.PORT || '3000', 10)

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error('PORT deve ser um número inteiro entre 1 e 65535.')
}

const nodeEnv = process.env.NODE_ENV || 'development'
const databaseUrl = process.env.DATABASE_URL || ''
const demoMode = nodeEnv !== 'production' && (
  process.env.DEMO_MODE === 'true' || (process.env.DEMO_MODE === undefined && !databaseUrl)
)

if (nodeEnv === 'production' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL é obrigatória em produção.')
}

if (nodeEnv === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error('SESSION_SECRET deve ter pelo menos 32 caracteres em produção.')
}

module.exports = Object.freeze({
  env: nodeEnv,
  host: process.env.HOST || '0.0.0.0',
  port: parsedPort,
  databaseUrl,
  sessionSecret: process.env.SESSION_SECRET || 'apenas-desenvolvimento-troque-esta-chave',
  isProduction: nodeEnv === 'production',
  demoMode,
})
