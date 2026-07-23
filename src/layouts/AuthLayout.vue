<template>
  <div class="auth-shell auth-shell--split account-pages account-pages--auth w-100" data-kkoo-portal="buyer">
    <aside class="auth-split-pattern" aria-hidden="true">
      <div class="auth-split-pattern__logo">
        <img :src="logoMark" alt="" width="480" height="160" decoding="async" />
      </div>
    </aside>
    <main class="auth-split-form">
      <div class="auth-split-form__inner">
        <AuthViewportFit>
          <slot />
        </AuthViewportFit>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AuthViewportFit from '@/components/auth/AuthViewportFit.vue'
/** Light mark for the purple pattern panel (always dark-bg asset). */
import logoMark from '@/assets/images/logo-dark.svg'

const body = document.body
const root = document.documentElement

onMounted(() => {
  if (body) {
    body.classList.add('authentication-bg')
    body.setAttribute('data-kkoo-portal', 'buyer')
    body.removeAttribute('style')
  }
  root.classList.add('auth-viewport-lock')
  document.querySelector('.offcanvas-backdrop')?.classList.remove('show')
})

onUnmounted(() => {
  if (body) {
    body.classList.remove('authentication-bg', 'authentication-bg--house')
    body.removeAttribute('data-kkoo-portal')
  }
  root.classList.remove('auth-viewport-lock')
})
</script>
