const { getPrisma } = require('../database/prisma')

function findByEmail(email) {
  return getPrisma().user.findUnique({ where: { email } })
}

function create(data) {
  return getPrisma().user.create({
    data,
    select: { id: true, name: true, email: true, role: true },
  })
}

module.exports = { findByEmail, create }
