import { createRouter, createWebHistory } from 'vue-router';
import { allRoutes } from './routes/index';
import { useAuthStore } from '@/stores/auth'
import { initNavigationAnalytics } from '@/services/navigationAnalytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
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

/** Buyer web: only routes with meta.authRequired need login; any signed-in user is allowed. */
router.beforeEach(async (routeTo, _routeFrom, next) => {
  const auth = useAuthStore();
  await auth.initialize();

  if (auth.isAuthenticated) {
    if (routeTo.name === 'auth.sign-in' || routeTo.name === 'auth.sign-up') {
      return next(auth.defaultRouteAfterAuth());
    }
  }

  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);
  if (!authRequired) return next();

  if (!auth.isAuthenticated) {
    return next({ name: 'auth.sign-in', query: { redirectedFrom: routeTo.fullPath } });
  }
  next();
});

initNavigationAnalytics(router);

export default router;
