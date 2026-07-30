import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { allRoutes } from './routes/index';
import { useAuthStore } from '@/stores/auth'
import { initNavigationAnalytics } from '@/services/navigationAnalytics'
import { isPublicMarketingRouteName } from '@/constants/publicRoutes'
import { ensureAuthSessionValid } from '@/utils/ensureAuthSession'
import {
  canUseStoreSubdomain,
  isStoreSubdomainHost,
  storeSlugFromHostname,
} from '@/utils/storePublicUrl'

const hostSlugAtBoot =
  typeof window !== 'undefined' ? storeSlugFromHostname() : null

const routes: RouteRecordRaw[] = [...allRoutes]
if (hostSlugAtBoot) {
  // On {slug}.kkooapp.co.tz, `/` is the storefront (not the marketplace home).
  routes.unshift({
    path: '/',
    name: 'store.microsite.host',
    meta: { title: 'Store' },
    component: () => import('@/views/store/BusinessMicrosite.vue'),
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 72 };
    }
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title;
  if (title) {
    document.title = title.toString();
  }
  const description = to.meta.description;
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && typeof description === 'string') {
    descEl.setAttribute('content', description);
  } else if (descEl && !description) {
    descEl.setAttribute(
      'content',
      "Shop, eat, send, and order groceries on KKOO. Escrow, tracking, and rewards — Tanzania's super-app.",
    );
  }
  next();
});

/**
 * Store subdomain hosts ({slug}.kkooapp.co.tz):
 * - `/` and `/store/*` → microsite
 * - checkout / auth / other app routes stay available on the same host
 * Apex production: `/store/:slug` → https://{slug}.kkooapp.co.tz
 */
router.beforeEach((to, _from, next) => {
  const hostSlug = storeSlugFromHostname();
  if (hostSlug) {
    const path = to.path.toLowerCase();
    const isStorefrontPath =
      to.name === 'store.microsite' ||
      to.name === 'store.microsite.host' ||
      path === '/' ||
      path.startsWith('/store/');

    if (!isStorefrontPath) {
      return next();
    }

    if (
      (to.name === 'store.microsite' || to.name === 'store.microsite.host') &&
      (to.name === 'store.microsite.host' || String(to.params.slugOrId || '') === hostSlug)
    ) {
      return next();
    }

    if (to.name === 'store.microsite.host' || path === '/') {
      return next({ name: 'store.microsite.host', query: to.query, hash: to.hash, replace: true });
    }

    return next({
      name: 'store.microsite',
      params: { slugOrId: hostSlug },
      query: to.query,
      hash: to.hash,
      replace: true,
    });
  }

  if (
    to.name === 'store.microsite' &&
    typeof window !== 'undefined' &&
    import.meta.env.PROD &&
    !isStoreSubdomainHost()
  ) {
    const slug = String(to.params.slugOrId || '').trim().toLowerCase();
    const host = window.location.hostname.toLowerCase();
    const onApex = host === 'kkooapp.co.tz' || host === 'www.kkooapp.co.tz';
    if (onApex && canUseStoreSubdomain(slug)) {
      const search = to.fullPath.includes('?') ? to.fullPath.slice(to.fullPath.indexOf('?')) : '';
      window.location.replace(`https://${slug}.kkooapp.co.tz/${search}${to.hash || ''}`);
      return;
    }
  }

  next();
});

/** Buyer web: only routes with meta.authRequired need login; marketing pages stay public. */
router.beforeEach(async (routeTo, _routeFrom, next) => {
  const isPublicMarketing = isPublicMarketingRouteName(routeTo.name);

  const auth = useAuthStore();
  await auth.initialize();

  if (
    routeTo.name === 'store.microsite' ||
    routeTo.name === 'store.microsite.host' ||
    isStoreSubdomainHost()
  ) {
    // Microsite itself is public; checkout/auth on the store host still honor meta.authRequired below.
    if (
      routeTo.name === 'store.microsite' ||
      routeTo.name === 'store.microsite.host' ||
      routeTo.path === '/' ||
      routeTo.path.toLowerCase().startsWith('/store/')
    ) {
      return next();
    }
  }

  if (isPublicMarketing) {
    return next();
  }

  if (auth.isAuthenticated) {
    // Sign-up: send signed-in users into the app. Sign-in stays reachable so they can
    // Continue to KKOO or switch accounts.
    if (routeTo.name === 'auth.sign-up') {
      return next(auth.defaultRouteAfterAuth());
    }
  }

  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);
  if (!authRequired) return next();

  const sessionValid = await ensureAuthSessionValid(auth);
  if (!sessionValid) {
    return next({ name: 'auth.sign-in', query: { redirectedFrom: routeTo.fullPath } });
  }
  next();
});

initNavigationAnalytics(router);

export default router;
