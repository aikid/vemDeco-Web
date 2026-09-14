const AppError = require('../errors/app-error')
const { getPrisma } = require('../database/prisma')

async function createOrder(buyerId, listingId, input) {
  return getPrisma().$transaction(async (transaction) => {
    const listing = await transaction.listing.findFirst({
      where: { id: listingId, kind: 'PRODUCT', status: 'PUBLISHED', deletedAt: null },
      include: { product: true },
    })

    if (!listing || !listing.product || listing.price == null) {
      throw new AppError('Este produto não está disponível para checkout.', 404, 'PRODUCT_UNAVAILABLE')
    }
    if (listing.ownerId === buyerId) {
      throw new AppError('Você não pode comprar o próprio produto.', 403, 'OWN_PRODUCT')
    }

    const reserved = await transaction.productDetails.updateMany({
      where: { listingId, stock: { gte: input.quantity } },
      data: { stock: { decrement: input.quantity } },
    })
    if (reserved.count !== 1) {
      throw new AppError('A quantidade solicitada não está disponível.', 409, 'INSUFFICIENT_STOCK')
    }

    return transaction.checkoutOrder.create({
      data: {
        listingId,
        buyerId,
        quantity: input.quantity,
        unitPrice: listing.price,
        total: listing.price.mul(input.quantity),
        recipientName: input.recipientName,
        phone: input.phone,
        addressLine: input.addressLine,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
      },
    })
  })
}

function findBuyerOrder(id, buyerId) {
  return getPrisma().checkoutOrder.findFirst({
    where: { id, buyerId },
    include: { listing: { select: { title: true, slug: true } } },
  })
}

module.exports = { createOrder, findBuyerOrder }
