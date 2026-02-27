import { defineStore } from 'pinia'

const STORAGE_KEY = 'tienda-cart'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
  slug?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    open: false,
    hydrated: false
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
  },

  actions: {
    init() {
      if (import.meta.client && !this.hydrated) {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          this.items = JSON.parse(data)
        }
        this.hydrated = true
      }
    },

    add(product: Product, quantity: number = 1) {
      const existing = this.items.find(i => i.id === product.id)

      if (existing) {
        const newQty = existing.quantity + quantity

        existing.quantity = Math.min(newQty, existing.stock)
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock)
        })
      }

      this.open = true
      this.persist()
    },

    increase(id: string) {
      const item = this.items.find(i => i.id === id)
      if (!item) return

      if (item.quantity < item.stock) {
        item.quantity++
        this.persist()
      }
    },

    decrease(id: string) {
      const item = this.items.find(i => i.id === id)
      if (!item) return

      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.removeById(id)
      }

      this.persist()
    },

    removeById(id: string) {
      this.items = this.items.filter(i => i.id !== id)
      this.persist()
    },

    clearCart() {
      this.items = []
      this.persist()
    },

    toggle() {
      this.open = !this.open
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      }
    }
  }
})