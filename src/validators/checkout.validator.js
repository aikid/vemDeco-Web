const { z } = require('zod')

function validCpfCnpj(value) {
  const digits = value.replace(/\D/g, '')
  if (![11, 14].includes(digits.length) || /^(\d)\1+$/.test(digits)) return false

  const calculateDigit = (base, weights) => {
    const sum = base.split('').reduce((total, digit, index) => total + Number(digit) * weights[index], 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  if (digits.length === 11) {
    const first = calculateDigit(digits.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2])
    const second = calculateDigit(`${digits.slice(0, 9)}${first}`, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
    return digits.endsWith(`${first}${second}`)
  }

  const first = calculateDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const second = calculateDigit(`${digits.slice(0, 12)}${first}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  return digits.endsWith(`${first}${second}`)
}

const checkoutSchema = z.object({
  quantity: z.coerce.number().int().min(1, 'Escolha pelo menos uma unidade.').max(20, 'O limite por pedido é de 20 unidades.'),
  recipientName: z.string().trim().min(2, 'Informe quem receberá o pedido.').max(120),
  phone: z.string().trim().min(8, 'Informe um telefone válido.').max(30),
  addressLine: z.string().trim().min(5, 'Informe o endereço de entrega.').max(180),
  city: z.string().trim().min(2, 'Informe a cidade.').max(100),
  state: z.string().trim().toUpperCase().length(2, 'Use a sigla do estado com 2 letras.'),
  postalCode: z.string().trim().min(8, 'Informe o CEP.').max(10),
  cpfCnpj: z.string().trim().max(20).refine(validCpfCnpj, 'Informe um CPF ou CNPJ válido.'),
  billingType: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD'], { message: 'Escolha Pix, boleto ou cartão de crédito.' }),
})

module.exports = { checkoutSchema, validCpfCnpj }
