<template>
  <section id="how" class="lp-premium-section">
    <div class="container-lg">
      <header class="lp-premium-section__head lp-premium-reveal" ref="headRef">
        <p class="lp-premium-section__eyebrow">{{ t('landing.premium.stepsEyebrow') }}</p>
        <h2 class="lp-premium-section__title">{{ t('landing.premium.stepsTitle') }}</h2>
        <p class="lp-premium-section__lead">{{ t('landing.premium.stepsLead') }}</p>
      </header>

      <ol class="lp-premium-steps" role="list">
        <li
          v-for="(step, i) in premiumSteps"
          :key="step.key"
          class="lp-premium-steps__card lp-premium-reveal"
          :class="`lp-premium-steps__card--${stepTones[i]}`"
          :style="{ '--step-i': i }"
        >
          <span class="lp-premium-steps__connector" v-if="i < premiumSteps.length - 1" aria-hidden="true" />
          <span class="lp-premium-steps__num" aria-hidden="true">{{ i + 1 }}</span>
          <span class="lp-premium-steps__icon" aria-hidden="true">
            <Icon :icon="step.icon" />
          </span>
          <h3 class="lp-premium-steps__title">{{ t(step.titleKey) }}</h3>
          <p class="lp-premium-steps__desc">{{ t(step.descKey) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { premiumSteps } from '@/config/landing-premium'
import { observeRevealChildren, useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const headRef = ref<HTMLElement | null>(null)
const stepTones = ['purple', 'orange', 'ride'] as const

useLandingReveal(headRef)

onMounted(() => {
  observeRevealChildren(headRef.value?.closest('section') ?? null)
})
</script>

<style scoped>
.lp-premium-steps {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 768px) {
  .lp-premium-steps {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

.lp-premium-steps__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.6rem 1.4rem 1.4rem;
  border-radius: var(--lp-premium-radius-lg);
  border: 1px solid var(--lp-premium-border);
  box-shadow: var(--lp-premium-shadow);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  transition-delay: calc(var(--step-i, 0) * 0.08s);
  overflow: hidden;
}

.lp-premium-steps__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.lp-premium-steps__card--purple::before {
  background: linear-gradient(90deg, var(--lp-premium-primary), #9b6fd4);
}
.lp-premium-steps__card--orange::before {
  background: linear-gradient(90deg, var(--lp-premium-accent), #ffcd5c);
}
.lp-premium-steps__card--ride::before {
  background: linear-gradient(90deg, #2b8cff, #7ec8ff);
}

.lp-premium-steps__card--purple {
  background: linear-gradient(160deg, rgba(var(--lp-premium-primary-rgb), 0.1), var(--lp-premium-surface) 45%);
}
.lp-premium-steps__card--orange {
  background: linear-gradient(160deg, rgba(var(--lp-premium-accent-rgb), 0.14), var(--lp-premium-surface) 45%);
}
.lp-premium-steps__card--ride {
  background: linear-gradient(160deg, rgba(43, 140, 255, 0.12), var(--lp-premium-surface) 45%);
}

.lp-premium-steps__card:hover {
  transform: translateY(-5px);
  box-shadow: var(--lp-premium-shadow-vivid);
}

.lp-premium-steps__connector {
  display: none;
}

@media (min-width: 768px) {
  .lp-premium-steps__connector {
    display: block;
    position: absolute;
    top: 2.4rem;
    right: -0.65rem;
    width: 1.3rem;
    height: 2px;
    background: linear-gradient(90deg, rgba(var(--lp-premium-primary-rgb), 0.4), transparent);
    z-index: 1;
  }
}

.lp-premium-steps__num {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 800;
  color: #1a1224;
  background: var(--lp-premium-accent);
  box-shadow: 0 4px 12px rgba(var(--lp-premium-accent-rgb), 0.4);
}

.lp-premium-steps__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  color: var(--lp-premium-primary);
  background: rgba(var(--lp-premium-primary-rgb), 0.12);
}

.lp-premium-steps__card--orange .lp-premium-steps__icon {
  color: #c47d00;
  background: rgba(var(--lp-premium-accent-rgb), 0.2);
}
.lp-premium-steps__card--ride .lp-premium-steps__icon {
  color: #2b8cff;
  background: rgba(43, 140, 255, 0.15);
}

.lp-premium-steps__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lp-premium-steps__desc {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--lp-premium-muted);
}

@media (prefers-reduced-motion: reduce) {
  .lp-premium-steps__card {
    transition: none;
  }
}
</style>
