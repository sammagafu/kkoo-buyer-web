<template>
  <Teleport to="body">
    <div v-if="visible" class="lh-cookie" role="dialog" aria-labelledby="lh-cookie-title" aria-live="polite">
      <div class="lh-cookie__panel">
        <div class="lh-cookie__copy">
          <h2 id="lh-cookie-title" class="lh-cookie__title">{{ t('trust.cookieTitle') }}</h2>
          <p class="lh-cookie__text">
            {{ t('trust.cookieBody') }}
            <RouterLink :to="{ name: 'pages.cookies' }" class="lh-cookie__link">{{
              t('landing.footerCookiePolicy')
            }}</RouterLink>
          </p>
        </div>
        <div class="lh-cookie__actions">
          <button type="button" class="lh-cookie__btn lh-cookie__btn--ghost" @click="reject">
            {{ t('trust.cookieReject') }}
          </button>
          <button type="button" class="lh-cookie__btn lh-cookie__btn--primary" @click="accept">
            {{ t('trust.cookieAccept') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { COOKIE_CONSENT_KEY } from '@/config/company-trust'

const { t } = useI18n()
const visible = ref(false)

onMounted(() => {
  try {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) visible.value = true
  } catch {
    visible.value = true
  }
})

function persist(value: 'accepted' | 'rejected') {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
  } catch {
    // ignore
  }
  visible.value = false
}

function accept() {
  persist('accepted')
}

function reject() {
  persist('rejected')
}
</script>
