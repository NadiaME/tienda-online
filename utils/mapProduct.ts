import type { Product as CartProduct } from '@/stores/cart'
import type { Product as DbProduct } from '@/types/product'

export const mapToCartProduct = (p: DbProduct): CartProduct => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images?.[0] ?? '',
    stock: p.stock_online
})