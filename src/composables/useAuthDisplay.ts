import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export function useAuthDisplay() {
  const auth = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(auth)

  const displayName = computed(() => {
    const currentUser = user.value
    return (
      currentUser?.full_name ||
      [currentUser?.first_name, currentUser?.last_name].filter(Boolean).join(' ') ||
      currentUser?.username ||
      currentUser?.phone_number ||
      'Your account'
    )
  })

  const dashboardRoute = computed(() => {
    if (!isAuthenticated.value) {
      return { name: 'buyer.marketplace' as const }
    }
    return { name: 'account.home' as const }
  })

  return {
    isAuthenticated,
    displayName,
    dashboardRoute,
  }
}
