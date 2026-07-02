<template>
  <div class="lp-vivid-flow">
    <section id="services" class="lp-vivid-flow__section">
      <div class="container-lg">
        <header class="lp-vivid-flow__head text-center">
          <span class="lp-section-pill">{{ t('landing.superApp.eyebrow') }}</span>
          <h2 class="lp-vivid-flow__title">{{ t('landing.superApp.headline') }}</h2>
          <p class="lp-vivid-flow__lead">{{ t('landing.superApp.lead') }}</p>
        </header>

        <div class="lp-vivid-audience" role="tablist" :aria-label="t('landing.superApp.tabsAria')">
          <button
            v-for="audience in superAppAudiences"
            :key="audience.id"
            type="button"
            role="tab"
            class="lp-vivid-audience__card"
            :class="[
              `lp-vivid-audience__card--${audience.id}`,
              { 'lp-vivid-audience__card--active': activeAudience === audience.id },
            ]"
            :aria-selected="activeAudience === audience.id"
            @click="activeAudience = audience.id"
          >
            <span class="lp-vivid-audience__icon" aria-hidden="true">
              <Icon :icon="audience.icon" />
            </span>
            <span class="lp-vivid-audience__label">{{ t(audience.labelKey) }}</span>
          </button>
        </div>

        <p class="lp-vivid-flow__audience-desc text-center">{{ t(activeAudienceMeta.descKey) }}</p>

        <Transition name="lp-vivid-panel" mode="out-in">
          <div :key="activeAudience" role="tabpanel">
            <div
              v-for="group in activeGroups"
              :key="group.key"
              class="lp-vivid-group"
            >
              <h3 class="lp-vivid-group__title">{{ t(group.titleKey) }}</h3>
              <div class="lp-vivid-grid" role="list">
                <component
                  v-for="(item, idx) in group.items"
                  :key="item.key"
                  :is="item.href ? 'a' : 'router-link'"
                  :href="item.href"
                  :to="item.to"
                  class="lp-vivid-card text-decoration-none"
                  :class="`lp-vivid-card--${accentFor(group.key, idx)}`"
                  :target="item.href ? '_blank' : undefined"
                  :rel="item.href ? 'noopener noreferrer' : undefined"
                  role="listitem"
                >
                  <span class="lp-vivid-card__stripe" aria-hidden="true" />
                  <span class="lp-vivid-card__icon" aria-hidden="true">
                    <Icon :icon="item.icon" />
                  </span>
                  <span class="lp-vivid-card__body">
                    <span class="lp-vivid-card__title">{{ t(item.labelKey) }}</span>
                    <span class="lp-vivid-card__desc">{{ t(item.descKey) }}</span>
                  </span>
                  <Icon icon="solar:arrow-right-up-linear" class="lp-vivid-card__arrow" aria-hidden="true" />
                </component>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <section id="earn" class="lp-vivid-flow__section lp-vivid-flow__section--earn">
      <div class="container-lg">
        <header class="lp-vivid-flow__head text-center">
          <span class="lp-section-pill">{{ t('landing.superApp.earnEyebrow') }}</span>
          <h2 class="lp-vivid-flow__title">{{ t('landing.superApp.earnHeadline') }}</h2>
          <p class="lp-vivid-flow__lead">{{ t('landing.superApp.earnLead') }}</p>
        </header>

        <div class="lp-vivid-earn" role="list">
          <component
            v-for="(card, i) in superAppEarnCards"
            :key="card.key"
            :is="card.href ? 'a' : 'router-link'"
            :href="card.href"
            :to="card.to"
            class="lp-vivid-earn__card text-decoration-none"
            :class="`lp-vivid-earn__card--${earnTones[i] ?? 'purple'}`"
            :target="card.href ? '_blank' : undefined"
            :rel="card.href ? 'noopener noreferrer' : undefined"
            role="listitem"
          >
            <span class="lp-vivid-earn__icon" aria-hidden="true">
              <Icon :icon="card.icon" />
            </span>
            <h3 class="lp-vivid-earn__title">{{ t(card.labelKey) }}</h3>
            <p class="lp-vivid-earn__desc">{{ t(card.descKey) }}</p>
            <span class="lp-vivid-earn__cta">
              {{ t('landing.superApp.earnCta') }}
              <Icon icon="solar:arrow-right-linear" />
            </span>
          </component>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import {
  superAppAudiences,
  superAppEarnCards,
  superAppServiceGroups,
  type SuperAppAudienceId,
} from '@/config/landing-superapp'

const { t } = useI18n()
const activeAudience = ref<SuperAppAudienceId>('consumer')

const activeAudienceMeta = computed(
  () => superAppAudiences.find((a) => a.id === activeAudience.value) ?? superAppAudiences[0],
)
const activeGroups = computed(() => superAppServiceGroups[activeAudience.value])

const earnTones = ['gold', 'teal', 'purple'] as const
const accentCycle = ['food', 'grocery', 'ride', 'shop', 'purple', 'teal'] as const

function accentFor(groupKey: string, index: number) {
  const hash = groupKey.split('').reduce((n, c) => n + c.charCodeAt(0), 0)
  return accentCycle[(hash + index) % accentCycle.length]
}
</script>

<style scoped>
.lp-vivid-flow__section {
  padding: clamp(3.5rem, 8vw, 5.5rem) 0;
}

.lp-vivid-flow__section--earn {
  background: linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.06) 0%, transparent 100%);
}

html[data-bs-theme='dark'] .lp-vivid-flow__section--earn {
  background: linear-gradient(180deg, rgba(var(--bs-primary-rgb), 0.12) 0%, transparent 100%);
}

