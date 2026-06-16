<template>
  <div class="lp-wrapper mk-landing">
    <LandingHeader />
    <!-- ===================== HERO SECTION ===================== -->
    <section
      id="top"
      class="lp-hero-section"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <!-- Overlay (gradient veil on top of bg image) -->
      <div class="lp-hero-overlay" aria-hidden="true"></div>
      <!-- Floating orbs -->
      <div class="lp-hero-orb lp-hero-orb-1"></div>
      <div class="lp-hero-orb lp-hero-orb-2"></div>
      <div class="lp-hero-orb lp-hero-orb-3"></div>
      <!-- Noise texture overlay -->
      <div class="lp-hero-noise"></div>

      <div class="container-lg position-relative z-3 lp-hero-container">
        <div class="lp-hero-inner">
          <div class="row lp-hero-row g-4 g-lg-5 justify-content-center align-items-center">
            <div class="col-12 text-center px-1 px-sm-2">
              <div class="lp-hero-copy lp-hero-copy--masthead">
                <p class="lp-hero-kicker">{{ t('landing.heroEyebrow') }}</p>

                <h1 class="lp-hero-headline lp-hero-headline--display">
                  <span class="lp-hero-line lp-hero-line-1 lp-hero-display-line">
                    <span class="lp-hero-display-text">{{ t('landing.heroHeadline1') }}</span>
                  </span>
                  <span class="lp-hero-line lp-hero-line-3 lp-text-gold lp-hero-display-sub">{{
                    t('landing.heroHeadline2')
                  }}</span>
                </h1>

                <div class="lp-hero-rule" aria-hidden="true" />

                <!-- Subtitle -->
                <p class="lp-hero-subtitle mx-auto" data-wow="fade-up">{{ t('landing.heroSubtitle') }}</p>

                <!-- Trust badges -->
                <div class="lp-hero-trust-strip">
                  <div class="lp-hero-trust-row">
                    <span class="lp-hero-trust-item">
                      <Icon :icon="bi('shield-lock-fill')" /> {{ t('landing.heroTrust1') }}
                    </span>
                    <span class="lp-hero-trust-item">
                      <Icon :icon="bi('geo-alt-fill')" /> {{ t('landing.heroTrust2') }}
                    </span>
                    <span class="lp-hero-trust-item">
                      <Icon :icon="bi('patch-check-fill')" /> {{ t('landing.heroTrust3') }}
                    </span>
                    <span class="lp-hero-trust-item">
                      <Icon :icon="bi('cash-coin')" /> {{ t('landing.heroTrust4') }}
                    </span>
                  </div>
                  <p class="lp-hero-trust-line small text-secondary mb-0 mt-2 mx-auto">{{ t('landing.heroTrustLine') }}</p>
                </div>

                <!-- CTA Buttons -->
                <div class="lp-hero-actions d-flex flex-wrap justify-content-center" data-wow="fade-up">
                  <router-link
                    :to="landingAnchors.download"
                    class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg lp-hero-btn lp-hero-cta-primary text-decoration-none d-inline-flex align-items-center"
                    @click="onLandingSectionClick('download', $event)"
                  >
                    <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                      <Icon :icon="bi('download')" class="lp-hero-btn-icon" />
                      <span>{{ t('landing.ctaGetStarted') }}</span>
                    </span>
                    <span class="lp-btn-pill__well" aria-hidden="true">
                      <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                    </span>
                  </router-link>
                  <router-link
                    :to="isAuthenticated ? dashboardRoute : buyerRoutes.marketplace"
                    class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg lp-hero-btn lp-btn-hero-outline text-decoration-none d-inline-flex align-items-center"
                  >
                    <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                      <Icon :icon="isAuthenticated ? bi('speedometer2') : bi('bag-heart')" class="lp-hero-btn-icon" />
                      <span>{{ isAuthenticated ? t('landing.headerGoToDashboard') : t('landing.ctaShopOnWeb') }}</span>
                    </span>
                    <span class="lp-btn-pill__well" aria-hidden="true">
                      <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                    </span>
                  </router-link>
                  <KkooAccountButton variant="accent" size="lg" class="lp-hero-btn" />
                </div>
              </div>
            </div>

            <div class="col-12 lp-hero-scroll-col">
              <router-link
                :to="landingAnchors.solutions"
                class="lp-hero-scroll-indicator text-decoration-none"
                aria-label="Scroll down"
                @click="onLandingSectionClick('solutions', $event)"
              >
                <Icon :icon="bi('chevron-double-down')" class="lp-hero-scroll-icon" />
                <div class="lp-hero-scroll-line" aria-hidden="true"></div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== WHAT IS INSIDE KKOO ===================== -->
    <section id="solutions" class="lp-inside-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="lp-inside-mesh" aria-hidden="true" />

      <div class="container-lg position-relative">
        <header class="lp-inside-head">
          <span class="lp-section-pill">{{ t('landing.whatsInsideLabel') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('landing.whatsInsideHeadline') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('landing.verticalsTitleAccent') }}</span>
          </h2>
          <p class="lp-inside-head__sub lp-purple-paragraph mb-0">{{ t('landing.verticalsSub') }}</p>
        </header>

        <div class="lp-inside-bento" role="list">
          <router-link
            v-for="(vertical, i) in verticals"
            :key="vertical.accent"
            :to="vertical.to"
            class="lp-inside-gate text-decoration-none"
            :class="`lp-inside-gate--${vertical.accent}`"
            role="listitem"
          >
            <div class="lp-inside-gate__bg" aria-hidden="true">
              <img
                :src="vertical.image"
                :alt="vertical.title"
                class="lp-inside-gate__img"
                loading="lazy"
              />
              <div class="lp-buyers-visual__overlay" aria-hidden="true" />
            </div>
            <span class="lp-inside-gate__watermark" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="lp-inside-gate__panel">
              <span class="lp-inside-gate__tag">{{ vertical.tag }}</span>
              <h3 class="lp-inside-gate__title">{{ vertical.title }}</h3>
              <p class="lp-inside-gate__desc">{{ vertical.desc }}</p>
              <p class="lp-inside-gate__context mb-0">{{ vertical.context }}</p>
            </div>
          </router-link>
        </div>

        <div class="lp-shop-verticals mt-5" role="list">
          <router-link
            v-for="vertical in shopVerticals"
            :key="vertical.key"
            :to="vertical.route"
            class="lp-shop-vertical-card text-decoration-none"
            :class="`lp-shop-vertical-card--${vertical.accent}`"
            role="listitem"
          >
            <span class="lp-shop-vertical-card__icon" aria-hidden="true">
              <Icon :icon="vertical.icon" />
            </span>
            <span class="lp-shop-vertical-card__copy">
              <span class="lp-shop-vertical-card__title">{{ t(vertical.labelKey) }}</span>
              <span class="lp-shop-vertical-card__desc">{{ t(vertical.descKey) }}</span>
            </span>
            <Icon icon="solar:arrow-right-up-linear" class="lp-shop-vertical-card__arrow" aria-hidden="true" />
          </router-link>
        </div>

        <header class="lp-explore-head mt-5 pt-2">
          <h3 class="lp-explore-head__title">{{ t('landing.exploreProgramsTitle') }}</h3>
          <p class="lp-explore-head__sub mb-0">{{ t('landing.exploreProgramsSub') }}</p>
        </header>

        <div class="lp-shop-verticals" role="list">
          <router-link
            v-for="program in marketingPrograms"
            :key="program.key"
            :to="program.route"
            class="lp-shop-vertical-card text-decoration-none"
            :class="`lp-shop-vertical-card--${program.accent}`"
            role="listitem"
          >
            <span class="lp-shop-vertical-card__icon" aria-hidden="true">
              <Icon :icon="program.icon" />
            </span>
            <span class="lp-shop-vertical-card__copy">
              <span class="lp-shop-vertical-card__title">{{ t(program.labelKey) }}</span>
              <span class="lp-shop-vertical-card__desc">{{ t(program.descKey) }}</span>
            </span>
            <Icon icon="solar:arrow-right-up-linear" class="lp-shop-vertical-card__arrow" aria-hidden="true" />
          </router-link>
          <a
            :href="bizWebUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="lp-shop-vertical-card lp-shop-vertical-card--biz text-decoration-none"
            role="listitem"
          >
            <span class="lp-shop-vertical-card__icon" aria-hidden="true">
              <Icon icon="solar:buildings-3-bold" />
            </span>
            <span class="lp-shop-vertical-card__copy">
              <span class="lp-shop-vertical-card__title">{{ t('landing.navBusiness') }}</span>
              <span class="lp-shop-vertical-card__desc">{{ t('landing.exploreBizPortalDesc') }}</span>
            </span>
            <Icon icon="solar:square-arrow-right-up-linear" class="lp-shop-vertical-card__arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <!-- ===================== BUYERS APP ===================== -->
    <section id="buyers-app" class="lp-buyers-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="lp-buyers-glow lp-buyers-glow--purple" aria-hidden="true" />
      <div class="lp-buyers-glow lp-buyers-glow--gold" aria-hidden="true" />

      <div class="container-lg position-relative">
        <div class="lp-buyers-stage">
          <div class="lp-buyers-copy">
            <span class="lp-section-pill">{{ t('landing.ifYouShopLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('landing.ifYouShopHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.ifYouShopHeadline2') }}</span>
            </h2>
            <p class="fs-5 mb-4 lp-purple-paragraph">{{ t('landing.ifYouShopBody') }}</p>
            <div class="d-flex flex-wrap gap-2">
              <router-link
                :to="buyerRoutes.marketplace"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                  <span>{{ t('landing.ctaShopOnWeb') }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </router-link>
              <router-link
                :to="landingAnchors.download"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
                @click="onLandingSectionClick('download', $event)"
              >
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                  <span>{{ t('landing.ifYouShopCta') }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </router-link>
            </div>
          </div>

          <div class="lp-buyers-panel">
            <div class="lp-buyers-visual">
              <img :src="foodImg" alt="" class="lp-buyers-visual__img" loading="lazy" />
              <div class="lp-buyers-visual__overlay" aria-hidden="true" />
              <span class="lp-buyers-visual__badge">
                <Icon :icon="bi('shield-lock-fill')" />
                {{ t('landing.buyerProtection1Title') }}
              </span>
            </div>

            <div class="lp-buyers-grid" role="list">
              <article
                v-for="(feature, i) in buyerFeatures"
                :key="i"
                class="lp-buyers-tile"
                role="listitem"
              >
                <span class="lp-buyers-tile__icon" aria-hidden="true">
                  <Icon :icon="biFromClass(feature.icon)" />
                </span>
                <span class="lp-buyers-tile__copy">
                  <h3 class="lp-buyers-tile__title">{{ feature.title }}</h3>
                  <p class="lp-buyers-tile__desc">{{ feature.desc }}</p>
                </span>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== SELLER PLATFORM ===================== -->
    <section id="seller-platform" class="lp-sellers-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="lp-sellers-glow" aria-hidden="true" />

      <div class="container-lg position-relative">
        <div class="lp-sellers-stage">
          <div class="lp-sellers-panel">
            <div class="lp-sellers-visual">
              <img :src="shopImg" alt="" class="lp-sellers-visual__img" loading="lazy" />
              <div class="lp-sellers-visual__overlay" aria-hidden="true" />
              <span class="lp-sellers-visual__badge">
                <Icon :icon="bi('shop-window')" />
                {{ t('landing.verticalSellersTitle') }}
              </span>
            </div>

            <div class="lp-sellers-grid">
              <article
                v-for="(feature, i) in sellerFeatures"
                :key="i"
                class="lp-sellers-tile"
              >
                <span class="lp-sellers-tile__icon" aria-hidden="true">
                  <Icon :icon="biFromClass(feature.icon)" />
                </span>
                <span class="lp-sellers-tile__copy">
                  <h3 class="lp-sellers-tile__title">{{ feature.title }}</h3>
                  <p class="lp-sellers-tile__desc">{{ feature.desc }}</p>
                </span>
              </article>
            </div>
          </div>

          <div class="lp-sellers-copy">
            <span class="lp-section-pill">{{ t('landing.ifYouSellLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('landing.ifYouSellHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.ifYouSellHeadline2') }}</span>
            </h2>
            <p class="fs-5 mb-4 lp-purple-paragraph">{{ t('landing.ifYouSellBody') }}</p>
            <div class="d-flex flex-wrap gap-2">
              <router-link
                :to="buyerRoutes.business"
                class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                  <span>{{ t('landing.ifYouSellCta') }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </router-link>
              <a
                :href="bizWebUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                  <span>{{ t('landing.navBusiness') }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:square-arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== APP + WEB TOGETHER ===================== -->
    <section class="lp-services-section py-5 py-lg-6 position-relative">
      <div class="container-lg">
        <div class="row mb-5 lp-protection-row">
          <div class="col-lg-5 mb-4 mb-lg-0">
            <span class="lp-section-pill">{{ t('landing.ifYouRideLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('landing.ifYouRideHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.ifYouRideHeadline2') }}</span>
            </h2>
            <p class="fs-5 text-secondary mb-4 lp-purple-paragraph">{{ t('landing.ifYouRideBody') }}</p>
            <div class="d-flex flex-wrap gap-2">
              <router-link
                :to="buyerRoutes.ride"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                  <span>{{ t('landing.ifYouRideCta') }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </router-link>
              <router-link
                :to="buyerRoutes.courier"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                  <span>{{ t('landing.exploreCourier') }}</span>
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </router-link>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="row g-3">
              <div v-for="(feature, i) in buyerProtectionFeatures" :key="i" class="col-12 col-lg-6">
                <div class="card border-0 shadow-sm h-100 transition-all lp-card" style="border-radius: 0.75rem;">
                  <div class="card-body">
                    <div class="lp-feature-icon-sm mb-3"
                      :style="{ background: feature.color }">
                      <Icon :icon="biFromClass(feature.icon)" />
                    </div>
                    <h3 class="lp-card-title">{{ feature.title }}</h3>
                    <p class="lp-card-text mb-0">{{ feature.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== FOR BUSINESSES ===================== -->
    <section id="businesses" class="lp-sme-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="container-lg position-relative">
        <header class="lp-sme-hero-band">
          <div class="lp-sme-hero-band__content">
            <span class="lp-section-pill">{{ t('landing.smeLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading lp-section-heading--inverse mb-3">
              {{ t('landing.smeHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.smeHeadline3') }}</span>
            </h2>
            <p class="lp-sme-hero-band__body lp-purple-paragraph">{{ t('landing.smeBody') }}</p>
          </div>
        </header>

        <div class="lp-sme-command">
          <article
            v-for="(module, i) in businessModules"
            :key="i"
            class="lp-sme-module"
          >
            <div class="lp-sme-module__head">
              <span class="lp-sme-module__icon" aria-hidden="true">
                <Icon :icon="biFromClass(module.icon)" />
              </span>
              <div>
                <h3 class="lp-sme-module__title">{{ module.title }}</h3>
                <p class="lp-sme-module__desc">{{ module.desc }}</p>
              </div>
            </div>
            <ul class="lp-sme-module__list">
              <li v-for="item in module.items" :key="item" class="lp-sme-module__item">
                <Icon :icon="bi('check2')" aria-hidden="true" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ===================== WHAT YOU GET ===================== -->
    <section id="what-you-get" class="lp-ecosystem-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="lp-ecosystem-ambient lp-ecosystem-ambient--purple" aria-hidden="true" />
      <div class="lp-ecosystem-ambient lp-ecosystem-ambient--gold" aria-hidden="true" />

      <div class="container-lg position-relative">
        <header class="lp-ecosystem-head">
          <span class="lp-section-pill">{{ t('landing.sectionSolutionsTitle') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('landing.featuresTitle') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('landing.featuresTitleAccent') }}</span>
          </h2>
          <p class="lp-ecosystem-head__sub mb-0">{{ t('landing.featuresSub') }}</p>
        </header>

        <div class="lp-ecosystem-stage">
          <div class="lp-ecosystem-hub" aria-hidden="true">
            <div class="lp-ecosystem-hub__rings">
              <span class="lp-ecosystem-hub__ring" />
              <span class="lp-ecosystem-hub__ring lp-ecosystem-hub__ring--inner" />
              <span class="lp-ecosystem-hub__core">
                <Icon :icon="bi('arrow-repeat')" />
              </span>
            </div>
            <span class="lp-ecosystem-hub__label">{{ t('landing.whatsInsideConnector') }}</span>
          </div>

          <div class="lp-ecosystem-lanes">
            <article
              v-for="(feature, i) in ecosystemCards"
              :key="i"
              class="lp-ecosystem-lane"
              :class="`lp-ecosystem-lane--${['buyers', 'sellers', 'loop'][i]}`"
            >
              <span class="lp-ecosystem-lane__rail" aria-hidden="true">
                <span class="lp-ecosystem-lane__dot">{{ ['01', '02', '03'][i] }}</span>
              </span>
              <div class="lp-ecosystem-lane__body">
                <span class="lp-ecosystem-lane__icon" aria-hidden="true">
                  <Icon :icon="biFromClass(feature.icon)" />
                </span>
                <h3 class="lp-ecosystem-lane__title">{{ feature.title }}</h3>
                <p class="lp-ecosystem-lane__desc mb-0">{{ feature.desc }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== REWARDS ===================== -->
    <section id="rewards" class="lp-rewards-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="lp-rewards-ambient lp-rewards-ambient--purple" aria-hidden="true" />
      <div class="lp-rewards-ambient lp-rewards-ambient--gold" aria-hidden="true" />

      <div class="container-lg position-relative">
        <div class="lp-rewards-stage">
          <div class="lp-rewards-brief">
            <span class="lp-section-pill">{{ t('landing.rewardsLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              <span v-if="rewardsHeadlineParts.accent">{{ rewardsHeadlineParts.lead }}</span>
              <template v-else>{{ t('landing.rewardsHeadline') }}</template>
              <span
                v-if="rewardsHeadlineParts.accent"
                class="lp-text-primary d-block d-md-inline"
              >{{ rewardsHeadlineParts.accent }}</span>
            </h2>
            <p class="fs-5 mb-4 lp-rewards-intro__body">{{ t('landing.rewardsBody') }}</p>

            <div class="lp-rewards-perk-grid">
              <article
                v-for="(item, i) in rewardsList"
                :key="i"
                class="lp-rewards-perk"
              >
                <span class="lp-rewards-perk__n" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="lp-rewards-perk__icon" aria-hidden="true">
                  <Icon :icon="biFromClass(item.icon)" />
                </span>
                <span class="lp-rewards-perk__copy">
                  <span class="lp-rewards-perk__title">{{ item.title }}</span>
                  <span class="lp-rewards-perk__desc">{{ item.desc }}</span>
                </span>
              </article>
            </div>

            <router-link
              :to="buyerRoutes.shareEarn"
              class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--lg lp-section-cta text-decoration-none d-inline-flex align-items-center"
            >
              <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
                <span>{{ t('landing.rewardsCta') }}</span>
              </span>
              <span class="lp-btn-pill__well" aria-hidden="true">
                <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
              </span>
            </router-link>
          </div>

          <div class="lp-rewards-vault">
            <div class="lp-rewards-vault__glow" aria-hidden="true" />

            <header class="lp-rewards-vault__head">
              <div class="lp-rewards-vault__meter" aria-hidden="true">
                <span class="lp-rewards-vault__meter-fill" />
              </div>
              <p class="lp-rewards-vault__label mb-0">{{ t('landing.rewardsLabel') }}</p>
            </header>

            <article
              v-if="featuredXpLevel"
              class="lp-rewards-hero-tier"
            >
              <span class="lp-rewards-hero-tier__crown" aria-hidden="true">
                <Icon :icon="bi('stars')" />
              </span>
              <span class="lp-rewards-hero-tier__halo" aria-hidden="true">
                <Icon
                  :icon="biFromClass(featuredXpLevel.icon)"
                  :class="`lp-xp-icon lp-xp-icon--${featuredXpLevel.tone ?? 'gold'}`"
                />
              </span>
              <div class="lp-rewards-hero-tier__copy">
                <p class="lp-rewards-hero-tier__tag mb-1">Peak tier</p>
                <h3 class="lp-rewards-hero-tier__name">{{ featuredXpLevel.name }}</h3>
                <p class="lp-rewards-hero-tier__xp mb-0">{{ featuredXpLevel.xp }}</p>
              </div>
            </article>

            <div class="lp-rewards-xp-deck">
              <article
                v-for="(level, i) in standardXpLevels"
                :key="`xp-${i}`"
                class="lp-rewards-xp-card"
                :class="`lp-rewards-xp-card--${level.tone ?? 'explorer'}`"
              >
                <span class="lp-rewards-xp-card__icon" aria-hidden="true">
                  <Icon
                    :icon="biFromClass(level.icon)"
                    :class="`lp-xp-icon lp-xp-icon--${level.tone ?? 'explorer'}`"
                  />
                </span>
                <div class="lp-rewards-xp-card__copy">
                  <h4 class="lp-rewards-xp-card__name">{{ level.name }}</h4>
                  <p class="lp-rewards-xp-card__xp mb-0">{{ level.xp }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== ONBOARDING ===================== -->
    <section id="work" class="lp-onboard-section lp-section py-5 py-lg-6 position-relative overflow-hidden">
      <div class="lp-onboard-ambient lp-onboard-ambient--purple" aria-hidden="true" />
      <div class="lp-onboard-ambient lp-onboard-ambient--gold" aria-hidden="true" />

      <div class="container-lg position-relative">
        <header class="lp-onboard-hero text-center mb-4 mb-lg-5">
          <span class="lp-section-pill">{{ t('landing.navOnboarding') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('landing.onboardingHeadline1') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('landing.onboardingHeadline2') }}</span>
          </h2>
          <p class="lp-onboard-hero__lead mb-0 mx-auto">{{ t('landing.onboardingHeadlineAccent') }}</p>
        </header>

        <div class="lp-onboard-mission">
          <aside class="lp-onboard-brief">
            <div class="lp-onboard-brief__ring" aria-hidden="true">
              <svg viewBox="0 0 120 120" class="lp-onboard-brief__svg">
                <circle cx="60" cy="60" r="52" class="lp-onboard-brief__track" />
                <circle cx="60" cy="60" r="52" class="lp-onboard-brief__progress" />
              </svg>
              <span class="lp-onboard-brief__hub">
                <strong>5</strong>
                <small>{{ t('landing.onboardingStatSteps') }}</small>
              </span>
            </div>

            <div class="lp-onboard-brief__stats">
              <span class="lp-onboard-brief__stat">
                <Icon :icon="bi('lightning-charge-fill')" aria-hidden="true" />
                <span>
                  <strong>{{ t('landing.onboardingStatSteps') }}</strong>
                  <small>Guided setup</small>
                </span>
              </span>
              <span class="lp-onboard-brief__stat">
                <Icon :icon="bi('clock-history')" aria-hidden="true" />
                <span>
                  <strong>48h</strong>
                  <small>{{ t('landing.onboardingStatReview') }}</small>
                </span>
              </span>
            </div>
          </aside>

          <div class="lp-onboard-runway">
            <ol class="lp-onboard-path list-unstyled mb-0">
              <li
                v-for="(step, i) in sellerOnboarding"
                :key="`step-${i}`"
                class="lp-onboard-path__stop"
                :class="`lp-onboard-path__stop--${step.accent}`"
              >
                <span class="lp-onboard-path__node" aria-hidden="true">{{ i + 1 }}</span>
                <article class="lp-onboard-path__card">
                  <span class="lp-onboard-path__icon" aria-hidden="true">
                    <Icon :icon="biFromClass(step.icon)" />
                  </span>
                  <span class="lp-onboard-path__copy">
                    <h3 class="lp-onboard-path__title">{{ step.title }}</h3>
                    <p class="lp-onboard-path__desc mb-0">{{ step.desc }}</p>
                  </span>
                </article>
              </li>
            </ol>

            <article class="lp-onboard-launch">
              <div class="lp-onboard-launch__copy">
                <span class="lp-onboard-launch__badge" aria-hidden="true">
                  <Icon :icon="bi('rocket-takeoff-fill')" />
                </span>
                <div>
                  <h3 class="lp-onboard-launch__title">{{ t('landing.onboarding6Title') }}</h3>
                  <p class="lp-onboard-launch__desc mb-0">{{ t('landing.onboarding6Desc') }}</p>
                </div>
              </div>
              <div class="lp-onboard-launch__actions">
                <router-link
                  :to="isAuthenticated ? dashboardRoute : buyerRoutes.sellerRegister"
                  class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
                >
                  <span class="lp-btn-pill__label">{{ isAuthenticated ? t('landing.headerGoToDashboard') : t('landing.onboarding6Cta') }}</span>
                  <span class="lp-btn-pill__well" aria-hidden="true">
                    <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                  </span>
                </router-link>
                <router-link
                  :to="landingAnchors.download"
                  class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
                  @click="onLandingSectionClick('download', $event)"
                >
                  <span class="lp-btn-pill__label">{{ t('landing.onboarding6CtaSecondary') }}</span>
                  <span class="lp-btn-pill__well" aria-hidden="true">
                    <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                  </span>
                </router-link>
              </div>
            </article>
          </div>
        </div>

        <div class="lp-onboard-podium mt-4 mt-lg-5">
          <header class="lp-onboard-podium__head text-center">
            <p class="lp-onboard-podium__label mb-1">{{ t('landing.sellerTiersLabel') }}</p>
            <p class="lp-onboard-podium__sub mb-0">{{ t('landing.sellerTiersSub') }}</p>
          </header>

          <div class="lp-onboard-podium__stage" role="list" :aria-label="t('landing.sellerTiersLabel')">
            <article
              v-for="(tier, i) in sellerTiers"
              :key="`tier-${i}`"
              class="lp-onboard-podium__slot"
              :class="[
                `lp-onboard-podium__slot--${tier.tone}`,
                { 'lp-onboard-podium__slot--peak': tier.peak },
              ]"
              role="listitem"
            >
              <div class="lp-onboard-podium__pillar" aria-hidden="true">
                <span class="lp-onboard-podium__icon">
                  <Icon :icon="biFromClass(tier.icon)" />
                </span>
              </div>
              <div class="lp-onboard-podium__plate">
                <span class="lp-onboard-podium__level">{{ tier.level }}</span>
                <h4 class="lp-onboard-podium__name">{{ tier.name }}</h4>
                <p class="lp-onboard-podium__desc mb-0">{{ tier.desc }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== EARN AS AN INFLUENCER ===================== -->
    <section id="share-earn" class="lp-influencer-section lp-section py-5 py-lg-6 position-relative">
      <div class="container-lg">
        <div class="row mb-4 mb-lg-5">
          <div class="col-lg-8">
            <span class="lp-section-pill">{{ t('landing.influencerLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('landing.influencerHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.influencerHeadline2') }}</span>
            </h2>
            <p class="lp-influencer-intro__lead mb-0">{{ t('landing.influencerBody') }}</p>
          </div>
        </div>

        <ol
          class="lp-influencer-steps row g-3 g-lg-4 list-unstyled mb-4 mb-lg-5"
          :aria-label="t('landing.influencerHowLabel')"
        >
          <li
            v-for="step in influencerSteps"
            :key="step.key"
            class="col-6 col-lg-4"
          >
            <article
              class="lp-influencer-step-card h-100"
              :class="`lp-influencer-step-card--${step.accent}`"
            >
              <div class="lp-influencer-step-card__top">
                <span class="lp-influencer-step-card__num" aria-hidden="true">{{ step.num }}</span>
                <span class="lp-influencer-step-card__icon" aria-hidden="true">
                  <Icon :icon="biFromClass(step.icon)" />
                </span>
              </div>
              <h3 class="lp-influencer-step-card__title">{{ step.title }}</h3>
              <p class="lp-influencer-step-card__desc mb-0">{{ step.desc }}</p>
            </article>
          </li>
        </ol>

        <div class="lp-influencer-footer d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="lp-influencer-trust">
            <Icon :icon="bi('shield-check')" class="lp-influencer-trust__icon" aria-hidden="true" />
            <p class="lp-influencer-trust__text mb-0">{{ t('landing.influencerNote') }}</p>
          </div>
          <router-link
            :to="buyerRoutes.shareEarn"
            class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center flex-shrink-0"
          >
            <span class="lp-btn-pill__label d-inline-flex align-items-center gap-2">
              <Icon :icon="bi('link-45deg')" />
              <span>{{ t('landing.influencerCta') }}</span>
            </span>
            <span class="lp-btn-pill__well" aria-hidden="true">
              <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===================== WHY KKOO ===================== -->
    <section id="why" class="lp-section lp-trust-section py-5 py-lg-6">
      <div class="container-lg">
        <div class="row mb-5 text-center">
          <div class="col-lg-8 mx-auto">
            <span class="lp-section-pill">{{ t('landing.whyLabel') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('landing.movementHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.movementHeadline2') }}</span>
            </h2>
            <p class="fs-5 lp-trust-lead mb-0">{{ t('landing.movementBody') }}</p>
          </div>
        </div>

        <div class="row g-4">
          <div v-for="(pillar, i) in whyPillars" :key="i" class="col-6 col-lg-3">
            <article class="lp-trust-card h-100" :class="`lp-trust-card--${pillar.accent}`">
              <div class="lp-trust-card__icon" aria-hidden="true">
                <Icon :icon="biFromClass(pillar.icon)" />
              </div>
              <h3 class="lp-trust-card__title">{{ pillar.title }}</h3>
              <p class="lp-trust-card__body mb-0">{{ pillar.desc }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== STATS ===================== -->
    <section
      ref="statsSectionRef"
      class="lp-stats-section py-5 py-lg-6 position-relative overflow-hidden"
    >
      <div class="lp-stats-ambient lp-stats-ambient--gold" aria-hidden="true" />
      <div class="lp-stats-ambient lp-stats-ambient--light" aria-hidden="true" />

      <div class="container-lg position-relative">
        <header class="lp-stats-head text-center mb-4 mb-lg-5">
          <span class="lp-section-pill lp-section-pill--on-dark">{{ statsSectionMeta.label }}</span>
          <h2 class="display-4 fw-800 lp-section-heading lp-section-heading--inverse mb-0">
            {{ statsSectionMeta.headline }}
            <span class="lp-text-primary d-block d-md-inline">{{ statsSectionMeta.headlineAccent }}</span>
          </h2>
        </header>

        <div class="lp-stats-constellation">
          <div class="lp-stats-mesh" aria-hidden="true" />

          <div class="lp-stats-bento">
            <article
              v-for="(stat, i) in stats"
              :key="stat.key || i"
              class="lp-stats-node"
              :class="{
                'lp-stats-node--hero': stat.featured,
                'lp-stats-node--pulse': i === 0,
              }"
            >
              <span class="lp-stats-node__ring" aria-hidden="true">
                <Icon :icon="biFromClass(stat.icon)" />
              </span>
              <h3 class="lp-stats-node__value" aria-live="polite">{{ statDisplays[i] ?? stat.value }}</h3>
              <p class="lp-stats-node__label mb-0">{{ stat.label }}</p>
              <span class="lp-stats-node__shine" aria-hidden="true" />
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== TESTIMONIALS ===================== -->
    <section
      id="stories"
      ref="testimonialsSectionRef"
      class="lp-testimonials-section lp-services-section lp-section py-5 py-lg-6 position-relative"
    >
      <div class="container-lg">
        <div class="row mb-4 mb-lg-5 text-center">
          <div class="col-lg-9 mx-auto">
            <span class="lp-section-pill">{{ t('landing.testimonialsSectionPill') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('landing.testimonialsHeadline1') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('landing.testimonialsHeadline2') }}</span>
            </h2>
          </div>
        </div>

        <div
          class="lp-testimonials-carousel"
          @mouseenter="pauseTestimonialAutoplay"
          @mouseleave="resumeTestimonialAutoplay"
          @focusin="pauseTestimonialAutoplay"
          @focusout="resumeTestimonialAutoplay"
        >
          <div
            class="lp-testimonials-track"
            :style="{ transform: `translateX(-${testimonialSlide * 100}%)` }"
          >
            <div
              v-for="(slide, slideIndex) in testimonialCarouselSlides"
              :key="`testimonial-slide-${slideIndex}`"
              class="lp-testimonials-slide"
              :class="{ 'lp-testimonials-slide--solo': testimonialsCarouselStacked }"
            >
              <article
                v-for="(testimonial, cardIndex) in slide"
                :key="`${slideIndex}-${testimonial.name}`"
                class="lp-testimonial-showcase"
                :class="{ 'lp-testimonial-showcase--visible': testimonialsInView }"
                :style="{ '--testimonial-stagger': cardIndex }"
              >
                <span class="lp-testimonial-showcase__quote" aria-hidden="true">“</span>
                <p class="lp-testimonial-showcase__text">{{ testimonial.text }}</p>
                <div class="lp-testimonial-showcase__profile">
                  <div class="lp-testimonial-showcase__avatar" aria-hidden="true">
                    {{ testimonial.initials }}
                  </div>
                  <div>
                    <p class="lp-testimonial-showcase__name mb-0">{{ testimonial.name }}</p>
                    <p class="lp-testimonial-showcase__handle mb-0">{{ testimonial.handle }}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div
          class="lp-testimonials-dots"
          role="tablist"
          :aria-label="t('landing.testimonialsCarouselAria')"
        >
          <button
            v-for="(label, i) in testimonialDotItems"
            :key="`testimonial-dot-${i}`"
            type="button"
            class="lp-testimonials-dot"
            :class="{ 'lp-testimonials-dot--active': testimonialSlide === i }"
            role="tab"
            :aria-selected="testimonialSlide === i"
            :aria-label="testimonialDotAriaLabel(i, label)"
            @click="setTestimonialSlide(i)"
          />
        </div>
      </div>
    </section>

    <!-- ===================== GET THE APP ===================== -->
    <section
      id="download"
      ref="downloadSectionRef"
      class="lp-download-section lp-download-section--surprise lp-section py-5 py-lg-6 position-relative overflow-hidden"
      :class="{
        'lp-download-section--burst': downloadBurstActive,
        'lp-download-section--lane-buyers': downloadLane === 'buyers',
        'lp-download-section--lane-sellers': downloadLane === 'sellers',
      }"
      :style="downloadSpotlightStyle"
      @mousemove="onDownloadSectionMove"
      @mouseleave="onDownloadSectionLeave"
    >
      <div class="lp-download-aurora" aria-hidden="true" />
      <div class="lp-download-grid-glow" aria-hidden="true" />
      <div class="lp-download-constellation" aria-hidden="true">
        <span
          v-for="(node, i) in downloadConstellation"
          :key="node.icon"
          class="lp-download-orbit"
          :class="`lp-download-orbit--${node.tone}`"
          :style="{ '--orbit-i': i }"
        >
          <Icon :icon="bi(node.icon)" />
        </span>
      </div>

      <div class="container-lg position-relative">
        <div class="lp-download-corridor">
          <header class="lp-download-corridor__head">
            <span
              class="lp-section-pill lp-download-pill-hit"
              role="button"
              tabindex="0"
              :aria-label="t('landing.downloadPillA11y')"
              @click="onDownloadPillClick"
              @keydown.enter.prevent="onDownloadPillClick"
            >{{ t('landing.downloadSectionPill') }}</span>
            <h2 class="display-4 fw-800 lp-section-heading mb-3">
              <span v-if="downloadHeadlineParts.accent">{{ downloadHeadlineParts.lead }}</span>
              <template v-else>{{ t('landing.downloadSectionHeadline') }}</template>
              <span
                v-if="downloadHeadlineParts.accent"
                class="lp-text-primary d-block d-md-inline"
              >{{ downloadHeadlineParts.accent }}</span>
            </h2>
            <p class="lp-download-corridor__sub mb-0">{{ t('landing.downloadSectionSub') }}</p>
            <div
              v-if="downloadInView"
              class="lp-download-whisper"
              role="status"
              aria-live="polite"
            >
              <Transition name="lp-download-whisper" mode="out-in">
                <p :key="downloadWhisperIndex" class="lp-download-whisper__line mb-0">
                  {{ downloadWhispers[downloadWhisperIndex] }}
                </p>
              </Transition>
            </div>
          </header>

          <div
            class="lp-download-lanes"
            role="tablist"
            :aria-label="t('landing.downloadLaneA11y')"
          >
            <button
              id="download-tab-buyers"
              type="button"
              role="tab"
              class="lp-download-lane"
              :class="{ 'lp-download-lane--active': downloadLane === 'buyers' }"
              :aria-selected="downloadLane === 'buyers'"
              aria-controls="download-panel-buyers"
              @click="setDownloadLane('buyers')"
            >
              <Icon :icon="bi('bag-heart')" aria-hidden="true" />
              <span>{{ t('landing.downloadLaneBuyers') }}</span>
            </button>
            <button
              id="download-tab-sellers"
              type="button"
              role="tab"
              class="lp-download-lane"
              :class="{ 'lp-download-lane--active': downloadLane === 'sellers' }"
              :aria-selected="downloadLane === 'sellers'"
              aria-controls="download-panel-sellers"
              @click="setDownloadLane('sellers')"
            >
              <Icon :icon="bi('shop-window')" aria-hidden="true" />
              <span>{{ t('landing.downloadLaneSellers') }}</span>
            </button>
          </div>

          <div class="lp-download-deck-wrap">
            <div class="lp-download-bridge" aria-hidden="true">
              <svg class="lp-download-bridge__svg" viewBox="0 0 320 48" preserveAspectRatio="none">
                <path
                  class="lp-download-bridge__path"
                  d="M8 28 C80 4, 240 4, 312 28"
                  fill="none"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
              <span class="lp-download-bridge__dot" />
              <span class="lp-download-bridge__label">{{ t('landing.downloadBridgeLabel') }}</span>
            </div>

            <div class="lp-download-deck">
            <Transition name="lp-download-panel" mode="out-in">
            <article
              v-if="buyersApp && (!downloadStacked || downloadLane === 'buyers')"
              id="download-panel-buyers"
              key="download-buyers"
              role="tabpanel"
              aria-labelledby="download-tab-buyers"
              class="lp-download-card lp-download-card--buyers"
              @mouseenter="setDownloadLane('buyers')"
              @focusin="setDownloadLane('buyers')"
            >
              <span class="lp-download-card__ribbon" aria-hidden="true" />
              <header class="lp-download-card__head">
                <span class="lp-download-card__tag">{{ buyersApp.tag }}</span>
                <h3 class="lp-download-card__title">{{ buyersApp.name }}</h3>
              </header>
              <p class="lp-download-card__desc mb-0">{{ buyersApp.desc }}</p>
              <div class="lp-download-card__cta">
                <span class="lp-download-card__cta-label">{{ t('landing.downloadAvailableOn') }}</span>
                <ul class="lp-download-card__links list-unstyled mb-0">
                  <li
                    v-for="action in downloadActionsFor('buyers')"
                    :key="action.id"
                  >
                    <a
                      :href="action.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="lp-download-badge"
                      :class="`lp-download-badge--${action.tone}`"
                    >
                      <span class="lp-download-badge__mark" aria-hidden="true">
                        <Icon :icon="bi(action.icon)" class="lp-download-badge__icon" />
                      </span>
                      <span class="lp-download-badge__copy">
                        <span class="lp-download-badge__kicker">{{ action.kicker }}</span>
                        <span class="lp-download-badge__brand">{{ action.brand }}</span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </article>
            </Transition>

            <Transition name="lp-download-panel" mode="out-in">
            <article
              v-if="sellersApp && (!downloadStacked || downloadLane === 'sellers')"
              id="download-panel-sellers"
              key="download-sellers"
              role="tabpanel"
              aria-labelledby="download-tab-sellers"
              class="lp-download-card lp-download-card--sellers"
              @mouseenter="setDownloadLane('sellers')"
              @focusin="setDownloadLane('sellers')"
            >
              <span class="lp-download-card__ribbon" aria-hidden="true" />
              <header class="lp-download-card__head">
                <span class="lp-download-card__tag">{{ sellersApp.tag }}</span>
                <h3 class="lp-download-card__title">{{ sellersApp.name }}</h3>
              </header>
              <p class="lp-download-card__desc mb-0">{{ sellersApp.desc }}</p>
              <div class="lp-download-card__cta">
                <span class="lp-download-card__cta-label">{{ t('landing.downloadAvailableOn') }}</span>
                <ul class="lp-download-card__links list-unstyled mb-0">
                  <li
                    v-for="action in downloadActionsFor('sellers')"
                    :key="action.id"
                  >
                    <a
                      :href="action.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="lp-download-badge"
                      :class="`lp-download-badge--${action.tone}`"
                    >
                      <span class="lp-download-badge__mark" aria-hidden="true">
                        <Icon :icon="bi(action.icon)" class="lp-download-badge__icon" />
                      </span>
                      <span class="lp-download-badge__copy">
                        <span class="lp-download-badge__kicker">{{ action.kicker }}</span>
                        <span class="lp-download-badge__brand">{{ action.brand }}</span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <footer class="lp-download-card__foot">
                <p class="lp-download-card__foot-note mb-0">{{ t('landing.downloadSellersNote') }}</p>
                <a
                  v-if="isAuthenticated"
                  :href="bizWebUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="lp-download-card__foot-link"
                >
                  <Icon :icon="bi('speedometer2')" />
                  <span>{{ t('landing.downloadSellersCta') }}</span>
                  <Icon :icon="bi('arrow-right')" class="lp-download-card__foot-arrow" aria-hidden="true" />
                </a>
                <router-link
                  v-else
                  :to="buyerRoutes.sellerRegister"
                  class="lp-download-card__foot-link"
                >
                  <Icon :icon="bi('globe2')" />
                  <span>{{ t('landing.downloadSellersCta') }}</span>
                  <Icon :icon="bi('arrow-right')" class="lp-download-card__foot-arrow" aria-hidden="true" />
                </router-link>
              </footer>
            </article>
            </Transition>
            </div>
          </div>
        </div>
      </div>

      <Transition name="lp-download-pop">
        <div
          v-if="downloadBurstActive"
          class="lp-download-burst"
          role="status"
        >
          <span class="lp-download-burst__emoji" aria-hidden="true">📲✨🛍️</span>
          <p class="lp-download-burst__title mb-1">{{ t('landing.downloadBurstTitle') }}</p>
          <p class="mb-0">{{ t('landing.downloadBurstMessage') }}</p>
        </div>
      </Transition>

      <div v-if="downloadBurstActive" class="lp-download-confetti" aria-hidden="true">
        <span
          v-for="n in 20"
          :key="n"
          class="lp-download-confetti-bit"
          :style="{ '--i': n }"
        />
      </div>
    </section>

    <!-- ===================== CTA ===================== -->
    <section class="lp-cta-section py-5 py-lg-6 position-relative overflow-hidden">
      <div
        class="lp-cta-bg"
        role="presentation"
        :style="{ backgroundImage: `url(${ctaImage})` }"
      />
      <div class="lp-cta-overlay" aria-hidden="true" />
      <div class="lp-cta-glow lp-cta-glow--gold" aria-hidden="true" />
      <div class="lp-cta-glow lp-cta-glow--purple" aria-hidden="true" />

      <div class="container-lg position-relative lp-cta-content">
        <div class="lp-cta-stage">
          <div class="lp-cta-copy text-center text-lg-start">
            <span class="lp-cta-kicker">{{ t('landing.finalLabel') }}</span>
            <h2 class="lp-cta-headline mb-3">
              <span class="lp-cta-headline__line">{{ t('landing.finalHeadline1') }}</span>
              <span class="lp-cta-headline__accent">{{ t('landing.finalHeadline2') }}</span>
            </h2>
            <p class="lp-cta-lead mb-3">{{ t('landing.finalBody') }}</p>
            <p class="lp-cta-micro mb-4">{{ t('landing.finalMicrocopy') }}</p>

            <div class="lp-cta-actions">
              <div class="lp-cta-account mb-3 mb-lg-0">
                <KkooAccountButton variant="accent" size="lg" />
              </div>
              <router-link
                :to="landingAnchors.download"
                class="lp-cta-action lp-cta-action--primary text-decoration-none"
                @click="onLandingSectionClick('download', $event)"
              >
                <span class="lp-cta-action__icon" aria-hidden="true">
                  <Icon :icon="bi('download')" />
                </span>
                <span class="lp-cta-action__text">{{ t('landing.finalCtaDownload') }}</span>
                <Icon :icon="bi('arrow-right')" class="lp-cta-action__arrow" />
              </router-link>
              <router-link
                :to="buyerRoutes.marketplace"
                class="lp-cta-action text-decoration-none"
              >
                <span class="lp-cta-action__icon" aria-hidden="true">
                  <Icon :icon="bi('bag-heart')" />
                </span>
                <span class="lp-cta-action__text">{{ t('landing.ctaShopOnWeb') }}</span>
                <Icon :icon="bi('arrow-right')" class="lp-cta-action__arrow" />
              </router-link>
              <router-link
                :to="buyerRoutes.business"
                class="lp-cta-action text-decoration-none"
              >
                <span class="lp-cta-action__icon" aria-hidden="true">
                  <Icon :icon="bi('window-stack')" />
                </span>
                <span class="lp-cta-action__text">{{ t('landing.finalCtaSell') }}</span>
                <Icon :icon="bi('arrow-right')" class="lp-cta-action__arrow" />
              </router-link>
              <router-link
                :to="buyerRoutes.ride"
                class="lp-cta-action text-decoration-none"
              >
                <span class="lp-cta-action__icon" aria-hidden="true">
                  <Icon :icon="bi('scooter')" />
                </span>
                <span class="lp-cta-action__text">{{ t('landing.finalCtaRide') }}</span>
                <Icon :icon="bi('arrow-right')" class="lp-cta-action__arrow" />
              </router-link>
              <router-link
                :to="buyerRoutes.personal"
                class="lp-cta-action text-decoration-none"
              >
                <span class="lp-cta-action__icon" aria-hidden="true">
                  <Icon :icon="bi('person-heart')" />
                </span>
                <span class="lp-cta-action__text">{{ t('landing.navPersonal') }}</span>
                <Icon :icon="bi('arrow-right')" class="lp-cta-action__arrow" />
              </router-link>
              <router-link
                :to="buyerRoutes.community"
                class="lp-cta-action text-decoration-none"
              >
                <span class="lp-cta-action__icon" aria-hidden="true">
                  <Icon :icon="bi('people')" />
                </span>
                <span class="lp-cta-action__text">{{ t('landing.navCommunity') }}</span>
                <Icon :icon="bi('arrow-right')" class="lp-cta-action__arrow" />
              </router-link>
            </div>

            <div class="lp-cta-trust-mobile d-lg-none">
              <article
                v-for="card in ctaTrustCards"
                :key="`m-${card.label}`"
                class="lp-cta-trust-chip"
                :class="`lp-cta-trust-chip--${card.tone}`"
              >
                <Icon :icon="bi(card.icon)" />
                <span>{{ card.value }}</span>
              </article>
            </div>
          </div>

          <div class="lp-cta-visual d-none d-lg-block" aria-hidden="true">
            <div class="lp-cta-orbit">
              <span class="lp-cta-orbit__ring lp-cta-orbit__ring--outer" />
              <span class="lp-cta-orbit__ring lp-cta-orbit__ring--inner" />
              <span class="lp-cta-orbit__core">
                <Icon :icon="bi('shield-lock-fill')" />
              </span>
            </div>

            <article
              v-for="(card, i) in ctaTrustCards"
              :key="card.label"
              class="lp-cta-float"
              :class="`lp-cta-float--${i + 1} lp-cta-float--${card.tone}`"
            >
              <span class="lp-cta-float__icon">
                <Icon :icon="bi(card.icon)" />
              </span>
              <span class="lp-cta-float__copy">
                <span class="lp-cta-float__label">{{ card.label }}</span>
                <span class="lp-cta-float__value">{{ card.value }}</span>
              </span>
            </article>
          </div>
        </div>
      </div>
    </section>

    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import KkooAccountButton from '@/components/auth/KkooAccountButton.vue'
import LandingHeader from '@/views/marketing/partials/LandingHeader.vue'
import LandingFooter from '@/views/marketing/partials/LandingFooter.vue'
import { useAuthDisplay } from '@/composables/useAuthDisplay'
import { buyerRoutes, landingAnchors, shopVerticals, marketingPrograms, bizWebUrl } from '@/config/landing-links'
import { appLinks } from '@/config/app-links'
import { landingApi, type LandingStatItem } from '@/api/landing'

// Import images
import heroImg from '@/assets/landing/hero.jpg'
import catImg from '@/assets/landing/cat.jpg'
import shopImg from '@/assets/landing/services/shop.jpg'
import foodImg from '@/assets/landing/services/food.jpg'

const { t } = useI18n()
const route = useRoute()
const { isAuthenticated, dashboardRoute } = useAuthDisplay()

function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const root = document.querySelector('.mk-landing')
  const target =
    root?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ?? document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior, block: 'start' })
  const hash = `#${id}`
  if (window.location.hash !== hash) {
    history.replaceState(null, '', hash)
  }
}

function onLandingSectionClick(id: string, event: MouseEvent) {
  if (route.name !== 'pages.landing') return
  event.preventDefault()
  scrollToSection(id)
}

onMounted(() => {
  const root = document.querySelector('.mk-landing')
  if (!root) return

  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-wow]'))
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

  if (targets.length > 0) {
    if (prefersReduced) {
      for (const el of targets) el.classList.add('is-inview')
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              ;(entry.target as HTMLElement).classList.add('is-inview')
              io.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
      )

      for (const el of targets) io.observe(el)
    }
  }

  root.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
    if (!a) return
    const id = a.getAttribute('href')?.slice(1)
    if (!id) return
    const target = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (!target) return
    e.preventDefault()
    scrollToSection(id, prefersReduced ? 'auto' : 'smooth')
  })

  if (route.hash) {
    const id = route.hash.slice(1)
    window.setTimeout(() => scrollToSection(id, 'auto'), 80)
  }
})

watch(
  () => route.hash,
  (hash) => {
    if (!hash || route.name !== 'pages.landing') return
    const id = hash.slice(1)
    requestAnimationFrame(() => scrollToSection(id))
  },
)

const heroImage = heroImg
const ctaImage = catImg
// NOTE: "Radion-style showcase" section removed.

function bi(iconName: string) {
  return `bi:${iconName}`
}

function biFromClass(className: string) {
  // Supports legacy strings like "bi bi-bag-fill"
  const iconSlug = className
    .split(/\s+/)
    .find((t) => t.startsWith('bi-') && t !== 'bi')
    ?.replace(/^bi-/, '')
  return iconSlug ? `bi:${iconSlug}` : 'bi:question-circle'
}

type FeatureCard = { title: string; desc: string; icon: string; color: string }

function landingFeatureCards(
  prefix: string,
  count: number,
  icons: string[],
  colors: string[],
): FeatureCard[] {
  return Array.from({ length: count }, (_, i) => ({
    title: t(`landing.${prefix}${i + 1}Title`),
    desc: t(`landing.${prefix}${i + 1}Desc`),
    icon: icons[i] ?? 'bi bi-check-circle',
    color: colors[i] ?? 'rgba(88, 15, 168, 0.1)',
  }))
}

const cardColors = [
  'rgba(88, 15, 168, 0.1)',
  'rgba(248, 180, 75, 0.1)',
  'rgba(124, 45, 158, 0.1)',
  'rgba(255, 184, 0, 0.1)',
]

// ===== VERTICALS (buyers app + sellers) =====
const verticals = computed(() => [
  {
    tag: t('landing.verticalBuyersTag'),
    title: t('landing.verticalBuyersTitle'),
    desc: t('landing.verticalBuyersDesc'),
    context: t('landing.verticalBuyersContext'),
    icon: 'bi bi-bag-heart',
    image: foodImg,
    accent: 'buyers',
    to: buyerRoutes.personal,
  },
  {
    tag: t('landing.verticalSellersTag'),
    title: t('landing.verticalSellersTitle'),
    desc: t('landing.verticalSellersDesc'),
    context: t('landing.verticalSellersContext'),
    icon: 'bi bi-shop',
    image: shopImg,
    accent: 'sellers',
    to: buyerRoutes.business,
  },
])

const buyerFeatures = computed(() =>
  landingFeatureCards(
    'buyerFeature',
    6,
    ['bi bi-shield-lock', 'bi bi-geo-alt', 'bi bi-bag-check', 'bi bi-trophy', 'bi bi-lightning', 'bi bi-phone'],
    cardColors,
  ),
)

const sellerFeatures = computed(() =>
  landingFeatureCards(
    'sellerFeature',
    6,
    ['bi bi-shop', 'bi bi-cash-stack', 'bi bi-graph-up', 'bi bi-person-vcard', 'bi bi-box-seam', 'bi bi-megaphone'],
    cardColors,
  ),
)

const buyerProtectionFeatures = computed(() =>
  landingFeatureCards(
    'buyerProtection',
    4,
    ['bi bi-patch-check', 'bi bi-shield-lock', 'bi bi-truck', 'bi bi-clock-history'],
    cardColors,
  ),
)

// ===== BUSINESS / ADMIN MODULES =====
const businessModules = ref([
  {
    title: 'People and access',
    desc: 'Who can do what',
    icon: 'bi bi-people-fill',
    color: 'rgba(88, 15, 168, 0.1)',
    items: ['Phone sign-in', 'Staff roles', 'KYC checks', 'Browsers stay signed in sensibly']
  },
  {
    title: 'Commerce',
    desc: 'Orders in one view',
    icon: 'bi bi-cart-check-fill',
    color: 'rgba(248, 180, 75, 0.1)',
    items: ['See every cart', 'Refunds and disputes', 'Settlement previews', 'Audit trail you can print']
  },
  {
    title: 'Reports',
    desc: 'Numbers for Monday',
    icon: 'bi bi-bar-chart-fill',
    color: 'rgba(124, 45, 158, 0.1)',
    items: ['Sales and throughput', 'What is selling', 'Exports for finance', 'Search and demand hints']
  },
  {
    title: 'Delivery',
    desc: 'Routes and riders',
    icon: 'bi bi-geo-fill',
    color: 'rgba(255, 184, 0, 0.1)',
    items: ['Zones and pricing', 'Assignments', 'Proof of delivery', 'When something goes off-route']
  },
  {
    title: 'Payouts',
    desc: 'Money with a paper trail',
    icon: 'bi bi-bank2',
    color: 'rgba(88, 15, 168, 0.1)',
    items: ['Payout batches', 'Commission lines', 'Tax exports', 'When numbers do not match']
  },
  {
    title: 'CRM',
    desc: 'Customers and invoices',
    icon: 'bi bi-receipt',
    color: 'rgba(248, 180, 75, 0.1)',
    items: ['Customer cards', 'PDF invoices', 'Deni reminders', 'Suppliers and POs']
  }
])

// ===== ECOSYSTEM LOOP (buyers + sellers) =====
const ecosystemCards = computed(() =>
  [1, 2, 3].map((i) => ({
    title: t(`landing.ecosystemCard${i}Title`),
    desc: t(`landing.ecosystemCard${i}Desc`),
    icon: ['bi bi-bag-heart', 'bi bi-shop', 'bi bi-arrow-repeat'][i - 1],
    color: ['rgba(88, 15, 168, 0.15)', 'rgba(248, 180, 75, 0.15)', 'rgba(124, 45, 158, 0.15)'][i - 1],
  })),
)

// ===== REWARDS & GAMIFICATION =====
const rewardsList = ref([
  { title: 'Points that add up', desc: 'Earn on orders in the buyers app. Redeem at checkout.', icon: 'bi bi-coin' },
  { title: 'Vouchers you can send', desc: 'Create them here, friends open them in the app—nice for birthdays or win-backs.', icon: 'bi bi-gift' },
  { title: 'Referrals that pay', desc: 'We tie signups and sales back to a link so people get paid what you promised.', icon: 'bi bi-share' },
  { title: 'Promos you control', desc: 'Flash sales, bundles, and coupons you switch on once and run everywhere the same way.', icon: 'bi bi-tag' },
  { title: 'Little wins, often', desc: 'Streaks, scratch cards, and small surprises that keep regulars coming back without feeling nagged.', icon: 'bi bi-stars' }
])

const xpLevels = ref([
  { name: 'Explorer', xp: '0 - 499 XP', icon: 'bi bi-compass', tone: 'explorer', featured: false },
  { name: 'Regular', xp: '500 - 1,999 XP', icon: 'bi bi-star-fill', tone: 'regular', featured: false },
  { name: 'Silver', xp: '2,000 - 4,999 XP', icon: 'bi bi-award-fill', tone: 'silver', featured: false },
  { name: 'Gold', xp: '5,000 - 9,999 XP', icon: 'bi bi-trophy-fill', tone: 'gold', featured: true },
  { name: 'Platinum', xp: '10,000+ XP', icon: 'bi bi-gem', tone: 'platinum', featured: false },
  { name: '11+ Badges', xp: 'Collect them all', icon: 'bi bi-patch-check-fill', tone: 'badges', featured: false }
])

const featuredXpLevel = computed(() => xpLevels.value.find((l) => l.featured) ?? null)
const standardXpLevels = computed(() => xpLevels.value.filter((l) => !l.featured))

const rewardsHeadlineParts = computed(() => {
  const full = t('landing.rewardsHeadline')
  const lastSpace = full.lastIndexOf(' ')
  if (lastSpace <= 0) return { lead: full, accent: '' }
  return {
    lead: full.slice(0, lastSpace),
    accent: full.slice(lastSpace + 1),
  }
})

// ===== SELLER ONBOARDING (guided steps) =====
const sellerOnboarding = computed(() =>
  [1, 2, 3, 4, 5].map((i) => ({
    title: t(`landing.onboarding${i}Title`),
    desc: t(`landing.onboarding${i}Desc`),
    icon: [
      'bi bi-person-badge',
      'bi bi-mortarboard',
      'bi bi-box-seam',
      'bi bi-bag-check',
      'bi bi-rocket-takeoff',
    ][i - 1],
    accent: ['purple', 'purple', 'gold', 'gold', 'purple'][i - 1],
  })),
)

const sellerTiers = computed(() =>
  [1, 2, 3, 4].map((i) => ({
    level: t(`landing.sellerTier${i}Level`),
    name: t(`landing.sellerTier${i}Name`),
    desc: t(`landing.sellerTier${i}Desc`),
    icon: ['bi bi-rocket-takeoff', 'bi bi-patch-check-fill', 'bi bi-star-fill', 'bi bi-gem'][i - 1],
    tone: ['launch', 'verified', 'preferred', 'partner'][i - 1],
    peak: i === 4,
  })),
)

const influencerSteps = computed(() =>
  [1, 2, 3].map((i) => ({
    key: `step-${i}`,
    num: String(i).padStart(2, '0'),
    title: t(`landing.influencerStep${i}Title`),
    desc: t(`landing.influencerStep${i}Desc`),
    icon: ['bi bi-share-fill', 'bi bi-graph-up-arrow', 'bi bi-wallet2'][i - 1],
    accent: ['share', 'growth', 'payout'][i - 1],
  })),
)

// ===== WHY KKOO PILLARS =====
const whyPillars = computed(() =>
  [1, 2, 3, 4].map((i) => ({
    title: t(`landing.whyPillar${i}Title`),
    desc: t(`landing.whyPillar${i}Body`),
    icon: [
      'bi bi-shield-lock-fill',
      'bi bi-geo-alt-fill',
      'bi bi-patch-check-fill',
      'bi bi-clock-history',
    ][i - 1],
    accent: ['purple', 'gold', 'purple', 'gold'][i - 1],
  })),
)

// ===== STATS (count-up when section scrolls into view) =====
type LandingStat = LandingStatItem

const defaultStats = (): LandingStat[] => [
  { key: 'wallets', value: '100K+', label: 'Active wallets', icon: 'bi bi-people-fill', featured: true },
  { key: 'skus', value: '1,000+', label: 'SKUs in catalog', icon: 'bi bi-box-seam-fill', featured: true },
  { key: 'orders_paid', value: '50K+', label: 'Orders paid', icon: 'bi bi-arrow-left-right', featured: false },
  { key: 'apps', value: '2', label: 'Apps in the ecosystem', icon: 'bi bi-grid-fill', featured: false },
  { key: 'support', value: '24/7', label: 'Help when it is busy', icon: 'bi bi-broadcast', featured: false },
  { key: 'payments', value: '5', label: 'Ways to pay', icon: 'bi bi-credit-card-fill', featured: false },
  { key: 'express', value: '30 min', label: 'Express delivery', icon: 'bi bi-lightning-fill', featured: false },
  { key: 'disputes', value: '48 hrs', label: 'Dispute first reply', icon: 'bi bi-shield-fill-check', featured: false },
]

const stats = ref<LandingStat[]>(defaultStats())

const statsSectionMeta = ref({
  label: '',
  headline: '',
  headlineAccent: '',
})

function applyStatsFallbackMeta() {
  statsSectionMeta.value = {
    label: t('landing.statsSectionPill'),
    headline: t('landing.statsSectionHeadline1'),
    headlineAccent: t('landing.statsSectionHeadline2'),
  }
}

applyStatsFallbackMeta()

async function loadLandingStats() {
  try {
    const data = await landingApi.stats()
    if (!data) {
      stats.value = defaultStats()
      applyStatsFallbackMeta()
      return
    }
    if (data.section_label?.trim()) {
      statsSectionMeta.value.label = data.section_label.trim()
    }
    if (data.section_headline?.trim()) {
      statsSectionMeta.value.headline = data.section_headline.trim()
    }
    if (data.section_headline_accent?.trim()) {
      statsSectionMeta.value.headlineAccent = data.section_headline_accent.trim()
    }
    if (Array.isArray(data.stats) && data.stats.length > 0) {
      stats.value = data.stats.map((row) => ({
        key: row.key || row.label,
        label: row.label,
        value: row.value,
        icon: row.icon || 'bi bi-check-circle',
        featured: Boolean(row.featured),
      }))
    }
  } catch {
    stats.value = defaultStats()
    applyStatsFallbackMeta()
  }
}

loadLandingStats()

type ParsedStat =
  | { type: 'static'; text: string }
  | { type: 'count'; target: number; format: (n: number) => string }

function parseStatForAnimation(value: string): ParsedStat {
  const v = value.trim()
  const k = /^(\d+)K\+$/i.exec(v)
  if (k) {
    const cap = Number(k[1])
    return { type: 'count', target: cap, format: (n) => `${Math.round(n)}K+` }
  }
  const comma = /^([\d,]+)\+$/.exec(v)
  if (comma) {
    const target = Number(comma[1].replace(/,/g, ''))
    return {
      type: 'count',
      target,
      format: (n) => `${Math.round(n).toLocaleString('en-US')}+`,
    }
  }
  const plain = /^(\d+)$/.exec(v)
  if (plain) {
    const target = Number(plain[1])
    return { type: 'count', target, format: (n) => String(Math.round(n)) }
  }
  const mins = /^(\d+)\s*min$/i.exec(v)
  if (mins) {
    const target = Number(mins[1])
    return { type: 'count', target, format: (n) => `${Math.round(n)} min` }
  }
  const hrs = /^(\d+)\s*hrs?$/i.exec(v)
  if (hrs) {
    const target = Number(hrs[1])
    return { type: 'count', target, format: (n) => `${Math.round(n)} hrs` }
  }
  return { type: 'static', text: v }
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function animateCount(
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (n: number) => void,
  onDone?: () => void,
) {
  const t0 = performance.now()
  function tick(now: number) {
    const elapsed = now - t0
    const t = Math.min(1, elapsed / durationMs)
    const e = easeOutCubic(t)
    onUpdate(from + (to - from) * e)
    if (t < 1) requestAnimationFrame(tick)
    else onDone?.()
  }
  requestAnimationFrame(tick)
}

const statsSectionRef = ref<HTMLElement | null>(null)
const statDisplays = ref<string[]>([])
const statsCounterStarted = ref(false)

function initStatDisplays() {
  statDisplays.value = stats.value.map((s) => {
    const p = parseStatForAnimation(s.value)
    return p.type === 'static' ? p.text : p.format(0)
  })
}

watch(
  stats,
  () => {
    initStatDisplays()
  },
  { deep: true, immediate: true },
)

function runStatsCounters() {
  stats.value.forEach((s, i) => {
    const p = parseStatForAnimation(s.value)
    if (p.type === 'static') return
    const delay = i * 75
    const duration = 1250
    window.setTimeout(() => {
      animateCount(0, p.target, duration, (n) => {
        statDisplays.value[i] = p.format(n)
      })
    }, delay)
  })
}

useIntersectionObserver(
  statsSectionRef,
  ([entry]) => {
    if (entry?.isIntersecting && !statsCounterStarted.value) {
      statsCounterStarted.value = true
      runStatsCounters()
    }
  },
  { threshold: 0.22 },
)

// ===== KKOO APPS =====
const downloadHeadlineParts = computed(() => {
  const full = t('landing.downloadSectionHeadline')
  const lastSpace = full.lastIndexOf(' ')
  if (lastSpace <= 0) return { lead: full, accent: '' }
  return {
    lead: full.slice(0, lastSpace),
    accent: full.slice(lastSpace + 1),
  }
})

const kkooApps = computed(() => [
  {
    key: 'buyers',
    tag: t('landing.verticalBuyersTag'),
    name: t('landing.verticalBuyersTitle'),
    desc: t('landing.downloadBuyersDesc'),
    icon: 'bi bi-bag-heart',
    tone: 'buyers',
  },
  {
    key: 'sellers',
    tag: t('landing.verticalSellersTag'),
    name: t('landing.verticalSellersTitle'),
    desc: t('landing.downloadSellersDesc'),
    icon: 'bi bi-window-stack',
    tone: 'sellers',
  },
])

type DownloadAction = {
  id: string
  href: string
  icon: string
  kicker: string
  brand: string
  tone: 'google' | 'apple' | 'windows' | 'mac'
}

const buyerDownloadActions = computed<DownloadAction[]>(() => [
  {
    id: 'google',
    href: appLinks.marketplace.googlePlay,
    icon: 'google-play',
    kicker: t('landing.storeBadgeGoogleKicker'),
    brand: t('landing.storeBadgeGoogleBrand'),
    tone: 'google',
  },
  {
    id: 'apple',
    href: appLinks.marketplace.appStore,
    icon: 'apple',
    kicker: t('landing.storeBadgeAppleKicker'),
    brand: t('landing.storeBadgeAppleBrand'),
    tone: 'apple',
  },
])

const sellerDownloadActions = computed<DownloadAction[]>(() => [
  {
    id: 'windows',
    href: appLinks.business.windows,
    icon: 'windows',
    kicker: t('landing.storeBadgeDesktopKicker'),
    brand: t('landing.storeBadgeWindowsBrand'),
    tone: 'windows',
  },
  {
    id: 'mac',
    href: appLinks.business.mac,
    icon: 'apple',
    kicker: t('landing.storeBadgeDesktopKicker'),
    brand: t('landing.storeBadgeMacBrand'),
    tone: 'mac',
  },
])

function downloadActionsFor(key: string) {
  return key === 'buyers' ? buyerDownloadActions.value : sellerDownloadActions.value
}

const buyersApp = computed(() => kkooApps.value.find((app) => app.key === 'buyers'))
const sellersApp = computed(() => kkooApps.value.find((app) => app.key === 'sellers'))

type DownloadLane = 'buyers' | 'sellers'

const downloadSectionRef = ref<HTMLElement | null>(null)
const downloadSpotlightStyle = ref<Record<string, string>>({})
const downloadLane = ref<DownloadLane>('buyers')
const downloadWhisperIndex = ref(0)
const downloadBurstActive = ref(false)
const downloadPillClicks = ref(0)
const downloadInView = ref(false)
const downloadStacked = ref(false)
let downloadWhisperTimer: ReturnType<typeof setInterval> | null = null
let downloadBurstTimeout: ReturnType<typeof setTimeout> | null = null
let downloadLayoutMq: MediaQueryList | null = null

function syncDownloadStacked() {
  if (typeof window === 'undefined') return
  downloadStacked.value = window.matchMedia('(max-width: 991.98px)').matches
}

const downloadWhispers = computed(() => [
  t('landing.downloadWhisper1'),
  t('landing.downloadWhisper2'),
  t('landing.downloadWhisper3'),
  t('landing.downloadWhisper4'),
  t('landing.downloadWhisper5'),
])

const downloadConstellation = [
  { icon: 'phone', tone: 'buyers' },
  { icon: 'bag-heart', tone: 'buyers' },
  { icon: 'geo-alt', tone: 'buyers' },
  { icon: 'shield-lock', tone: 'buyers' },
  { icon: 'laptop', tone: 'sellers' },
  { icon: 'shop-window', tone: 'sellers' },
  { icon: 'window-stack', tone: 'sellers' },
  { icon: 'globe2', tone: 'sellers' },
] as const

function onDownloadSectionMove(e: MouseEvent) {
  const el = downloadSectionRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const x = ((e.clientX - r.left) / r.width) * 100
  const y = ((e.clientY - r.top) / r.height) * 100
  downloadSpotlightStyle.value = {
    '--dl-spot-x': `${x}%`,
    '--dl-spot-y': `${y}%`,
  }
}

function onDownloadSectionLeave() {
  downloadSpotlightStyle.value = {
    '--dl-spot-x': '50%',
    '--dl-spot-y': '35%',
  }
}

function setDownloadLane(lane: DownloadLane) {
  downloadLane.value = lane
}

function onDownloadPillClick() {
  downloadPillClicks.value += 1
  if (downloadPillClicks.value >= 4) {
    downloadPillClicks.value = 0
    triggerDownloadBurst()
  }
}

function triggerDownloadBurst() {
  downloadBurstActive.value = true
  if (downloadBurstTimeout) clearTimeout(downloadBurstTimeout)
  downloadBurstTimeout = setTimeout(() => {
    downloadBurstActive.value = false
  }, 4800)
}

function startDownloadWhisperCycle() {
  if (downloadWhisperTimer) return
  downloadWhisperTimer = setInterval(() => {
    downloadWhisperIndex.value = (downloadWhisperIndex.value + 1) % downloadWhispers.value.length
  }, 4400)
}

function stopDownloadWhisperCycle() {
  if (downloadWhisperTimer) {
    clearInterval(downloadWhisperTimer)
    downloadWhisperTimer = null
  }
}

useIntersectionObserver(
  downloadSectionRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      downloadInView.value = true
      startDownloadWhisperCycle()
    } else {
      downloadInView.value = false
      stopDownloadWhisperCycle()
    }
  },
  { threshold: 0.18 },
)

const ctaTrustCards = computed(() => [
  {
    label: t('landing.ctaFloat1Label'),
    value: t('landing.ctaFloat1Value'),
    icon: 'shield-lock-fill',
    tone: 'purple',
  },
  {
    label: t('landing.ctaFloat2Label'),
    value: t('landing.ctaFloat2Value'),
    icon: 'geo-alt-fill',
    tone: 'gold',
  },
  {
    label: t('landing.ctaFloat3Label'),
    value: t('landing.ctaFloat3Value'),
    icon: 'patch-check-fill',
    tone: 'mint',
  },
])

const TESTIMONIAL_AUTOPLAY_MS = 6000

type TestimonialItem = {
  name: string
  role: string
  handle: string
  text: string
  initials: string
}

function testimonialHandleFromName(name: string) {
  const slug = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return slug ? `@${slug}` : '@kkoo'
}

function testimonialFromKeys(
  nameKey: string,
  roleKey: string,
  textKey: string,
  initials: string,
): TestimonialItem {
  const name = t(nameKey)
  return {
    name,
    role: t(roleKey),
    handle: testimonialHandleFromName(name),
    text: t(textKey),
    initials,
  }
}

const testimonialSlides = computed<TestimonialItem[][]>(() => [
  [
    testimonialFromKeys('landing.testimonial1Name', 'landing.testimonial1Role', 'landing.testimonial1Text', 'AM'),
    testimonialFromKeys('landing.testimonial2Name', 'landing.testimonial2Role', 'landing.testimonial2Text', 'DK'),
    testimonialFromKeys('landing.testimonial3Name', 'landing.testimonial3Role', 'landing.testimonial3Text', 'FM'),
  ],
  [
    testimonialFromKeys('landing.testimonial4Name', 'landing.testimonial4Role', 'landing.testimonial4Text', 'HK'),
    testimonialFromKeys('landing.testimonial5Name', 'landing.testimonial5Role', 'landing.testimonial5Text', 'GN'),
    testimonialFromKeys('landing.testimonial6Name', 'landing.testimonial6Role', 'landing.testimonial6Text', 'MZ'),
  ],
])

const testimonialSlideLabels = computed(() => [
  t('landing.testimonialsBuyerGroup'),
  t('landing.testimonialsSellerGroup'),
])

const allTestimonials = computed(() => testimonialSlides.value.flat())

const testimonialsCarouselStacked = ref(false)
let testimonialsLayoutMq: MediaQueryList | null = null

function syncTestimonialsCarouselStacked() {
  if (typeof window === 'undefined') return
  testimonialsCarouselStacked.value = window.matchMedia('(max-width: 991.98px)').matches
}

const testimonialCarouselSlides = computed(() => {
  if (testimonialsCarouselStacked.value) {
    return allTestimonials.value.map((item) => [item])
  }
  return testimonialSlides.value
})

const testimonialDotItems = computed(() => {
  if (testimonialsCarouselStacked.value) {
    return allTestimonials.value.map((item) => item.name)
  }
  return testimonialSlideLabels.value
})

function testimonialDotAriaLabel(index: number, label: string) {
  if (testimonialsCarouselStacked.value) {
    return t('landing.testimonialsCarouselGoTo', { n: index + 1 })
  }
  return t('landing.testimonialsCarouselGoToGroup', { group: label })
}

const testimonialsSectionRef = ref<HTMLElement | null>(null)
const testimonialsInView = ref(false)
const testimonialSlide = ref(0)

let testimonialTimer: ReturnType<typeof setInterval> | null = null
let testimonialAutoplayPaused = false

function clearTestimonialTimer() {
  if (testimonialTimer) {
    clearInterval(testimonialTimer)
    testimonialTimer = null
  }
}

function startTestimonialAutoplay() {
  clearTestimonialTimer()
  const slideCount = testimonialCarouselSlides.value.length
  if (slideCount < 2) return
  testimonialTimer = setInterval(() => {
    if (testimonialAutoplayPaused) return
    testimonialSlide.value = (testimonialSlide.value + 1) % slideCount
  }, TESTIMONIAL_AUTOPLAY_MS)
}

function setTestimonialSlide(index: number) {
  testimonialSlide.value = index
}

function pauseTestimonialAutoplay() {
  testimonialAutoplayPaused = true
}

function resumeTestimonialAutoplay() {
  testimonialAutoplayPaused = false
}

watch(testimonialCarouselSlides, (slides) => {
  if (testimonialSlide.value >= slides.length) testimonialSlide.value = 0
})

watch(testimonialsCarouselStacked, () => {
  testimonialSlide.value = 0
  if (testimonialsInView.value) startTestimonialAutoplay()
})

useIntersectionObserver(
  testimonialsSectionRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      testimonialsInView.value = true
      startTestimonialAutoplay()
    } else {
      clearTestimonialTimer()
    }
  },
  { threshold: 0.2 },
)

onMounted(() => {
  onDownloadSectionLeave()
  syncDownloadStacked()
  syncTestimonialsCarouselStacked()
  if (typeof window !== 'undefined') {
    downloadLayoutMq = window.matchMedia('(max-width: 991.98px)')
    downloadLayoutMq.addEventListener('change', syncDownloadStacked)
    testimonialsLayoutMq = window.matchMedia('(max-width: 991.98px)')
    testimonialsLayoutMq.addEventListener('change', syncTestimonialsCarouselStacked)
  }
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
    testimonialsInView.value = true
  }
})

onUnmounted(() => {
  clearTestimonialTimer()
  stopDownloadWhisperCycle()
  if (downloadBurstTimeout) clearTimeout(downloadBurstTimeout)
  downloadLayoutMq?.removeEventListener('change', syncDownloadStacked)
  testimonialsLayoutMq?.removeEventListener('change', syncTestimonialsCarouselStacked)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

/* ===== BRAND THEME VARS (KKOO tokens only) ===== */
.lp-wrapper.mk-landing {
  font-family: 'Poppins', sans-serif;
  --gr: 1.618;
  --primary: var(--kkoo-primary, var(--bs-kkoo-primary, #5c308f));
  --primary-dark: var(--kkoo-primary-dark, #3b1a5a);
  --primary-light: var(--kkoo-primary-light, #7b46b3);
  --gold: var(--kkoo-accent, var(--bs-kkoo-secondary, #f7a829));
  --gold-bright: var(--kkoo-accent-dark, #e8940f);
  --gold-light: var(--kkoo-gold-light, #f8b44b);
  --surface: var(--bs-kkoo-surface, #f9f7fc);
  --surface-2: var(--bs-kkoo-surface-variant, #ede9f5);
  --gold-ink: var(--kkoo-accent-dark);
  --gold-ink-2: var(--kkoo-accent-dark);
  --on-brand: color-mix(in srgb, var(--gold-light) 18%, var(--surface));
  --on-brand-strong: color-mix(in srgb, var(--gold-light) 12%, #fff);
  --on-brand-muted: color-mix(in srgb, var(--gold) 28%, var(--surface));
  --ink: var(--primary);
  --ink-muted: color-mix(in srgb, var(--primary) 62%, var(--bs-kkoo-on-surface-variant, #6b7280));
  --lp-icon-ink: var(--primary-dark);
  --lp-icon-ink-soft: var(--primary);
  --lp-icon-gold: var(--gold-bright);
  --lp-icon-on-tint: var(--primary-dark);
  --lp-icon-on-dark-surface: var(--on-brand-strong);
  --lp-heading-ink: var(--kkoo-text-dark, var(--bs-kkoo-on-surface, #1f1b24));
  --lp-body-ink: var(--bs-kkoo-on-surface-variant, #6b7280);
  --lp-muted-ink: color-mix(in srgb, var(--lp-heading-ink) 72%, var(--surface));
  --lp-subtle-ink: color-mix(in srgb, var(--lp-heading-ink) 58%, var(--surface));
  --lp-accent-on-purple-tint: var(--gold-bright);
  --lp-accent-on-gold-tint: var(--primary-dark);
  --lp-accent-on-brand-surface: var(--gold-light);
  --lp-download-tag-buyers: var(--primary-dark);
  --lp-download-tag-sellers: var(--primary-dark);
  overflow-x: hidden;
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing {
  --lp-heading-ink: var(--on-brand-strong);
  --lp-body-ink: color-mix(in srgb, var(--on-brand-strong) 78%, transparent);
  --lp-muted-ink: color-mix(in srgb, var(--on-brand-strong) 64%, transparent);
  --lp-subtle-ink: color-mix(in srgb, var(--on-brand-strong) 62%, transparent);
  --lp-accent-on-purple-tint: var(--gold-light);
  --lp-accent-on-gold-tint: var(--kkoo-accent-light, #c9a0e8);
  --lp-accent-on-brand-surface: var(--gold-light);
  --lp-download-tag-buyers: var(--kkoo-accent-light, #c9a0e8);
  --lp-download-tag-sellers: var(--kkoo-accent-light, #c9a0e8);
  --lp-icon-ink: var(--kkoo-accent-light, #c9a0e8);
  --lp-icon-ink-soft: var(--primary-light);
  --lp-icon-gold: var(--gold);
  --lp-icon-on-tint: var(--kkoo-accent-light, #c9a0e8);
  --lp-icon-on-dark-surface: var(--on-brand-strong);
}

/* ===== TYPOGRAPHY ===== */
.display-3, .display-4, .display-5 {
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.fw-800 { font-weight: 800; }
.fw-700 { font-weight: 700; }
.fw-600 { font-weight: 600; }

.lp-lead {
  line-height: 1.618;
  font-weight: 400;
  color: var(--lp-body-ink) !important;
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-lead {
  color: var(--lp-body-ink) !important;
}

.lp-purple-paragraph {
  color: var(--lp-body-ink) !important;
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-purple-paragraph {
  color: var(--lp-body-ink) !important;
}

.lp-gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, var(--gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lp-text-primary {
  color: var(--lp-accent-on-purple-tint, var(--gold-ink-2));
}

/* Section titles: neutral ink + contrasting accent (not purple on purple / gold on gold) */
.lp-section-heading {
  margin-top: 0;
  margin-bottom: 0.625rem;
  color: var(--lp-heading-ink);
  line-height: 1.18;
  letter-spacing: normal;
  word-spacing: normal;
}

.mk-landing .lp-section-heading .lp-text-primary {
  color: var(--lp-accent-on-purple-tint, var(--gold-ink-2));
  margin-inline-start: 0.35em;
}

/* Sections with a stronger gold wash — use purple ink for the accent */
.mk-landing :is(
  .lp-buyers-section,
  .lp-sellers-section,
  .lp-rewards-section,
  .lp-ecosystem-section,
  .lp-onboard-section,
  .lp-download-section
) .lp-section-heading:not(.lp-section-heading--inverse) .lp-text-primary {
  color: var(--lp-accent-on-gold-tint, var(--primary-dark));
}

.lp-section-heading--inverse {
  color: var(--on-brand-strong);
}

.lp-section-heading--inverse .lp-text-primary {
  color: var(--lp-accent-on-brand-surface);
  margin-inline-start: 0.35em;
}

@media (max-width: 767.98px) {
  .mk-landing .lp-section-heading .lp-text-primary.d-block {
    margin-inline-start: 0;
    margin-top: 0.2em;
    display: block;
  }
}

@media (min-width: 768px) {
  .mk-landing .lp-section-heading .lp-text-primary.d-md-inline {
    margin-inline-start: 0.35em;
    display: inline;
  }
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-section-heading:not(.lp-section-heading--inverse) {
  color: var(--lp-heading-ink);
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-section-heading:not(.lp-section-heading--inverse) .lp-text-primary {
  color: var(--lp-accent-on-purple-tint);
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing :is(
  .lp-buyers-section,
  .lp-sellers-section,
  .lp-rewards-section,
  .lp-ecosystem-section,
  .lp-onboard-section,
  .lp-download-section
) .lp-section-heading:not(.lp-section-heading--inverse) .lp-text-primary {
  color: var(--lp-accent-on-gold-tint);
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-section-heading--inverse {
  color: var(--on-brand-strong);
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-section-heading--inverse .lp-text-primary {
  color: var(--lp-accent-on-brand-surface);
}
.text-gold { color: var(--gold-ink); }
.text-beige { color: rgba(255, 247, 234, 0.92) !important; }
.text-beige-50 { color: rgba(255, 247, 234, 0.7) !important; }
.text-white-50 { color: rgba(255, 255, 255, 0.5); }

/* ===== GOLDEN RATIO SPACING ===== */
.py-lg-6 {
  padding-top: calc(5rem * var(--gr));
  padding-bottom: calc(5rem * var(--gr));
}

.py-5 {
  padding-top: calc(3rem * var(--gr));
  padding-bottom: calc(3rem * var(--gr));
}

/* Avoid overriding Bootstrap spacing utilities inside this component. */
.lp-gap-4 { gap: calc(1.5rem * var(--gr)); }
.lp-gap-5 { gap: calc(2.5rem * var(--gr)); }

/* ===== HERO ===== */
.lp-hero-section {
  position: relative;
  min-height: 88vh;
  min-height: 88dvh;
  overflow: hidden;
  /* Use background-color only so :style backgroundImage on the section is never reset by shorthand */
  background-color: #050208;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.lp-hero-container {
  min-height: inherit;
  display: flex;
  flex-direction: column;
}

.lp-hero-inner {
  flex: 1;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(4.5rem, 10vw, 5.5rem) 0 clamp(3rem, 8vh, 4.5rem);
}

.lp-hero-row {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  align-items: center;
}

.lp-hero-scroll-col {
  position: relative;
  min-height: 2.5rem;
  flex-shrink: 0;
}

.lp-hero-copy {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.35rem;
  padding: clamp(1.25rem, 2.8vh, 2.5rem) 0;
}

.lp-hero-copy--masthead {
  gap: 1.5rem;
  max-width: min(72rem, 100%);
  margin-inline: auto;
}

@media (min-width: 768px) {
  .lp-hero-copy--masthead {
    gap: 1.75rem;
  }
}

@media (max-width: 575.98px) {
  .lp-hero-copy {
    padding: 1.25rem 0 2rem;
    gap: 1.15rem;
  }

  .lp-hero-subtitle {
    font-size: clamp(0.95rem, 3.2vw, 1.08rem);
  }
}

/* (Hero right-side image card removed; hero now uses full-bleed cover image) */

/* Overlay — darker center for huge headline contrast */
.lp-hero-overlay {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse 90% 70% at 50% 38%, rgba(5, 2, 12, 0.52) 0%, transparent 62%),
    radial-gradient(circle at 20% 10%, rgba(88, 15, 168, 0.22), transparent 58%),
    radial-gradient(circle at 80% 22%, rgba(230, 161, 58, 0.14), transparent 60%),
    linear-gradient(135deg, rgba(5, 2, 8, 0.72) 0%, rgba(5, 2, 8, 0.45) 42%, rgba(5, 2, 8, 0.68) 100%);
  z-index: 1;
  pointer-events: none;
}

/* Hero is centered now; legacy badge/icons are no longer used. */
.lp-hero-badge-animated,
.lp-hero-icons-row {
  display: none !important;
}

/* Background animation intentionally disabled (static hero). */

/* Floating orbs */
.lp-hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 2;
  pointer-events: none;
}

.lp-hero-orb-1 {
  width: 500px;
  height: 500px;
  /* Keep warmth without the strong yellow cast */
  background: radial-gradient(circle, rgba(230, 161, 58, 0.55) 0%, transparent 70%);
  top: -10%;
  right: -5%;
}

.lp-hero-orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  bottom: -10%;
  left: -5%;
}

.lp-hero-orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--primary-dark) 0%, transparent 70%);
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}

/* Orb animations intentionally disabled (static hero). */

/* Noise texture */
.lp-hero-noise {
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  pointer-events: none;
}

.z-3 { position: relative; z-index: 3; }

/* Badge animated */
.lp-hero-badge-animated {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: calc(0.4rem * var(--gr)) calc(1.2rem * var(--gr));
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  animation: fadeSlideUp 0.8s ease-out both;
}

.lp-hero-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(248, 180, 75, 0.4); }
  50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(248, 180, 75, 0); }
}

/* Kicker */
.lp-hero-kicker {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  animation: fadeSlideUp 0.75s ease-out 0.05s both;
}

/* Headline — display scale */
.lp-hero-headline {
  margin: 0;
  width: 100%;
  max-width: min(90rem, 100%);
  font-weight: 800;
  color: var(--on-brand-strong);
}

.lp-hero-headline--display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
}

.lp-hero-line {
  display: block;
}

.lp-hero-display-line {
  margin: 0;
  padding: 0 0.15em;
  animation: fadeSlideUp 0.85s ease-out 0.15s both;
}

.lp-hero-display-text {
  display: inline-block;
  max-width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2.85rem, 13.5vw, 8.25rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.045em;
  text-transform: none;
  color: #fff;
  overflow-wrap: anywhere;
  word-wrap: break-word;
  text-shadow:
    0 2px 0 rgba(0, 0, 0, 0.22),
    0 8px 48px rgba(0, 0, 0, 0.45),
    0 0 80px rgba(88, 15, 168, 0.25);
}

.lp-hero-word-accent {
  color: var(--gold-light);
  text-shadow:
    0 2px 0 rgba(0, 0, 0, 0.2),
    0 0 40px rgba(230, 161, 58, 0.45);
}

.lp-hero-line-2 {
  animation: fadeSlideUp 0.8s ease-out 0.4s both;
}

.lp-hero-display-sub {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(1.65rem, 5.5vw, 4.25rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin-top: 0.08em;
  animation: fadeSlideUp 0.85s ease-out 0.35s both;
}

.lp-hero-line-3 {
  animation: fadeSlideUp 0.8s ease-out 0.6s both;
}

/* Decorative rule under headline */
.lp-hero-rule {
  width: min(12rem, 42vw);
  height: 3px;
  border-radius: 999px;
  margin: 0.15rem auto 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(230, 161, 58, 0.95) 22%,
    rgba(88, 15, 168, 0.9) 78%,
    transparent
  );
  opacity: 0.95;
  animation: fadeSlideUp 0.8s ease-out 0.45s both;
}

.lp-text-gold {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subtitle */
.lp-hero-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(0.98rem, 1.5vw + 0.75rem, 1.22rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.76);
  max-width: min(38rem, 92vw);
  line-height: 1.65;
  letter-spacing: 0.01em;
  word-spacing: 0.04em;
  animation: fadeSlideUp 0.8s ease-out 0.55s both;
  margin: 0;
}

/* Trust — glass strip */
.lp-hero-trust-strip {
  width: 100%;
  max-width: min(52rem, 100%);
  padding: 0.65rem 0.85rem;
  border-radius: 1rem;
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  animation: fadeSlideUp 0.8s ease-out 0.65s both;
}

.lp-hero-trust-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
  row-gap: 0.75rem;
}

@media (min-width: 768px) {
  .lp-hero-trust-row {
    column-gap: 1.5rem;
    row-gap: 0.5rem;
  }
}

@media (min-width: 1200px) {
  .lp-hero-trust-row {
    column-gap: 2rem;
  }
}

/* Hero CTA row (button metrics set with .lp-hero-actions .lp-hero-btn.lp-btn-pill below) */
.lp-hero-actions {
  gap: 0.75rem 1rem;
  margin-top: 0.75rem;
}

.lp-hero-btn {
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.lp-hero-btn-icon {
  flex-shrink: 0;
  font-size: 1.1em;
  vertical-align: -0.125em;
}

/* Hero CTA */
.lp-hero-cta-primary {
  border: 0 !important;
  color: rgba(255, 255, 255, 0.96) !important;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
  box-shadow: 0 18px 44px color-mix(in srgb, var(--primary) 32%, transparent);
}

.lp-hero-cta-primary:hover {
  box-shadow: 0 26px 64px color-mix(in srgb, var(--primary) 42%, transparent);
  filter: saturate(1.06) contrast(1.02);
}

.lp-btn-hero-outline {
  color: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.26) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(12px);
}

.lp-btn-hero-outline:hover {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.38) !important;
}

.lp-hero-cta-primary:focus-visible,
.lp-btn-hero-outline:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--gold) 58%, transparent);
  outline-offset: 4px;
}

/* Stat pills */
.lp-hero-stats {
  animation: fadeSlideUp 0.8s ease-out 1.2s both;
}

.lp-hero-stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: calc(0.4rem * var(--gr)) calc(1rem * var(--gr));
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.lp-hero-stat-pill:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(248, 180, 75, 0.3);
}

.lp-hero-stat-value {
  font-weight: 800;
  font-size: 1rem;
  color: var(--gold);
}

.lp-hero-stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

/* Scroll indicator */
.lp-hero-scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
  animation: heroScrollBounce 1.6s ease-in-out infinite;
  text-decoration: none;
  cursor: pointer;
}

.lp-hero-scroll-line {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, var(--gold), transparent);
  border-radius: 2px;
  opacity: 0.75;
}

@keyframes heroScrollBounce {
  0%, 100% { transform: translateY(0); opacity: 0.9; }
  50% { transform: translateY(8px); opacity: 1; }
}

/* Floating icons row */
.lp-hero-icons-row {
  display: flex;
  gap: calc(1rem * var(--gr));
  justify-content: center;
  align-items: center;
  animation: fadeSlideUp 0.8s ease-out 0.1s both;
}

.lp-hero-float-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--on-brand);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.lp-hero-float-icon:hover {
  transform: scale(1.15);
  border-color: var(--gold);
}

.lp-hero-float-1 { background: rgba(88, 15, 168, 0.3); animation: iconBob 3s ease-in-out 0s infinite; }
.lp-hero-float-2 { background: rgba(248, 180, 75, 0.3); animation: iconBob 3s ease-in-out 0.3s infinite; }
.lp-hero-float-3 { background: rgba(124, 45, 158, 0.3); animation: iconBob 3s ease-in-out 0.6s infinite; }
.lp-hero-float-4 { background: rgba(255, 184, 0, 0.3); animation: iconBob 3s ease-in-out 0.9s infinite; }
.lp-hero-float-5 { background: rgba(88, 15, 168, 0.3); animation: iconBob 3s ease-in-out 1.2s infinite; }
.lp-hero-float-6 { background: rgba(248, 180, 75, 0.3); animation: iconBob 3s ease-in-out 1.5s infinite; }

@keyframes iconBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Trust badges (animation on strip) */
.lp-hero-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.8125rem, 1.65vw, 0.96875rem);
  font-weight: 600;
  line-height: 1.45;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.68);
}

.lp-hero-trust-item :deep(svg) {
  color: var(--gold);
  width: 1.05rem;
  height: 1.05rem;
  flex-shrink: 0;
}

.lp-hero-trust-item i {
  color: var(--gold);
  font-size: 0.95rem;
}

/* Stat pill icon */
.lp-hero-stat-icon {
  color: var(--gold);
  font-size: 0.85rem;
}

/* Scroll icon */
.lp-hero-scroll-icon {
  color: var(--gold);
  font-size: 0.85rem;
  display: block;
  margin-bottom: 0.3rem;
  animation: scrollPulse 2s ease-in-out infinite;
}

.badge {
  display: inline-block;
  padding: calc(0.5rem * var(--gr)) calc(1rem * var(--gr));
  border-radius: calc(1.5rem * var(--gr));
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tighter rhythm: pill → title → lead copy */
.row.text-center .lp-section-heading {
  margin-inline: auto;
  text-align: center;
}

.row.text-center .lp-section-pill {
  margin-inline: auto;
}

.row.text-center .lp-purple-paragraph {
  margin-inline: auto;
  text-align: center;
}

.lp-section-heading + p.fs-5 {
  margin-top: 0;
}

.guide-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-top: auto;
  color: var(--bs-primary);
  font-weight: 700;
  text-decoration: none;
  transition: color 180ms ease;
}

.guide-link:hover {
  color: color-mix(in srgb, var(--bs-primary) 80%, #000 20%);
}

.guide-link:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--gold, #f7a829) 58%, transparent);
  outline-offset: 3px;
}

/* NOTE: Radion-style showcase removed. */

/* WOW scroll-reveal */
.mk-landing [data-wow] {
  opacity: 0;
  filter: blur(6px);
  transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
  will-change: opacity, transform, filter;
}

.mk-landing [data-wow].is-inview {
  opacity: 1;
  filter: blur(0);
}

.mk-landing [data-wow='fade-up'] {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .mk-landing [data-wow] {
    transition: none !important;
    transform: none !important;
    filter: none !important;
    opacity: 1 !important;
  }

  .lp-download-card:hover,
  .lp-download-badge,
  .lp-ecosystem-lane__body:hover,
  .guide-link {
    transition: none !important;
  }
}

.bg-primary-gradient {
  background: rgba(88, 15, 168, 0.1);
  color: var(--lp-heading-ink);
  border: 1px solid rgba(88, 15, 168, 0.2);
}

/* ===== BUTTONS ===== */

/* ===== WHAT YOU GET — reactor lanes ===== */
.lp-ecosystem-section {
  background:
    radial-gradient(ellipse 80% 55% at 0% 0%, rgba(92, 48, 143, 0.1), transparent 52%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(248, 180, 75, 0.12), transparent 50%),
    linear-gradient(180deg, rgba(255, 247, 234, 0.35) 0%, transparent 42%);
}

.lp-ecosystem-ambient {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(78px);
  z-index: 0;
}

.lp-ecosystem-ambient--purple {
  width: 20rem;
  height: 20rem;
  top: -6%;
  left: -8%;
  background: rgba(92, 48, 143, 0.2);
}

.lp-ecosystem-ambient--gold {
  width: 16rem;
  height: 16rem;
  right: -6%;
  bottom: 10%;
  background: rgba(248, 180, 75, 0.22);
}

.lp-ecosystem-head {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 42rem;
  margin-inline: auto;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  padding-inline: 0.25rem;
}

.lp-ecosystem-head__sub {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--lp-body-ink);
}

.lp-ecosystem-stage {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
}

.lp-ecosystem-hub {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 1rem;
}

.lp-ecosystem-hub__rings {
  position: relative;
  width: 4rem;
  height: 4rem;
  display: grid;
  place-items: center;
}

.lp-ecosystem-hub__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed rgba(92, 48, 143, 0.28);
}

.lp-ecosystem-hub__ring--inner {
  inset: 18%;
  border-color: rgba(248, 180, 75, 0.4);
}

.lp-ecosystem-hub__core {
  position: relative;
  z-index: 1;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--primary-dark);
  background: #fff;
  border: 2px solid rgba(248, 180, 75, 0.45);
  box-shadow: 0 10px 28px rgba(92, 48, 143, 0.18);
}

.lp-ecosystem-hub__core :deep(svg) {
  width: 1.05rem;
  height: 1.05rem;
}

.lp-ecosystem-hub__label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lp-subtle-ink);
  text-align: center;
}

.lp-ecosystem-lanes {
  display: grid;
  gap: clamp(0.85rem, 2.5vw, 1.15rem);
}

.lp-ecosystem-lane {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem 1rem;
  align-items: stretch;
}

.lp-ecosystem-lane__rail {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.35rem;
}

.lp-ecosystem-lane__rail::after {
  content: '';
  flex: 1;
  width: 2px;
  margin-top: 0.5rem;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(92, 48, 143, 0.35), rgba(248, 180, 75, 0.45));
  min-height: 1.5rem;
}

.lp-ecosystem-lane:last-child .lp-ecosystem-lane__rail::after {
  display: none;
}

.lp-ecosystem-lane__dot {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.95), 0 8px 22px rgba(92, 48, 143, 0.22);
  flex-shrink: 0;
}

.lp-ecosystem-lane--sellers .lp-ecosystem-lane__dot {
  background: var(--kkoo-gradient-accent, linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%));
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.95), 0 8px 22px rgba(248, 180, 75, 0.25);
}

.lp-ecosystem-lane__body {
  display: grid;
  gap: 0.55rem;
  padding: clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 2.5vw, 1.2rem);
  border-radius: 1.2rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 16px 40px rgba(16, 12, 22, 0.08);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.lp-ecosystem-lane__body:hover {
  transform: translateY(-3px);
  border-color: rgba(92, 48, 143, 0.22);
  box-shadow: 0 22px 50px rgba(16, 12, 22, 0.12);
}

.lp-ecosystem-lane--sellers .lp-ecosystem-lane__body {
  border-color: rgba(248, 180, 75, 0.32);
  background: linear-gradient(165deg, rgba(248, 180, 75, 0.12) 0%, rgba(255, 255, 255, 0.96) 55%);
}

.lp-ecosystem-lane--sellers .lp-ecosystem-lane__body:hover {
  border-color: rgba(248, 180, 75, 0.45);
}

.lp-ecosystem-lane--loop .lp-ecosystem-lane__body {
  background: linear-gradient(165deg, rgba(92, 48, 143, 0.08) 0%, rgba(255, 255, 255, 0.96) 50%);
}

.lp-ecosystem-lane__icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  display: grid;
  place-items: center;
  background: rgba(92, 48, 143, 0.1);
  border: 1px solid rgba(92, 48, 143, 0.12);
}

.lp-ecosystem-lane--sellers .lp-ecosystem-lane__icon {
  background: rgba(248, 180, 75, 0.16);
  border-color: rgba(248, 180, 75, 0.28);
}

.lp-ecosystem-lane__icon :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.lp-ecosystem-lane__title {
  margin: 0;
  font-size: clamp(1rem, 0.4vw + 0.92rem, 1.12rem);
  font-weight: 800;
  line-height: 1.25;
  color: var(--lp-heading-ink);
}

.lp-ecosystem-lane__desc {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--lp-body-ink);
}

@media (min-width: 992px) {
  .lp-ecosystem-stage {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.75rem;
  }

  .lp-ecosystem-hub {
    padding: 0;
  }

  .lp-ecosystem-lanes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    align-items: stretch;
  }

  .lp-ecosystem-lane {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .lp-ecosystem-lane__rail {
    display: none;
  }

  .lp-ecosystem-lane__body {
    height: 100%;
    text-align: center;
    justify-items: center;
  }

  .lp-ecosystem-lane__icon {
    margin-inline: auto;
  }
}

@media (max-width: 575.98px) {
  .lp-ecosystem-section {
    padding-top: 2.75rem !important;
    padding-bottom: 2.75rem !important;
  }

  .lp-ecosystem-head {
    margin-bottom: 1.25rem;
  }

  .lp-ecosystem-lane {
    gap: 0.7rem 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-ecosystem-lane__body:hover {
    transform: none;
  }
}

html[data-bs-theme='dark'] .lp-ecosystem-section {
  background:
    radial-gradient(ellipse 80% 55% at 0% 0%, rgba(92, 48, 143, 0.16), transparent 52%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(248, 180, 75, 0.08), transparent 50%);
}

html[data-bs-theme='dark'] .lp-ecosystem-head__sub,
html[data-bs-theme='dark'] .lp-ecosystem-hub__label {
  color: rgba(255, 255, 255, 0.62);
}

html[data-bs-theme='dark'] .lp-ecosystem-hub__core {
  background: rgba(28, 18, 40, 0.95);
  color: var(--lp-accent-on-brand-surface);
  border-color: color-mix(in srgb, var(--gold) 35%, transparent);
}

html[data-bs-theme='dark'] .lp-ecosystem-lane__body {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-ecosystem-lane--sellers .lp-ecosystem-lane__body,
html[data-bs-theme='dark'] .lp-ecosystem-lane--loop .lp-ecosystem-lane__body {
  background: rgba(255, 255, 255, 0.06);
}

html[data-bs-theme='dark'] .lp-ecosystem-lane__title {
  color: rgba(255, 255, 255, 0.94);
}

html[data-bs-theme='dark'] .lp-ecosystem-lane__desc {
  color: rgba(255, 255, 255, 0.65);
}

html[data-bs-theme='dark'] .lp-ecosystem-lane__icon {
  background: rgba(200, 160, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-ecosystem-lane--sellers .lp-ecosystem-lane__icon {
  background: rgba(247, 168, 41, 0.14);
}

/* ===== GET THE APP — dual deck + surprise layer ===== */
.lp-download-section .lp-section-heading {
  color: var(--lp-heading-ink);
}

.lp-download-section--surprise {
  isolation: isolate;
  --dl-spot-x: 50%;
  --dl-spot-y: 35%;
}

.lp-download-section--surprise::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    480px circle at var(--dl-spot-x) var(--dl-spot-y),
    color-mix(in srgb, var(--gold) 18%, transparent),
    transparent 62%
  );
  opacity: 0.75;
  transition: opacity 0.35s ease;
}

.lp-download-grid-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--primary) 5%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--primary) 5%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
  opacity: 0.45;
}

.lp-download-constellation {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.lp-download-orbit {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 50%;
  font-size: 0.95rem;
  border: 1px solid color-mix(in srgb, var(--primary) 16%, transparent);
  background: color-mix(in srgb, var(--on-brand-strong) 88%, transparent);
  color: var(--primary-dark);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--primary) 12%, transparent);
  animation: lp-download-orbit 16s ease-in-out infinite;
  animation-delay: calc(var(--orbit-i) * -1.4s);
  opacity: 0.55;
}

.lp-download-orbit--sellers {
  color: var(--gold-ink);
  border-color: color-mix(in srgb, var(--gold) 28%, transparent);
}

.lp-download-orbit:nth-child(1) { left: 6%; top: 14%; }
.lp-download-orbit:nth-child(2) { left: 18%; top: 72%; }
.lp-download-orbit:nth-child(3) { left: 82%; top: 18%; }
.lp-download-orbit:nth-child(4) { right: 10%; bottom: 12%; }
.lp-download-orbit:nth-child(5) { left: 28%; top: 8%; }
.lp-download-orbit:nth-child(6) { right: 22%; top: 62%; }
.lp-download-orbit:nth-child(7) { left: 4%; bottom: 28%; }
.lp-download-orbit:nth-child(8) { right: 6%; top: 42%; }

@keyframes lp-download-orbit {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(10px, -14px) rotate(8deg);
  }
}

.lp-download-pill-hit {
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
}

.lp-download-pill-hit:hover {
  transform: translateY(-2px) scale(1.03);
}

.lp-download-section--burst .lp-download-pill-hit {
  animation: lp-download-pill-party 0.55s ease infinite;
}

@keyframes lp-download-pill-party {
  0%,
  100% {
    transform: rotate(-2deg) scale(1.05);
  }
  50% {
    transform: rotate(2deg) scale(1.08);
  }
}

.lp-download-whisper {
  margin-top: calc(1rem * var(--gr) / 1.618);
  padding: 0.65rem 1rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--on-brand-strong) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--primary) 14%, transparent);
  box-shadow: 0 12px 32px color-mix(in srgb, var(--primary) 10%, transparent);
  backdrop-filter: blur(8px);
}

.lp-download-whisper__line {
  font-size: 0.88rem;
  font-weight: 600;
  font-style: italic;
  color: color-mix(in srgb, var(--primary-dark) 82%, var(--lp-body-ink));
}

.lp-download-whisper-enter-active,
.lp-download-whisper-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.lp-download-whisper-enter-from,
.lp-download-whisper-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.lp-download-lanes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: calc(1.15rem * var(--gr));
}

@media (max-width: 991.98px) {
  .lp-download-lanes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem;
    max-width: 22rem;
    margin-inline: auto;
    padding: 0.35rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--on-brand-strong) 75%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 14%, transparent);
    box-shadow: 0 10px 28px color-mix(in srgb, var(--primary) 8%, transparent);
  }

  .lp-download-lane {
    width: 100%;
    justify-content: center;
    min-height: 2.65rem;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  .lp-download-lane--active {
    box-shadow: 0 8px 22px color-mix(in srgb, var(--primary) 18%, transparent);
  }

  .lp-download-deck {
    min-height: 12rem;
  }
}

.lp-download-lane {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);
  background: color-mix(in srgb, var(--on-brand-strong) 90%, transparent);
  color: var(--lp-body-ink);
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.lp-download-lane:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--primary) 28%, transparent);
}

.lp-download-lane--active {
  color: var(--on-brand-strong);
  border-color: color-mix(in srgb, var(--primary) 35%, transparent);
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--primary) 24%, transparent);
}

