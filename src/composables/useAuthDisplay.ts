import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

import { BUYER_DASHBOARD_ROUTE } from '@/constants/buyerDashboard'

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
      return BUYER_DASHBOARD_ROUTE
    }
    if (auth.isSeller || auth.isAdminOrStaff) {
      return { name: 'buyer.profile' as const }
    }
    return BUYER_DASHBOARD_ROUTE
  })

  return {
    isAuthenticated,
    displayName,
    dashboardRoute,
  }
}
