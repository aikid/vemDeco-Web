const { z } = require('zod')

const interestSchema = z.object({
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Escreva uma mensagem com pelo menos 10 caracteres.').max(2000),
})

module.exports = { interestSchema }