.lp-download-section--lane-sellers .lp-download-lane--active {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%);
  color: var(--primary-dark);
  border-color: color-mix(in srgb, var(--gold) 45%, transparent);
}

.lp-download-deck-wrap {
  position: relative;
}

.lp-download-bridge {
  display: none;
}

@media (min-width: 992px) {
  .lp-download-bridge {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(42%, 220px);
    transform: translate(-50%, -50%);
    z-index: 2;
    pointer-events: none;
  }

  .lp-download-bridge__svg {
    display: block;
    width: 100%;
    height: 2.5rem;
  }

  .lp-download-bridge__path {
    stroke: color-mix(in srgb, var(--primary) 35%, var(--gold));
    stroke-width: 2;
    stroke-dasharray: 6 8;
    animation: lp-download-bridge-dash 2.8s linear infinite;
  }

  .lp-download-bridge__dot {
    position: absolute;
    left: 0;
    top: 50%;
    width: 10px;
    height: 10px;
    margin-top: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--primary));
    box-shadow: 0 0 16px color-mix(in srgb, var(--gold) 65%, transparent);
    animation: lp-download-bridge-travel 2.8s ease-in-out infinite;
  }

  .lp-download-bridge__label {
    position: absolute;
    left: 50%;
    top: -1.35rem;
    transform: translateX(-50%);
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--lp-muted-ink);
    opacity: 0.85;
  }
}

