import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { buyerRoutes } from '@/config/landing-links'

export function useKkooAccountAuth() {
  const route = useRoute()
  const { t } = useI18n()
  const { isAuthenticated, displayName, dashboardRoute } = useAuthDisplay()

  function signInRoute(redirectFrom?: string) {
    const redirect = redirectFrom ?? route.fullPath
    if (redirect === '/auth/sign-in' || redirect === '/auth/sign-up') {
      return buyerRoutes.signIn
    }
    return { name: 'auth.sign-in', query: { redirectedFrom: redirect } }
  }

  const accountCtaRoute = computed(() =>
    isAuthenticated.value ? dashboardRoute.value : signInRoute(),
  )

  const accountCtaLabel = computed(() =>
    isAuthenticated.value
      ? t('auth.continueWithKkooAccount')
      : t('auth.signInWithKkooAccount'),
  )

  return {
    isAuthenticated,
    displayName,
    dashboardRoute,
    signInRoute,
    accountCtaRoute,
    accountCtaLabel,
  }
}
