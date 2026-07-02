<template>
  <section id="hero" class="lp-download-hero">
    <div class="ui-container lp-download-hero__grid">
      <div class="lp-download-hero__copy">
        <p class="lp-download-hero__eyebrow">{{ t('landing.premium.downloadHeroEyebrow') }}</p>
        <h1 class="lp-download-hero__title">
          {{ t('landing.premium.downloadHeroTitle') }}
          <span class="lp-bento-accent">{{ t('landing.premium.downloadHeroAccent') }}</span>
        </h1>
        <p class="lp-download-hero__lead">{{ t('landing.premium.downloadHeroLead') }}</p>

        <LandingStoreBadges layout="row" />

        <p class="lp-download-hero__proof">
          <Icon icon="solar:users-group-rounded-bold" aria-hidden="true" />
          {{ t('landing.premium.downloadHeroProof') }}
        </p>

        <div class="lp-download-hero__secondary">
          <router-link :to="buyerRoutes.marketplace" class="lp-download-hero__browse">
            {{ t('landing.premium.browseWithoutSignup') }}
            <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
          </router-link>
        </div>

        <div class="lp-download-hero__audience" role="tablist" :aria-label="t('landing.premium.audienceSwitcherAria')">
          <button
            v-for="item in audienceSwitcherItems"
            :key="item.key"
            type="button"
            role="tab"
            class="lp-download-hero__audience-btn"
            @click="scrollToSection(item.sectionId)"
          >
            {{ t(item.labelKey) }}
          </button>
        </div>
      </div>

      <div class="lp-download-hero__visual" aria-hidden="true">
        <LandingPhoneMockup hero large>
          <Transition name="lp-mockup-fade" mode="out-in">
            <img
              :key="activeSlide.key"
              :src="activeSlide.image"
              :alt="t(activeSlide.altKey)"
              class="lp-phone-mockup__image"
            />
          </Transition>
        </LandingPhoneMockup>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import LandingStoreBadges from '@/views/marketing/components/LandingStoreBadges.vue'
import LandingPhoneMockup from '@/views/marketing/partials/LandingPhoneMockup.vue'
import { audienceSwitcherItems, heroMockupSlides } from '@/config/landing-audiences'
import { buyerRoutes } from '@/config/landing-links'
import { useLandingScroll } from '@/composables/useLandingScroll'

const { t } = useI18n()
const { scrollToSection } = useLandingScroll()

const slideIndex = ref(0)
const activeSlide = ref(heroMockupSlides[0])
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    slideIndex.value = (slideIndex.value + 1) % heroMockupSlides.length
    activeSlide.value = heroMockupSlides[slideIndex.value]
  }, 4000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
