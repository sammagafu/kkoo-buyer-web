export type BuyForMeProductSelection = {
  productId?: number
  productTitle: string
  productPrice: number
  sellerId?: number
  storeName?: string
  storeSlug?: string
  distanceMeters: number
  distanceSurcharge: number
  lineTotal: number
  savingsAmount?: number
  compareAtTotal?: number
  distanceLabel: string
}

export type BuyForMeItemDraft = {
  key: string
  categoryId: string
  name: string
  price: number
  quantity: number
  selection: BuyForMeProductSelection | null
}

export function lineUnitTotal(item: BuyForMeItemDraft) {
  if (item.selection) return item.selection.lineTotal
  return Math.max(0, item.price || 0)
}

export function newItemDraft(categoryId: string, initialName = ''): BuyForMeItemDraft {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    categoryId,
    name: initialName,
    price: 0,
    quantity: 1,
    selection: null,
  }
}
