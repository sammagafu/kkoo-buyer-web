<template>
  <AuthLayout>
    <AuthCard title="Returning to KKOO app" subtitle="Completing sign-in…" show-logo icon="bi-phone">
      <p v-if="error" class="auth-alert auth-alert--danger">{{ error }}</p>
      <p v-else-if="openedApp" class="text-muted text-center mb-0">
        If the app did not open, tap the button below.
      </p>
      <p v-else class="text-muted text-center mb-0">{{ t('auth.redirecting') }}</p>
      <b-button v-if="deepLink" variant="primary" class="w-100 mt-3" @click="openApp">
        Open KKOO app
      </b-button>
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/auth/AuthCard.vue'

const route = useRoute()
const { t } = useI18n()
const error = ref('')
const openedApp = ref(false)

const deepLink = computed(() => {
  const err = String(route.query.error ?? '')
  if (err) return ''
  const code = String(route.query.code ?? '')
  if (!code) return ''
  const params = new URLSearchParams({ code })
  const state = String(route.query.state ?? '')
  if (state) params.set('state', state)
  return `kkoo://oauth/callback?${params.toString()}`
})

function openApp() {
  if (!deepLink.value) return
  window.location.href = deepLink.value
  openedApp.value = true
}

onMounted(() => {
  const err = String(route.query.error ?? '')
  if (err) {
    error.value = String(route.query.error_description ?? err)
    return
  }
  if (!String(route.query.code ?? '')) {
    error.value = 'Missing authorization code'
    return
  }
  openApp()
  window.setTimeout(() => {
    openedApp.value = true
  }, 1200)
})
</script>
