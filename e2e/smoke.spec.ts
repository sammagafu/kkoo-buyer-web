import { expect, test } from '@playwright/test'

test.describe('P0 smokes', () => {
  test('invite?ref= redirects guests to sign-up with ref', async ({ page }) => {
    await page.goto('/invite?ref=INVITE99')
    await page.waitForURL(/sign-up/i, { timeout: 15_000 })
    expect(page.url()).toMatch(/ref=INVITE99/)
    const stored = await page.evaluate(() => sessionStorage.getItem('kkoo_pending_referral_code'))
    // Either still in URL or captured in sessionStorage by invite/sign-up flow
    expect(stored === 'INVITE99' || page.url().includes('ref=INVITE99')).toBeTruthy()
  })

  test('product page with share ref stores pending share code', async ({ page }) => {
    await page.route('**/api/v1/catalog/products/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 42,
          title: 'Smoke Product',
          slug: 'smoke-product',
          base_price: 5000,
          skus: [{ id: 7, is_available: true, stock_quantity: 10 }],
        }),
      })
    })
    await page.route('**/api/v1/**', async (route) => {
      if (route.request().url().includes('/catalog/products/')) {
        return route.fallback()
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    })

    await page.goto('/product/s/smoke-product?ref=aabbccddeeff0011')
    await page.waitForTimeout(800)
    const code = await page.evaluate(() => sessionStorage.getItem('kkoo_pending_share_code'))
    expect(code).toBe('aabbccddeeff0011')
  })

  test('marketplace home loads campaign carousel or strip shell', async ({ page }) => {
    await page.route('**/api/v1/campaigns/active/**', async (route) => {
      const url = route.request().url()
      const placement = new URL(url).searchParams.get('placement')
      const results =
        placement === 'promo_banner'
          ? [
              {
                id: 2,
                title: 'Strip Deal',
                placement: 'promo_banner',
                image_url: '',
                cta_label: 'Shop',
                cta_route: '/marketplace',
              },
            ]
          : [
              {
                id: 1,
                title: 'Hero Preorder',
                placement: 'home_hero',
                action_type: 'preorder',
                badge: 'preorder',
                badge_label: 'Preorder',
                remaining_stock: 100,
                image_url: '',
                cta_label: 'Preorder',
                cta_route: '/product/s/smoke-product',
              },
            ]
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ results }),
      })
    })
    await page.route('**/api/v1/**', async (route) => {
      if (route.request().url().includes('/campaigns/active/')) {
        return route.fallback()
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ results: [], products: [], stores: [] }),
      })
    })

    await page.goto('/marketplace')
    await expect(page.locator('.buyer-promo-fs, .buyer-promo-strip').first()).toBeVisible({
      timeout: 20_000,
    })
  })
})
