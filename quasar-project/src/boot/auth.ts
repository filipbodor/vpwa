import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/pinia-stores'

export default boot(() => {
  const authStore = useAuthStore()
  
  authStore.initializeFromStorage()
})