@keyframes lp-download-bridge-dash {
  to {
    stroke-dashoffset: -28;
  }
}

@keyframes lp-download-bridge-travel {
  0%,
  100% {
    left: 4%;
    opacity: 0.35;
  }
  50% {
    left: 88%;
    opacity: 1;
  }
}

@media (min-width: 992px) {
  .lp-download-section--lane-buyers .lp-download-card--sellers:not(:hover),
  .lp-download-section--lane-sellers .lp-download-card--buyers:not(:hover) {
    opacity: 0.78;
    filter: saturate(0.88);
    transform: scale(0.985);
  }

  .lp-download-section--lane-buyers .lp-download-card--buyers,
  .lp-download-section--lane-sellers .lp-download-card--sellers {
    border-color: color-mix(in srgb, var(--gold) 38%, var(--primary));
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.9) inset,
      0 24px 52px color-mix(in srgb, var(--primary) 16%, transparent);
  }
}

.lp-download-panel-enter-active,
.lp-download-panel-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.lp-download-panel-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.lp-download-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.lp-download-section--burst .lp-download-card {
  animation: lp-download-card-glow 0.7s ease infinite alternate;
}

@keyframes lp-download-card-glow {
  from {
    box-shadow: 0 16px 40px color-mix(in srgb, var(--primary) 12%, transparent);
  }
  to {
    box-shadow: 0 22px 52px color-mix(in srgb, var(--gold) 28%, transparent);
  }
}

