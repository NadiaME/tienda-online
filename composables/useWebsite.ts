import { inject } from 'vue'

export const useWebsite = () => {
    const settings = inject<any>('settings', {}) ?? {}

    return {
        settings
    }
}