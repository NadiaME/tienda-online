import { defineStore } from 'pinia'

const STORAGE_KEY = 'tienda-cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
    open: false
  }),

  actions: {
    add(product: any) {
      this.items.push(product)
      this.persist()
    },

    remove(index: number) {
      this.items.splice(index, 1)
      this.persist()
    },

    toggle() {
      this.open = !this.open
    },

    clear() {
      this.items = []
      this.persist()
    },

    load() {
      if (import.meta.client) {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          this.items = JSON.parse(data)
        }
      }
    },

    persist() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      }
    }
  },

  getters: {
    totalItems: (state) => state.items.length,
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price, 0)
  }
})