.lp-download-burst {
  position: fixed;
  left: 50%;
  bottom: 1.75rem;
  transform: translateX(-50%);
  z-index: 1200;
  padding: 0.9rem 1.35rem;
  border-radius: 1rem;
  text-align: center;
  color: var(--on-brand-strong);
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--gold) 55%, var(--primary-dark)) 100%);
  box-shadow: 0 22px 50px color-mix(in srgb, var(--primary) 42%, transparent);
  max-width: min(92vw, 380px);
}

.lp-download-burst__title {
  font-weight: 900;
  font-size: 1rem;
}

.lp-download-burst__emoji {
  display: block;
  font-size: 1.3rem;
  letter-spacing: 0.15em;
  margin-bottom: 0.2rem;
}

.lp-download-pop-enter-active,
.lp-download-pop-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lp-download-pop-enter-from,
.lp-download-pop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(14px) scale(0.92);
}

.lp-download-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  overflow: hidden;
}

.lp-download-confetti-bit {
  position: absolute;
  left: calc(6% + (var(--i) * 4.5%));
  bottom: -6px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--gold);
  animation: lp-download-confetti 1.75s ease-out calc(var(--i) * 0.06s) forwards;
}

.lp-download-confetti-bit:nth-child(3n) {
  background: var(--primary);
  width: 6px;
  height: 10px;
}

