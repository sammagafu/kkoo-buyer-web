export const baseBrand = 'KKOOAPP — Shop, order, and run your business in one place'

export function setTitle(title: string) {
  const base = 'KKOOAPP — Shop & order'
  return title ? `[Buyer] ${title} | ${base}` : `[Buyer] ${base}`
}

export function setLandingTitle(title: string) {
  return title ? `${title} | ${baseBrand}` : baseBrand
}
