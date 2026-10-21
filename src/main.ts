import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { wow } from './directives/wow'
import { initOfflineDB } from './utils/offlineStorage'
import KkooIcon from '@/components/KkooIcon.vue'
import { useLayoutStore } from '@/stores/layout'
import { loadAppStyles, needsFullAppStyles } from '@/styles/loadAppStyles'

import {createBootstrap} from 'bootstrap-vue-next'

import '@/assets/scss/landing-entry.scss'

async function mountApp() {
  if (needsFullAppStyles(window.location.pathname)) {
    await loadAppStyles()
  }

  const app = createApp(App)

  app.component('KkooIcon', KkooIcon)
  app.directive('wow', wow)
  const pinia = createPinia()
  app.use(pinia)
  // Apply saved theme before first paint so dark mode surfaces render correctly
  useLayoutStore(pinia).init()
  app.use(router)
  app.use(i18n)
  app.use(createBootstrap())

  app.mount('#app')
}

void mountApp()

const scheduleOfflineBootstrap = () => {
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void) => number
  }

  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(() => {
      void initOfflineDB()
    })
    return
  }

  window.setTimeout(() => {
    void initOfflineDB()
  }, 1000)
}

scheduleOfflineBootstrap()

// Disabled until HTTPS is live on kkooapp.co.tz (service worker returns 503 when TLS fails).
// Re-enable after: sudo certbot --nginx -d kkooapp.co.tz ...
if (false && 'serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      for (const reg of regs) void reg.unregister()
    })
  })
}
