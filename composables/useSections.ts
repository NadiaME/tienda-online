import { inject } from 'vue'

export const useSections = () => {
    const sections = inject<any[]>('sections', []) ?? []

    return {
        sections
    }
}