import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { startKkooOAuth } from '@/utils/kkooOAuth'

export function useKkooAccountAuth() {
  const route = useRoute()
  const { t } = useI18n()
  const { isAuthenticated, displayName, dashboardRoute } = useAuthDisplay()

  function signInWithKkooAccount(redirectFrom?: string) {
    void startKkooOAuth({ returnTo: redirectFrom ?? route.fullPath })
  }

  function signInRoute(redirectFrom?: string) {
    const redirect = redirectFrom ?? route.fullPath
    if (redirect === '/auth/sign-in' || redirect === '/auth/sign-up') {
      return { name: 'auth.sign-in' as const }
    }
    return { name: 'auth.sign-in' as const, query: { redirectedFrom: redirect } }
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
    signInWithKkooAccount,
    accountCtaRoute,
    accountCtaLabel,
  }
}
