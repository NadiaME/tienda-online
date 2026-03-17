import { inject } from 'vue'

export const useMenus = () => {
    const menus = inject<any[]>('menus', []) ?? []

    return { menus }
}