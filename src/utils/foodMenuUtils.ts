import type { RestaurantMenuItem } from '@/api/superApp'

export type FoodCourse =
  | 'starter'
  | 'main'
  | 'side'
  | 'dessert'
  | 'beverage'
  | 'snack'
  | 'other'

export const FOOD_COURSE_ORDER: FoodCourse[] = [
  'starter',
  'main',
  'side',
  'dessert',
  'beverage',
  'snack',
  'other',
]

const COURSE_SET = new Set<string>(FOOD_COURSE_ORDER)

/** Infer course when API omits course_type (category name heuristics). */
export function inferCourseType(
  product: RestaurantMenuItem,
  categoryName = '',
  categorySlug = '',
): FoodCourse {
  const raw = String(product.course_type ?? '').trim().toLowerCase()
  if (raw && COURSE_SET.has(raw)) return raw as FoodCourse

  const hay = `${product.title ?? ''} ${categoryName} ${categorySlug}`.toLowerCase()
  if (/\b(drink|drinks|beverage|soda|juice|coffee|tea|water|smoothie)\b/.test(hay)) {
    return 'beverage'
  }
  if (/\b(side|sides|fries|chips|salad|extra)\b/.test(hay)) return 'side'
  if (/\b(starter|appetizer|soup)\b/.test(hay)) return 'starter'
  if (/\b(dessert|sweet|cake|ice.?cream)\b/.test(hay)) return 'dessert'
  if (/\b(snack|snacks)\b/.test(hay)) return 'snack'
  return 'main'
}

export function priceOf(product: RestaurantMenuItem): number {
  const sku = product.skus?.[0]
  if (sku?.price_override != null && sku.price_override >= 0) return Number(sku.price_override)
  if (product.discount_price != null && product.discount_price >= 0) return Number(product.discount_price)
  if (product.price != null && product.price >= 0) return Number(product.price)
  if (product.base_price != null && product.base_price >= 0) return Number(product.base_price)
  return 0
}

export function canAddToCart(product: RestaurantMenuItem): boolean {
  return Boolean(product.id && product.skus?.[0]?.id)
}

export function groupByCourse(
  products: RestaurantMenuItem[],
  categoryHint?: { name?: string; slug?: string },
): Record<FoodCourse, RestaurantMenuItem[]> {
  const map = Object.fromEntries(FOOD_COURSE_ORDER.map((c) => [c, [] as RestaurantMenuItem[]])) as Record<
    FoodCourse,
    RestaurantMenuItem[]
  >
  for (const p of products) {
    const course = inferCourseType(p, categoryHint?.name, categoryHint?.slug)
    map[course].push(p)
  }
  return map
}

export function flattenMenuWithCourses(
  categories: { name?: string; slug?: string; products?: RestaurantMenuItem[] }[],
): RestaurantMenuItem[] {
  const out: RestaurantMenuItem[] = []
  for (const cat of categories) {
    for (const p of cat.products ?? []) {
      out.push({
        ...p,
        course_type: inferCourseType(p, cat.name, cat.slug),
      })
    }
  }
  return out
}

export function comboBuckets(products: RestaurantMenuItem[]) {
  const mains = products.filter((p) => inferCourseType(p) === 'main' && canAddToCart(p))
  const sides = products.filter((p) => inferCourseType(p) === 'side' && canAddToCart(p))
  const drinks = products.filter((p) => inferCourseType(p) === 'beverage' && canAddToCart(p))
  /** Fallbacks when course_type is missing everywhere: use category-inferred list, else first half as mains */
  const usableMains = mains.length ? mains : products.filter(canAddToCart).slice(0, Math.ceil(products.length / 2))
  const usableSides = sides.length
    ? sides
    : products.filter((p) => canAddToCart(p) && !usableMains.includes(p)).slice(0, 8)
  const usableDrinks = drinks.length
    ? drinks
    : products.filter((p) => canAddToCart(p) && !usableMains.includes(p) && !usableSides.includes(p)).slice(0, 8)

  return {
    mains: usableMains,
    sides: usableSides,
    drinks: usableDrinks,
    canBuildCombo: usableMains.length > 0 && (usableSides.length > 0 || usableDrinks.length > 0),
  }
}

export function formatTzs(amount: number): string {
  return `TZS ${Math.round(amount).toLocaleString('en-TZ')}`
}
