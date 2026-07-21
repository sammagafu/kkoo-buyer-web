<template>
  <section class="buyer-discovery" :class="{ 'buyer-discovery--desktop': desktopLayout }" :aria-label="t('buyerXp.home.nearYou')">
    <div class="buyer-discovery__head">
      <h2 class="buyer-discovery__title">{{ t('buyerXp.home.nearYou') }}</h2>
    </div>
    <div v-if="loading" class="buyer-discovery__status">{{ t('buyerXp.common.loading') }}</div>
    <div v-else-if="!nearbyStores.length" class="buyer-discovery__status">{{ t('buyerXp.home.noStoresNearby') }}</div>
    <div v-else class="buyer-discovery__scroll" role="list">
      <RouterLink
        v-for="store in nearbyStores"
        :key="store.key"
        :to="store.to"
        class="buyer-discovery__shop"
        role="listitem"
      >
        <img v-if="store.image" :src="store.image" :alt="store.name" loading="lazy" decoding="async" />
        <span v-else class="buyer-discovery__shop-fallback" aria-hidden="true">
          <Icon icon="solar:shop-2-bold" />
        </span>
        <span class="buyer-discovery__shop-name">{{ store.name }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { venueImageUrl } from '@/utils/assetUrl'
import { venueDetailLink, type VenueVertical } from '@/utils/buyerDetailLinks'

type Store = {
  seller_id?: number
  user_id?: number
  business_name?: string
  cover_image?: string
  logo_url?: string
  seller_type?: string
}

const props = defineProps<{
  stores?: Store[]
  loading?: boolean
  desktopLayout?: boolean
}>()

const { t } = useI18n()

function storeVertical(store: Store): VenueVertical {
  const type = (store.seller_type || '').toLowerCase()
  if (type === 'restaurant') return 'eats'
  if (type === 'pharmacy') return 'pharmacy'
  if (type === 'hotel') return 'hotel'
  return 'grocery'
}

const nearbyStores = computed(() =>
  (props.stores ?? []).slice(0, 8).map((store) => {
    const id = store.seller_id ?? store.user_id
    return {
      key: String(id ?? store.business_name),
      name: store.business_name || t('buyerXp.marketplace.storeFallback'),
      image: venueImageUrl(store),
      to: id ? venueDetailLink(storeVertical(store), id) : { name: 'buyer.search' },
    }
  }),
)
</script>
