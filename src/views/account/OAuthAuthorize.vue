<template>
  <AuthLayout>
    <AuthCard
      :title="challenge ? `Sign in to ${challenge.client_name}` : 'KKOO Account'"
      :subtitle="challenge ? 'Review access and continue with your phone number.' : 'Loading…'"
      show-logo
      icon="bi-shield-lock"
    >
      <p v-if="loadError" class="auth-alert auth-alert--danger">{{ loadError }}</p>

      <template v-else-if="challenge">
        <p class="text-muted small mb-3">
          <strong>{{ challenge.client_name }}</strong> is requesting access to your KKOO Account.
        </p>
        <ul class="oauth-scope-list mb-4">
          <li v-for="scope in challenge.scopes" :key="scope">{{ scopeLabel(scope) }}</li>
        </ul>

        <div v-if="!auth.isAuthenticated">
          <p class="text-muted small mb-3">{{ t('auth.kkooAccountSubtitle') }}</p>
          <b-form class="auth-center-form" @submit.prevent="otpSent ? verify() : requestOtp()" novalidate>
            <AuthField :label="t('auth.phoneNumber')" icon="bi-telephone">
              <b-form-input v-model="phone" type="tel" :readonly="otpSent" class="auth-field__input" />
            </AuthField>
            <AuthField v-if="otpSent" :label="t('auth.otpCode')" icon="bi-key" otp>
              <b-form-input v-model="otpCode" class="auth-field__input auth-field__input--otp" maxlength="8" />
            </AuthField>
            <p v-if="formError" class="auth-alert auth-alert--danger">{{ formError }}</p>
            <b-button type="submit" variant="primary" class="w-100" :disabled="busy">
              {{ otpSent ? t('auth.verifyAndSignIn') : t('auth.sendOtp') }}
            </b-button>
          </b-form>
        </div>

        <div v-else class="d-flex flex-column gap-2">
          <p class="text-muted small mb-0">Signed in as {{ displayName }}</p>
          <b-button variant="primary" :disabled="busy" @click="approve(true)">Allow & continue</b-button>
          <b-button variant="outline-secondary" :disabled="busy" @click="approve(false)">Deny</b-button>
        </div>
      </template>
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthField from '@/components/auth/AuthField.vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import {
  approveOAuthChallenge,
  fetchOAuthChallenge,
  type OAuthChallenge,
} from '@/utils/kkooOAuth'

const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()
const { displayName } = useAuthDisplay()

const challenge = ref<OAuthChallenge | null>(null)
const loadError = ref('')
const formError = ref('')
const phone = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const busy = ref(false)

const challengeId = computed(() => String(route.query.challenge ?? ''))

function scopeLabel(scope: string) {
  const map: Record<string, string> = {
    openid: 'Basic sign-in',
    profile: 'Your name and photo',
    phone: 'Phone number',
    email: 'Email address',
    buyer: 'Shop and order as buyer',
    seller: 'Seller workspace',
    admin: 'Admin access',
    'offline_access': 'Stay signed in',
    'partner:read': 'Read partner data',
    'partner:write': 'Act on your behalf (partner)',
  }
  return map[scope] || scope
}

onMounted(async () => {
  if (!challengeId.value) {
    loadError.value = 'Missing authorization request'
    return
  }
  try {
    challenge.value = await fetchOAuthChallenge(challengeId.value)
    if (auth.isAuthenticated && (challenge.value.first_party || challenge.value.has_consent)) {
      await approve(true)
    }
  } catch {
    loadError.value = 'This sign-in request expired or is invalid.'
  }
})

async function requestOtp() {
  formError.value = ''
  if (!phone.value.trim()) {
    formError.value = t('auth.phoneRequired')
    return
  }
  busy.value = true
  try {
    await authApi.requestOtp(phone.value.trim())
    otpSent.value = true
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : t('auth.otpSendFailed')
  } finally {
    busy.value = false
  }
}

async function verify() {
  formError.value = ''
  busy.value = true
  try {
    await auth.loginWithOtp(phone.value.trim(), otpCode.value.trim())
    await approve(true)
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : t('auth.otpInvalidOrExpired')
  } finally {
    busy.value = false
  }
}

async function approve(allow: boolean) {
  if (!challenge.value) return
  busy.value = true
  try {
    const { redirect_uri: redirectUri } = await approveOAuthChallenge(challenge.value.challenge_id, allow)
    window.location.href = redirectUri
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Could not complete authorization'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.oauth-scope-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
}
</style>
