import { AppVisibility } from 'quasar'
import { useAuthStore } from 'src/stores/pinia-stores'

export function useAppNotifications() {
  const authStore = useAuthStore()

  /**
   * Shows a system notification
   * Note: API will handle filtering (mentions, user preferences, etc.)
   * Client only checks: DND status and app visibility
   */
  function showNotification(
    sender: string,
    message: string,
    avatar?: string
  ) {
    console.log('[Notifications] showNotification called:', { sender, message: message.substring(0, 30) })
    
    if (!authStore.currentUser) {
      console.log('[Notifications] ❌ No current user')
      return
    }

    const status = authStore.currentUser.status
    console.log('[Notifications] User status:', status)
    
    // Don't show notifications if user is DND or offline
    if (status === 'dnd' || status === 'offline') {
      console.log('[Notifications] ❌ User is DND or offline')
      return
    }

    const isVisible = AppVisibility.appVisible
    console.log('[Notifications] App visible:', isVisible)
    
    // Only show notification if app is not visible
    if (isVisible) {
      console.log('[Notifications] ❌ App is visible, no notification needed')
      return
    }

    console.log('[Notifications] Permission:', 'Notification' in window ? Notification.permission : 'Not supported')
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      console.log('[Notifications] ❌ Cannot create notification - permission not granted or not supported')
      return
    }

    const truncatedMessage = message.length > 100 
      ? message.substring(0, 100) + '...' 
      : message

    console.log('[Notifications] ✅ Creating notification:', sender, truncatedMessage)
    const notification = new Notification(sender, {
      body: truncatedMessage,
      icon: avatar || '/icons/icon-128x128.png',
      badge: '/icons/icon-128x128.png',
      tag: 'slack-message',
      requireInteraction: false,
      silent: false,
    })

    // Close notification after 5 seconds
    setTimeout(() => notification.close(), 5000)

    // Focus app when notification is clicked
    notification.onclick = () => {
      window.focus()
      notification.close()
    }
  }

  async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

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

