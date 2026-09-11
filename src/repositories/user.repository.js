const { prisma } = require('../database/prisma')

function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}

function create(data) {
  return prisma.user.create({
    data,
    select: { id: true, name: true, email: true, role: true },
  })
}

module.exports = { findByEmail, create }
