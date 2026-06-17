import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BUYER_ACCOUNT_TILES, BUYER_SERVICE_TILES, type BuyerFeatureTile } from '@/constants/buyerFeatures'

function mapTiles(tiles: BuyerFeatureTile[], prefix: 'service' | 'account', t: (key: string) => string) {
  return tiles.map((tile) => ({
    ...tile,
    title: t(`buyerXp.features.${prefix}.${tile.id}.title`),
    subtitle: t(`buyerXp.features.${prefix}.${tile.id}.subtitle`),
  }))
}

export function useBuyerFeatureTiles() {
  const { t, locale } = useI18n()
  const serviceTiles = computed(() => {
    void locale.value
    return mapTiles(BUYER_SERVICE_TILES, 'service', t)
  })
  const accountTiles = computed(() => {
    void locale.value
    return mapTiles(BUYER_ACCOUNT_TILES, 'account', t)
  })
  return { serviceTiles, accountTiles }
}
