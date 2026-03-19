export type Product = {
  id: string
  name: string
  slug: string
  images: string[]
  stock_online: number
  description: string
  price: number
  category: {
    id: string
    name: string
  }
}