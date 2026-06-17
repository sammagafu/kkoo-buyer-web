<template>
  <MarketingLayout>
    <section class="lp-section web-profile-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-profile-head">
          <div class="web-profile-avatar">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" class="rounded-circle object-fit-cover" width="72" height="72" />
            <span v-else class="web-profile-initials">{{ initials }}</span>
          </div>
          <div>
            <h1 class="web-profile-name mb-1">{{ displayName }}</h1>
            <p class="text-muted mb-0">{{ contactLine }}</p>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section pt-0">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="web-profile-links">
          <RouterLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="web-profile-link"
          >
            <Icon :icon="link.icon" class="web-profile-link-icon" />
            <span>{{ link.label }}</span>
            <Icon icon="solar:alt-arrow-right-linear" class="ms-auto opacity-50" />
          </RouterLink>
        </div>

        <b-button v-if="hasWorkspaces" variant="outline-primary" class="mt-3" :to="{ name: 'account.home' }">
          Switch workspace
        </b-button>

        <b-button variant="outline-danger" class="mt-3 ms-0 ms-sm-2" @click="signOut">Sign out</b-button>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { BUYER_ACCOUNT_ROLE, useAuthStore } from '@/stores/auth'
import { resolveAssetUrl } from '@/utils/assetUrl'

const auth = useAuthStore()
const router = useRouter()
const { user, availableAccountRoles } = storeToRefs(auth)

const displayName = computed(() => {
  const u = user.value
  return (
    u?.full_name ||
    [u?.first_name, u?.last_name].filter(Boolean).join(' ') ||
    u?.username ||
    u?.phone_number ||
    'KKOO member'
  )
})

const contactLine = computed(() => {
  const u = user.value
  return [u?.phone_number, u?.email].filter(Boolean).join(' • ') || 'Signed in'
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

const links = [
  { label: 'My orders', icon: 'solar:bag-check-bold', to: { name: 'buyer.orders' } },
  { label: 'Favorites', icon: 'solar:heart-bold', to: { name: 'buyer.favorites' } },
  { label: 'Edit profile', icon: 'solar:user-id-bold', to: { name: 'account.profile' } },
  { label: 'Notifications', icon: 'solar:bell-bold', to: { name: 'account.notifications' } },
  { label: 'Marketplace', icon: 'solar:cart-large-2-bold', to: { name: 'buyer.marketplace' } },
  { label: 'Eats', icon: 'solar:cup-hot-bold', to: { name: 'buyer.eats' } },
]

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
}

.web-profile-avatar {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: rgba(var(--bs-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.web-profile-initials {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bs-primary);
}

.web-profile-name {
  font-size: 1.5rem;
  font-weight: 700;
}

.web-profile-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.web-profile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  border-radius: 0.875rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.web-profile-link:hover {
  border-color: rgba(var(--bs-primary-rgb), 0.35);
  box-shadow: 0 0.25rem 0.75rem rgba(var(--bs-body-color-rgb), 0.06);
}

.web-profile-link-icon {
  font-size: 1.25rem;
  color: var(--bs-primary);
}
</style>
