const { PrismaClient } = require('@prisma/client')
const { databaseUrl, env } = require('../config/env')

const globalDatabase = globalThis

const prisma = globalDatabase.__vemdecoPrisma || new PrismaClient({
  log: env === 'development' ? ['warn', 'error'] : ['error'],
})

if (env !== 'production') globalDatabase.__vemdecoPrisma = prisma

module.exports = {
  prisma,
  isDatabaseConfigured: Boolean(databaseUrl),
}
