import { Notify, AppVisibility } from 'quasar'
import { useAuthStore } from 'src/stores/pinia-stores'

export function useAppNotifications() {
  const authStore = useAuthStore()

  function shouldShowNotification(): boolean {
    if (!authStore.currentUser) return false

    const status = authStore.currentUser.status
    if (status === 'busy' || status === 'offline') {
      return false
    }

    const notificationsEnabled = authStore.currentUser.notificationsEnabled !== false

    if (!notificationsEnabled) {
      return false
    }

    return !AppVisibility.appVisible
  }

  function showMessageNotification(
    sender: string,
    message: string,
    isMention: boolean = false
  ) {
    if (!shouldShowNotification()) {
      return
    }

    const mentionsOnly = authStore.currentUser?.mentionsOnly || false
    if (mentionsOnly && !isMention) {
      return
    }

    const truncatedMessage = message.length > 50 
      ? message.substring(0, 50) + '...' 
      : message

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${sender}`, {
        body: truncatedMessage,
        icon: '/favicon.ico',
        tag: 'chat-message',
      })
    } else {
      Notify.create({
        message: `${sender}: ${truncatedMessage}`,
        color: isMention ? 'warning' : 'primary',
        position: 'top-right',
        timeout: 3000,
        actions: [
          {
            label: 'Dismiss',
            color: 'white',
          },
        ],
      })
    }
  }

  async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  return {
    shouldShowNotification,
    showMessageNotification,
    requestNotificationPermission,
  }
}

