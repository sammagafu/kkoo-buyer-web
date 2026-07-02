<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.settings.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.settings.meta') }}</p>
    </header>

    <p v-if="restrictedMessage" class="buyer-xp-toast">{{ restrictedMessage }}</p>

    <section class="buyer-hub-list">
      <BuyerHubCard
        v-for="link in links"
        :key="link.labelKey"
        :title="t(link.labelKey)"
        :subtitle="t(link.subtitleKey)"
        :icon="link.icon"
        :to="link.to"
      />
    </section>

    <section class="buyer-detail-card mt-3">
      <BuyerSectionHeader :title="t('buyerXp.settings.language')" />
      <div class="buyer-ride-field">
        <select v-model="language" @change="saveLanguage">
          <option v-for="loc in supportedLocales" :key="loc.code" :value="loc.code">{{ loc.name }}</option>
        </select>
      </div>
      <p v-if="saveMsg" class="buyer-xp-toast buyer-xp-toast--ok mt-2">{{ saveMsg }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { userApi } from '@/api/user'
import { formatApiError } from '@/utils/formatApiError'
import { applyLocaleFromPreference, setLocale, supportedLocales, type LocaleCode } from '@/i18n'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'

const { t, locale } = useI18n()
const route = useRoute()
const language = ref<LocaleCode>('en')
const saveMsg = ref('')

const restrictedMessage = computed(() => {
  const restricted = String(route.query.restricted ?? '').toLowerCase()
  switch (restricted) {
    case 'admin':
      return 'No admin access on this account.'
    case 'business':
      return 'Open the seller portal on KKOO Business to register your store.'
    default:
      return ''
  }
})

const links = computed<Array<{ labelKey: string; subtitleKey: string; icon: string; to: RouteLocationRaw }>>(() => [
  { labelKey: 'buyerXp.settings.editProfile', subtitleKey: 'buyerXp.settings.editProfileSub', icon: 'solar:user-id-bold', to: { name: 'account.profile' } },
  { labelKey: 'buyerXp.settings.notifications', subtitleKey: 'buyerXp.settings.notificationsSub', icon: 'solar:bell-bold', to: { name: 'account.notifications' } },
  { labelKey: 'buyerXp.settings.backupCodes', subtitleKey: 'buyerXp.settings.backupCodesSub', icon: 'solar:shield-keyhole-bold', to: { name: 'account.backup-codes' } },
  { labelKey: 'buyerXp.settings.disputes', subtitleKey: 'buyerXp.settings.disputesSub', icon: 'solar:shield-warning-bold', to: { name: 'buyer.disputes' } },
])

async function load() {
  try {
    const { data } = await userApi.getMe()
    const u = data as { language_preference?: string }
    if (u.language_preference) {
      language.value = u.language_preference as LocaleCode
      applyLocaleFromPreference(u.language_preference)
    } else {
      language.value = locale.value as LocaleCode
    }
  } catch {
    language.value = locale.value as LocaleCode
  }
}

async function saveLanguage() {
  saveMsg.value = ''
  setLocale(language.value)
  try {
    await userApi.updateMe({ language_preference: language.value })
    saveMsg.value = t('buyerXp.settings.languageSaved')
  } catch (e) {
    saveMsg.value = formatApiError(e, t('buyerXp.settings.couldNotSave'))
  }
}

onMounted(load)
</script>

<style scoped>
.buyer-ride-field select {
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.65rem;
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-input-bg);
  color: var(--buyer-ink);
}
</style>
