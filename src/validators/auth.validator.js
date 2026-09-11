const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(254),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  document: z.string().trim().max(20).optional().or(z.literal('')),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').max(72),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(254),
  password: z.string().min(1, 'Informe sua senha.').max(72),
  returnTo: z.string().optional(),
})

function firstError(result) {
  return result.error?.issues?.[0]?.message || 'Revise os dados informados.'
}

module.exports = { registerSchema, loginSchema, firstError }
