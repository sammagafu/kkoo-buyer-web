<template>
  <nav class="lp-quicknav" :aria-label="t('landing.quickNav.aria')">
    <div class="ui-container">
      <div class="lp-quicknav__track" role="list">
        <a
          v-for="item in navItems"
          :key="item.key"
          :href="`#${item.sectionId}`"
          class="lp-quicknav__chip"
          role="listitem"
          @click.prevent="jumpTo(item.sectionId)"
        >
          <Icon :icon="item.icon" aria-hidden="true" />
          <span>{{ t(item.labelKey) }}</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const navItems = [
  { key: 'services', sectionId: 'services', icon: 'solar:widget-5-bold', labelKey: 'landing.quickNav.services' },
  { key: 'sellers', sectionId: 'seller-value', icon: 'solar:shop-2-bold', labelKey: 'landing.quickNav.sellers' },
  { key: 'stories', sectionId: 'stories', icon: 'solar:chat-square-like-bold', labelKey: 'landing.premium.navStories' },
  { key: 'download', sectionId: 'download', icon: 'solar:download-minimalistic-bold', labelKey: 'landing.headerGetApp' },
] as const

function jumpTo(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
/* Mobile-first: swipeable chip rail with snap; centers itself on wider screens. */
.lp-quicknav {
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(var(--bs-body-color-rgb), 0.06);
}

.lp-quicknav__track {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.lp-quicknav__track::-webkit-scrollbar {
  display: none;
}

@media (min-width: 768px) {
  .lp-quicknav__track {
    justify-content: center;
    overflow-x: visible;
  }
}

.lp-quicknav__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  scroll-snap-align: start;
  min-height: 2.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.1);
  background: var(--bs-body-bg);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bs-body-color);
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.lp-quicknav__chip:hover {
  color: var(--bs-primary);
  border-color: rgba(var(--bs-primary-rgb), 0.4);
  background: rgba(var(--bs-primary-rgb), 0.06);
  transform: translateY(-1px);
}

.lp-quicknav__chip .iconify {
  font-size: 1rem;
  color: var(--bs-primary);
}
</style>