.lp-vivid-flow__head {
  max-width: 42rem;
  margin: 0 auto 2rem;
}

.lp-vivid-flow__title {
  margin: 0.75rem 0 0.85rem;
  font-size: clamp(1.85rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: var(--bs-body-color);
}

.lp-vivid-flow__lead {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  color: rgba(var(--bs-body-color-rgb), 0.68);
}

.lp-vivid-flow__audience-desc {
  max-width: 36rem;
  margin: 0 auto 2rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(var(--bs-body-color-rgb), 0.65);
}

/* Audience cards */
.lp-vivid-audience {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .lp-vivid-audience {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }
}

.lp-vivid-audience__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.65rem;
  border: 2px solid rgba(var(--bs-body-color-rgb), 0.08);
  border-radius: 1rem;
  background: var(--bs-body-bg);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.lp-vivid-audience__card:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--bs-primary-rgb), 0.35);
}

.lp-vivid-audience__card--active {
  border-color: transparent;
  color: #fff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.lp-vivid-audience__card--active.lp-vivid-audience__card--consumer {
  background: linear-gradient(145deg, #6b2fa8, #4a1d75);
}

.lp-vivid-audience__card--active.lp-vivid-audience__card--merchant {
  background: linear-gradient(145deg, #e6a13a, #c47f1a);
}

.lp-vivid-audience__card--active.lp-vivid-audience__card--rider {
  background: linear-gradient(145deg, #1abc9c, #16a085);
}

.lp-vivid-audience__card--active.lp-vivid-audience__card--business {
  background: linear-gradient(145deg, #3498db, #2471a3);
}

.lp-vivid-audience__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 1.25rem;
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
}

.lp-vivid-audience__card--active .lp-vivid-audience__icon {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.lp-vivid-audience__label {
  font-size: 0.82rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
}

.lp-vivid-group + .lp-vivid-group {
  margin-top: 2rem;
}

.lp-vivid-group__title {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(var(--bs-body-color-rgb), 0.5);
}

/* Service cards */
.lp-vivid-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15.5rem), 1fr));
  gap: 0.75rem;
}

.lp-vivid-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1rem 1rem 1.15rem;
  border-radius: 1rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
  background: var(--bs-body-bg);
  color: inherit;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lp-vivid-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(var(--bs-body-color-rgb), 0.1);
  color: inherit;
}

.lp-vivid-card__stripe {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.lp-vivid-card--food .lp-vivid-card__stripe { background: #ff6b35; }
.lp-vivid-card--grocery .lp-vivid-card__stripe { background: #2ecc71; }
.lp-vivid-card--ride .lp-vivid-card__stripe { background: #3498db; }
.lp-vivid-card--shop .lp-vivid-card__stripe { background: #9b59b6; }
.lp-vivid-card--purple .lp-vivid-card__stripe { background: var(--bs-primary); }
.lp-vivid-card--teal .lp-vivid-card__stripe { background: #1abc9c; }

.lp-vivid-card__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.65rem;
  font-size: 1.15rem;
}

.lp-vivid-card--food .lp-vivid-card__icon { background: rgba(255, 107, 53, 0.12); color: #ff6b35; }
.lp-vivid-card--grocery .lp-vivid-card__icon { background: rgba(46, 204, 113, 0.12); color: #27ae60; }
.lp-vivid-card--ride .lp-vivid-card__icon { background: rgba(52, 152, 219, 0.12); color: #2980b9; }
.lp-vivid-card--shop .lp-vivid-card__icon { background: rgba(155, 89, 182, 0.12); color: #8e44ad; }
.lp-vivid-card--purple .lp-vivid-card__icon { background: rgba(var(--bs-primary-rgb), 0.12); color: var(--bs-primary); }
.lp-vivid-card--teal .lp-vivid-card__icon { background: rgba(26, 188, 156, 0.12); color: #16a085; }

.lp-vivid-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.lp-vivid-card__title {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.3;
}

.lp-vivid-card__desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgba(var(--bs-body-color-rgb), 0.62);
}

.lp-vivid-card__arrow {
  flex-shrink: 0;
  margin-top: 0.15rem;
  opacity: 0.4;
  font-size: 1rem;
}

.lp-vivid-card:hover .lp-vivid-card__arrow {
  opacity: 0.85;
}

/* Earn strip */
.lp-vivid-earn {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}

.lp-vivid-earn__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.35rem 1.25rem;
  border-radius: 1.1rem;
  color: #fff;
  min-height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lp-vivid-earn__card:hover {
  transform: translateY(-4px);
  color: #fff;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.lp-vivid-earn__card--gold {
  background: linear-gradient(145deg, #e6a13a 0%, #b8730f 100%);
}

.lp-vivid-earn__card--teal {
  background: linear-gradient(145deg, #1abc9c 0%, #0e8c73 100%);
}

.lp-vivid-earn__card--purple {
  background: linear-gradient(145deg, #6b2fa8 0%, #4a1d75 100%);
}

.lp-vivid-earn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 0.85rem;
  border-radius: 0.75rem;
  font-size: 1.3rem;
  background: rgba(255, 255, 255, 0.2);
}

.lp-vivid-earn__title {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.lp-vivid-earn__desc {
  margin: 0 0 1rem;
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.88);
}

.lp-vivid-earn__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.lp-vivid-panel-enter-active,
.lp-vivid-panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.lp-vivid-panel-enter-from,
.lp-vivid-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .lp-vivid-audience__card,
  .lp-vivid-card,
  .lp-vivid-earn__card,
  .lp-vivid-panel-enter-active,
  .lp-vivid-panel-leave-active {
    transition: none;
  }
}
</style>
