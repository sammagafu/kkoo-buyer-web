import { describe, expect, it } from 'vitest'
import { landingHeroImage, landingPhoneImage, serviceCardImage } from '@/config/landing-images'
import { needsFullAppStyles } from '@/styles/loadAppStyles'

describe('landing responsive images', () => {
  it('serves a sized WebP srcset for the LCP hero', () => {
    expect(landingHeroImage.src).toContain('hero-960.webp')
    expect(landingHeroImage.srcset).toContain('640w')
    expect(landingHeroImage.srcset).toContain('1280w')
    expect(landingHeroImage.sizes).toContain('100vw')
  })

  it('keeps service cards at 2x display width', () => {
    const food = serviceCardImage('food')
    expect(food.src).toBe('/images/landing/services/food-820.webp')
    expect(food.srcset).toContain('food-410.webp 410w')
    expect(food.width).toBe(820)
  })

  it('provides a compact phone mock', () => {
    expect(landingPhoneImage.srcset).toContain('400w')
  })
})

describe('homepage style splitting', () => {
  it('keeps the apex homepage on the slim landing CSS', () => {
    expect(needsFullAppStyles('/')).toBe(false)
    expect(needsFullAppStyles('/market')).toBe(true)
    expect(needsFullAppStyles('/eats?ref=home')).toBe(true)
  })
})
