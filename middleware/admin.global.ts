export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  if (to.path !== '/admin') return

  const config = useRuntimeConfig()
  const access = useCookie('admin_access')

  if (access.value !== config.public.adminPassword) {
    const password = window.prompt('Clave de acceso al admin:')

    if (password === config.public.adminPassword) {
      access.value = password
    } else {
      return navigateTo('/')
    }
  }
})
