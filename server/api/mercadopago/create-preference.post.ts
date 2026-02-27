import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  console.log('ENV RAW:', process.env.MP_ACCESS_TOKEN)
  console.log('CONFIG:', config.mpAccessToken)
  console.log('BODY:', body)

  if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Items inválidos'
    })
  }

  // 🔐 Supabase con SERVICE ROLE
  const supabase = createClient(
    config.public.supabaseUrl!,
    config.supabaseServiceKey!
  )

  // 1️⃣ Crear orden
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      store_id: config.public.storeId,
      items: body.items,
      total: body.total ?? 0,
      status: 'pending'
    })
    .select()
    .single()

  if (error || !order) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Error creando orden' })
  }

  // 2️⃣ Crear preferencia vía API directa
  const response: any = await $fetch(
    'https://api.mercadopago.com/checkout/preferences',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.mpAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        items: body.items.map((item: any) => ({
          title: item.name,
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.price),
          currency_id: 'UYU'
        })),
        external_reference: order.id,
        back_urls: {
          success: `${config.mpSuccessUrl}?order_id=${order.id}`,
          failure: config.mpFailureUrl,
          pending: config.mpPendingUrl
        },
        auto_return: 'approved'
      }
    }
  )

  return {
    init_point: response.init_point
  }
})