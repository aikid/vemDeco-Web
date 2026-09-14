const { z } = require('zod')

const optionalNumber = z.union([z.literal(''), z.coerce.number().nonnegative()]).optional()

const demoListingSchema = z.object({
  kind: z.enum(['PROPERTY', 'SERVICE', 'PRODUCT']),
  title: z.string().trim().min(5, 'Informe um título com pelo menos 5 caracteres.').max(140),
  description: z.string().trim().min(20, 'Descreva o anúncio com pelo menos 20 caracteres.').max(5000),
  price: z.union([z.literal(''), z.coerce.number().nonnegative('O preço não pode ser negativo.')]).optional(),
  priceType: z.enum(['FIXED', 'STARTING_AT', 'NEGOTIABLE', 'ON_REQUEST']),
  city: z.string().trim().min(2, 'Informe a cidade.').max(100),
  state: z.string().trim().toUpperCase().length(2, 'Use a sigla do estado com 2 letras.'),
  propertyType: z.string().trim().max(60).optional(),
  purpose: z.enum(['SALE', 'RENT']).optional(),
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  parkingSpaces: optionalNumber,
  area: optionalNumber,
  serviceType: z.string().trim().max(100).optional(),
  serviceArea: z.string().trim().max(180).optional(),
  productCondition: z.string().trim().max(30).optional(),
  stock: optionalNumber,
  deliveryDetails: z.string().trim().max(180).optional(),
}).superRefine((data, context) => {
  if (data.kind === 'PROPERTY' && (!data.propertyType || !data.purpose)) {
    context.addIssue({ code: 'custom', message: 'Informe o tipo e a finalidade do imóvel.' })
  }
  if (data.kind === 'SERVICE' && !data.serviceType) {
    context.addIssue({ code: 'custom', message: 'Informe o tipo de serviço.' })
  }
  if (data.kind === 'PRODUCT' && (!data.productCondition || data.stock == null || data.stock < 1)) {
    context.addIssue({ code: 'custom', message: 'Informe a condição e um estoque de pelo menos 1 unidade.' })
  }
  if (data.kind === 'PRODUCT' && (data.price == null || data.price === '')) {
    context.addIssue({ code: 'custom', message: 'Informe o preço do produto.' })
  }
})

module.exports = { demoListingSchema }
