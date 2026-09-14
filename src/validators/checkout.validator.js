const { z } = require('zod')

const checkoutSchema = z.object({
  quantity: z.coerce.number().int().min(1, 'Escolha pelo menos uma unidade.').max(20, 'O limite por pedido é de 20 unidades.'),
  recipientName: z.string().trim().min(2, 'Informe quem receberá o pedido.').max(120),
  phone: z.string().trim().min(8, 'Informe um telefone válido.').max(30),
  addressLine: z.string().trim().min(5, 'Informe o endereço de entrega.').max(180),
  city: z.string().trim().min(2, 'Informe a cidade.').max(100),
  state: z.string().trim().toUpperCase().length(2, 'Use a sigla do estado com 2 letras.'),
  postalCode: z.string().trim().min(8, 'Informe o CEP.').max(10),
})

module.exports = { checkoutSchema }
