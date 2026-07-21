<template>
  <AuthLayout>
    <article class="oauth-consent" :aria-busy="busy">
      <header class="oauth-consent__brand">
        <LogoBox custom-class="oauth-consent__logo" :logo-height="44" />
        <p class="oauth-consent__brand-label">KKOO Account</p>
      </header>

      <p v-if="loadError" class="auth-alert auth-alert--danger mb-0">{{ loadError }}</p>

      <template v-else-if="challenge">
        <div class="oauth-consent__app">
          <div class="oauth-consent__app-mark" aria-hidden="true">
            {{ clientInitials }}
          </div>
          <div class="oauth-consent__app-copy">
            <h1 class="oauth-consent__title">
              Sign in with KKOO to continue to
              <span class="oauth-consent__app-name">{{ challenge.client_name }}</span>
            </h1>
            <p class="oauth-consent__subtitle">
              {{ challenge.first_party
                ? 'This is a KKOO app. Confirm with your phone to continue.'
                : `${challenge.client_name} wants to use your KKOO Account — the same trusted login used across KKOO apps.` }}
            </p>
          </div>
        </div>

        <section class="oauth-consent__perms" aria-labelledby="oauth-perms-heading">
          <h2 id="oauth-perms-heading" class="oauth-consent__perms-title">This app will receive</h2>
          <ul class="oauth-consent__perm-list">
            <li v-for="scope in challenge.scopes" :key="scope">
              <span class="oauth-consent__perm-icon" aria-hidden="true">
                <i class="bi" :class="scopeIcon(scope)" />
              </span>
              <span>
                <strong>{{ scopeTitle(scope) }}</strong>
                <span class="oauth-consent__perm-desc">{{ scopeHint(scope) }}</span>
              </span>
            </li>
          </ul>
        </section>

        <div v-if="!auth.isAuthenticated" class="oauth-consent__auth">
          <p class="oauth-consent__auth-kicker">Sign in with your KKOO phone</p>
          <b-form class="auth-center-form" @submit.prevent="otpSent ? verify() : requestOtp()" novalidate>
            <AuthField :label="t('auth.phoneNumber')" icon="bi-telephone">
              <b-form-input
                v-model="phone"
                type="tel"
                :placeholder="t('auth.phonePlaceholder')"
                :readonly="otpSent"
                class="auth-field__input"
                autocomplete="tel"
              />
            </AuthField>
            <AuthField v-if="otpSent" :label="t('auth.otpCode')" icon="bi-key" otp>
              <b-form-input
                v-model="otpCode"
                class="auth-field__input auth-field__input--otp"
                inputmode="numeric"
                maxlength="8"
                autocomplete="one-time-code"
                :placeholder="t('auth.otpPlaceholder')"
              />
            </AuthField>
            <p v-if="otpSent" class="oauth-consent__otp-links">
              <button type="button" class="auth-text-link" :disabled="busy" @click="resetOtp">
                {{ t('auth.useDifferentNumber') }}
              </button>
            </p>
            <p v-if="formError" class="auth-alert auth-alert--danger">{{ formError }}</p>
            <b-button type="submit" variant="primary" class="w-100 oauth-consent__primary" :disabled="busy">
              {{ otpSent ? t('auth.verifyAndSignIn') : 'Continue with KKOO' }}
            </b-button>
          </b-form>
        </div>

        <div v-else class="oauth-consent__auth">
          <div class="oauth-consent__signed-in">
            <span class="oauth-consent__avatar" aria-hidden="true">{{ accountInitial }}</span>
            <div>
              <p class="oauth-consent__signed-label">Signed in to KKOO as</p>
              <p class="oauth-consent__signed-name">{{ displayName }}</p>
            </div>
          </div>
          <p v-if="formError" class="auth-alert auth-alert--danger">{{ formError }}</p>
          <b-button
            variant="primary"
            class="w-100 oauth-consent__primary"
            :disabled="busy"
            @click="approve(true)"
          >
            Allow & continue to {{ challenge.client_name }}
          </b-button>
          <b-button
            variant="outline-secondary"
            class="w-100"
            :disabled="busy"
            @click="approve(false)"
          >
            Cancel
          </b-button>
        </div>

        <p class="oauth-consent__footer">
          By continuing, you share the permissions above with
          <strong>{{ challenge.client_name }}</strong>.
          You can revoke access later from your KKOO account.
        </p>
      </template>

      <p v-else class="text-muted text-center mb-0 py-4">Loading authorization…</p>
    </article>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthField from '@/components/auth/AuthField.vue'
import LogoBox from '@/components/LogoBox.vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { formatApiError } from '@/utils/formatApiError'
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