.lp-download-confetti-bit:nth-child(5n) {
  border-radius: 50%;
  background: #fff;
}

@keyframes lp-download-confetti {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-240px) rotate(520deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-download-orbit,
  .lp-download-bridge__path,
  .lp-download-bridge__dot,
  .lp-download-section--burst .lp-download-card,
  .lp-download-section--burst .lp-download-pill-hit {
    animation: none;
  }

  .lp-download-section--lane-buyers .lp-download-card--sellers,
  .lp-download-section--lane-sellers .lp-download-card--buyers {
    opacity: 1;
    filter: none;
    transform: none;
  }

  .lp-download-panel-enter-active,
  .lp-download-panel-leave-active {
    transition: none;
  }
}

.lp-download-section.lp-section {
  background:
    radial-gradient(ellipse 65% 55% at 0% 20%, color-mix(in srgb, var(--primary) 11%, transparent), transparent 58%),
    radial-gradient(ellipse 50% 45% at 100% 80%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 52%),
    linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%);
}

.lp-download-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.45;
  background:
    radial-gradient(ellipse 55% 45% at 15% 20%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 60%),
    radial-gradient(ellipse 50% 40% at 85% 80%, color-mix(in srgb, var(--gold) 12%, transparent), transparent 58%);
}

.lp-download-corridor {
  position: relative;
  z-index: 1;
}

.lp-download-corridor__head {
  text-align: center;
  max-width: 40rem;
  margin-inline: auto;
  margin-bottom: clamp(calc(1.85rem * var(--gr)), 4vw, calc(2.75rem * var(--gr)));
}

.lp-download-corridor__head .lp-section-pill {
  margin-bottom: calc(0.75rem * var(--gr) / 1.618);
}

.lp-download-corridor__sub {
  font-size: 1.05rem;
  line-height: 1.618;
  margin-inline: auto;
  color: var(--lp-body-ink);
}

.lp-download-deck {
  display: grid;
  gap: calc(1rem * var(--gr));
}

@media (min-width: 992px) {
  .lp-download-deck {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: calc(1.25rem * var(--gr));
    align-items: stretch;
  }
}

.lp-download-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: calc(0.85rem * var(--gr) / 1.618);
  padding: clamp(calc(1.15rem * var(--gr) / 1.618), 3vw, calc(1.75rem * var(--gr) / 1.618));
  border-radius: 1.35rem;
  background: var(--on-brand-strong);
  color: var(--lp-body-ink);
  border: 1px solid color-mix(in srgb, var(--primary) 14%, transparent);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.85) inset,
    0 16px 40px color-mix(in srgb, var(--primary) 10%, transparent);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.lp-download-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--gold) 32%, transparent);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 22px 48px color-mix(in srgb, var(--primary) 14%, transparent);
}

.lp-download-card--sellers {
  border-color: color-mix(in srgb, var(--gold) 28%, transparent);
}

.lp-download-card--sellers:hover {
  border-color: color-mix(in srgb, var(--gold) 42%, transparent);
}

.lp-download-card__ribbon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 55%, var(--gold)) 100%);
}

.lp-download-card--sellers .lp-download-card__ribbon {
  background: linear-gradient(90deg, var(--gold) 0%, color-mix(in srgb, var(--gold) 70%, #fff) 100%);
}

.lp-download-card__head {
  display: flex;
  flex-direction: column;
  gap: calc(0.35rem * var(--gr) / 1.618);
}

.lp-download-card__tag {
  display: inline-block;
  margin-bottom: 0.2rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lp-download-tag-buyers, var(--primary-dark));
}

.lp-download-card--sellers .lp-download-card__tag {
  color: var(--lp-download-tag-sellers, var(--primary-dark));
}

.lp-download-card__title {
  margin: 0;
  font-size: clamp(1.2rem, 0.4vw + 1.05rem, 1.45rem);
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: normal;
  word-spacing: normal;
  color: var(--lp-heading-ink);
}

.lp-download-card__desc {
  font-size: 0.94rem;
  line-height: 1.618;
  margin: 0;
  color: var(--lp-body-ink);
}

.lp-download-card__cta {
  display: flex;
  flex-direction: column;
  gap: calc(0.55rem * var(--gr) / 1.618);
}

.lp-download-card__cta-label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lp-muted-ink);
}

.lp-download-card__links {
  display: flex;
  flex-direction: column;
  gap: calc(0.5rem * var(--gr) / 1.618);
}

.lp-download-badge {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.55rem;
  width: 100%;
  min-height: 3.1rem;
  padding: 0.62rem 0.85rem;
  border-radius: 0.95rem;
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);
  background: var(--on-brand-strong);
  color: var(--lp-heading-ink);
  box-shadow:
    0 8px 22px color-mix(in srgb, var(--primary) 8%, transparent),
    0 1px 0 rgba(255, 255, 255, 0.75) inset;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.lp-download-badge:hover {
  transform: translateY(-2px);
  color: var(--lp-heading-ink);
  border-color: color-mix(in srgb, var(--primary) 26%, transparent);
  box-shadow:
    0 14px 32px color-mix(in srgb, var(--primary) 12%, transparent),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
}

.lp-download-badge__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 2.1rem;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--lp-heading-ink) 12%, transparent);
  background: color-mix(in srgb, var(--surface-2) 92%, #fff);
  color: var(--lp-heading-ink);
}

.lp-download-badge__icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

.lp-download-badge__mark :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
  display: block;
}

.lp-download-badge--google .lp-download-badge__icon {
  color: var(--gold-bright);
}

.lp-download-badge--apple .lp-download-badge__icon,
.lp-download-badge--mac .lp-download-badge__icon {
  color: var(--primary-dark);
}

.lp-download-badge--windows .lp-download-badge__icon {
  color: var(--primary-light);
}

.lp-download-badge__copy {
  display: grid;
  flex: 0 0 auto;
  line-height: 1.05;
  text-align: left;
}

.lp-download-badge__kicker {
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--lp-muted-ink);
}

.lp-download-badge__brand {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--lp-heading-ink);
}

.lp-download-card__foot {
  margin-top: auto;
  padding-top: calc(1rem * var(--gr) / 1.618);
  border-top: 1px solid color-mix(in srgb, var(--primary) 12%, transparent);
  display: flex;
  flex-direction: column;
  gap: calc(0.65rem * var(--gr) / 1.618);
}

.lp-download-card__foot-note {
  font-size: 0.84rem;
  line-height: 1.618;
  margin: 0;
  color: var(--lp-muted-ink);
}

.lp-download-card__foot-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  align-self: flex-start;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-size: 0.86rem;
  font-weight: 800;
  text-decoration: none;
  color: var(--on-brand-strong);
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--primary) 22%, transparent);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.lp-download-card__foot-link:hover {
  color: var(--on-brand-strong);
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 88%, #000) 0%, var(--primary-dark) 100%);
  border-color: color-mix(in srgb, var(--gold) 35%, transparent);
  box-shadow: 0 14px 32px color-mix(in srgb, var(--primary) 28%, transparent);
}

.lp-download-card__foot-link :deep(svg) {
  width: 1rem;
  height: 1rem;
  color: var(--lp-accent-on-brand-surface);
}

.lp-download-card__foot-arrow {
  opacity: 0.85;
  transition: transform 0.2s ease;
}

.lp-download-card__foot-link:hover .lp-download-card__foot-arrow {
  transform: translateX(3px);
}

@media (max-width: 575.98px) {
  .lp-download-section .container-lg {
    padding-inline: 1rem;
  }

  .lp-download-card {
    padding: calc(1.1rem * var(--gr) / 1.618);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-download-card:hover,
  .lp-download-badge:hover,
  .lp-download-card__foot-link:hover {
    transform: none;
  }
}

html[data-bs-theme='dark'] .lp-download-section.lp-section {
  background:
    radial-gradient(ellipse 80% 55% at 0% 0%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 52%),
    radial-gradient(ellipse 70% 50% at 100% 100%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 50%),
    #0f0f0f;
}

html[data-bs-theme='dark'] .lp-download-aurora {
  opacity: 0.35;
}

html[data-bs-theme='dark'] .lp-download-section--surprise::before {
  background: radial-gradient(
    480px circle at var(--dl-spot-x) var(--dl-spot-y),
    color-mix(in srgb, var(--gold) 14%, transparent),
    transparent 62%
  );
}

html[data-bs-theme='dark'] .lp-download-orbit {
  background: rgba(28, 24, 36, 0.88);
  border-color: rgba(255, 255, 255, 0.12);
  color: var(--kkoo-accent-light, #c9a0e8);
}

html[data-bs-theme='dark'] .lp-download-orbit--sellers {
  color: var(--gold-light);
}

html[data-bs-theme='dark'] .lp-download-whisper {
  background: rgba(22, 18, 28, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .lp-download-whisper__line {
  color: rgba(255, 255, 255, 0.78);
}

html[data-bs-theme='dark'] .lp-download-lane {
  background: rgba(28, 24, 36, 0.92);
  border-color: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.82);
}

html[data-bs-theme='dark'] .lp-download-lane--active {
  color: var(--on-brand-strong);
}

@media (max-width: 991.98px) {
  html[data-bs-theme='dark'] .lp-download-lanes {
    background: rgba(22, 18, 28, 0.92);
    border-color: rgba(255, 255, 255, 0.12);
  }

  html[data-bs-theme='dark'] .lp-download-lane {
    color: rgba(255, 255, 255, 0.82);
  }
}

html[data-bs-theme='dark'] .lp-download-section .lp-section-heading {
  color: var(--lp-heading-ink);
}

html[data-bs-theme='dark'] .lp-download-corridor__sub,
html[data-bs-theme='dark'] .lp-download-card {
  color: var(--lp-body-ink);
}

html[data-bs-theme='dark'] .lp-download-card {
  background: rgba(22, 18, 28, 0.92);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
}

html[data-bs-theme='dark'] .lp-download-card:hover {
  border-color: color-mix(in srgb, var(--gold) 32%, transparent);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
}

html[data-bs-theme='dark'] .lp-download-card__title {
  color: var(--lp-heading-ink);
}

html[data-bs-theme='dark'] .lp-download-card__desc,
html[data-bs-theme='dark'] .lp-download-card__foot-note {
  color: var(--lp-body-ink);
}

html[data-bs-theme='dark'] .lp-download-card__cta-label {
  color: var(--lp-muted-ink);
}

html[data-bs-theme='dark'] .lp-download-badge {
  border-color: rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, rgba(40, 34, 52, 0.95), rgba(28, 24, 36, 0.88));
  color: var(--lp-heading-ink);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.32),
    0 1px 0 rgba(255, 255, 255, 0.1) inset;
}

html[data-bs-theme='dark'] .lp-download-badge:hover {
  color: var(--lp-heading-ink);
  border-color: rgba(255, 255, 255, 0.22);
}

html[data-bs-theme='dark'] .lp-download-badge__mark {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: var(--lp-heading-ink);
}

html[data-bs-theme='dark'] .lp-download-badge__kicker {
  color: var(--lp-muted-ink);
}

html[data-bs-theme='dark'] .lp-download-badge__brand {
  color: var(--lp-heading-ink);
}

html[data-bs-theme='dark'] .lp-download-badge--google .lp-download-badge__icon {
  color: var(--gold-light);
}

html[data-bs-theme='dark'] .lp-download-badge--apple .lp-download-badge__icon,
html[data-bs-theme='dark'] .lp-download-badge--mac .lp-download-badge__icon {
  color: var(--kkoo-accent-light, #c9a0e8);
}

html[data-bs-theme='dark'] .lp-download-badge--windows .lp-download-badge__icon {
  color: var(--primary-light);
}

html[data-bs-theme='dark'] .lp-download-card__foot {
  border-top-color: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .lp-download-card__foot-link {
  color: var(--on-brand-strong);
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 92%, #fff) 0%, var(--primary-dark) 100%);
  border-color: rgba(255, 255, 255, 0.14);
}

html[data-bs-theme='dark'] .lp-download-card__foot-link:hover {
  color: var(--on-brand-strong);
  background: linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--gold) 35%, var(--primary-dark)) 100%);
  border-color: color-mix(in srgb, var(--gold) 40%, transparent);
}

