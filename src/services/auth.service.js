const bcrypt = require('bcryptjs')
const AppError = require('../errors/app-error')
const users = require('../repositories/user.repository')
const { isDatabaseConfigured } = require('../database/prisma')
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('invalid-password-placeholder', 12)

function ensureDatabase() {
  if (!isDatabaseConfigured) {
    throw new AppError('O banco de dados ainda não foi configurado neste ambiente.', 503, 'DATABASE_UNAVAILABLE')
  }
}

async function register(input) {
  ensureDatabase()
  const existing = await users.findByEmail(input.email)
  if (existing) throw new AppError('Já existe uma conta com este e-mail.', 409, 'EMAIL_IN_USE')

  const passwordHash = await bcrypt.hash(input.password, 12)
  return users.create({
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    document: input.document ? input.document.replace(/\D/g, '') : null,
    passwordHash,
  })
}

async function authenticate(input) {
  ensureDatabase()
  const user = await users.findByEmail(input.email)
  const validPassword = await bcrypt.compare(input.password, user?.passwordHash || DUMMY_PASSWORD_HASH)

  if (!validPassword || !user.isActive) {
    throw new AppError('E-mail ou senha inválidos.', 401, 'INVALID_CREDENTIALS')
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

module.exports = { register, authenticate }
