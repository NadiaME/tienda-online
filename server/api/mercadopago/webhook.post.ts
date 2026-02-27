import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    // Solo procesamos notificaciones de pago
    if (!body?.data?.id) {
        return { received: true }
    }

    const paymentId = body.data.id

    try {
        // 🔎 1️⃣ Consultar estado real del pago en MercadoPago
        const mpResponse: any = await $fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${config.mpAccessToken}`
                }
            }
        )

        const orderId = mpResponse.external_reference
        if (!orderId) return { received: true }

        // 🔐 2️⃣ Cliente Supabase con SERVICE ROLE
        const supabase = createClient(
            config.public.supabaseUrl!,
            config.supabaseServiceKey!
        )

        // 🔎 3️⃣ Buscar la orden
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        if (!order) return { received: true }

        // 🧠 4️⃣ Determinar nuevo estado
        let newStatus = 'pending'

        switch (mpResponse.status) {
            case 'approved':
                newStatus = 'paid'
                break
            case 'rejected':
                newStatus = 'rejected'
                break
            case 'cancelled':
                newStatus = 'cancelled'
                break
            case 'in_process':
            case 'pending':
            default:
                newStatus = 'pending'
        }

        // 🟢 5️⃣ Si aprobado y aún no estaba paid → descontar stock
        if (newStatus === 'paid' && order.status !== 'paid') {
            for (const item of order.items) {
                await supabase.rpc('decrease_stock', {
                    product_id_input: item.id,
                    quantity_input: item.quantity
                })
            }
        }

        // 🔄 6️⃣ Actualizar orden
        await supabase
            .from('orders')
            .update({
                status: newStatus,
                mp_payment_id: paymentId
            })
            .eq('id', orderId)

        return { received: true }

    } catch (error) {
        console.error('Webhook error:', error)
        return { received: true } // MP necesita 200 siempre
    }
})