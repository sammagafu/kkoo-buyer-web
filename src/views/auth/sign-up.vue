<template>
  <AuthLayout>
    <AuthCard
      :title="t('auth.signUpTitleBuyer')"
      :subtitle="t('auth.signUpCopyBuyer')"
      :logo-height="64"
      wide
      show-logo
    >
      <div
        class="auth-signup-progress mb-3"
        role="progressbar"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="t('auth.signUpProgressLabel')"
      >
        <div class="auth-signup-progress__track">
          <div class="auth-signup-progress__fill" style="width: 25%" />
        </div>
        <p class="auth-signup-progress__hint mb-0">{{ t('auth.signUpProgressHint') }}</p>
      </div>

      <b-form class="auth-center-form" @submit.prevent="handleSubmit" novalidate>
        <div v-if="error.length > 0" class="auth-alert auth-alert--danger">{{ error }}</div>

        <AuthField :label="t('auth.phoneNumber')" icon="bi-telephone">
          <b-form-input
            v-model="phone"
            class="auth-field__input"
            type="tel"
            :placeholder="t('auth.phonePlaceholder')"
            autocomplete="tel"
            required
            :aria-label="t('auth.phoneNumber')"
          />
        </AuthField>

        <div class="auth-form-grid auth-form-grid--2">
          <AuthField :label="t('auth.firstName')" icon="bi-person">
            <b-form-input
              v-model="firstName"
              class="auth-field__input"
              type="text"
              :placeholder="t('auth.optional')"
              autocomplete="given-name"
            />
          </AuthField>
          <AuthField :label="t('auth.lastName')" icon="bi-person">
            <b-form-input
              v-model="lastName"
              class="auth-field__input"
              type="text"
              :placeholder="t('auth.optional')"
              autocomplete="family-name"
            />
          </AuthField>
        </div>

        <AuthTermsCheck v-model="acceptTerms" class="auth-terms--centered" />

        <b-button variant="primary" type="submit" class="auth-center-card__submit w-100" :disabled="loading">
          {{ loading ? t('auth.signUpSubmitting') : t('auth.signUpSubmitBuyer') }}
        </b-button>
      </b-form>

      <template #alt>
        <router-link :to="{ name: 'auth.sign-in' }" class="auth-alt-btn">{{ t('auth.signIn') }}</router-link>
        <a
          :href="bizSellerRegisterUrl"
          class="auth-alt-btn"
          target="_blank"
          rel="noopener noreferrer"
        >{{ t('auth.registerAsSeller') }}</a>
      </template>
    </AuthCard>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import AuthField from '@/components/auth/AuthField.vue'
import AuthTermsCheck from '@/components/auth/AuthTermsCheck.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authApi } from '@/api'
import { BUYER_ACCOUNT_ROLE, useAuthStore } from '@/stores/auth'
import type { User } from '@/types/auth'
import { formatApiError } from '@/utils/formatApiError'
import { resolvePostAuthRedirect } from '@/utils/authRedirect'
import { bizSellerRegisterUrl } from '@/config/landing-links'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const phone = ref('')
const firstName = ref('')
const lastName = ref('')
const acceptTerms = ref(false)
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!phone.value.trim()) {
    error.value = t('auth.phoneRequired')
    return
  }
  if (!acceptTerms.value) {
    error.value = t('auth.acceptTermsRequired')
    return
  }

  loading.value = true
  try {
    const { data } = await authApi.registerBuyer({
      phone_number: phone.value.trim(),
      first_name: firstName.value.trim() || undefined,
      last_name: lastName.value.trim() || undefined,
    })

    await auth.completeRegistration({
      ...data,
      user: data.user as User | undefined,
    })

    auth.setActiveAccountRole(BUYER_ACCOUNT_ROLE)

    await router.push(
      resolvePostAuthRedirect(route.query.redirectedFrom, auth.defaultRouteAfterAuth()),
    )
  } catch (e: unknown) {
    const err = e as { message?: string }
    if (String(err.message || '').toLowerCase().includes('not_allowed')) {
      error.value = t('auth.notAllowedPortal')
      return
    }
    error.value = formatApiError(e, t('auth.otpSendFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-signup-progress__track {
  height: 0.35rem;
  border-radius: 999px;
  background: rgba(92, 48, 143, 0.12);
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.auth-signup-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--kkoo-secondary, #f7a829);
}
.auth-signup-progress__hint {
  font-size: 0.8rem;
  color: var(--kkoo-muted, #6a4c86);
  text-align: center;
}
</style>
