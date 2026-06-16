<template>
  <MarketingLayout>
    <section class="lp-section webapp-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="webapp-hero-grid">
          <div>
            <p class="webapp-kicker">KKOO on the web</p>
            <h1 class="webapp-title">Shop, eat, stay, and ride without the mobile app.</h1>
            <p class="webapp-lead">
              Use the web experience to browse restaurants, hotels, marketplace products, and rides. Sign in once and
              keep one cart and checkout flow across every surface.
            </p>
            <div class="webapp-actions">
              <RouterLink :to="{ name: 'web.eats' }" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg">
                <span class="lp-btn-pill__label">Order food</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:cup-hot-bold" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
              <RouterLink :to="{ name: 'web.groceries' }" class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg">
                <span class="lp-btn-pill__label">Buy groceries</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:bag-2-bold" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
              <RouterLink :to="{ name: 'web.checkout' }" class="lp-btn-pill lp-btn-pill--ghost lp-btn-pill--lg">
                <span class="lp-btn-pill__label">Open checkout</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
            </div>
            <div class="webapp-links">
              <RouterLink :to="{ name: 'web.market' }" class="webapp-link">
                <Icon icon="solar:cart-large-2-bold" /> Marketplace
              </RouterLink>
              <RouterLink :to="{ name: 'web.eats' }" class="webapp-link">
                <Icon icon="solar:cup-hot-bold" /> Eats
              </RouterLink>
              <RouterLink :to="{ name: 'web.booking' }" class="webapp-link">
                <Icon icon="solar:bed-bold" /> Hotels
              </RouterLink>
              <RouterLink :to="{ name: 'web.ride' }" class="webapp-link">
                <Icon icon="solar:scooter-bold" /> Rides
              </RouterLink>
            </div>
          </div>
          <div class="webapp-hero-visual">
            <div class="webapp-hero-card">
              <div class="webapp-hero-card-head">Unified web ordering</div>
              <ul class="webapp-hero-list">
                <li><Icon icon="solar:cart-large-2-bold" /> Marketplace / grocery</li>
                <li><Icon icon="solar:cup-hot-bold" /> Eats / restaurants</li>
                <li><Icon icon="solar:bed-bold" /> Hotels / stays</li>
                <li><Icon icon="solar:scooter-bold" /> Rides / delivery</li>
              </ul>
              <div class="webapp-hero-foot">
                <RouterLink :to="{ name: 'web.checkout' }" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm">
                  <span class="lp-btn-pill__label">Start now</span>
                  <span class="lp-btn-pill__well" aria-hidden="true">
                    <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                  </span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section webapp-grid-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="webapp-grid">
          <article v-for="card in cards" :key="card.title" class="webapp-card">
            <div class="webapp-card-icon">
              <Icon :icon="card.icon" />
            </div>
            <h3 class="webapp-card-title">{{ card.title }}</h3>
            <p class="webapp-card-copy">{{ card.copy }}</p>
            <div class="webapp-card-actions">
              <RouterLink :to="card.to" class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm">
                <span class="lp-btn-pill__label">{{ card.cta }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </RouterLink>
            </div>
          </article>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'

const cards = [
  {
    title: 'Eats on the web',
    copy: 'Browse restaurants, add menu items to cart, and check out on the web if you prefer desktop ordering.',
    icon: 'solar:cup-hot-bold',
    to: { name: 'web.eats' },
    cta: 'Order food',
  },
  {
    title: 'Hotels & stays',
    copy: 'Open hotel microsites, explore rooms and services, and finish booking in the unified checkout.',
    icon: 'solar:bed-bold',
    to: { name: 'web.booking' },
    cta: 'Book a stay',
  },
  {
    title: 'Marketplace & grocery',
    copy: 'Use the web to explore seller microsites and marketplace listings, then check out without switching to mobile.',
    icon: 'solar:cart-large-2-bold',
    to: { name: 'web.market' },
    cta: 'Shop products',
  },
  {
    title: 'Rides & delivery',
    copy: 'Request rides or delivery through the web entry points when the app is not available.',
    icon: 'solar:scooter-bold',
    to: { name: 'web.ride' },
    cta: 'Request a ride',
  },
  {
    title: 'Careers (drivers)',
    copy: 'Join as a courier/driver and keep your earnings and routes in one place.',
    icon: 'solar:run-bold',
    to: { name: 'pages.courier' },
    cta: 'View driver page',
  },
]
</script>

<style scoped>
.webapp-hero {
  background:
    radial-gradient(circle at 18% 24%, rgba(92, 48, 143, 0.16), transparent 34%),
    radial-gradient(circle at 82% 18%, rgba(247, 168, 41, 0.16), transparent 28%);
}
.webapp-hero-grid {
  display: grid;
  gap: 1.35rem;
  align-items: center;
}
@media (min-width: 992px) {
  .webapp-hero-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.95fr);
  }
}
.webapp-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 800;
  font-size: 0.78rem;
  color: #5c308f;
}
.webapp-title {
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.05;
  margin: 0.75rem 0;
  max-width: 18ch;
}
.webapp-lead {
  max-width: 60ch;
  color: var(--bs-secondary-color);
  font-size: 1.02rem;
  line-height: 1.7;
}
.webapp-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, auto));
  gap: 0.8rem;
  align-items: stretch;
  margin-top: 1.1rem;
}
.webapp-hero-visual {
  justify-self: center;
}
.webapp-hero-card {
  width: min(420px, 90vw);
  border-radius: 1.75rem;
  padding: 1.4rem;
  background:
    radial-gradient(circle at 30% 20%, rgba(247, 168, 41, 0.16), transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(240, 236, 250, 0.96));
  border: 1px solid rgba(92, 48, 143, 0.15);
  box-shadow: 0 24px 60px rgba(35, 20, 46, 0.18);
}
.webapp-hero-card-head {
  font-weight: 800;
  font-size: 0.95rem;
  color: #5c308f;
  margin-bottom: 0.6rem;
}
.webapp-hero-list {
  list-style: none;
  margin: 0 0 1rem 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
  color: var(--bs-body-color);
  font-weight: 600;
}
.webapp-hero-list li {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.webapp-hero-list .iconify {
  color: #5c308f;
}
.webapp-hero-foot {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.6rem;
}
.webapp-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.65rem;
}
.webapp-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #5c308f;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 18px rgba(35, 20, 46, 0.08);
}
.webapp-link .iconify {
  font-size: 0.95rem;
}
.webapp-grid-section {
  background: radial-gradient(circle at 16% 18%, rgba(92, 48, 143, 0.08), transparent 34%);
  padding-top: clamp(1.6rem, 3vw, 2.2rem);
}
.webapp-grid {
  display: grid;
  gap: 1.1rem;
}
@media (min-width: 992px) {
  .webapp-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}
.webapp-card {
  border-radius: 1.25rem;
  padding: 1.2rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 14px 32px rgba(35, 20, 46, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.webapp-card-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.9rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(92, 48, 143, 0.14), rgba(247, 168, 41, 0.14));
  color: #5c308f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.webapp-card-title {
  font-size: 1.05rem;
  margin: 0;
}
.webapp-card-copy {
  color: var(--bs-secondary-color);
  margin: 0;
  line-height: 1.6;
  flex: 1;
}
.webapp-card-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 0.3rem;
}
</style>
