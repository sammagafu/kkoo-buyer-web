<template>
  <section
    class="buyer-discovery"
    :class="{ 'buyer-discovery--desktop': desktopLayout }"
    :aria-label="t('buyerXp.home.nearYou')"
  >
    <BuyerSectionHeader :title="t('buyerXp.home.nearYou')" />

    <div v-if="loading" class="buyer-discovery__status">{{ t('buyerXp.common.loading') }}</div>
    <BuyerEmptyState
      v-else-if="!nearbyStores.length"
      size="compact"
      flush
      tone="grocery"
      :eyebrow="t('buyerXp.home.emptyNearbyEyebrow')"
      :title="t('buyerXp.home.emptyNearbyTitle')"
      :message="t('buyerXp.home.emptyNearbyMessage')"
      icon="solar:map-point-bold"
    >
      <template #action>
        <RouterLink :to="{ name: 'buyer.search' }" class="buyer-empty__cta">{{ t('buyerXp.nav.search') }}</RouterLink>
        <RouterLink :to="{ name: 'buyer.eats' }" class="buyer-empty__cta buyer-empty__cta--secondary">{{ t('buyerXp.nav.eats') }}</RouterLink>
      </template>
    </BuyerEmptyState>
    <div v-else class="buyer-discovery__rail" role="list">
      <RouterLink
        v-for="store in nearbyStores"
        :key="store.key"
        :to="store.to"
        class="buyer-discovery__place"
        :data-vertical="store.vertical"
        role="listitem"
      >
        <span class="buyer-discovery__visual">
          <img
            v-if="store.image"
            :src="store.image"
            :alt="store.name"
            loading="lazy"
            decoding="async"
          />
          <span v-else class="buyer-discovery__mark" aria-hidden="true">
            <Icon :icon="store.icon" width="28" height="28" />
          </span>
        </span>
        <span class="buyer-discovery__copy">
          <span class="buyer-discovery__kind">{{ store.kindLabel }}</span>
          <span class="buyer-discovery__name">{{ store.name }}</span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
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

const VERTICAL_META: Record<
  VenueVertical,
  { icon: string; kindKey: string }
> = {
  grocery: { icon: 'solar:shop-2-bold', kindKey: 'buyerXp.nav.groceries' },
  eats: { icon: 'solar:chef-hat-bold', kindKey: 'buyerXp.nav.eats' },
  pharmacy: { icon: 'solar:medical-kit-bold', kindKey: 'buyerXp.nav.pharmacy' },
  hotel: { icon: 'solar:buildings-2-bold', kindKey: 'hotels.directory.tagHotel' },
}

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
    const vertical = storeVertical(store)
    const meta = VERTICAL_META[vertical]
    return {
      key: String(id ?? store.business_name),
      name: store.business_name || t('buyerXp.marketplace.storeFallback'),
      image: venueImageUrl(store),
      vertical,
      icon: meta.icon,
      kindLabel: t(meta.kindKey),
      to: id ? venueDetailLink(vertical, id) : { name: 'buyer.search' },
    }
  }),
)
</script>
