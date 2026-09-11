const path = require('node:path')
const crypto = require('node:crypto')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const parsedPort = Number.parseInt(process.env.PORT || '3000', 10)

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error('PORT deve ser um número inteiro entre 1 e 65535.')
}

const nodeEnv = process.env.NODE_ENV || 'development'
const databaseUrl = process.env.DATABASE_URL || ''
const demoModeRequested = process.env.DEMO_MODE === 'true'
const demoMode = demoModeRequested || (nodeEnv !== 'production' && process.env.DEMO_MODE === undefined && !databaseUrl)

if (nodeEnv === 'production' && !databaseUrl && !demoMode) {
  throw new Error('DATABASE_URL é obrigatória em produção. Para o bypass temporário, defina DEMO_MODE=true.')
}

if (nodeEnv === 'production' && !demoMode && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error('SESSION_SECRET deve ter pelo menos 32 caracteres em produção.')
}

const sessionSecret = process.env.SESSION_SECRET || (
  demoMode ? crypto.randomBytes(32).toString('hex') : 'apenas-desenvolvimento-troque-esta-chave'
)

module.exports = Object.freeze({
  env: nodeEnv,
  host: process.env.HOST || '0.0.0.0',
  port: parsedPort,
  databaseUrl,
  sessionSecret,
  isProduction: nodeEnv === 'production',
  demoMode,
})
