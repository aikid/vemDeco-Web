const { databaseUrl, env } = require('../config/env')

const globalDatabase = globalThis
let prisma = globalDatabase.__vemdecoPrisma

function getPrisma() {
  if (!databaseUrl) {
    throw new Error('O banco de dados ainda não foi configurado neste ambiente.')
  }

  if (!prisma) {
    const { PrismaClient } = require('@prisma/client')

    prisma = new PrismaClient({
      log: env === 'development' ? ['warn', 'error'] : ['error'],
    })

    if (env !== 'production') globalDatabase.__vemdecoPrisma = prisma
  }

  return prisma
}

module.exports = {
  getPrisma,
  isDatabaseConfigured: Boolean(databaseUrl),
}
