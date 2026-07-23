<template>
  <p class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { captureReferralRefFromQuery } from '@/composables/applyPendingReferral'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const ref = captureReferralRefFromQuery(route.query.ref)
  await auth.initialize()
  const query = ref ? { ref } : {}
  if (auth.isAuthenticated) {
    await router.replace({ name: 'buyer.referral', query })
    return
  }
  await router.replace({ name: 'auth.sign-up', query })
})
</script>
