import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        toast: {
            visible: false,
            message: '',
            image: '',
            quantity: 1
        }
    }),

    actions: {
        showToast(payload: {
            message: string
            image?: string
            quantity?: number
        }, duration = 3000) {
            this.toast.message = payload.message
            this.toast.image = payload.image || ''
            this.toast.quantity = payload.quantity || 1
            this.toast.visible = true

            setTimeout(() => {
                this.toast.visible = false
            }, duration)
        }
    }
})