/* Footer store badges (unchanged) */
/* Footer store badges (unchanged) */
#download .lp-download-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  justify-content: center;
}

@media (min-width: 480px) {
  #download .lp-download-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

#download .lp-download-actions--stack {
  grid-template-columns: 1fr;
}

#download .lp-store-badge {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 0.95rem;
  text-decoration: none;
  border: 1px solid rgba(88, 15, 168, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.5));
  box-shadow:
    0 10px 28px rgba(16, 24, 40, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.6) inset;
  color: rgba(16, 24, 40, 0.92);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  min-height: 52px;
}

#download .lp-store-badge:hover {
  transform: translateY(-2px);
  border-color: rgba(88, 15, 168, 0.24);
  box-shadow:
    0 18px 46px rgba(16, 24, 40, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.6) inset;
}

#download .lp-store-badge__icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background:
    radial-gradient(circle at top left, rgba(248, 180, 75, 0.22), transparent 55%),
    linear-gradient(135deg, rgba(88, 15, 168, 0.14), rgba(88, 15, 168, 0.06));
  color: rgba(88, 15, 168, 0.92);
  border: 1px solid rgba(88, 15, 168, 0.14);
}

#download .lp-store-badge__icon :deep(svg) {
  width: 1.15rem;
  height: 1.15rem;
}

#download .lp-store-badge__text {
  min-width: 0;
  display: grid;
  line-height: 1.05;
  text-align: left;
}

#download .lp-store-badge__kicker {
  font-size: clamp(0.62rem, 0.55rem + 0.3vw, 0.72rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: rgba(16, 24, 40, 0.56);
}

#download .lp-store-badge__brand {
  font-size: clamp(0.78rem, 0.68rem + 0.6vw, 0.92rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

html[data-bs-theme='dark'] #download .lp-store-badge {
  border-color: rgba(255, 255, 255, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.06));
  color: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.35),
    0 1px 0 rgba(255, 255, 255, 0.08) inset;
}

html[data-bs-theme='dark'] #download .lp-store-badge__kicker {
  color: rgba(255, 255, 255, 0.64);
}

html[data-bs-theme='dark'] #download .lp-store-badge__icon {
  color: rgba(248, 180, 75, 0.95);
  border-color: rgba(248, 180, 75, 0.18);
  background:
    radial-gradient(circle at top left, rgba(248, 180, 75, 0.18), transparent 55%),
    linear-gradient(135deg, rgba(88, 15, 168, 0.22), rgba(88, 15, 168, 0.08));
}

@media (max-width: 420px) {
  #download .lp-download-actions {
    grid-template-columns: 1fr;
  }
}

/* Hero pills: override global pill padding from golden-ratio scale */
.lp-hero-actions .lp-hero-btn.lp-btn-pill {
  min-height: 2.75rem;
  padding: 0.625rem 1.375rem;
  font-size: 0.9375rem;
}

@media (min-width: 576px) {
  .lp-hero-actions .lp-hero-btn.lp-btn-pill {
    min-height: 3rem;
    padding: 0.6875rem 1.625rem;
    font-size: 1rem;
  }
}

@media (min-width: 992px) {
  .lp-hero-actions .lp-hero-btn.lp-btn-pill {
    min-height: 3.125rem;
    padding: 0.75rem 1.75rem;
    font-size: 1.0625rem;
  }
}

.btn-primary {
  color: #fff !important;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
  transform: translateY(calc(-0.125rem * var(--gr)));
  box-shadow: 0 calc(0.5rem * var(--gr)) calc(1.5rem * var(--gr)) color-mix(in srgb, var(--primary) 35%, transparent);
}

.btn-outline-primary {
  color: var(--primary) !important;
  border: calc(0.1rem * var(--gr)) solid var(--primary);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--primary) !important;
  color: #fff !important;
  border-color: var(--primary);
}

/* ===== CARDS ===== */
.card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}

.card:hover {
  box-shadow: 0 calc(0.5rem * var(--gr)) calc(1.5rem * var(--gr)) rgba(88, 15, 168, 0.12) !important;
}

/* Section h2 → card h3 + body (readable, consistent scale) */
.lp-card-title {
  font-size: clamp(1.0625rem, 1.12vw, 1.2rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.015em;
  color: var(--ink);
  margin: 0 0 0.5rem;
}

.lp-card-title--compact {
  font-size: clamp(0.9375rem, 1vw, 1.0625rem);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.lp-card-title--featured {
  font-size: clamp(1.2rem, 1.35vw, 1.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.lp-card-text {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--ink-muted);
  margin: 0;
}

.lp-card-text--on-dark {
  color: rgba(255, 255, 255, 0.88);
}

.lp-card-caption {
  font-size: 0.8125rem;
  line-height: 1.45;
  font-weight: 500;
  color: var(--lp-muted-ink);
  margin: 0;
}

.lp-card-list {
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--lp-body-ink);
}

.lp-card-list-item {
  display: flex;
  align-items: flex-start;
}

html[data-bs-theme='dark'] .lp-card-title {
  color: rgba(255, 255, 255, 0.94);
}

html[data-bs-theme='dark'] .lp-card-text {
  color: rgba(255, 255, 255, 0.72);
}

html[data-bs-theme='dark'] .lp-card-caption {
  color: rgba(255, 255, 255, 0.58);
}

html[data-bs-theme='dark'] .lp-card-list {
  color: rgba(255, 255, 255, 0.7);
}

.lp-card-surface .card-body {
  padding: 1.25rem 1.35rem;
}

.lp-card .card-body {
  padding: 1.25rem 1.35rem;
}

.lp-testimonial-quote {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--lp-body-ink);
  font-weight: 400;
  margin: 0;
  padding: 0;
  border: 0;
}

.lp-testimonial-quote--on-brand {
  color: rgba(255, 255, 255, 0.92);
}

.lp-testimonial-footer .lp-card-title {
  margin-bottom: 0.15rem;
}

.lp-card-featured {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--on-brand);
}

.lp-card-featured .lp-card-title {
  color: var(--on-brand-strong);
}

.lp-card-featured .lp-card-caption {
  color: var(--on-brand-muted);
}

.lp-xp-icon {
  color: var(--lp-icon-ink);
}

.lp-xp-icon--explorer { color: var(--lp-icon-ink); }
.lp-xp-icon--regular { color: color-mix(in srgb, var(--primary) 70%, var(--gold) 30%); }
.lp-xp-icon--silver { color: rgba(125, 132, 148, 0.95); }
.lp-xp-icon--gold { color: var(--gold); }
.lp-xp-icon--platinum { color: color-mix(in srgb, var(--primary) 55%, rgba(236, 234, 235, 1) 45%); }
.lp-xp-icon--badges { color: color-mix(in srgb, var(--gold) 62%, var(--primary) 38%); }

html[data-bs-theme='dark'] .mk-landing .lp-xp-icon--silver { color: rgba(236, 234, 235, 0.78); }
html[data-bs-theme='dark'] .mk-landing .lp-xp-icon--platinum { color: rgba(236, 234, 235, 0.92); }

.lp-card-image-wrapper { border-radius: 1rem 1rem 0 0; }
.object-fit-cover { object-fit: cover; }

/* ===== SOLUTIONS / VERTICALS (two-up grid) ===== */
.lp-verticals-row {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}

.lp-verticals-row > [class*='col-'] {
  display: flex;
  min-width: 0;
}

.lp-verticals-row .lp-vertical-featured,
.lp-verticals-row .lp-verticals-card {
  width: 100%;
  flex: 1 1 auto;
}

.lp-verticals-row .lp-vertical-featured {
  min-height: clamp(320px, 42vw, 440px);
}

.lp-verticals-row .lp-verticals-card {
  min-height: clamp(320px, 42vw, 440px);
}

.lp-verticals-row .lp-verticals-card-media {
  flex: 1 1 auto;
  min-height: 200px;
  height: auto !important;
}

/* ===== FEATURED VERTICAL CARD (Eat) ===== */
.lp-vertical-featured {
  position: relative;
  border-radius: 1.25rem;
  min-height: 420px;
}

.lp-vertical-featured-bg {
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  transform: scale(1.02);
  filter: saturate(1.1) contrast(1.05);
}

.lp-vertical-featured-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.75;
}

.lp-vertical-featured-body {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 1.5rem;
  color: var(--on-brand);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.lp-vertical-featured-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  margin-bottom: 0.75rem;
}

.lp-vertical-featured-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.lp-vertical-featured-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  font-weight: 700;
}

.lp-vertical-featured-link:hover {
  color: var(--on-brand-strong);
  text-decoration: none;
  transform: translateY(-1px);
}

/* ===== FEATURE ICONS ===== */
.lp-service-icon,
.lp-feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-feature-icon-sm {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--lp-icon-ink);
}

.lp-feature-icon-sm :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

/* Shared icon contrast on tinted surfaces */
.mk-landing .lp-sme-module__icon,
.mk-landing .lp-onboard-path__icon,
.mk-landing .lp-onboard-podium__icon,
.mk-landing .lp-influencer-trust__icon {
  color: var(--lp-icon-on-tint);
}

.mk-landing .lp-buyers-tile__icon,
.mk-landing .lp-ecosystem-lane__icon {
  color: var(--lp-icon-ink);
}

.mk-landing .lp-sellers-tile__icon,
.mk-landing .lp-ecosystem-lane--sellers .lp-ecosystem-lane__icon,
.mk-landing .lp-stats-node__ring {
  color: var(--gold);
}

.mk-landing .lp-rewards-perk__icon {
  color: var(--lp-icon-gold);
}

.mk-landing .lp-onboard-path__stop--gold .lp-onboard-path__icon {
  color: var(--lp-icon-gold);
}

.mk-landing .lp-sme-module__item :deep(svg) {
  color: var(--lp-icon-gold);
}

/* XP vault (dark panel) */
.mk-landing .lp-rewards-vault .lp-xp-icon {
  color: var(--lp-icon-on-dark-surface);
}

.mk-landing .lp-rewards-xp-card--gold .lp-xp-icon,
.mk-landing .lp-rewards-xp-card--regular .lp-xp-icon,
.mk-landing .lp-rewards-xp-card--badges .lp-xp-icon {
  color: rgba(255, 255, 255, 0.9);
}

.mk-landing .lp-rewards-xp-card--silver .lp-xp-icon {
  color: rgba(255, 255, 255, 0.78);
}

.mk-landing .lp-rewards-xp-card--platinum .lp-xp-icon {
  color: #f5e6ff;
}

.mk-landing .lp-rewards-hero-tier__halo .lp-xp-icon {
  color: #2a1500;
}

html[data-bs-theme='dark'] .mk-landing .lp-trust-card--purple .lp-trust-card__icon {
  color: var(--lp-icon-ink);
  background: rgba(200, 160, 255, 0.14);
}

html[data-bs-theme='dark'] .mk-landing .lp-trust-card--gold .lp-trust-card__icon {
  color: var(--gold);
  background: rgba(247, 168, 41, 0.16);
}

html[data-bs-theme='dark'] .mk-landing .lp-influencer-trust__icon {
  color: var(--lp-icon-ink);
}

html[data-bs-theme='dark'] .mk-landing .lp-download-nexus__core {
  color: var(--lp-icon-ink);
  background: rgba(28, 18, 40, 0.92);
  border-color: rgba(255, 255, 255, 0.14);
}

html[data-bs-theme='dark'] .mk-landing .lp-buyers-visual__badge,
html[data-bs-theme='dark'] .mk-landing .lp-sellers-visual__badge {
  color: #fff;
}

html[data-bs-theme='dark'] .mk-landing .lp-sellers-visual__badge {
  color: #2a1500;
}

html[data-bs-theme='dark'] .mk-landing .lp-buyers-tile__icon,
html[data-bs-theme='dark'] .mk-landing .lp-sme-module__icon,
html[data-bs-theme='dark'] .mk-landing .lp-ecosystem-lane__icon,
html[data-bs-theme='dark'] .mk-landing .lp-onboard-path__icon {
  background: rgba(200, 160, 255, 0.12);
}

html[data-bs-theme='dark'] .mk-landing .lp-sellers-tile__icon,
html[data-bs-theme='dark'] .mk-landing .lp-ecosystem-lane--sellers .lp-ecosystem-lane__icon,
html[data-bs-theme='dark'] .mk-landing .lp-rewards-perk__icon,
html[data-bs-theme='dark'] .mk-landing .lp-onboard-path__stop--gold .lp-onboard-path__icon {
  background: rgba(247, 168, 41, 0.14);
}

html[data-bs-theme='dark'] .mk-landing .lp-onboard-podium__icon {
  color: var(--lp-icon-ink);
}

.lp-reward-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(248, 180, 75, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== STEP NUMBERS ===== */
.lp-step-number {
  height: calc(1.4rem * var(--gr));
  padding: 0 calc(0.8rem * var(--gr));
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(92, 48, 143, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 14px 34px rgba(92, 48, 143, 0.18);
}

.lp-step-card {
  position: relative;
  border-radius: 1.4rem;
  border: 1px solid rgba(31, 27, 36, 0.08);
  background: rgba(255, 255, 255, 0.92);
  padding: calc(1.45rem * var(--gr)) calc(1.35rem * var(--gr));
  box-shadow: 0 18px 50px rgba(16, 12, 22, 0.08);
  overflow: hidden;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.lp-step-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 26px 68px rgba(16, 12, 22, 0.12);
  border-color: rgba(92, 48, 143, 0.18);
}

.lp-step-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(0.85rem * var(--gr));
  margin-bottom: calc(0.9rem * var(--gr));
}

.lp-step-icon {
  width: calc(3.15rem * var(--gr));
  height: calc(3.15rem * var(--gr));
  border-radius: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.96);
  background: linear-gradient(135deg, rgba(92, 48, 143, 1) 0%, rgba(120, 64, 185, 1) 100%);
  box-shadow: 0 22px 60px rgba(92, 48, 143, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.18) inset;
  position: relative;
}

.lp-step-icon::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.05));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

html[data-bs-theme='dark'] .lp-step-card {
  background: rgba(8, 5, 15, 0.62);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
}

html[data-bs-theme='dark'] .lp-step-desc {
  color: rgba(255, 255, 255, 0.7);
}

/* ===== SECTIONS ===== */
.lp-section {
  position: relative;
  z-index: 2;
  background: linear-gradient(180deg, var(--surface-2) 0%, var(--surface) 100%);
  transition: background-color 0.3s ease;
}

.lp-services-section {
  background: linear-gradient(135deg, rgba(88, 15, 168, 0.03) 0%, rgba(248, 180, 75, 0.06) 100%);
}

/* ===== STATS — constellation bento ===== */
.lp-stats-section .lp-section-pill--on-dark {
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.22);
}

.lp-stats-head {
  position: relative;
  z-index: 1;
}

.lp-stats-section {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 60% at 15% 20%, rgba(248, 180, 75, 0.18), transparent 55%),
    radial-gradient(ellipse 70% 55% at 85% 80%, rgba(255, 255, 255, 0.08), transparent 50%),
    linear-gradient(135deg, #4a2678 0%, #5c308f 38%, #7b46b3 72%, #5c308f 100%);
}

.lp-stats-ambient {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
  z-index: 0;
}

.lp-stats-ambient--gold {
  width: 20rem;
  height: 20rem;
  top: -8%;
  right: -6%;
  background: rgba(248, 180, 75, 0.28);
}

.lp-stats-ambient--light {
  width: 16rem;
  height: 16rem;
  left: -5%;
  bottom: -10%;
  background: rgba(255, 255, 255, 0.12);
}

.lp-stats-constellation {
  position: relative;
  z-index: 1;
}

.lp-stats-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 2.5rem 2.5rem;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 78%);
}

.lp-stats-bento {
  position: relative;
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.lp-stats-node {
  position: relative;
  display: grid;
  gap: 0.35rem;
  align-content: center;
  justify-items: center;
  text-align: center;
  padding: 1.1rem 0.85rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%);
  box-shadow:
    0 16px 40px rgba(16, 8, 28, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.lp-stats-node:hover {
  transform: translateY(-4px);
  border-color: rgba(248, 180, 75, 0.45);
  box-shadow:
    0 22px 50px rgba(16, 8, 28, 0.28),
    0 0 0 1px rgba(248, 180, 75, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.lp-stats-node--hero {
  grid-column: span 2;
  padding: 1.35rem 1.15rem 1.25rem;
  background:
    linear-gradient(145deg, rgba(248, 180, 75, 0.22) 0%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.06) 100%);
}

.lp-stats-node--pulse .lp-stats-node__ring {
  animation: lp-stats-ring-pulse 3s ease-in-out infinite;
}

@keyframes lp-stats-ring-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(248, 180, 75, 0.35), 0 8px 24px rgba(0, 0, 0, 0.15); }
  50% { box-shadow: 0 0 0 8px rgba(248, 180, 75, 0.12), 0 12px 32px rgba(248, 180, 75, 0.2); }
}

.lp-stats-node__shine {
  position: absolute;
  top: -40%;
  left: -30%;
  width: 55%;
  height: 140%;
  pointer-events: none;
  background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.12) 50%, transparent 60%);
  transform: rotate(12deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lp-stats-node:hover .lp-stats-node__shine {
  opacity: 1;
}

.lp-stats-node__ring {
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--gold);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 0.15rem;
}

.lp-stats-node--hero .lp-stats-node__ring {
  width: 3.1rem;
  height: 3.1rem;
}

.lp-stats-node__ring :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.lp-stats-node--hero .lp-stats-node__ring :deep(svg) {
  width: 1.45rem;
  height: 1.45rem;
}

.lp-stats-node__value {
  margin: 0;
  font-weight: 900;
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  min-height: 1.1em;
  color: #fff;
}

.lp-stats-node--hero .lp-stats-node__value {
  font-size: clamp(1.65rem, 2.8vw, 2.45rem);
}

.lp-stats-node__label {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.72);
  max-width: 14rem;
}

.lp-stats-node--hero .lp-stats-node__label {
  font-size: 0.88rem;
}

@media (max-width: 991.98px) {
  .lp-stats-bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lp-stats-node--hero {
    grid-column: span 2;
  }
}

@media (max-width: 575.98px) {
  .lp-stats-bento {
    gap: 0.65rem;
  }

  .lp-stats-node {
    padding: 0.95rem 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-stats-node--pulse .lp-stats-node__ring {
    animation: none;
  }

  .lp-stats-node:hover {
    transform: none;
  }
}

/* ===== TRANSITIONS ===== */
.transition-all { transition: all 0.3s ease; }


/* ===== WHAT IS INSIDE KKOO — bento fusion ===== */
.lp-inside-section {
  background:
    linear-gradient(180deg, rgba(255, 247, 234, 0.55) 0%, transparent 42%),
    radial-gradient(ellipse 70% 55% at 100% 0%, rgba(92, 48, 143, 0.1), transparent 55%);
}

.lp-inside-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.4;
  background-image: radial-gradient(circle at 1px 1px, rgba(92, 48, 143, 0.08) 1px, transparent 0);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, #000 30%, transparent 95%);
}

.lp-inside-head {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 44rem;
  margin-inline: auto;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.lp-inside-head .lp-section-heading {
  color: var(--lp-heading-ink);
}

.lp-inside-head .lp-section-heading .lp-text-primary {
  color: var(--lp-accent-on-purple-tint);
}

.lp-inside-head__sub {
  font-size: 1.08rem;
  line-height: 1.65;
  margin-inline: auto;
  color: var(--lp-body-ink);
}

.lp-inside-bento {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
}

@media (min-width: 992px) {
  .lp-inside-bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

.lp-inside-gate {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: clamp(22rem, 52vw, 28rem);
  border-radius: 1.65rem;
  overflow: hidden;
  border: 1px solid rgba(92, 48, 143, 0.16);
  box-shadow: 0 24px 60px rgba(16, 12, 22, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.lp-inside-gate:hover {
  transform: translateY(-6px);
  box-shadow: 0 32px 72px rgba(16, 12, 22, 0.16);
}

.lp-inside-gate--sellers {
  border-color: rgba(248, 180, 75, 0.35);
}

.lp-inside-gate__bg {
  position: absolute;
  inset: 0;
}

.lp-inside-gate__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s ease;
}

.lp-inside-gate:hover .lp-inside-gate__img {
  transform: scale(1.06);
}

.lp-inside-gate__watermark {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: clamp(4rem, 12vw, 6.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.12);
  pointer-events: none;
  user-select: none;
}

.lp-inside-gate__panel {
  position: relative;
  z-index: 2;
  margin-top: auto;
  padding: clamp(1.25rem, 3vw, 1.65rem);
  color: #fff;
}

.lp-inside-gate__tag {
  display: inline-flex;
  margin-bottom: 0.55rem;
  padding: 0.32rem 0.75rem;
  border-radius: 999px;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
}

.lp-inside-gate--buyers .lp-inside-gate__tag {
  color: var(--gold-light);
}

.lp-inside-gate--sellers .lp-inside-gate__tag {
  color: var(--kkoo-accent-light, #c9a0e8);
}

.lp-inside-gate__title {
  margin: 0 0 0.45rem;
  font-size: clamp(1.35rem, 0.6vw + 1.15rem, 1.65rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: normal;
  color: var(--on-brand-strong);
}

.lp-inside-gate__desc {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.82);
  max-width: 32rem;
}

.lp-inside-gate__context {
  margin: 0;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.84rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.62);
}

@media (max-width: 991.98px) {
  .lp-inside-gate {
    min-height: 20rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-inside-gate:hover,
  .lp-inside-gate:hover .lp-inside-gate__img {
    transform: none;
  }
}

html[data-bs-theme='dark'] .lp-inside-gate {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

/* ===== BUYERS APP ===== */
.lp-buyers-section {
  background:
    radial-gradient(ellipse 65% 55% at 0% 20%, rgba(92, 48, 143, 0.1), transparent 58%),
    radial-gradient(ellipse 50% 45% at 100% 80%, rgba(248, 180, 75, 0.1), transparent 52%);
}

.lp-buyers-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(70px);
  z-index: 0;
}

.lp-buyers-glow--purple {
  width: 18rem;
  height: 18rem;
  top: 10%;
  left: -5%;
  background: rgba(92, 48, 143, 0.22);
}

.lp-buyers-glow--gold {
  width: 14rem;
  height: 14rem;
  right: 5%;
  bottom: 15%;
  background: rgba(248, 180, 75, 0.2);
}

.lp-buyers-stage {
  display: grid;
  gap: 2rem;
  align-items: start;
}

.lp-section-cta {
  margin-bottom: 0;
}

@media (max-width: 991.98px) {
  .lp-buyers-stage,
  .lp-sellers-stage {
    gap: 2.5rem;
  }

  .lp-section-cta {
    margin-bottom: 1.75rem;
  }

  .lp-protection-row {
    row-gap: 0.25rem;
  }
}

@media (min-width: 992px) {
  .lp-buyers-stage {
    grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr);
    gap: 2.5rem 3rem;
  }

  .lp-section-cta {
    margin-bottom: 0;
  }
}

.lp-buyers-copy {
  position: relative;
  z-index: 1;
}

@media (min-width: 992px) {
  .lp-buyers-copy {
    position: sticky;
    top: 6rem;
  }
}

.lp-buyers-panel {
  display: grid;
  gap: 1.25rem;
}

.lp-buyers-visual {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  min-height: 14rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  box-shadow: 0 24px 56px rgba(92, 48, 143, 0.14);
}

.lp-buyers-visual__img {
  width: 100%;
  height: 100%;
  min-height: 14rem;
  object-fit: cover;
  display: block;
}

.lp-buyers-visual__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(28, 12, 48, 0.75) 0%, rgba(92, 48, 143, 0.35) 50%, transparent 100%);
}

.lp-buyers-visual__badge {
  position: absolute;
  left: 1.15rem;
  bottom: 1.15rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.lp-buyers-visual__badge :deep(svg) {
  width: 1rem;
  height: 1rem;
  color: var(--lp-accent-on-brand-surface);
}

.lp-buyers-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  min-width: 0;
}

@media (min-width: 1200px) {
  .lp-buyers-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lp-buyers-tile {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(92, 48, 143, 0.1);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 28px rgba(16, 12, 22, 0.06);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.lp-buyers-tile:hover {
  transform: translateY(-2px);
  border-color: rgba(248, 180, 75, 0.35);
  box-shadow: 0 16px 36px rgba(16, 12, 22, 0.1);
}

.lp-buyers-tile__copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.lp-buyers-tile__icon {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, rgba(92, 48, 143, 0.14), rgba(248, 180, 75, 0.12));
  flex-shrink: 0;
}

.lp-buyers-tile__icon :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}

.lp-buyers-tile__title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--lp-heading-ink);
}

