<template>
  <Teleport to="body">
    <div
      class="lh-mega"
      :data-theme="theme"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
    >
      <div class="lh-mega__backdrop" @click="emit('close')" />
      <div class="lh-mega__panel">
        <div class="lh-mega__top">
          <button type="button" class="lh-mega__close" aria-label="Close menu" @click="emit('close')">
            <Icon icon="solar:close-circle-bold" width="28" height="28" />
          </button>
        </div>

        <div class="lh-mega__layout">
          <nav class="lh-mega__rail" aria-label="Menu sections">
            <button
              v-for="section in sections"
              :key="section.key"
              type="button"
              class="lh-mega__rail-btn"
              :class="{ 'is-active': activeKey === section.key }"
              :aria-pressed="activeKey === section.key"
              @click="activeKey = section.key"
            >
              {{ t(section.labelKey) }}
            </button>
          </nav>

          <div class="lh-mega__body">
            <p class="lh-mega__section-label">{{ t(activeSection.labelKey) }}</p>
            <ul class="lh-mega__grid">
              <li v-for="item in activeSection.items" :key="item.key">
                <RouterLink
                  v-if="'route' in item && item.route"
                  :to="item.route"
                  class="lh-mega__card"
                  @click="emit('close')"
                >
                  <span class="lh-mega__card-icon" :data-accent="item.accent" aria-hidden="true">
                    <Icon :icon="item.icon" width="28" height="28" />
                  </span>
                  <span class="lh-mega__card-copy">
                    <span class="lh-mega__card-title">{{ t(item.labelKey) }}</span>
                    <span v-if="item.descKey" class="lh-mega__card-desc">{{ t(item.descKey) }}</span>
                  </span>
                  <Icon icon="solar:arrow-right-linear" class="lh-mega__card-arrow" aria-hidden="true" />
                </RouterLink>
                <a
                  v-else-if="'href' in item && item.href"
                  :href="item.href"
                  class="lh-mega__card"
                  rel="noopener"
                  @click="emit('close')"
                >
                  <span class="lh-mega__card-icon" :data-accent="item.accent" aria-hidden="true">
                    <Icon :icon="item.icon" width="28" height="28" />
                  </span>
                  <span class="lh-mega__card-copy">
                    <span class="lh-mega__card-title">{{ t(item.labelKey) }}</span>
                    <span v-if="item.descKey" class="lh-mega__card-desc">{{ t(item.descKey) }}</span>
                  </span>
                  <Icon icon="solar:arrow-right-linear" class="lh-mega__card-arrow" aria-hidden="true" />
                </a>
              </li>
            </ul>

            <div v-if="'promos' in activeSection && activeSection.promos?.length" class="lh-mega__promos">
              <RouterLink
                v-for="promo in activeSection.promos"
                :key="promo.key"
                :to="promo.route"
                class="lh-mega__promo"
                :data-accent="promo.accent"
                @click="emit('close')"
              >
                <span class="lh-mega__promo-title">{{ t(promo.titleKey) }}</span>
                <span class="lh-mega__promo-cta">{{ t(promo.ctaKey) }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
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

watch(
  () => props.initialSection,
  (key) => {
    if (key) activeKey.value = key
  },
)

const activeSection = computed(
  () => sections.find((s) => s.key === activeKey.value) ?? sections[0]!,
)
</script>
