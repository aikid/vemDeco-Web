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
      include: { listing: { select: { title: true, slug: true } } },
    })
  })
}

function findBuyerPaymentProfile(buyerId) {
  return getPrisma().user.findUnique({
    where: { id: buyerId },
    select: { id: true, name: true, email: true, document: true },
  })
}

function attachPayment(orderId, buyerId, payment) {
  return getPrisma().checkoutOrder.update({
    where: { id: orderId, buyerId, status: 'PENDING_PAYMENT' },
    data: {
      paymentProvider: 'ASAAS',
      paymentMethod: payment.billingType,
      paymentStatus: payment.status,
      paymentExternalId: payment.id,
      paymentUrl: payment.invoiceUrl,
      paymentDueDate: payment.dueDate ? new Date(`${payment.dueDate}T12:00:00.000Z`) : null,
    },
  })
}

async function cancelOrderAndRestoreStock(orderId, buyerId) {
  return getPrisma().$transaction(async (transaction) => {
    const order = await transaction.checkoutOrder.findFirst({
      where: { id: orderId, buyerId, status: 'PENDING_PAYMENT' },
      select: { id: true, listingId: true, quantity: true },
    })
    if (!order) return false

    await transaction.checkoutOrder.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    })
    await transaction.productDetails.update({
      where: { listingId: order.listingId },
      data: { stock: { increment: order.quantity } },
    })
    return true
  })
}

async function findBuyerOrder(id, buyerId) {
  const order = await getPrisma().checkoutOrder.findFirst({
    where: { id, buyerId },
    include: {
      listing: {
        select: {
          title: true,
          slug: true,
          images: {
            orderBy: { position: 'asc' },
            take: 1,
            select: { id: true, publicUrl: true },
          },
        },
      },
    },
  })

  if (!order) return null

  return {
    ...order,
    imageUrl: order.listing.images[0]
      ? order.listing.images[0].publicUrl || `/media/anuncios/${order.listing.images[0].id}`
      : null,
  }
}

async function findBuyerOrders(buyerId) {
  const orderList = await getPrisma().checkoutOrder.findMany({
    where: {
      buyerId,
      NOT: { status: 'CANCELLED', paymentExternalId: null },
    },
    include: {
      listing: {
        select: {
          title: true,
          slug: true,
          images: {
            orderBy: { position: 'asc' },
            take: 1,
            select: { id: true, publicUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return orderList.map((order) => ({
    ...order,
    imageUrl: order.listing.images[0]
      ? order.listing.images[0].publicUrl || `/media/anuncios/${order.listing.images[0].id}`
      : null,
  }))
}

function mappedCheckoutStatus(eventType, paymentStatus) {
  if (['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'].includes(eventType) || ['CONFIRMED', 'RECEIVED'].includes(paymentStatus)) {
    return 'CONFIRMED'
  }
  if (
    ['PAYMENT_DELETED', 'PAYMENT_REFUNDED', 'PAYMENT_CHARGEBACK_REQUESTED', 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'].includes(eventType)
    || ['REFUNDED', 'DELETED', 'CHARGEBACK_REQUESTED'].includes(paymentStatus)
  ) {
    return 'CANCELLED'
  }
  return null
}

async function applyPaymentUpdate({ eventId = null, eventType = 'PAYMENT_SYNCED', payment, payload = null }) {
  return getPrisma().$transaction(async (transaction) => {
    if (eventId) {
      const inserted = await transaction.paymentWebhookEvent.createMany({
        data: [{
          id: eventId,
          provider: 'ASAAS',
          eventType,
          paymentId: payment.id || null,
          payload: payload || { event: eventType, payment },
        }],
        skipDuplicates: true,
      })
      if (inserted.count === 0) return { duplicate: true, found: true }
    }

    const order = await transaction.checkoutOrder.findUnique({
      where: { paymentExternalId: payment.id },
      select: { id: true, listingId: true, quantity: true, status: true },
    })
    if (!order) return { duplicate: false, found: false }

    const nextStatus = mappedCheckoutStatus(eventType, payment.status)
    const shouldRestoreStock = nextStatus === 'CANCELLED' && order.status !== 'CANCELLED'
    const data = { paymentStatus: payment.status || eventType.replace(/^PAYMENT_/, '') }

    if (nextStatus === 'CONFIRMED' && order.status === 'PENDING_PAYMENT') {
      data.status = 'CONFIRMED'
      data.paymentConfirmedAt = new Date()
    } else if (nextStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
      data.status = 'CANCELLED'
    }

    await transaction.checkoutOrder.update({ where: { id: order.id }, data })
    if (shouldRestoreStock) {
      await transaction.productDetails.update({
        where: { listingId: order.listingId },
        data: { stock: { increment: order.quantity } },
      })
    }

    return { duplicate: false, found: true, status: data.status || order.status }
  })
}

module.exports = {
  createOrder,
  findBuyerPaymentProfile,
  attachPayment,
  cancelOrderAndRestoreStock,
  findBuyerOrder,
  findBuyerOrders,
  applyPaymentUpdate,
}