.lp-buyers-tile__desc {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--lp-muted-ink);
}

@media (max-width: 575.98px) {
  .lp-buyers-grid,
  .lp-sellers-grid {
    gap: 0.55rem;
  }

  .lp-buyers-tile,
  .lp-sellers-tile {
    padding: 0.75rem 0.6rem;
    gap: 0.55rem;
  }

  .lp-buyers-tile__title,
  .lp-sellers-tile__title {
    font-size: 0.82rem;
  }

  .lp-buyers-tile__desc,
  .lp-sellers-tile__desc {
    font-size: 0.72rem;
  }

  .lp-sme-command {
    gap: 0.65rem;
  }

  .lp-rewards-perk-grid {
    gap: 0.5rem;
  }
}

@media (max-width: 1199.98px) {
  .lp-buyers-panel {
    gap: 1rem;
  }

  .lp-buyers-visual {
    min-height: 11rem;
    aspect-ratio: 16 / 9;
    border-radius: 1rem;
  }

  .lp-buyers-visual__img {
    min-height: 0;
    height: 100%;
    aspect-ratio: 16 / 9;
  }

  .lp-buyers-tile {
    padding: 1rem 1.1rem;
  }

  .lp-buyers-tile__title {
    font-size: 0.95rem;
  }

  .lp-buyers-tile__desc {
    font-size: 0.84rem;
    line-height: 1.5;
  }
}

/* ===== SELLER PLATFORM ===== */
.lp-sellers-section {
  background:
    linear-gradient(180deg, rgba(248, 180, 75, 0.06) 0%, transparent 35%),
    radial-gradient(ellipse 70% 50% at 100% 30%, rgba(92, 48, 143, 0.08), transparent 55%);
}

.lp-sellers-glow {
  position: absolute;
  width: 20rem;
  height: 20rem;
  top: 15%;
  right: -6%;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(75px);
  background: rgba(248, 180, 75, 0.2);
}

.lp-sellers-stage {
  display: grid;
  gap: 2rem;
  align-items: start;
}

@media (min-width: 992px) {
  .lp-sellers-stage {
    grid-template-columns: minmax(0, 0.58fr) minmax(0, 0.42fr);
    gap: 2.5rem 3rem;
  }
}

.lp-sellers-panel {
  display: grid;
  gap: 1.25rem;
  order: 2;
}

@media (min-width: 992px) {
  .lp-sellers-panel {
    order: 1;
  }
}

.lp-sellers-copy {
  order: 1;
}

@media (min-width: 992px) {
  .lp-sellers-copy {
    order: 2;
    position: sticky;
    top: 6rem;
  }
}

.lp-sellers-visual {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  min-height: 14rem;
  border: 1px solid rgba(247, 168, 41, 0.25);
  box-shadow: 0 24px 56px rgba(247, 168, 41, 0.12);
}

.lp-sellers-visual__img {
  width: 100%;
  height: 100%;
  min-height: 14rem;
  object-fit: cover;
  display: block;
}

.lp-sellers-visual__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(225deg, rgba(42, 21, 0, 0.7) 0%, rgba(230, 161, 58, 0.35) 45%, transparent 100%);
}

.lp-sellers-visual__badge {
  position: absolute;
  right: 1.15rem;
  bottom: 1.15rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  color: #2a1500;
  background: linear-gradient(135deg, var(--gold) 0%, #ffd27a 100%);
  box-shadow: 0 10px 28px rgba(247, 168, 41, 0.3);
}

.lp-sellers-visual__badge :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.lp-sellers-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  min-width: 0;
}

@media (min-width: 1200px) {
  .lp-sellers-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lp-sellers-tile {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(247, 168, 41, 0.18);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 28px rgba(16, 12, 22, 0.06);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.lp-sellers-tile__copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.lp-sellers-tile:hover {
  transform: translateY(-2px) translateX(-2px);
  border-color: rgba(92, 48, 143, 0.25);
  box-shadow: 0 16px 36px rgba(16, 12, 22, 0.1);
}

.lp-sellers-tile__icon {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  background: rgba(248, 180, 75, 0.18);
  flex-shrink: 0;
}

.lp-sellers-tile__icon :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}

.lp-sellers-tile__title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.3;
  color: var(--lp-heading-ink);
}

.lp-sellers-tile__desc {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--lp-muted-ink);
}

@media (max-width: 1199.98px) {
  .lp-sellers-tile {
    padding: 1rem 1.1rem;
  }

  .lp-sellers-tile__title {
    font-size: 0.95rem;
  }

  .lp-sellers-tile__desc {
    font-size: 0.84rem;
    line-height: 1.5;
  }
}

/* ===== FOR BUSINESSES ===== */
.lp-sme-section {
  position: relative;
  overflow: hidden;
}

.lp-sme-hero-band {
  position: relative;
  margin-bottom: 2.5rem;
  padding: clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2rem);
  border-radius: 1.75rem;
  text-align: center;
  border: 1px solid rgba(92, 48, 143, 0.16);
  background:
    linear-gradient(125deg, rgba(28, 12, 48, 0.94) 0%, rgba(52, 24, 82, 0.9) 42%, rgba(18, 10, 28, 0.92) 100%);
  box-shadow: 0 32px 72px rgba(92, 48, 143, 0.22);
  overflow: hidden;
}

.lp-sme-hero-band::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 80% 20%, rgba(247, 168, 41, 0.25), transparent 45%);
}

.lp-sme-hero-band__content {
  position: relative;
  z-index: 1;
  max-width: 44rem;
  margin-inline: auto;
}

.lp-sme-hero-band .lp-section-pill {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.18);
}

.lp-sme-hero-band__body {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78) !important;
}

.lp-sme-command {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

@media (min-width: 992px) {
  .lp-sme-command {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .lp-sme-command {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.lp-sme-module {
  display: flex;
  flex-direction: column;
  padding: 1.15rem 1.2rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 36px rgba(16, 12, 22, 0.07);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.lp-sme-module:hover {
  transform: translateY(-3px);
  border-color: rgba(248, 180, 75, 0.35);
  box-shadow: 0 22px 48px rgba(16, 12, 22, 0.11);
}

.lp-sme-module__head {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
}

.lp-sme-module__icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.8rem;
  display: grid;
  place-items: center;
  background: rgba(92, 48, 143, 0.1);
  flex-shrink: 0;
}

.lp-sme-module__icon :deep(svg) {
  width: 1.15rem;
  height: 1.15rem;
}

.lp-sme-module__title {
  margin: 0 0 0.15rem;
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--lp-heading-ink);
  line-height: 1.25;
}

.lp-sme-module__desc {
  margin: 0;
  font-size: 0.8rem;
  color: var(--lp-muted-ink);
}

.lp-sme-module__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.4rem;
  margin-top: auto;
}

.lp-sme-module__item {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--lp-body-ink);
}

.lp-sme-module__item :deep(svg) {
  width: 0.85rem;
  height: 0.85rem;
  margin-top: 0.15rem;
  flex-shrink: 0;
}

/* ===== REWARDS — vault + perk grid ===== */
.lp-rewards-section {
  background:
    radial-gradient(ellipse 90% 70% at 0% 20%, rgba(92, 48, 143, 0.12), transparent 55%),
    radial-gradient(ellipse 70% 60% at 100% 80%, rgba(248, 180, 75, 0.14), transparent 52%),
    linear-gradient(180deg, rgba(255, 247, 234, 0.35) 0%, transparent 42%);
}

.lp-rewards-ambient {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(78px);
  z-index: 0;
}

.lp-rewards-ambient--purple {
  width: 22rem;
  height: 22rem;
  top: -4%;
  left: -8%;
  background: rgba(92, 48, 143, 0.24);
}

.lp-rewards-ambient--gold {
  width: 18rem;
  height: 18rem;
  right: -5%;
  bottom: 8%;
  background: rgba(248, 180, 75, 0.22);
}

.lp-rewards-stage {
  display: grid;
  gap: 2rem;
  align-items: stretch;
}

@media (min-width: 992px) {
  .lp-rewards-stage {
    grid-template-columns: minmax(0, 0.44fr) minmax(0, 0.56fr);
    gap: 2.25rem 2.5rem;
  }
}

.lp-rewards-brief {
  position: relative;
  z-index: 1;
}

@media (min-width: 992px) {
  .lp-rewards-brief {
    position: sticky;
    top: 6rem;
  }
}

.lp-rewards-intro__body {
  color: var(--lp-body-ink);
  line-height: 1.65;
}

.lp-rewards-perk-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.lp-rewards-perk {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 0.7rem 0.75rem;
  align-items: start;
  padding: 0.95rem 1rem 0.95rem 0.85rem;
  border-radius: 1rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 32px rgba(16, 12, 22, 0.06);
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.lp-rewards-perk:hover {
  transform: translateY(-3px);
  border-color: rgba(248, 180, 75, 0.4);
  box-shadow: 0 18px 42px rgba(92, 48, 143, 0.12);
}

.lp-rewards-perk__n {
  position: absolute;
  top: 0.55rem;
  right: 0.65rem;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: var(--lp-subtle-ink);
}

.lp-rewards-perk__icon {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  background: rgba(248, 180, 75, 0.16);
}

.lp-rewards-perk__icon :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}

.lp-rewards-perk__copy {
  display: grid;
  gap: 0.12rem;
}

.lp-rewards-perk__title {
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--lp-heading-ink);
  line-height: 1.3;
}

.lp-rewards-perk__desc {
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--lp-muted-ink);
}

/* XP vault */
.lp-rewards-vault {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 2.5vw, 1.65rem);
  border-radius: 1.65rem;
  border: 1px solid rgba(92, 48, 143, 0.18);
  background:
    linear-gradient(165deg, rgba(28, 12, 48, 0.96) 0%, rgba(52, 24, 82, 0.92) 38%, rgba(14, 8, 22, 0.98) 100%);
  box-shadow:
    0 32px 72px rgba(92, 48, 143, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.lp-rewards-vault__glow {
  position: absolute;
  inset: -20% -10% auto;
  height: 55%;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(248, 180, 75, 0.28), transparent 68%);
}

.lp-rewards-vault__head {
  position: relative;
  z-index: 1;
}

.lp-rewards-vault__meter {
  display: block;
  height: 0.35rem;
  margin-bottom: 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.lp-rewards-vault__meter-fill {
  display: block;
  width: 68%;
  height: 100%;
  border-radius: inherit;
  background: var(--kkoo-gradient-accent, linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%));
  box-shadow: 0 0 14px rgba(248, 180, 75, 0.55);
}

.lp-rewards-vault__label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--lp-accent-on-brand-surface);
}

.lp-rewards-hero-tier {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem 1.15rem;
  align-items: center;
  padding: 1.15rem 1.2rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(248, 180, 75, 0.45);
  background: linear-gradient(135deg, rgba(248, 180, 75, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%);
  box-shadow: 0 16px 40px rgba(248, 180, 75, 0.18);
}

.lp-rewards-hero-tier__crown {
  position: absolute;
  top: 0.75rem;
  right: 0.85rem;
  color: var(--primary-dark);
  font-size: 1rem;
}

.lp-rewards-hero-tier__crown :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.lp-rewards-hero-tier__halo {
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.75rem;
  color: #2a1500;
  background: var(--kkoo-gradient-accent, linear-gradient(145deg, var(--gold-light) 0%, var(--gold) 55%, var(--gold-bright) 100%));
  box-shadow:
    0 0 0 8px rgba(248, 180, 75, 0.15),
    0 14px 36px rgba(248, 180, 75, 0.35);
  animation: lp-rewards-pulse 3s ease-in-out infinite;
}

@keyframes lp-rewards-pulse {
  0%, 100% { box-shadow: 0 0 0 8px rgba(248, 180, 75, 0.15), 0 14px 36px rgba(248, 180, 75, 0.35); }
  50% { box-shadow: 0 0 0 14px rgba(248, 180, 75, 0.22), 0 18px 44px rgba(248, 180, 75, 0.45); }
}

.lp-rewards-hero-tier__tag {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.lp-rewards-hero-tier__name {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1.15;
}

.lp-rewards-hero-tier__xp {
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.72);
}

.lp-rewards-xp-deck {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.lp-rewards-xp-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem;
  align-items: center;
  padding: 0.7rem 0.8rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, background 0.2s ease;
}

.lp-rewards-xp-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.lp-rewards-xp-card__icon {
  font-size: 1.2rem;
}

.lp-rewards-xp-card__name {
  margin: 0 0 0.08rem;
  font-size: 0.82rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
}

.lp-rewards-xp-card__xp {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.35;
}

.mk-landing .lp-rewards-vault .lp-xp-icon {
  color: rgba(255, 255, 255, 0.92);
}

.mk-landing .lp-rewards-hero-tier__halo .lp-xp-icon {
  color: #2a1500;
}

.mk-landing .lp-rewards-xp-card--gold .lp-xp-icon,
.mk-landing .lp-rewards-xp-card--regular .lp-xp-icon,
.mk-landing .lp-rewards-xp-card--badges .lp-xp-icon {
  color: rgba(255, 255, 255, 0.9);
}

@media (prefers-reduced-motion: reduce) {
  .lp-rewards-hero-tier__halo {
    animation: none;
  }

  .lp-rewards-perk:hover,
  .lp-rewards-xp-card:hover {
    transform: none;
  }
}

html[data-bs-theme='dark'] .lp-rewards-section {
  background:
    radial-gradient(ellipse 90% 70% at 0% 20%, rgba(92, 48, 143, 0.18), transparent 55%),
    radial-gradient(ellipse 70% 60% at 100% 80%, rgba(248, 180, 75, 0.1), transparent 52%);
}

html[data-bs-theme='dark'] .lp-rewards-perk {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-rewards-perk__title {
  color: rgba(255, 255, 255, 0.94);
}

html[data-bs-theme='dark'] .lp-rewards-perk__desc,
html[data-bs-theme='dark'] .lp-rewards-intro__body {
  color: rgba(255, 255, 255, 0.65);
}

html[data-bs-theme='dark'] .lp-rewards-perk__icon {
  background: rgba(247, 168, 41, 0.14);
}

/* ===== ONBOARDING — mission runway + podium ===== */
.lp-onboard-section {
  background:
    radial-gradient(circle at 6% 10%, rgba(92, 48, 143, 0.1), transparent 42%),
    radial-gradient(circle at 94% 90%, rgba(248, 180, 75, 0.12), transparent 40%),
    linear-gradient(180deg, transparent 0%, rgba(92, 48, 143, 0.04) 100%);
}

.lp-onboard-ambient {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(72px);
  z-index: 0;
}

.lp-onboard-ambient--purple {
  width: 20rem;
  height: 20rem;
  top: 5%;
  left: -6%;
  background: rgba(92, 48, 143, 0.2);
}

.lp-onboard-ambient--gold {
  width: 16rem;
  height: 16rem;
  right: -4%;
  bottom: 20%;
  background: rgba(248, 180, 75, 0.18);
}

.lp-onboard-hero {
  position: relative;
  z-index: 1;
  max-width: 44rem;
  margin-inline: auto;
}

.lp-onboard-hero__lead {
  max-width: 36rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--lp-body-ink);
}

.lp-onboard-mission {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 992px) {
  .lp-onboard-mission {
    grid-template-columns: minmax(0, 0.34fr) minmax(0, 0.66fr);
    gap: 2rem;
  }
}

.lp-onboard-brief {
  padding: clamp(1.15rem, 2vw, 1.5rem);
  border-radius: 1.35rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 180, 75, 0.1) 100%);
  box-shadow: 0 22px 56px rgba(16, 12, 22, 0.08);
  text-align: center;
}

@media (min-width: 992px) {
  .lp-onboard-brief {
    position: sticky;
    top: 6rem;
  }
}

.lp-onboard-brief__ring {
  position: relative;
  width: 8.5rem;
  height: 8.5rem;
  margin: 0 auto 1.15rem;
}

.lp-onboard-brief__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.lp-onboard-brief__track {
  fill: none;
  stroke: rgba(92, 48, 143, 0.12);
  stroke-width: 8;
}

.lp-onboard-brief__progress {
  fill: none;
  stroke: var(--gold);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 327;
  stroke-dashoffset: 65;
}

.lp-onboard-brief__hub {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  display: grid;
  gap: 0.1rem;
  text-align: center;
}

.lp-onboard-brief__hub strong {
  font-size: 1.75rem;
  font-weight: 900;
  line-height: 1;
  color: var(--primary-dark);
}

.lp-onboard-brief__hub small {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--lp-muted-ink);
}

.lp-onboard-brief__stats {
  display: grid;
  gap: 0.65rem;
}

.lp-onboard-brief__stat {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem;
  align-items: center;
  padding: 0.75rem 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(92, 48, 143, 0.1);
  background: rgba(255, 255, 255, 0.88);
  text-align: left;
}

.lp-onboard-brief__stat :deep(svg) {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--lp-icon-gold, var(--gold));
}

.lp-onboard-brief__stat strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--lp-heading-ink);
  line-height: 1.25;
}

.lp-onboard-brief__stat small {
  display: block;
  font-size: 0.75rem;
  color: var(--lp-muted-ink);
  line-height: 1.35;
}

/* Runway path */
.lp-onboard-runway {
  display: grid;
  gap: 1rem;
  padding: clamp(1rem, 2vw, 1.35rem);
  border-radius: 1.35rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background:
    radial-gradient(circle at top right, rgba(248, 180, 75, 0.14), transparent 50%),
    rgba(255, 255, 255, 0.94);
  box-shadow: 0 24px 60px rgba(16, 12, 22, 0.09);
}

.lp-onboard-path {
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 992px) {
  .lp-onboard-path {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
  }
}

@media (min-width: 1200px) {
  .lp-onboard-path {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lp-onboard-path__stop:nth-child(4),
  .lp-onboard-path__stop:nth-child(5) {
    grid-column: span 1;
  }
}

.lp-onboard-path__stop {
  position: relative;
  display: grid;
  gap: 0.55rem;
}

.lp-onboard-path__node {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.95), 0 8px 20px rgba(92, 48, 143, 0.2);
}

.lp-onboard-path__stop--gold .lp-onboard-path__node {
  background: var(--kkoo-gradient-accent, linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%));
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.95), 0 8px 20px rgba(248, 180, 75, 0.25);
}

.lp-onboard-path__card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: start;
  padding: 0.9rem 0.95rem;
  border-radius: 1rem;
  border: 1px solid rgba(31, 27, 36, 0.08);
  background: #fff;
  box-shadow: 0 10px 28px rgba(16, 12, 22, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  height: 100%;
}

.lp-onboard-path__card:hover {
  transform: translateY(-3px);
  border-color: rgba(92, 48, 143, 0.16);
  box-shadow: 0 16px 38px rgba(16, 12, 22, 0.1);
}

.lp-onboard-path__icon {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.7rem;
  display: grid;
  place-items: center;
  background: rgba(92, 48, 143, 0.1);
}

.lp-onboard-path__stop--gold .lp-onboard-path__icon {
  background: rgba(248, 180, 75, 0.18);
}

.lp-onboard-path__icon :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}

.lp-onboard-path__title {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--lp-heading-ink);
  line-height: 1.3;
}

.lp-onboard-path__desc {
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--lp-muted-ink);
}

.lp-onboard-launch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.15rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(248, 180, 75, 0.4);
  background: linear-gradient(125deg, rgba(92, 48, 143, 0.94) 0%, rgba(118, 62, 188, 0.9) 45%, rgba(230, 161, 58, 0.92) 100%);
  box-shadow: 0 20px 50px rgba(92, 48, 143, 0.22);
}

.lp-onboard-launch__copy {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  flex: 1 1 16rem;
}

.lp-onboard-launch__badge {
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 0.8rem;
  display: grid;
  place-items: center;
  color: var(--primary-dark);
  background: rgba(255, 255, 255, 0.94);
  flex-shrink: 0;
}

.lp-onboard-launch__badge :deep(svg) {
  width: 1.2rem;
  height: 1.2rem;
}

.lp-onboard-launch__title {
  margin: 0 0 0.3rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
}

.lp-onboard-launch__desc {
  font-size: 0.86rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.88);
  max-width: 28rem;
}

.lp-onboard-launch__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

/* Podium */
.lp-onboard-podium {
  position: relative;
  z-index: 1;
  padding: clamp(1.35rem, 2.5vw, 1.85rem);
  border-radius: 1.5rem;
  border: 1px solid rgba(92, 48, 143, 0.14);
  background:
    linear-gradient(180deg, rgba(28, 12, 48, 0.92) 0%, rgba(40, 20, 64, 0.88) 55%, rgba(18, 10, 28, 0.94) 100%);
  box-shadow: 0 28px 64px rgba(92, 48, 143, 0.2);
  overflow: hidden;
}

.lp-onboard-podium::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, rgba(248, 180, 75, 0.2), transparent 55%);
}

.lp-onboard-podium__head {
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
}

.lp-onboard-podium__label {
  font-weight: 800;
  font-size: clamp(1rem, 0.4vw + 0.92rem, 1.12rem);
  color: #fff;
}

.lp-onboard-podium__sub {
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.68);
  max-width: 40rem;
  margin-inline: auto;
}

.lp-onboard-podium__stage {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: end;
  min-height: 14rem;
  padding-top: 0.5rem;
}

.lp-onboard-podium__slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.65rem;
}

.lp-onboard-podium__pillar {
  width: 100%;
  max-width: 5.5rem;
  border-radius: 0.85rem 0.85rem 0.2rem 0.2rem;
  background: linear-gradient(180deg, rgba(248, 180, 75, 0.35) 0%, rgba(92, 48, 143, 0.55) 100%);
  display: grid;
  place-items: center;
  padding-top: 0.85rem;
  box-shadow: 0 -8px 24px rgba(248, 180, 75, 0.15);
  transition: transform 0.25s ease;
}

.lp-onboard-podium__slot--launch .lp-onboard-podium__pillar { height: 4.5rem; }
.lp-onboard-podium__slot--verified .lp-onboard-podium__pillar { height: 6rem; }
.lp-onboard-podium__slot--preferred .lp-onboard-podium__pillar { height: 7.5rem; }
.lp-onboard-podium__slot--partner.lp-onboard-podium__slot--peak .lp-onboard-podium__pillar {
  height: 9.5rem;
  background: linear-gradient(180deg, rgba(255, 230, 168, 0.55) 0%, rgba(248, 180, 75, 0.85) 45%, rgba(92, 48, 143, 0.6) 100%);
  box-shadow: 0 0 28px rgba(248, 180, 75, 0.35);
}

