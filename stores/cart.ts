import { defineStore } from 'pinia'

const STORAGE_KEY = 'tienda-cart'
export interface Product {
  id: number
  name: string
  price: number
  image: string
  slug?: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    open: false,
    hydrated: false // 👈 evita cargar dos veces
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
      // 👇 Solo en cliente (SSR safe)
      if (import.meta.client && !this.hydrated) {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          this.items = JSON.parse(data)
        }
        this.hydrated = true
      }
    },

    add(product: Product) {
      const existing = this.items.find(i => i.id === product.id)

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image, // ⭐ ahora SIEMPRE se guarda
          quantity: 1
        })
      }

      this.open = true
      this.persist()
    },

    remove(index: number) {
      this.items.splice(index, 1)
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
