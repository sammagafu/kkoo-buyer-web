import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useBuyerGreeting() {
  const { t } = useI18n()

  const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 12) return t('buyerXp.greetings.morning')
    if (h < 17) return t('buyerXp.greetings.afternoon')
    return t('buyerXp.greetings.evening')
  })

  return { greeting }
}
