export const houseFeatureItems = [
  { key: 'escrow' as const, icon: 'solar:shield-check-bold', zone: 'stack' as const },
  { key: 'tracking' as const, icon: 'solar:map-point-bold', zone: 'stack' as const },
  { key: 'oneApp' as const, icon: 'solar:widget-5-bold', zone: 'stack' as const },
  { key: 'pos' as const, icon: 'solar:shop-2-bold', zone: 'grid' as const },
  { key: 'business' as const, icon: 'solar:document-text-bold', zone: 'grid' as const },
  { key: 'rewards' as const, icon: 'solar:gift-bold', zone: 'grid' as const },
] as const

export const houseFeatureStack = houseFeatureItems.filter((item) => item.zone === 'stack')
export const houseFeatureGrid = houseFeatureItems.filter((item) => item.zone === 'grid')
