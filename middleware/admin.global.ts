import { useAdminAuth } from '~/composables/useAdminAuth'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  if (!to.path.startsWith('/admin')) return

  const { isAuthenticated, login } = useAdminAuth()

  if (!isAuthenticated.value) {
    const password = window.prompt('Clave de acceso al admin:')

    if (!password || !login(password)) {
      return navigateTo('/')
    }

    return navigateTo(to.fullPath, { replace: true })
  }
})