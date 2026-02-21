import { defineStore } from 'pinia'

const STORAGE_KEY = 'tienda-cart'

/* =========================
   TIPOS
========================= */

export interface Product {
  id: number
  name: string
  price: number
  images?: string[]
  image?: string
  slug?: string
  stock_online?: number
  quantity?: number
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

/* =========================
   STORE
========================= */

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    open: false,
    hydrated: false
  }),

  /* =========================
     GETTERS
  ========================= */

  getters: {
    totalItems: state =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: state =>
      state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
  },

  /* =========================
     ACTIONS
  ========================= */

  actions: {

    /* --- INIT (SSR SAFE) --- */

    init() {
      if (!import.meta.client || this.hydrated) return

      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        this.items = JSON.parse(data)
      }

      this.hydrated = true
    },

    /* --- ADD PRODUCT --- */

    add(product: Product) {
      const qtyToAdd = product.quantity ?? 1
      const maxStock = product.stock_online ?? Infinity

      const existing = this.items.find(i => i.id === product.id)

      if (existing) {
        const newQty = Math.min(
          existing.quantity + qtyToAdd,
          maxStock
        )
        existing.quantity = newQty
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image:
            product.images?.[0] ||
            product.image ||
            '',
          quantity: Math.min(qtyToAdd, maxStock)
        })
      }

      this.open = true
      this.persist()
    },

    /* --- REMOVE --- */

    remove(index: number) {
      this.items.splice(index, 1)
      this.persist()
    },

    /* --- CLEAR --- */

    clearCart() {
      this.items = []
      this.persist()
    },

    /* --- TOGGLE DRAWER --- */

    toggle() {
      this.open = !this.open
    },

    /* --- PERSISTENCIA --- */

    persist() {
      if (!import.meta.client) return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this.items)
      )
    }
  }
})