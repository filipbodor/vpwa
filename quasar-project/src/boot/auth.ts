import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/pinia-stores'

export default boot(async ({ router }) => {
  const authStore = useAuthStore()
  
  authStore.initializeFromStorage()
  
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchCurrentUser()
    } catch (error) {
      console.log('Token validation failed, redirecting to login')
      authStore.logout()
      if (router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/signup') {
        router.push('/login')
      }
    }
  }
})

