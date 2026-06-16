<template>
  <section class="lp-services-section" v-wow>
    <b-container class="lp-page-container">
      <div class="lp-services-header text-center mb-5">
        <p class="lp-services-kicker">{{ t('landing.ecosystemLabel') }}</p>
        <h2 class="lp-services-title">{{ t('landing.ecosystemTitle') }}</h2>
        <p class="lp-services-subtitle">{{ t('landing.ecosystemDesc') }}</p>
      </div>

      <b-row class="g-4">
        <b-col
          v-for="service in allServices"
          :key="service.key"
          lg="6"
          xl="3"
          class="d-flex"
        >
          <a
            :href="getServiceUrl(service.key)"
            target="_blank"
            rel="noopener noreferrer"
            class="lp-service-card text-decoration-none"
            :style="{ '--service-grad': service.accentGrad, '--service-color': service.color }"
            :aria-label="`Open ${service.name}`"
          >
            <div class="lp-service-card__icon">
              <Icon :icon="service.icon" />
            </div>
            <h3 class="lp-service-card__title">{{ service.name }}</h3>
            <p class="lp-service-card__desc">{{ service.description }}</p>
            <div class="lp-service-card__cta">
              <span class="lp-service-card__label">{{ t('common.openApp') }}</span>
              <Icon icon="solar:arrow-right-up-linear" class="lp-service-card__arrow" />
            </div>
          </a>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Icon } from '@iconify/vue';
import { useSubdomainNavigation } from '@/composables/useSubdomainNavigation';

const { t } = useI18n();
const { getServiceUrl, allServices } = useSubdomainNavigation();
</script>

<style scoped>
.lp-services-section {
  padding: 80px 0;
  background: linear-gradient(
    180deg,
    rgba(92, 48, 143, 0.03) 0%,
    rgba(247, 168, 41, 0.02) 100%
  );
}

.lp-services-header {
  margin-bottom: 2rem;
}

.lp-services-kicker {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-secondary);
  margin-bottom: 0.85rem;
  margin-top: 0;
}

.lp-services-title {
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 0.9rem;
  color: var(--bs-headings-color);
  text-wrap: balance;
}

.lp-services-subtitle {
  font-size: 1rem;
  line-height: 1.72;
  color: var(--bs-secondary-color);
  max-width: 64ch;
  margin: 0 auto 0;
}

/* Service Card */
.lp-service-card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem;
  border-radius: 1.6rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.3)
  );
  border: 1.5px solid var(--service-color, #5C308F);
  height: 100%;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  color: inherit;

  --service-grad: linear-gradient(135deg, #5C308F 0%, #3B1A5A 100%);
  --service-color: #5C308F;
}

.lp-service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--service-grad);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.lp-service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(92, 48, 143, 0.18);
  border-color: var(--service-color, #5C308F);
}

.lp-service-card:hover::before {
  opacity: 0.08;
}

.lp-service-card:hover .lp-service-card__arrow {
  transform: translateX(4px);
}

.lp-service-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--service-grad);
  font-size: 28px;
  color: white;
  flex-shrink: 0;
  z-index: 1;
  position: relative;
  box-shadow: 0 8px 24px rgba(92, 48, 143, 0.2);
}

.lp-service-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--bs-headings-color);
  z-index: 1;
  position: relative;
}

.lp-service-card__desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--bs-secondary-color);
  margin: 0;
  flex: 1;
  z-index: 1;
  position: relative;
}

.lp-service-card__cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--service-color, #5C308F);
  font-weight: 600;
  font-size: 0.95rem;
  margin-top: auto;
  z-index: 1;
  position: relative;
}

.lp-service-card__label {
  display: block;
}

.lp-service-card__arrow {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 991px) {
  .lp-services-section {
    padding: 60px 0;
  }

  .lp-service-card {
    padding: 1.5rem;
  }

  .lp-service-card__title {
    font-size: 1.1rem;
  }

  .lp-service-card__desc {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .lp-services-section {
    padding: 40px 0;
  }

  .lp-services-title {
    font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  }

  .lp-service-card {
    padding: 1.25rem;
    gap: 1rem;
  }

  .lp-service-card__icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .lp-service-card__title {
    font-size: 1rem;
  }

  .lp-service-card__desc {
    font-size: 0.85rem;
  }

  .lp-service-card__cta {
    font-size: 0.85rem;
  }
}
</style>
