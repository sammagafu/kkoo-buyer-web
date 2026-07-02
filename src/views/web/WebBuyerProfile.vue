<template>
  <div class="buyer-xp">
      <section class="buyer-home-hero">
        <div class="web-profile-head">
          <div class="web-profile-avatar">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" class="rounded-circle object-fit-cover" width="72" height="72" />
            <span v-else class="web-profile-initials">{{ initials }}</span>
          </div>
          <div>
            <p class="buyer-home-hero__overline">{{ t('buyerXp.hub.profileOverline') }}</p>
            <h1 class="buyer-home-hero__name">{{ displayName }}</h1>
            <p class="buyer-home-hero__tagline">{{ contactLine }}</p>
          </div>
        </div>
      </section>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.hub.accountSection')" />
      <div class="buyer-hub-list">
        <BuyerHubCard
          v-for="tile in accountTiles"
          :key="tile.id"
          :title="tile.title"
          :subtitle="tile.subtitle"
          :icon="tile.icon"
          :tone="tile.tone"
          :to="{ name: tile.routeName }"
        />
      </div>
    </section>

    <section class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.hub.moreSection')" />
      <div class="buyer-hub-list">
        <BuyerHubCard :title="t('buyerXp.hub.favorites')" :subtitle="t('buyerXp.hub.favoritesSub')" icon="solar:heart-bold" :to="{ name: 'buyer.favorites' }" />
        <BuyerHubCard :title="t('buyerXp.hub.editProfile')" :subtitle="t('buyerXp.hub.editProfileSub')" icon="solar:user-id-bold" :to="{ name: 'account.profile' }" />
        <BuyerHubCard :title="t('buyerXp.hub.servicesHub')" :subtitle="t('buyerXp.hub.servicesHubSub')" icon="solar:widget-5-bold" :to="{ name: 'buyer.services' }" />
      </div>
    </section>

    <section v-if="hasWorkspaces" class="buyer-surface">
      <BuyerSectionHeader :title="t('buyerXp.hub.switchWorkspace')" />
      <div class="buyer-hub-list mb-3">
        <button
          v-for="roleOption in roleSwitchOptions"
          :key="roleOption.role"
          type="button"
          class="buyer-venue__chip"
          :class="{ 'buyer-venue__chip--primary': activeAccountRole === roleOption.role }"
          @click="switchRole(roleOption.role)"
        >
          {{ roleOption.label }}
        </button>
      </div>
      <div class="buyer-hub-list">
        <article
          v-for="workspace in workspaceCards"
          :key="workspace.title"
          class="buyer-detail-card"
          :class="{ 'opacity-75': !workspace.available }"
        >
          <div class="buyer-detail-row">
            <strong>{{ workspace.title }}</strong>
            <span class="buyer-page-head__meta">{{ workspace.status }}</span>
          </div>
          <div class="buyer-btn-row mt-2">
            <button
              v-if="workspace.available && workspace.role"
              type="button"
              class="buyer-venue__chip buyer-venue__chip--primary"
              @click="switchRole(workspace.role)"
            >
              {{ t('buyerXp.hub.workspaces.switchHere') }}
            </button>
            <a
              v-else-if="workspace.href"
              :href="workspace.href"
              class="buyer-venue__chip"
              target="_blank"
              rel="noopener"
            >
              {{ workspace.available ? workspace.cta : workspace.fallbackCta ?? workspace.cta }}
            </a>
            <router-link
              v-else-if="workspace.route"
              :to="workspace.route"
              class="buyer-venue__chip"
            >
              {{ workspace.available ? workspace.cta : workspace.fallbackCta ?? workspace.cta }}
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <div class="px-3 pb-4">
      <button type="button" class="buyer-venue__chip" style="color:#c0392b" @click="signOut">{{ t('buyerXp.hub.signOut') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { BUYER_ACCOUNT_ROLE, useAuthStore } from '@/stores/auth'
import { resolveAssetUrl } from '@/utils/assetUrl'
import { useBuyerFeatureTiles } from '@/composables/useBuyerFeatureTiles'
import { useAccountWorkspaces } from '@/composables/useAccountWorkspaces'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerHubCard from '@/components/buyer/experience/BuyerHubCard.vue'

const { t, locale } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const { user, availableAccountRoles } = storeToRefs(auth)
const { accountTiles } = useBuyerFeatureTiles()
const { activeAccountRole, roleSwitchOptions, workspaceCards, switchRole } = useAccountWorkspaces()

const displayName = computed(() => {
  void locale.value
  const u = user.value
  return (
    u?.full_name ||
    [u?.first_name, u?.last_name].filter(Boolean).join(' ') ||
    u?.username ||
    u?.phone_number ||
    t('buyerXp.hub.profileGuest')
  )
})

const contactLine = computed(() => {
  void locale.value
  const u = user.value
  return [u?.phone_number, u?.email].filter(Boolean).join(' • ') || t('buyerXp.hub.profileSignedIn')
})

const avatarUrl = computed(() => {
  const u = user.value as { avatar_url?: string; avatar?: string } | null
  return resolveAssetUrl(u?.avatar_url ?? u?.avatar) ?? ''
})

const initials = computed(() => {
  const parts = displayName.value.split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? ''
  const b = parts[1]?.[0] ?? ''
  return `${a}${b}`.toUpperCase() || '?'
})

const hasWorkspaces = computed(() =>
  availableAccountRoles.value.some((role) => role !== BUYER_ACCOUNT_ROLE),
)

async function signOut() {
  await auth.logout()
  await router.push({ name: 'buyer.marketplace' })
}
</script>

<style scoped>
.web-profile-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem 0;
}

.web-profile-avatar {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: rgba(91, 58, 140, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.web-profile-initials {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--buyer-purple, #5b3a8c);
}
</style>
