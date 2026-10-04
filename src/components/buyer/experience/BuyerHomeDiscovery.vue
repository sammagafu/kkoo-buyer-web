<template>
  <section
    class="buyer-discovery"
    :class="{ 'buyer-discovery--desktop': desktopLayout }"
    :aria-label="t('buyerXp.home.nearYou')"
  >
    <BuyerSectionHeader
      :title="t('buyerXp.home.nearYou')"
      :action-label="t('buyerXp.common.seeAll')"
      :action-to="{ name: 'buyer.nearby' }"
    />

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
            v-if="store.image && !failedImages[store.key]"
            :src="store.image"
            :alt="store.name"
            class="buyer-discovery__photo"
            :class="{ 'buyer-discovery__photo--logo': store.imageIsLogo }"
            loading="lazy"
            decoding="async"
            @error="onImageError(store.key)"
          />
          <span v-else class="buyer-discovery__mark" aria-hidden="true">
            <Icon :icon="store.icon" width="36" height="36" />
          </span>
          <span
            v-if="store.image && !failedImages[store.key]"
            class="buyer-discovery__kind-icon"
            aria-hidden="true"
          >
            <Icon :icon="store.icon" width="14" height="14" />
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
import { computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'
import { venueImageIsLogo, venueImageUrl } from '@/utils/assetUrl'
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
const failedImages = reactive<Record<string, boolean>>({})

function onImageError(key: string) {
  failedImages[key] = true
}

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
      imageIsLogo: venueImageIsLogo(store),
      vertical,
      icon: meta.icon,
      kindLabel: t(meta.kindKey),
      to: id ? venueDetailLink(vertical, id) : { name: 'buyer.search' },
    }
  }),
)
</script>
