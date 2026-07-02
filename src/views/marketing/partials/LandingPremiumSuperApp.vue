<template>
  <section id="services" class="lp-bento-section lp-services">
    <div class="ui-container">
      <header class="lp-services__head ui-reveal">
        <p class="lp-services__eyebrow">{{ t('landing.superApp.eyebrow') }}</p>
        <h2 class="lp-bento-section__title">{{ t('landing.superApp.headline') }}</h2>
        <p class="lp-services__lead">{{ t('landing.superApp.lead') }}</p>
      </header>

      <div class="lp-services__pillars" role="tablist" :aria-label="t('landing.superApp.tabsAria')">
        <button
          v-for="pillar in superAppPillars"
          :key="pillar.id"
          type="button"
          role="tab"
          class="lp-services__pillar"
          :class="[
            `lp-services__pillar--${pillar.tone}`,
            { 'lp-services__pillar--active': activePillar === pillar.id },
          ]"
          :aria-selected="activePillar === pillar.id"
          @click="selectPillar(pillar.id)"
        >
          <Icon :icon="pillar.icon" class="lp-services__pillar-icon" aria-hidden="true" />
          {{ t(pillar.labelKey) }}
        </button>
      </div>

      <p class="lp-services__desc">{{ t(activePillarMeta.descKey) }}</p>

      <Transition name="lp-services-panel" mode="out-in">
        <div :key="activePillar" class="lp-services__panel" role="tabpanel">
          <ul class="lp-services__list">
            <li v-for="item in flatItems" :key="item.key">
              <component
                :is="item.href ? 'a' : 'router-link'"
                :href="item.href"
                :to="item.to"
                class="lp-services__row text-decoration-none"
                :target="item.href ? '_blank' : undefined"
                :rel="item.href ? 'noopener noreferrer' : undefined"
              >
                <span class="lp-services__row-icon" aria-hidden="true">
                  <Icon :icon="item.icon" />
                </span>
                <span class="lp-services__row-body">
                  <span class="lp-services__row-title">{{ t(item.labelKey) }}</span>
                  <span class="lp-services__row-desc">{{ t(item.descKey) }}</span>
                </span>
                <Icon icon="solar:arrow-right-linear" class="lp-services__row-arrow" aria-hidden="true" />
              </component>
            </li>
          </ul>
        </div>
      </Transition>

      <div v-if="activePillar === 'sell'" class="lp-services__earn">
        <h3 class="lp-services__earn-title">{{ t('landing.superApp.earnHeadline') }}</h3>
        <div class="lp-services__earn-grid">
          <component
            v-for="card in superAppEarnCards"
            :key="card.key"
            :is="card.href ? 'a' : 'router-link'"
            :href="card.href"
            :to="card.to"
            class="lp-services__earn-card text-decoration-none"
            :target="card.href ? '_blank' : undefined"
            :rel="card.href ? 'noopener noreferrer' : undefined"
          >
            <Icon :icon="card.icon" class="lp-services__earn-icon" aria-hidden="true" />
            <span class="lp-services__earn-label">{{ t(card.labelKey) }}</span>
            <span class="lp-services__earn-desc">{{ t(card.descKey) }}</span>
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import {
  superAppEarnCards,
  superAppPillarGroups,
  superAppPillars,
  type SuperAppPillarId,
} from '@/config/landing-superapp'
import { useLandingPillar } from '@/composables/useLandingPillar'

const { t } = useI18n()
const { activePillar, navigateToPillar, syncPillarFromHash } = useLandingPillar()

const activePillarMeta = computed(
  () => superAppPillars.find((p) => p.id === activePillar.value) ?? superAppPillars[0],
)

const flatItems = computed(() =>
  superAppPillarGroups[activePillar.value].flatMap((group) => group.items),
)

function selectPillar(id: SuperAppPillarId) {
  navigateToPillar(id, false)
}

function onHashChange() {
  syncPillarFromHash()
}

onMounted(() => {
  syncPillarFromHash()
  window.addEventListener('hashchange', onHashChange)
})
onUnmounted(() => window.removeEventListener('hashchange', onHashChange))
</script>
