<template>
  <!-- Large readable testimonials — one featured quote -->
  <section id="stories" class="ui-section">
    <div class="ui-container">
      <header class="ui-section-head ui-reveal" ref="headRef">
        <p class="ui-eyebrow">{{ t('landing.premium.testimonialsEyebrow') }}</p>
        <h2 class="ui-heading">{{ t('landing.premium.testimonialsTitle') }}</h2>
      </header>

      <figure class="ui-testimonial ui-reveal">
        <blockquote class="ui-testimonial__quote">“{{ featured.text }}”</blockquote>
        <figcaption class="ui-testimonial__author">
          <span class="ui-testimonial__name">{{ featured.name }}</span>
          <span class="ui-testimonial__role">{{ featured.role }}</span>
        </figcaption>
      </figure>

      <div class="ui-testimonial__nav">
        <button type="button" class="ui-testimonial__btn" :aria-label="t('landing.premium.prev')" @click="prev">
          <Icon icon="solar:alt-arrow-left-linear" />
        </button>
        <span class="ui-testimonial__dots" aria-hidden="true">
          <span
            v-for="(_, i) in all"
            :key="i"
            class="ui-testimonial__dot"
            :class="{ 'ui-testimonial__dot--active': i === offset }"
          />
        </span>
        <button type="button" class="ui-testimonial__btn" :aria-label="t('landing.premium.next')" @click="next">
          <Icon icon="solar:alt-arrow-right-linear" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useLandingReveal } from '@/composables/useLandingReveal'

const { t } = useI18n()
const headRef = ref<HTMLElement | null>(null)
useLandingReveal(headRef)

type Item = { name: string; role: string; text: string }

const all = computed<Item[]>(() => [
  { name: t('landing.testimonial1Name'), role: t('landing.testimonial1Role'), text: t('landing.testimonial1Text') },
  { name: t('landing.testimonial2Name'), role: t('landing.testimonial2Role'), text: t('landing.testimonial2Text') },
  { name: t('landing.testimonial3Name'), role: t('landing.testimonial3Role'), text: t('landing.testimonial3Text') },
])

const offset = ref(0)
const featured = computed(() => all.value[offset.value] ?? all.value[0])

function next() {
  offset.value = (offset.value + 1) % all.value.length
}

function prev() {
  const len = all.value.length
  offset.value = (offset.value - 1 + len) % len
}
</script>

<style scoped>
.ui-testimonial {
  max-width: 42rem;
  margin: 0 auto 2rem;
  text-align: center;
}

.ui-testimonial__quote {
  margin: 0 0 1.5rem;
  font-size: clamp(1.15rem, 2.5vw, 1.5rem);
  font-weight: 500;
  line-height: 1.65;
  color: var(--ui-text);
}

.ui-testimonial__author {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.ui-testimonial__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ui-text);
}

.ui-testimonial__role {
  font-size: 0.85rem;
  color: var(--ui-text-muted);
}

.ui-testimonial__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.ui-testimonial__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--ui-border);
  border-radius: 50%;
  background: var(--ui-surface);
  color: var(--ui-text-muted);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.ui-testimonial__btn:hover {
  color: var(--ui-primary);
  border-color: var(--ui-primary);
}

.ui-testimonial__dots {
  display: flex;
  gap: 0.4rem;
}

.ui-testimonial__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ui-border);
}

.ui-testimonial__dot--active {
  background: var(--ui-primary);
}
</style>
