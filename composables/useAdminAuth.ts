export const useAdminAuth = () => {
  const config = useRuntimeConfig()

  const access = useCookie<string | null>('admin_access', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax'
  })

  const isAuthenticated = computed(() => {
    return access.value === config.public.adminPassword
  })

  const login = (password: string) => {
    if (password === config.public.adminPassword) {
      access.value = password
      return true
    }
    return false
  }

  const logout = () => {
    access.value = null
  }

  return {
    access,
    isAuthenticated,
    login,
    logout
  }
}