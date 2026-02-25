import { supabase } from '@/utils/supabase'

const storeId = useRuntimeConfig().public.storeId

export const useOrders = () => {
    const createOrder = async ({
        name,
        email,
        phone,
        cartItems,
        status = 'pending'
    }: {
        name: string
        email: string
        phone: string
        cartItems: Array<{ price: number; quantity: number }>
        status?: string
    }) => {
        const total = cartItems.reduce((sum, item) => {
            const price = Number(item.price) || 0
            const quantity = Number(item.quantity) || 1
            return sum + price * quantity
        }, 0)

        if (!total || total <= 0) {
            console.error('Total inválido', cartItems)
            return { success: false }
        }

        const { error } = await supabase
            .from('orders')
            .insert([
                {
                    store_id: storeId,
                    customer_name: name || null,
                    customer_email: email || null,
                    customer_phone: phone || null,
                    items: cartItems,
                    total,
                    status
                }
            ])

        if (error) {
            console.error(error)
            return { success: false }
        }

        return { success: true }
    }

    return { createOrder }
}
