<template>
  <Teleport to="body">
    <div
      class="lh-mega"
      :data-theme="theme"
      role="dialog"
      aria-modal="true"
      :aria-label="t('landingHouse.a11y.mainNav')"
      @keydown.escape.prevent="emit('close')"
    >
      <div class="lh-mega__backdrop" @click="emit('close')" />

      <div class="lh-mega__panel" role="document">
        <header class="lh-mega__head">
          <div class="lh-mega__head-copy">
            <p class="lh-mega__brand">{{ houseCopy.brand }}</p>
            <h2 class="lh-mega__title">{{ t(activeSection.labelKey) }}</h2>
          </div>
          <button
            ref="closeRef"
            type="button"
            class="lh-mega__close"
            :aria-label="t('landingHouse.a11y.closeMenu')"
            @click="emit('close')"
          >
            <Icon icon="solar:close-square-linear" width="22" height="22" />
          </button>
        </header>

        <div class="lh-mega__layout">
          <nav class="lh-mega__rail" :aria-label="t('landingHouse.a11y.menuSections')">
            <button
              v-for="section in sections"
              :key="section.key"
              type="button"
              class="lh-mega__rail-btn"
              :class="{ 'is-active': activeKey === section.key }"
              :aria-pressed="activeKey === section.key"
              @click="activeKey = section.key"
            >
              <span class="lh-mega__rail-label">{{ t(section.labelKey) }}</span>
              <span class="lh-mega__rail-count" aria-hidden="true">{{ section.items.length }}</span>
            </button>
          </nav>

          <div class="lh-mega__body">
            <ul class="lh-mega__list" role="list">
              <li v-for="item in activeSection.items" :key="item.key">
                <RouterLink
                  v-if="'route' in item && item.route"
                  :to="item.route"
                  class="lh-mega__link"
                  @click="emit('close')"
                >
                  <span class="lh-mega__link-icon" :data-accent="item.accent" aria-hidden="true">
                    <Icon :icon="item.icon" width="20" height="20" />
                  </span>
                  <span class="lh-mega__link-copy">
                    <span class="lh-mega__link-title">{{ t(item.labelKey) }}</span>
                    <span v-if="item.descKey" class="lh-mega__link-desc">{{ t(item.descKey) }}</span>
                  </span>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    class="lh-mega__link-arrow"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  />
                </RouterLink>
                <a
                  v-else-if="'href' in item && item.href"
                  :href="item.href"
                  class="lh-mega__link"
                  rel="noopener"
                  @click="emit('close')"
                >
                  <span class="lh-mega__link-icon" :data-accent="item.accent" aria-hidden="true">
                    <Icon :icon="item.icon" width="20" height="20" />
                  </span>
                  <span class="lh-mega__link-copy">
                    <span class="lh-mega__link-title">{{ t(item.labelKey) }}</span>
                    <span v-if="item.descKey" class="lh-mega__link-desc">{{ t(item.descKey) }}</span>
                  </span>
                  <Icon
                    icon="solar:arrow-right-up-linear"
                    class="lh-mega__link-arrow"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>

            <div
              v-if="'promos' in activeSection && activeSection.promos?.length"
              class="lh-mega__featured"
            >
              <RouterLink
                v-for="promo in activeSection.promos"
                :key="promo.key"
                :to="promo.route"
                class="lh-mega__featured-item"
                :data-accent="promo.accent"
                @click="emit('close')"
              >
                <span class="lh-mega__featured-copy">
                  <span class="lh-mega__featured-title">{{ t(promo.titleKey) }}</span>
                  <span class="lh-mega__featured-cta">
                    {{ t(promo.ctaKey) }}
                    <Icon icon="solar:arrow-right-linear" width="14" height="14" aria-hidden="true" />
                  </span>
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { houseCopy } from '@/config/landing-house'
import { houseMegaSections } from '@/config/landing-links'
import { useLayoutStore } from '@/stores/layout'

const props = withDefaults(
  defineProps<{
    initialSection?: string
  }>(),
  { initialSection: 'products' },
)

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { layout } = storeToRefs(useLayoutStore())
const theme = computed(() => (layout.value.theme === 'dark' ? 'dark' : 'light'))
const sections = houseMegaSections
const activeKey = ref(props.initialSection)
const closeRef = ref<HTMLButtonElement | null>(null)

watch(
  () => props.initialSection,
  (key) => {
    if (key) activeKey.value = key
  },
)

const activeSection = computed(
  () => sections.find((s) => s.key === activeKey.value) ?? sections[0]!,
)

onMounted(async () => {
  await nextTick()
  closeRef.value?.focus()
})
</script>
