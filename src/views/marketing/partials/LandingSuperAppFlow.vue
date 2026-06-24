<template>
  <div class="lp-superapp">
    <!-- Services hub — Grab/Bolt-style audience tabs + grouped services -->
    <section id="services" class="lp-superapp__services lp-section py-5 py-lg-6">
      <div class="container-lg">
        <header class="lp-superapp__head text-center mx-auto mb-4 mb-lg-5">
          <span class="lp-section-pill">{{ t('landing.superApp.eyebrow') }}</span>
          <h2 class="display-5 fw-800 lp-section-heading mb-2">{{ t('landing.superApp.headline') }}</h2>
          <p class="lp-superapp__lead mb-0">{{ t('landing.superApp.lead') }}</p>
        </header>

        <div class="lp-superapp__tabs" role="tablist" :aria-label="t('landing.superApp.tabsAria')">
          <button
            v-for="audience in superAppAudiences"
            :key="audience.id"
            type="button"
            role="tab"
            class="lp-superapp__tab"
            :class="{ 'lp-superapp__tab--active': activeAudience === audience.id }"
            :aria-selected="activeAudience === audience.id"
            @click="activeAudience = audience.id"
          >
            <Icon :icon="audience.icon" class="lp-superapp__tab-icon" aria-hidden="true" />
            <span class="lp-superapp__tab-label">{{ t(audience.labelKey) }}</span>
          </button>
        </div>

        <p class="lp-superapp__audience-desc text-center mx-auto mb-4 mb-lg-5">
          {{ t(activeAudienceMeta.descKey) }}
        </p>

        <div class="lp-superapp__groups" role="tabpanel">
          <div
            v-for="group in activeGroups"
            :key="group.key"
            class="lp-superapp__group"
          >
            <h3 class="lp-superapp__group-title">{{ t(group.titleKey) }}</h3>
            <div class="lp-superapp__grid" role="list">
              <component
                v-for="item in group.items"
                :key="item.key"
                :is="item.href ? 'a' : 'router-link'"
                :href="item.href"
                :to="item.to"
                class="lp-superapp__card text-decoration-none"
                :target="item.href ? '_blank' : undefined"
                :rel="item.href ? 'noopener noreferrer' : undefined"
                role="listitem"
              >
                <span class="lp-superapp__card-icon" aria-hidden="true">
                  <Icon :icon="item.icon" />
                </span>
                <span class="lp-superapp__card-copy">
                  <span class="lp-superapp__card-title">{{ t(item.labelKey) }}</span>
                  <span class="lp-superapp__card-desc">{{ t(item.descKey) }}</span>
                </span>
                <Icon icon="solar:arrow-right-up-linear" class="lp-superapp__card-arrow" aria-hidden="true" />
              </component>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Earn with KKOO — Bolt-style partner strip -->
    <section id="earn" class="lp-superapp__earn lp-section py-5 py-lg-6">
      <div class="container-lg">
        <header class="text-center mx-auto mb-4 mb-lg-5 lp-superapp__earn-head">
          <span class="lp-section-pill">{{ t('landing.superApp.earnEyebrow') }}</span>
          <h2 class="display-6 fw-800 lp-section-heading mb-2">{{ t('landing.superApp.earnHeadline') }}</h2>
          <p class="lp-superapp__lead mb-0">{{ t('landing.superApp.earnLead') }}</p>
        </header>

        <div class="lp-superapp__earn-grid" role="list">
          <component
            v-for="card in superAppEarnCards"
            :key="card.key"
            :is="card.href ? 'a' : 'router-link'"
            :href="card.href"
            :to="card.to"
            class="lp-superapp__earn-card text-decoration-none"
            :target="card.href ? '_blank' : undefined"
            :rel="card.href ? 'noopener noreferrer' : undefined"
            role="listitem"
          >
            <span class="lp-superapp__earn-icon" aria-hidden="true">
              <Icon :icon="card.icon" />
            </span>
            <h3 class="lp-superapp__earn-title">{{ t(card.labelKey) }}</h3>
            <p class="lp-superapp__earn-desc">{{ t(card.descKey) }}</p>
            <span class="lp-superapp__earn-cta">
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
</script>

<style scoped>
.lp-superapp__lead {
  max-width: 40rem;
  color: var(--lp-text-muted, rgba(var(--bs-body-color-rgb), 0.72));
  font-size: 1.05rem;
  line-height: 1.55;
}

.lp-superapp__tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lp-superapp__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.2);
  border-radius: 999px;
  background: rgba(var(--bs-body-bg-rgb), 0.6);
  color: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.lp-superapp__tab:hover {
  border-color: rgba(var(--bs-primary-rgb), 0.45);
}

.lp-superapp__tab--active {
  background: rgba(var(--bs-primary-rgb), 0.12);
  border-color: rgba(var(--bs-primary-rgb), 0.55);
  color: var(--bs-primary);
}

.lp-superapp__tab-icon {
  font-size: 1.15rem;
}

.lp-superapp__audience-desc {
  max-width: 36rem;
  color: var(--lp-text-muted, rgba(var(--bs-body-color-rgb), 0.68));
  font-size: 0.95rem;
}

.lp-superapp__group + .lp-superapp__group {
  margin-top: 2rem;
}

.lp-superapp__group-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--bs-body-color-rgb), 0.55);
  margin-bottom: 0.85rem;
}

.lp-superapp__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 0.75rem;
}

.lp-superapp__card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
  background: rgba(var(--bs-body-bg-rgb), 0.85);
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.lp-superapp__card:hover {
  border-color: rgba(var(--bs-primary-rgb), 0.35);
  box-shadow: 0 0.5rem 1.25rem rgba(var(--bs-body-color-rgb), 0.08);
  transform: translateY(-2px);
}

.lp-superapp__card-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.65rem;
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  font-size: 1.25rem;
}

.lp-superapp__card-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.lp-superapp__card-title {
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.3;
}

.lp-superapp__card-desc {
  font-size: 0.82rem;
  line-height: 1.4;
  color: rgba(var(--bs-body-color-rgb), 0.65);
}

.lp-superapp__card-arrow {
  flex-shrink: 0;
  margin-top: 0.15rem;
  opacity: 0.45;
  font-size: 1rem;
}

.lp-superapp__earn {
  background: linear-gradient(
    180deg,
    rgba(var(--bs-primary-rgb), 0.04) 0%,
    transparent 100%
  );
}

.lp-superapp__earn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.lp-superapp__earn-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.35rem 1.25rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(var(--bs-primary-rgb), 0.18);
  background: var(--bs-body-bg);
  color: inherit;
  min-height: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.lp-superapp__earn-card:hover {
  border-color: rgba(var(--bs-primary-rgb), 0.45);
  box-shadow: 0 0.75rem 1.5rem rgba(var(--bs-primary-rgb), 0.1);
}

.lp-superapp__earn-icon {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
  font-size: 1.35rem;
  margin-bottom: 0.85rem;
}

.lp-superapp__earn-title {
  font-size: 1.05rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.lp-superapp__earn-desc {
  font-size: 0.88rem;
  line-height: 1.45;
  color: rgba(var(--bs-body-color-rgb), 0.68);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.lp-superapp__earn-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--bs-primary);
}
</style>
