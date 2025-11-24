import { AppVisibility } from 'quasar'
import { useAuthStore } from 'src/stores/pinia-stores'

export function useAppNotifications() {
  const authStore = useAuthStore()

  function showNotification(
    sender: string,
    message: string,
    avatar?: string,
    mentions?: string[]
  ) {
    if (!authStore.currentUser) return

    const status = authStore.currentUser.status
    if (status === 'dnd' || status === 'offline') return

    const isVisible = AppVisibility.appVisible
    if (isVisible) return

    if (authStore.mentionsOnly) {
      const currentUserId = authStore.currentUserId
      if (!mentions || !mentions.includes(currentUserId)) return
    }

    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const truncatedMessage = message.length > 100 
      ? message.substring(0, 100) + '...' 
      : message
    
    const notificationOptions: NotificationOptions = {
      body: truncatedMessage,
      tag: 'slack-message',
      requireInteraction: false,
      silent: false,
    }
    
    if (avatar) {
      notificationOptions.icon = avatar
    }
    
    const notification = new Notification(sender, notificationOptions)

    setTimeout(() => notification.close(), 7000)

    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  }

  async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  function getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }

  return {
    showNotification,
    requestNotificationPermission,
    getNotificationPermission,
  }
}