const clientInitials = computed(() => {
  const name = challenge.value?.client_name?.trim() || 'App'
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

const accountInitial = computed(() => {
  const n = String(displayName.value || 'K').trim()
  return n.charAt(0).toUpperCase() || 'K'
})

const SCOPE_META: Record<string, { title: string; hint: string; icon: string }> = {
  openid: { title: 'Verify your identity', hint: 'Confirm you are signed in with KKOO', icon: 'bi-shield-check' },
  profile: { title: 'Profile', hint: 'Name and profile photo', icon: 'bi-person' },
  phone: { title: 'Phone number', hint: 'Your WhatsApp / mobile number', icon: 'bi-telephone' },
  email: { title: 'Email', hint: 'Email address if you have one on file', icon: 'bi-envelope' },
  buyer: { title: 'Shop as buyer', hint: 'Orders and marketplace activity', icon: 'bi-bag' },
  seller: { title: 'Seller workspace', hint: 'Business tools linked to your account', icon: 'bi-shop' },
  admin: { title: 'Admin access', hint: 'Staff tools if you have permission', icon: 'bi-shield-lock' },
  offline_access: { title: 'Stay signed in', hint: 'Keep the session active until you revoke it', icon: 'bi-arrow-repeat' },
  'partner:read': { title: 'Read partner data', hint: 'Let the app read allowed partner information', icon: 'bi-eye' },
  'partner:write': { title: 'Act on your behalf', hint: 'Let the app perform partner actions you approve', icon: 'bi-pencil-square' },
}

function scopeTitle(scope: string) {
  return SCOPE_META[scope]?.title || scope
}

function scopeHint(scope: string) {
  return SCOPE_META[scope]?.hint || 'Access related to this permission'
}

function scopeIcon(scope: string) {
  return SCOPE_META[scope]?.icon || 'bi-check2-circle'
}

function resetOtp() {
  otpSent.value = false
  otpCode.value = ''
  formError.value = ''
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
  } catch (e: unknown) {
    loadError.value = formatApiError(e, 'This sign-in request expired or is invalid. Start again from the app.')
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
    formError.value = formatApiError(e, t('auth.otpSendFailed'))
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
    formError.value = formatApiError(e, t('auth.otpInvalidOrExpired'))
  } finally {
    busy.value = false
  }
}

function navigateToRedirect(uri: string) {
  const isCustomScheme = /^[a-z][a-z0-9+.-]*:/i.test(uri) && !/^https?:/i.test(uri)
  if (isCustomScheme) {
    window.location.replace(uri)
    return
  }
  window.location.assign(uri)
}

async function approve(allow: boolean) {
  if (!challenge.value) return
  busy.value = true
  try {
    const { redirect_uri: redirectUri } = await approveOAuthChallenge(challenge.value.challenge_id, allow)
    navigateToRedirect(redirectUri)
  } catch (e: unknown) {
    formError.value = formatApiError(e, 'Could not complete authorization')
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.oauth-consent {
  width: min(100%, 26.5rem);
  margin: 0 auto;
  padding: 1.5rem 1.35rem 1.25rem;
  border-radius: 1.25rem;
  background:
    linear-gradient(165deg, rgba(255, 255, 255, 0.96), rgba(248, 242, 236, 0.92));
  border: 1px solid rgba(92, 48, 143, 0.12);
  box-shadow: 0 18px 40px rgba(59, 26, 90, 0.12);
}

.oauth-consent__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.oauth-consent__brand-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--kkoo-primary, #5c308f);
}

.oauth-consent__app {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.oauth-consent__app-mark {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 0.85rem;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(145deg, #5c308f, #3b1a5a);
}

.oauth-consent__title {
  margin: 0 0 0.35rem;
  font-size: 1.2rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--bs-headings-color, #1f1b24);
}

.oauth-consent__app-name {
  color: var(--kkoo-primary, #5c308f);
}

.oauth-consent__subtitle {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--bs-secondary-color, #6a4c86);
}

.oauth-consent__perms {
  margin-bottom: 1.25rem;
  padding: 0.85rem 0.9rem;
  border-radius: 0.85rem;
  background: rgba(92, 48, 143, 0.05);
  border: 1px solid rgba(92, 48, 143, 0.08);
}

.oauth-consent__perms-title {
  margin: 0 0 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--bs-secondary-color, #6a4c86);
}

.oauth-consent__perm-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.oauth-consent__perm-list li {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  font-size: 0.875rem;
}

.oauth-consent__perm-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #fff;
  color: var(--kkoo-primary, #5c308f);
  border: 1px solid rgba(92, 48, 143, 0.12);
  flex-shrink: 0;
}

.oauth-consent__perm-desc {
  display: block;
  font-size: 0.8rem;
  color: var(--bs-secondary-color, #6a4c86);
  font-weight: 400;
}

.oauth-consent__auth-kicker {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--bs-secondary-color, #6a4c86);
}

.oauth-consent__otp-links {
  display: flex;
  justify-content: flex-start;
  margin: -0.25rem 0 0.75rem;
}

.oauth-consent__primary {
  font-weight: 600;
  min-height: 2.75rem;
}

.oauth-consent__signed-in {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.85rem;
  background: rgba(247, 168, 41, 0.12);
  border: 1px solid rgba(247, 168, 41, 0.28);
}

.oauth-consent__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 700;
  background: var(--kkoo-primary, #5c308f);
  color: #fff;
}

.oauth-consent__signed-label {
  margin: 0;
  font-size: 0.75rem;
  color: var(--bs-secondary-color, #6a4c86);
}

.oauth-consent__signed-name {
  margin: 0;
  font-weight: 600;
}

.oauth-consent__auth {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.oauth-consent__footer {
  margin: 1.1rem 0 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--bs-secondary-color, #6a4c86);
  text-align: center;
}
</style>
