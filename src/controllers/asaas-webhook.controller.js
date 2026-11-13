const crypto = require('node:crypto')
const { asaasWebhookToken } = require('../config/env')
const orders = require('../repositories/checkout.repository')

function tokenMatches(received) {
  if (!asaasWebhookToken || !received) return false
  const expectedBuffer = Buffer.from(asaasWebhookToken)
  const receivedBuffer = Buffer.from(String(received))
  return expectedBuffer.length === receivedBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

async function receive(req, res, next) {
  try {
    if (!asaasWebhookToken) return res.status(503).json({ error: 'webhook_not_configured' })
    if (!tokenMatches(req.get('asaas-access-token'))) return res.status(401).json({ error: 'invalid_token' })

    const { id, event, payment } = req.body || {}
    if (typeof id !== 'string' || typeof event !== 'string' || typeof payment?.id !== 'string') {
      return res.status(400).json({ error: 'invalid_payload' })
    }

    const result = await orders.applyPaymentUpdate({
      eventId: id,
      eventType: event,
      payment,
      payload: req.body,
    })
    res.status(200).json({ received: true, duplicate: result.duplicate })
  } catch (error) {
    next(error)
  }
}

module.exports = { receive }