.lp-onboard-podium__slot:hover .lp-onboard-podium__pillar {
  transform: translateY(-4px);
}

.lp-onboard-podium__icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--primary-dark);
  background: #fff;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 20px rgba(16, 12, 22, 0.15);
}

.lp-onboard-podium__icon :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}

.lp-onboard-podium__slot--preferred .lp-onboard-podium__icon,
.lp-onboard-podium__slot--partner .lp-onboard-podium__icon {
  color: #9a5f12;
}

.lp-onboard-podium__plate {
  width: 100%;
  padding: 0.75rem 0.55rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
}

.lp-onboard-podium__level {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 0.2rem;
}

.lp-onboard-podium__name {
  margin: 0 0 0.25rem;
  font-size: 0.88rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
}

.lp-onboard-podium__desc {
  font-size: 0.72rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.62);
}

@media (max-width: 991.98px) {
  .lp-onboard-podium__stage {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 0;
    gap: 0.85rem;
    align-items: stretch;
  }

  .lp-onboard-podium__slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .lp-onboard-podium__pillar {
    max-width: 4.5rem;
    width: 100%;
    height: 4.5rem !important;
    border-radius: 0.85rem;
    padding-top: 0.65rem;
  }

  .lp-onboard-launch {
    flex-direction: column;
    align-items: stretch;
  }

  .lp-onboard-launch__actions {
    width: 100%;
  }

  .lp-onboard-launch__actions .lp-btn-pill {
    flex: 1 1 auto;
    justify-content: center;
  }
}

@media (max-width: 575.98px) {
  .lp-rewards-xp-deck {
    grid-template-columns: 1fr;
  }

  .lp-onboard-path {
    grid-template-columns: 1fr;
  }

  .lp-onboard-podium__stage {
    gap: 0.65rem;
  }

  .lp-onboard-podium__pillar {
    max-width: 3.75rem;
    height: 3.75rem !important;
  }

  .lp-onboard-podium__name {
    font-size: 0.82rem;
  }

  .lp-onboard-podium__desc {
    font-size: 0.68rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-onboard-path__card:hover,
  .lp-onboard-podium__slot:hover .lp-onboard-podium__pillar {
    transform: none;
  }
}

html[data-bs-theme='dark'] .lp-onboard-hero__lead {
  color: rgba(255, 255, 255, 0.72);
}

html[data-bs-theme='dark'] .lp-onboard-brief,
html[data-bs-theme='dark'] .lp-onboard-runway {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-onboard-brief__stat {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-onboard-brief__stat strong,
html[data-bs-theme='dark'] .lp-onboard-path__title {
  color: rgba(255, 255, 255, 0.94);
}

html[data-bs-theme='dark'] .lp-onboard-brief__stat small,
html[data-bs-theme='dark'] .lp-onboard-path__desc {
  color: rgba(255, 255, 255, 0.62);
}

html[data-bs-theme='dark'] .lp-onboard-path__card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-onboard-brief__hub strong {
  color: var(--kkoo-accent-light, #c9a0e8);
}

/* ===== INFLUENCER ===== */
.lp-influencer-section {
  background:
    radial-gradient(circle at 92% 12%, rgba(248, 180, 75, 0.1), transparent 44%),
    radial-gradient(circle at 4% 88%, rgba(92, 48, 143, 0.08), transparent 42%);
}

.lp-influencer-intro__lead {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--lp-body-ink);
}

.lp-influencer-steps {
  margin-left: 0;
  padding-left: 0;
}

.lp-influencer-step-card {
  padding: 1.15rem 1.1rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(31, 27, 36, 0.08);
  background: #fff;
  box-shadow: 0 14px 40px rgba(16, 12, 22, 0.06);
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.lp-influencer-step-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 52px rgba(16, 12, 22, 0.1);
}

.lp-influencer-step-card--share {
  border-top: 3px solid var(--primary);
}

.lp-influencer-step-card--growth {
  border-top: 3px solid var(--gold);
}

.lp-influencer-step-card--payout {
  border-top: 3px solid #3d9a6a;
}

.lp-influencer-step-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
}

.lp-influencer-step-card__num {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--lp-subtle-ink);
}

.lp-influencer-step-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.lp-influencer-step-card--growth .lp-influencer-step-card__icon {
  background: var(--kkoo-gradient-accent, linear-gradient(135deg, var(--gold) 0%, var(--gold-bright) 100%));
}

.lp-influencer-step-card--payout .lp-influencer-step-card__icon {
  background: linear-gradient(135deg, #3d9a6a 0%, #2d7a52 100%);
}

.lp-influencer-step-card__icon :deep(svg) {
  width: 1.15rem;
  height: 1.15rem;
}

.lp-influencer-step-card__title {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--lp-heading-ink);
  line-height: 1.3;
}

.lp-influencer-step-card__desc {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--lp-body-ink);
}

.lp-influencer-footer {
  padding-top: 0.25rem;
}

.lp-influencer-trust {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  flex: 1 1 16rem;
  max-width: 36rem;
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(92, 48, 143, 0.05);
}

.lp-influencer-trust__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.1rem;
}

.lp-influencer-trust__text {
  font-size: 0.84rem;
  line-height: 1.5;
  color: var(--lp-body-ink);
}

html[data-bs-theme='dark'] .lp-influencer-intro__lead {
  color: rgba(255, 255, 255, 0.72);
}

html[data-bs-theme='dark'] .lp-influencer-step-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-influencer-step-card__title {
  color: rgba(255, 255, 255, 0.94);
}

html[data-bs-theme='dark'] .lp-influencer-step-card__desc,
html[data-bs-theme='dark'] .lp-influencer-trust__text {
  color: rgba(255, 255, 255, 0.65);
}

html[data-bs-theme='dark'] .lp-influencer-trust {
  background: rgba(92, 48, 143, 0.12);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ===== TRUST (why) ===== */
.lp-trust-lead {
  color: var(--lp-body-ink);
  line-height: 1.65;
}

.lp-trust-card {
  padding: 1.35rem 1.15rem;
  border-radius: 1.15rem;
  border: 1px solid rgba(31, 27, 36, 0.08);
  background: #fff;
  box-shadow: 0 14px 40px rgba(16, 12, 22, 0.06);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.lp-trust-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 52px rgba(16, 12, 22, 0.1);
}

.lp-trust-card__icon {
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 0.85rem;
  border-radius: 0.85rem;
  display: grid;
  place-items: center;
}

.lp-trust-card--purple .lp-trust-card__icon {
  color: var(--primary-dark);
  background: rgba(92, 48, 143, 0.1);
}

.lp-trust-card--gold .lp-trust-card__icon {
  color: #9a5f12;
  background: rgba(248, 180, 75, 0.18);
}

.lp-trust-card__title {
  margin: 0 0 0.45rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--lp-heading-ink);
  line-height: 1.3;
}

.lp-trust-card__body {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--lp-body-ink);
}

html[data-bs-theme='dark'] .lp-trust-lead {
  color: rgba(255, 255, 255, 0.72);
}

html[data-bs-theme='dark'] .lp-trust-card {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-trust-card__title {
  color: rgba(255, 255, 255, 0.95);
}

html[data-bs-theme='dark'] .lp-trust-card__body {
  color: rgba(255, 255, 255, 0.72);
}

/* ===== TESTIMONIALS (showcase carousel) ===== */
.lp-testimonials-section {
  --lp-testimonial-surface: #f8f7fa;
  --lp-testimonial-profile-bg: #ffffff;
  --lp-testimonial-quote-color: rgba(92, 48, 143, 0.14);
  --lp-testimonial-handle: rgba(31, 27, 36, 0.58);
  --lp-testimonial-ink: #1f1b24;
  --lp-testimonial-muted: rgba(31, 27, 36, 0.72);
}

.lp-testimonials-carousel {
  overflow: hidden;
  margin-inline: auto;
  max-width: 72rem;
}

@media (max-width: 991.98px) {
  .lp-testimonials-carousel {
    max-width: 40rem;
  }
}

.lp-testimonials-track {
  display: flex;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.lp-testimonials-slide {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 1.35rem);
  padding: 0.15rem;
}

.lp-testimonials-slide--solo {
  grid-template-columns: 1fr;
  max-width: 40rem;
  margin-inline: auto;
}

@media (max-width: 991.98px) {
  .lp-testimonial-showcase {
    min-height: 16.5rem;
  }

  .lp-testimonial-showcase__text {
    -webkit-line-clamp: 6;
  }
}

.lp-testimonial-showcase {
  position: relative;
  border: 1px solid rgba(31, 27, 36, 0.06);
  display: flex;
  flex-direction: column;
  min-height: clamp(15rem, 24vw, 18.5rem);
  padding: clamp(1.35rem, 2.4vw, 1.85rem);
  padding-bottom: clamp(5.25rem, 8vw, 6.25rem);
  border-radius: 1.15rem;
  background: var(--lp-testimonial-surface);
  opacity: 0;
  transform: translateY(1.35rem);
  transition:
    opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--testimonial-stagger, 0) * 0.12s);
}

.lp-testimonial-showcase--visible {
  opacity: 1;
  transform: translateY(0);
}

.lp-testimonial-showcase__quote {
  display: block;
  margin-bottom: 0.65rem;
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2.75rem, 4.5vw, 3.75rem);
  line-height: 0.85;
  font-weight: 700;
  color: var(--lp-testimonial-quote-color);
  user-select: none;
}

.lp-testimonial-showcase__text {
  margin: 0;
  flex: 1;
  font-size: clamp(0.9rem, 0.35vw + 0.82rem, 1rem);
  line-height: 1.65;
  color: var(--lp-testimonial-ink, #1f1b24);
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.lp-testimonial-showcase__profile {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: min(88%, 16rem);
  padding: 0.85rem 1.1rem 0.95rem 0.95rem;
  border-radius: 0 1rem 0 1.15rem;
  background: var(--lp-testimonial-profile-bg);
  box-shadow: 0 -1px 0 rgba(16, 24, 40, 0.04);
}

.lp-testimonial-showcase__avatar {
  flex-shrink: 0;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--primary-dark);
  background: linear-gradient(145deg, rgba(88, 15, 168, 0.14), rgba(248, 180, 75, 0.22));
}

.lp-testimonial-showcase__name {
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.25;
  color: var(--lp-testimonial-ink, #1f1b24);
}

.lp-testimonial-showcase__handle {
  margin-top: 0.15rem !important;
  font-size: 0.8rem;
  line-height: 1.3;
  color: var(--lp-testimonial-handle);
}

.lp-testimonials-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin-top: clamp(1.35rem, 3vw, 2rem);
}

.lp-testimonials-dot {
  width: 1.65rem;
  height: 0.2rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(16, 24, 40, 0.16);
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;
}

.lp-testimonials-dot--active {
  background: var(--lp-text, #0a0a0a);
  transform: scaleX(1.08);
}

.lp-testimonials-dot:focus-visible {
  outline: 2px solid var(--primary-dark);
  outline-offset: 3px;
}

html[data-bs-theme='dark'] .lp-testimonials-section {
  --lp-testimonial-surface: rgba(255, 255, 255, 0.06);
  --lp-testimonial-profile-bg: rgba(8, 5, 15, 0.92);
  --lp-testimonial-quote-color: rgba(255, 255, 255, 0.1);
  --lp-testimonial-handle: rgba(255, 255, 255, 0.55);
  --lp-testimonial-ink: rgba(255, 255, 255, 0.92);
  --lp-testimonial-muted: rgba(255, 255, 255, 0.68);
}

html[data-bs-theme='dark'] .lp-testimonial-showcase__text,
html[data-bs-theme='dark'] .lp-testimonial-showcase__name {
  color: rgba(255, 255, 255, 0.92);
}

html[data-bs-theme='dark'] .lp-testimonials-dot {
  background: rgba(255, 255, 255, 0.22);
}

html[data-bs-theme='dark'] .lp-testimonials-dot--active {
  background: rgba(255, 255, 255, 0.92);
}

@media (prefers-reduced-motion: reduce) {
  .lp-testimonials-track {
    transition: none;
  }

  .lp-testimonial-showcase {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ===== CTA — immersive split ===== */
.lp-cta-section {
  min-height: clamp(28rem, 52vh, 38rem);
  border-top: none;
  border-bottom: none;
}

.lp-cta-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transform: scale(1.08);
  background-position: center 35%;
  background-size: cover;
  background-repeat: no-repeat;
  filter: saturate(1.12) contrast(1.05);
}

.lp-cta-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(115deg, rgba(28, 12, 48, 0.94) 0%, rgba(52, 24, 82, 0.88) 38%, rgba(18, 10, 28, 0.82) 100%),
    radial-gradient(circle at 85% 20%, rgba(247, 168, 41, 0.22), transparent 42%);
}

.lp-cta-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(60px);
}

.lp-cta-glow--purple {
  width: 22rem;
  height: 22rem;
  top: -4rem;
  left: -6rem;
  background: rgba(155, 89, 204, 0.35);
}

.lp-cta-glow--gold {
  width: 18rem;
  height: 18rem;
  right: 8%;
  bottom: -3rem;
  background: rgba(247, 168, 41, 0.28);
}

.lp-cta-content {
  z-index: 1;
}

.lp-cta-stage {
  display: grid;
  gap: 2.5rem;
  align-items: center;
  min-height: clamp(22rem, 40vh, 30rem);
}

@media (min-width: 992px) {
  .lp-cta-stage {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 2rem 3rem;
  }
}

.lp-cta-kicker {
  display: inline-flex;
  margin-bottom: 0.85rem;
  padding: 0.32rem 0.75rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.lp-cta-headline {
  margin: 0;
  color: #fff;
  line-height: 1.05;
}

.lp-cta-headline__line {
  display: block;
  font-size: clamp(2rem, 1.2rem + 2.8vw, 3.35rem);
  font-weight: 900;
  letter-spacing: -0.03em;
}

.lp-cta-headline__accent {
  display: block;
  margin-top: 0.2rem;
  font-size: clamp(1.35rem, 0.8rem + 1.8vw, 2rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, var(--gold-light) 0%, var(--gold) 45%, var(--on-brand-strong) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lp-cta-lead {
  max-width: 34rem;
  margin-inline: auto;
  font-size: clamp(1rem, 0.9rem + 0.35vw, 1.2rem) !important;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82) !important;
}

@media (min-width: 992px) {
  .lp-cta-lead {
    margin-inline: 0;
  }
}

.lp-cta-micro {
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.58) !important;
}

.lp-cta-account {
  display: flex;
  justify-content: center;
}

@media (min-width: 992px) {
  .lp-cta-account {
    justify-content: flex-start;
  }
}

.lp-cta-actions {
  display: grid;
  gap: 0.65rem;
  max-width: 26rem;
  margin-inline: auto;
}

@media (min-width: 992px) {
  .lp-cta-actions {
    margin-inline: 0;
  }
}

.lp-cta-action {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

a.lp-cta-action,
a.lp-hero-scroll-indicator {
  color: inherit;
}

.lp-cta-action:hover {
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.lp-cta-action--primary {
  border-color: rgba(247, 168, 41, 0.45);
  background: linear-gradient(135deg, color-mix(in srgb, var(--gold) 95%, transparent) 0%, var(--gold-bright) 100%);
  color: #2a1500;
  box-shadow: 0 14px 36px rgba(247, 168, 41, 0.28);
}

.lp-cta-action--primary:hover {
  color: #1f1000;
  background: linear-gradient(135deg, #ffd27a 0%, #f0ad42 100%);
}

.lp-cta-action--primary .lp-cta-action__icon {
  background: rgba(42, 21, 0, 0.12);
  color: #2a1500;
}

.lp-cta-action__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
}

.lp-cta-action__icon :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.lp-cta-action__text {
  font-size: 0.92rem;
  font-weight: 800;
  text-align: left;
  line-height: 1.25;
}

.lp-cta-action__arrow {
  width: 1rem;
  height: 1rem;
  opacity: 0.7;
}

.lp-cta-visual {
  position: relative;
  min-height: 22rem;
}

.lp-cta-orbit {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 12rem;
  height: 12rem;
  transform: translate(-50%, -50%);
}

.lp-cta-orbit__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.lp-cta-orbit__ring--outer {
  inset: -1.75rem;
  border-style: dashed;
  opacity: 0.55;
  animation: lp-cta-spin 28s linear infinite;
}

.lp-cta-orbit__ring--inner {
  inset: -0.65rem;
  border-color: rgba(247, 168, 41, 0.35);
}

.lp-cta-orbit__core {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 4.25rem;
  height: 4.25rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(145deg, var(--primary) 0%, #7b46b3 100%);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.lp-cta-orbit__core :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}

@keyframes lp-cta-spin {
  to {
    transform: rotate(360deg);
  }
}

.lp-cta-float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.85rem;
  border-radius: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
  animation: lp-cta-float 5s ease-in-out infinite;
}

.lp-cta-float--1 {
  top: 8%;
  right: 4%;
  animation-delay: 0s;
}

.lp-cta-float--2 {
  top: 42%;
  right: 0;
  animation-delay: 0.6s;
}

.lp-cta-float--3 {
  bottom: 6%;
  right: 14%;
  animation-delay: 1.2s;
}

.lp-cta-float--purple .lp-cta-float__icon {
  color: var(--kkoo-accent-light, #c9a0e8);
  background: color-mix(in srgb, var(--primary) 25%, transparent);
}

.lp-cta-float--gold .lp-cta-float__icon {
  color: var(--gold-light);
  background: color-mix(in srgb, var(--gold) 22%, transparent);
}

.lp-cta-float--mint .lp-cta-float__icon {
  color: var(--primary-light);
  background: color-mix(in srgb, var(--primary-light) 28%, transparent);
}

.lp-cta-float__icon {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.65rem;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.lp-cta-float__icon :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.lp-cta-float__copy {
  display: grid;
  line-height: 1.1;
  text-align: left;
}

.lp-cta-float__label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.58);
}

.lp-cta-float__value {
  font-size: 0.88rem;
  font-weight: 800;
  color: #fff;
}

@keyframes lp-cta-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.lp-cta-trust-mobile {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.lp-cta-trust-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.1);
}

.lp-cta-trust-chip :deep(svg) {
  width: 0.85rem;
  height: 0.85rem;
}

.lp-cta-trust-chip--purple {
  border-color: rgba(155, 89, 204, 0.35);
}

.lp-cta-trust-chip--gold {
  border-color: rgba(247, 168, 41, 0.35);
}

.lp-cta-trust-chip--mint {
  border-color: rgba(61, 154, 106, 0.35);
}

@media (max-width: 991.98px) {
  .lp-cta-section {
    min-height: 0;
  }

  .lp-cta-stage {
    min-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lp-cta-orbit__ring--outer,
  .lp-cta-float {
    animation: none;
  }
}

html[data-bs-theme='dark'] .lp-cta-overlay {
  background:
    linear-gradient(115deg, rgba(12, 6, 22, 0.96) 0%, rgba(36, 16, 58, 0.9) 40%, rgba(8, 5, 14, 0.88) 100%),
    radial-gradient(circle at 85% 20%, rgba(247, 168, 41, 0.16), transparent 42%);
}

html[data-bs-theme='dark'] .lp-cta-bg {
  filter: saturate(1.05) contrast(1.08) brightness(0.82);
}

html[data-bs-theme='dark'] .lp-cta-section {
  background: transparent !important;
}

/* ===== FOOTER ===== */
.lp-footer {
  background: #0a0a0a;
  color: #f0f0f0;
}

.lp-footer a:hover {
  color: var(--gold) !important;
}

/* ===== DARK MODE (driven by header toggle → data-bs-theme on <html>) ===== */
html[data-bs-theme='dark'] .lp-section {
  background: #0f0f0f;
  color: #f0f0f0;
}

html[data-bs-theme='dark'] .lp-wrapper .card {
  background: #1a1a1a;
  border-color: #2a2a2a;
  color: #f0f0f0;
}

html[data-bs-theme='dark'] .lp-services-section {
  background: linear-gradient(135deg, rgba(88, 15, 168, 0.1) 0%, rgba(248, 180, 75, 0.05) 100%);
}

/* Remove dark section backgrounds for specific sections */
html[data-bs-theme='dark'] #work.lp-services-section {
  background:
    radial-gradient(ellipse 80% 55% at 0% 0%, rgba(92, 48, 143, 0.14), transparent 52%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(248, 180, 75, 0.08), transparent 50%),
    #0f0f0f !important;
}

html[data-bs-theme='dark'] #download.lp-section {
  background:
    radial-gradient(ellipse 80% 55% at 0% 0%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 52%),
    radial-gradient(ellipse 70% 50% at 100% 100%, color-mix(in srgb, var(--gold) 10%, transparent), transparent 50%),
    #0f0f0f !important;
}


html[data-bs-theme='dark'] .lp-wrapper.mk-landing .text-secondary {
  color: rgba(255, 255, 255, 0.68) !important;
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing .lp-hero-trust-line.text-secondary {
  color: rgba(255, 255, 255, 0.58) !important;
}

/* Light cards on dark sections — glass surfaces + readable copy */
html[data-bs-theme='dark'] .lp-wrapper.mk-landing :is(
  .lp-buyers-tile,
  .lp-sellers-tile,
  .lp-sme-module,
  .lp-onboard-brief__stat
) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
}


html[data-bs-theme='dark'] .lp-wrapper.mk-landing :is(
  .lp-buyers-tile__title,
  .lp-sellers-tile__title,
  .lp-sme-module__title,
  .lp-onboard-brief__stat strong
) {
  color: rgba(255, 255, 255, 0.94);
}

html[data-bs-theme='dark'] .lp-wrapper.mk-landing :is(
  .lp-buyers-tile__desc,
  .lp-sellers-tile__desc,
  .lp-sme-module__desc,
  .lp-onboard-brief__stat small
) {
  color: rgba(255, 255, 255, 0.72);
}

html[data-bs-theme='dark'] .lp-cta-section {
  background: transparent !important;
}

.lp-shop-verticals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.lp-shop-vertical-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid rgba(92, 48, 143, 0.12);
  background: rgba(255, 255, 255, 0.72);
  color: inherit;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.lp-shop-vertical-card:hover {
  transform: translateY(-2px);
  border-color: rgba(92, 48, 143, 0.28);
  box-shadow: 0 12px 28px rgba(92, 48, 143, 0.08);
}

.lp-shop-vertical-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(92, 48, 143, 0.1);
  color: #5c308f;
  flex-shrink: 0;
}

.lp-shop-vertical-card__copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.lp-shop-vertical-card__title {
  font-weight: 800;
  font-size: 1rem;
}

.lp-shop-vertical-card__desc {
  font-size: 0.85rem;
  color: rgba(20, 19, 22, 0.68);
}

.lp-shop-vertical-card__arrow {
  margin-left: auto;
  flex-shrink: 0;
  opacity: 0.55;
}

html[data-bs-theme='dark'] .lp-shop-vertical-card {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .lp-shop-vertical-card__desc {
  color: rgba(255, 255, 255, 0.68);
}

.lp-explore-head__title {
  font-weight: 800;
  font-size: 1.35rem;
  margin-bottom: 0.35rem;
}

.lp-explore-head__sub {
  color: rgba(20, 19, 22, 0.68);
  max-width: 42rem;
}

html[data-bs-theme='dark'] .lp-explore-head__sub {
  color: rgba(255, 255, 255, 0.68);
}

.lp-inside-gate {
  color: inherit;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .py-lg-6 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .display-3, .display-4, .display-5 {
    font-size: 2rem;
  }

  .lp-hero-section {
    min-height: 100vh;
    min-height: 100dvh;
  }

  .lp-hero-inner {
    padding: clamp(4.25rem, 12vw, 5.5rem) 0 clamp(2.5rem, 7vh, 3.5rem);
  }

  .lp-hero-orb {
    display: none;
  }

  .lp-stats-mesh {
    opacity: 0.2;
  }
}

@media (max-width: 480px) {
  .lp-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lp-hero-actions .lp-hero-btn.lp-btn-pill {
    width: 100%;
    max-width: 22rem;
    margin-inline: auto;
    justify-content: center;
  }
}

.lp-hero-trust-line {
  max-width: 40rem;
  line-height: 1.5;
}
</style>
