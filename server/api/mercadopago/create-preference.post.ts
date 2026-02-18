import { MercadoPagoConfig, Preference } from 'mercadopago'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Items inválidos'
    })
  }

  const client = new MercadoPagoConfig({
    accessToken: config.mpAccessToken
  })

  const preference = new Preference(client)

  const items = body.items.map((item: any) => ({
    title: item.name,
    quantity: Number(item.quantity) || 1,
    unit_price: Number(item.price),
    currency_id: 'UYU'
  }))

  const response = await preference.create({
    body: {
      items,
      back_urls: {
        success: config.mpSuccessUrl,
        failure: config.mpFailureUrl,
        pending: config.mpPendingUrl
      },
      auto_return: 'approved'
    }
  })

  return {
    init_point: response.init_point
  }
})
