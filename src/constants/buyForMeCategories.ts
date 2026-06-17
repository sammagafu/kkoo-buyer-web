/** KKOO Send me verticals — mirrors Flutter BuyForMeCategory. */
export type BuyForMeCategoryId = 'food' | 'grocery' | 'pharmacy' | 'store'

export type BuyForMeCategory = {
  id: BuyForMeCategoryId
  label: string
  apiSource: string
  shoppingArea: string
  icon: string
}

export const BUY_FOR_ME_CATEGORIES: BuyForMeCategory[] = [
  { id: 'food', label: 'Food', apiSource: 'eats', shoppingArea: 'Restaurants & food', icon: 'solar:cup-hot-bold' },
  { id: 'grocery', label: 'Groceries', apiSource: 'grocery', shoppingArea: 'Grocery stores', icon: 'solar:bag-2-bold' },
  { id: 'pharmacy', label: 'Pharmacy', apiSource: 'manual', shoppingArea: 'Pharmacy', icon: 'solar:medical-kit-bold' },
  { id: 'store', label: 'Store', apiSource: 'catalog', shoppingArea: "KKOO Store & marketplace", icon: 'solar:shop-bold' },
]

export function buyForMeCategoryById(id: string): BuyForMeCategory {
  return BUY_FOR_ME_CATEGORIES.find((c) => c.id === id) ?? BUY_FOR_ME_CATEGORIES[0]
}
