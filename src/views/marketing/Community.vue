<template>
  <MarketingLayout>
    <div class="community-page">
    <section class="lp-section community-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="community-hero-grid">
          <div class="community-copy">
            <span class="lp-section-pill">{{ t('community.eyebrow') }}</span>
            <h1 class="display-4 fw-800 lp-section-heading mb-3">
              {{ t('community.heroTitle') }}
              <span class="lp-text-primary d-block d-md-inline">{{ t('community.heroTitleAccent') }}</span>
            </h1>
            <p class="lp-program-lead community-body-copy mb-0">{{ t('community.heroLead') }}</p>

            <div class="community-actions">
              <a
                href="#ask-a-question"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label">{{ t('community.actions.askQuestion') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </a>
              <a
                href="#request-a-feature"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--lg text-decoration-none d-inline-flex align-items-center"
              >
                <span class="lp-btn-pill__label">{{ t('community.actions.requestFeature') }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:lightbulb-bolt-linear" class="lp-btn-pill__icon" />
                </span>
              </a>
            </div>

            <div class="community-proof-row">
              <span v-for="point in communityProof" :key="point" class="community-proof-pill">{{ point }}</span>
            </div>

            <p v-if="isLoadingBoard" class="community-note">
              {{ t('community.notes.loadingBoard') }}
            </p>
            <p v-else-if="boardErrorKey" class="community-note community-note--error">
              {{ messageText(boardErrorKey) }}
            </p>
            <p v-else class="community-note">
              {{ t('community.notes.savedBoard') }}
            </p>
          </div>

          <article class="hero-board lp-program-card">
            <div class="hero-board-media lp-buyers-visual">
              <img :src="communityPlaceholder" :alt="t('community.heroImageAlt')" class="lp-buyers-visual__img" />
              <div class="lp-buyers-visual__overlay" aria-hidden="true" />
              <div class="hero-board-badge">{{ t('community.heroBoard.badge') }}</div>
              <div class="hero-board-metrics">
                <div class="hero-metric">
                  <span>{{ t('community.metrics.openQuestions') }}</span>
                  <strong>{{ threads.length }}</strong>
                </div>
                <div class="hero-metric">
                  <span>{{ t('community.metrics.totalReplies') }}</span>
                  <strong>{{ totalReplies }}</strong>
                </div>
                <div class="hero-metric">
                  <span>{{ t('community.metrics.featureIdeas') }}</span>
                  <strong>{{ featureIdeas.length }}</strong>
                </div>
              </div>
            </div>

            <div class="hero-board-body">
              <p class="hero-board-title">{{ t('community.heroBoard.title') }}</p>
              <div class="hero-board-summary">
                <article v-for="item in heroBoardSummary" :key="item.title" class="hero-board-summary-item">
                  <h2 class="community-card__title">{{ item.title }}</h2>
                  <p class="community-card__copy">{{ item.copy }}</p>
                </article>
              </div>
            </div>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section guidance-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading text-center">
          <span class="lp-section-pill">{{ t('community.guidance.kicker') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('community.guidance.title') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('community.guidance.titleAccent') }}</span>
          </h2>
          <p class="lp-program-copy community-body-copy mb-0 mx-auto">{{ t('community.guidance.copy') }}</p>
        </div>

        <div class="guide-grid">
          <article v-for="guide in participationGuides" :key="guide.title" class="guide-card community-card lp-program-card">
            <div class="guide-top">
              <span class="guide-icon">
                <Icon :icon="guide.icon" />
              </span>
              <span class="guide-tag">{{ guide.tag }}</span>
            </div>
            <h3 class="community-card__title">{{ guide.title }}</h3>
            <p class="community-card__copy">{{ guide.copy }}</p>
            <a :href="guide.href" class="guide-link">
              {{ guide.action }}
            </a>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section listening-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading text-center">
          <span class="lp-section-pill">{{ t('community.pulse.kicker') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('community.pulse.title') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('community.pulse.titleAccent') }}</span>
          </h2>
          <p class="lp-program-copy community-body-copy mb-0 mx-auto">{{ t('community.pulse.copy') }}</p>
        </div>

        <div class="status-grid">
          <article class="status-card community-card lp-program-card">
            <span class="status-label status-label--listening">{{ t('community.statuses.listening') }}</span>
            <strong class="community-stat">{{ listeningCount }}</strong>
            <p class="community-card__copy">{{ t('community.statuses.listeningCopy') }}</p>
          </article>
          <article class="status-card community-card lp-program-card">
            <span class="status-label status-label--planned">{{ t('community.statuses.planned') }}</span>
            <strong class="community-stat">{{ plannedCount }}</strong>
            <p class="community-card__copy">{{ t('community.statuses.plannedCopy') }}</p>
          </article>
          <article class="status-card community-card lp-program-card">
            <span class="status-label status-label--shipped">{{ t('community.statuses.shipped') }}</span>
            <strong class="community-stat">{{ shippedCount }}</strong>
            <p class="community-card__copy">{{ t('community.statuses.shippedCopy') }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section community-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading text-center">
          <span class="lp-section-pill">{{ t('community.coverage.kicker') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('community.coverage.title') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('community.coverage.titleAccent') }}</span>
          </h2>
          <p class="lp-program-copy community-body-copy mb-0 mx-auto">{{ t('community.coverage.copy') }}</p>
        </div>

        <div class="coverage-grid">
          <article v-for="item in featureCoverage" :key="item.title" class="coverage-card community-card lp-program-card">
            <div class="coverage-top">
              <span class="coverage-icon">
                <Icon :icon="item.icon" />
              </span>
              <span class="coverage-tag">{{ item.tag }}</span>
            </div>
            <h3 class="community-card__title">{{ item.title }}</h3>
            <p class="community-card__copy">{{ item.copy }}</p>
          </article>
        </div>
      </b-container>
    </section>

    <section class="lp-section community-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading text-center">
          <span class="lp-section-pill">{{ t('community.beforePost.kicker') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('community.beforePost.title') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('community.beforePost.titleAccent') }}</span>
          </h2>
          <p class="lp-program-copy community-body-copy mb-0 mx-auto">{{ t('community.beforePost.copy') }}</p>
        </div>

        <div class="posting-grid">
          <article class="posting-guide community-card lp-program-card">
            <div class="posting-guide-head">
              <h3 class="community-card__title">{{ t('community.postingGuide.title') }}</h3>
              <p class="community-card__copy">{{ t('community.postingGuide.copy') }}</p>
            </div>

            <div class="posting-list">
              <article v-for="(tip, index) in postingTips" :key="tip.title" class="posting-tip">
                <span class="posting-index">0{{ index + 1 }}</span>
                <div>
                  <h4 class="community-card__title community-card__title--sm">{{ tip.title }}</h4>
                  <p class="community-card__copy">{{ tip.copy }}</p>
                </div>
              </article>
            </div>
          </article>

          <div class="composer-grid">
            <article id="ask-a-question" class="composer-card community-card lp-program-card">
              <span class="lp-section-pill">{{ t('community.ask.kicker') }}</span>
              <h2 class="composer-card__title mb-0">
                {{ t('community.ask.title') }}
                <span class="composer-card__accent">{{ t('community.ask.titleAccent') }}</span>
              </h2>
              <p class="composer-message" v-if="questionMessageKey">{{ messageText(questionMessageKey) }}</p>

              <form class="composer-form community-form" @submit.prevent="submitQuestion">
                <div class="field-row">
                  <label>
                    <span>{{ t('community.labels.yourName') }}</span>
                    <input v-model.trim="questionForm.name" type="text" :placeholder="t('community.placeholders.nameExample1')" />
                  </label>
                  <label>
                    <span>{{ t('community.labels.yourRole') }}</span>
                    <select v-model="questionForm.role">
                      <option v-for="role in roleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>{{ t('community.labels.questionTitle') }}</span>
                  <input
                    v-model.trim="questionForm.title"
                    type="text"
                    :placeholder="t('community.placeholders.questionTitle')"
                  />
                </label>
                <label>
                  <span>{{ t('community.labels.details') }}</span>
                  <textarea
                    v-model.trim="questionForm.body"
                    rows="4"
                    :placeholder="t('community.placeholders.questionBody')"
                  />
                </label>
                <button
                  type="submit"
                  class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--md border-0 composer-submit"
                  :disabled="questionSubmitting"
                >
                  <span class="lp-btn-pill__label">
                    {{ questionSubmitting ? t('community.actions.postingQuestion') : t('community.actions.postQuestion') }}
                  </span>
                  <span class="lp-btn-pill__well" aria-hidden="true">
                    <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                  </span>
                </button>
              </form>
            </article>

            <article id="request-a-feature" class="composer-card composer-card--accent community-card lp-program-card">
              <span class="lp-section-pill">{{ t('community.feature.kicker') }}</span>
              <h2 class="composer-card__title mb-0">
                {{ t('community.feature.title') }}
                <span class="composer-card__accent">{{ t('community.feature.titleAccent') }}</span>
              </h2>
              <p class="composer-message" v-if="featureMessageKey">{{ messageText(featureMessageKey) }}</p>

              <form class="composer-form community-form" @submit.prevent="submitFeature">
                <div class="field-row">
                  <label>
                    <span>{{ t('community.labels.yourName') }}</span>
                    <input v-model.trim="featureForm.name" type="text" :placeholder="t('community.placeholders.nameExample2')" />
                  </label>
                  <label>
                    <span>{{ t('community.labels.area') }}</span>
                    <select v-model="featureForm.area">
                      <option v-for="area in areaOptions" :key="area.value" :value="area.value">{{ area.label }}</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>{{ t('community.labels.featureTitle') }}</span>
                  <input
                    v-model.trim="featureForm.title"
                    type="text"
                    :placeholder="t('community.placeholders.featureTitle')"
                  />
                </label>
                <label>
                  <span>{{ t('community.labels.whyItMatters') }}</span>
                  <textarea
                    v-model.trim="featureForm.why"
                    rows="4"
                    :placeholder="t('community.placeholders.featureWhy')"
                  />
                </label>
                <button
                  type="submit"
                  class="lp-btn-pill lp-btn-pill--accent lp-btn-pill--md border-0 composer-submit"
                  :disabled="featureSubmitting"
                >
                  <span class="lp-btn-pill__label">
                    {{ featureSubmitting ? t('community.actions.savingFeature') : t('community.actions.addFeature') }}
                  </span>
                  <span class="lp-btn-pill__well" aria-hidden="true">
                    <Icon icon="solar:lightbulb-bolt-linear" class="lp-btn-pill__icon" />
                  </span>
                </button>
              </form>
            </article>
          </div>
        </div>
      </b-container>
    </section>

    <section class="lp-section community-band">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading text-center">
          <span class="lp-section-pill">{{ t('community.sections.repliesKicker') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('community.sections.repliesTitle') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('community.sections.repliesTitleAccent') }}</span>
          </h2>
        </div>

        <div v-if="isLoadingBoard" class="empty-state lp-program-card">
          {{ t('community.empty.threadsLoading') }}
        </div>
        <div v-else-if="threads.length === 0" class="empty-state lp-program-card">
          {{ t('community.empty.threads') }}
        </div>
        <div v-else class="thread-list">
          <article v-for="thread in threads" :key="thread.id" class="thread-card community-card lp-program-card">
            <div class="thread-head">
              <div class="thread-meta">
                <span class="thread-tag">{{ displayRole(thread.author_role) }}</span>
                <span class="thread-author">{{ thread.author_name }}</span>
                <span class="thread-age">{{ formatRelativeTime(thread.created_at) }}</span>
              </div>
              <h3 class="community-card__title">{{ thread.title }}</h3>
              <p class="community-card__copy">{{ thread.body }}</p>
            </div>

            <div class="reply-list">
              <div v-for="reply in thread.replies" :key="reply.id" class="reply-card">
                <div class="reply-avatar" :class="{ 'reply-avatar--team': reply.is_team_reply }" aria-hidden="true">
                  {{ replyInitial(reply.author_name) }}
                </div>
                <div>
                  <div class="reply-meta">
                    <strong>{{ reply.author_name }}</strong>
                    <span>{{ displayRole(reply.author_role) }}</span>
                    <span v-if="reply.is_team_reply" class="reply-team-badge">{{ t('community.replies.teamBadge') }}</span>
                  </div>
                  <p>{{ reply.body }}</p>
                </div>
              </div>
            </div>

            <form class="reply-form community-form" @submit.prevent="submitReply(thread.id)">
              <div class="field-row">
                <label>
                  <span>{{ t('community.labels.yourName') }}</span>
                  <input
                    v-model.trim="replyDrafts[thread.id].name"
                    type="text"
                    :placeholder="t('community.placeholders.replyName')"
                  />
                </label>
                <label>
                  <span>{{ t('community.labels.yourRole') }}</span>
                  <select v-model="replyDrafts[thread.id].role">
                    <option v-for="role in roleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
                  </select>
                </label>
              </div>
              <textarea
                v-model.trim="replyDrafts[thread.id].body"
                rows="2"
                :placeholder="t('community.placeholders.replyBody')"
              />
              <p v-if="replyMessageKeys[thread.id]" class="composer-message">
                {{ messageText(replyMessageKeys[thread.id]) }}
              </p>
              <button
                type="submit"
                class="lp-btn-pill lp-btn-pill--primary lp-btn-pill--sm border-0"
                :disabled="replySubmitting[thread.id]"
              >
                <span class="lp-btn-pill__label">
                  {{ replySubmitting[thread.id] ? t('community.actions.postingReply') : t('community.actions.reply') }}
                </span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:arrow-right-up-linear" class="lp-btn-pill__icon" />
                </span>
              </button>
            </form>
          </article>
        </div>
      </b-container>
    </section>

    <section id="feature-board" class="lp-section roadmap-surface">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="section-heading text-center">
          <span class="lp-section-pill">{{ t('community.sections.featureBoardKicker') }}</span>
          <h2 class="display-4 fw-800 lp-section-heading mb-3">
            {{ t('community.sections.featureBoardTitle') }}
            <span class="lp-text-primary d-block d-md-inline">{{ t('community.sections.featureBoardTitleAccent') }}</span>
          </h2>
        </div>

        <div v-if="isLoadingBoard" class="empty-state lp-program-card">
          {{ t('community.empty.featuresLoading') }}
        </div>
        <div v-else-if="featureIdeas.length === 0" class="empty-state lp-program-card">
          {{ t('community.empty.features') }}
        </div>
        <div v-else class="feature-grid">
          <article v-for="idea in featureIdeas" :key="idea.id" class="feature-card community-card lp-program-card">
            <div class="feature-head">
              <span class="status-label" :class="statusClass(idea.status)">{{ statusLabel(idea.status) }}</span>
              <span class="feature-area">{{ displayArea(idea.area) }}</span>
            </div>
            <h3 class="community-card__title">{{ idea.title }}</h3>
            <p class="community-card__copy">{{ idea.summary }}</p>
            <div class="feature-foot">
              <button
                type="button"
                class="lp-btn-pill lp-btn-pill--surface lp-btn-pill--sm border-0 vote-button"
                :disabled="hasSupportedIdea(idea.id) || voteSubmitting[idea.id]"
                @click="voteForIdea(idea.id)"
              >
                <span class="lp-btn-pill__label">{{ supportLabel(idea.id) }}</span>
                <span class="lp-btn-pill__well" aria-hidden="true">
                  <Icon icon="solar:heart-angle-linear" class="lp-btn-pill__icon" />
                </span>
              </button>
              <strong>{{ idea.votes }} {{ t('community.replies.supportersLabel') }}</strong>
            </div>
          </article>
        </div>
      </b-container>
    </section>
    </div>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import MarketingLayout from './MarketingLayout.vue'
import {
  createCommunityFeatureRequest,
  createCommunityReply,
  createCommunityThread,
  listCommunityFeatureRequests,
  listCommunityThreads,
  supportCommunityFeatureRequest,
} from '@/api/community'
import communityPlaceholder from '@/assets/images/landing/placeholders/community-hero-placeholder.svg'
import type {
  CommunityFeatureRequest,
  CommunityFeatureStatus,
  CommunityThread,
} from '@/types/community'

type ReplyDraft = {
  name: string
  role: string
  body: string
}

type CommunityMessageCode =
  | 'boardError'
  | 'questionValidation'
  | 'questionSuccess'
  | 'questionError'
  | 'featureValidation'
  | 'featureSuccess'
  | 'featureError'
  | 'replyValidation'
  | 'replySuccess'
  | 'replyError'
  | 'supportError'

const SUPPORTED_IDEA_STORAGE_KEY = 'kkoo-community-supported-ideas-v1'

const { t, locale } = useI18n()

const communityProof = computed(() => [
  t('community.proof.1'),
  t('community.proof.2'),
  t('community.proof.3'),
  t('community.proof.4'),
])

const heroBoardSummary = computed(() => [
  {
    title: t('community.heroBoardSummary.1.title'),
    copy: t('community.heroBoardSummary.1.copy'),
  },
  {
    title: t('community.heroBoardSummary.2.title'),
    copy: t('community.heroBoardSummary.2.copy'),
  },
  {
    title: t('community.heroBoardSummary.3.title'),
    copy: t('community.heroBoardSummary.3.copy'),
  },
])

const participationGuides = computed(() => [
  {
    icon: 'solar:question-circle-linear',
    tag: t('community.guides.ask.tag'),
    title: t('community.guides.ask.title'),
    copy: t('community.guides.ask.copy'),
    action: t('community.guides.ask.action'),
    href: '#ask-a-question',
  },
  {
    icon: 'solar:danger-triangle-linear',
    tag: t('community.guides.report.tag'),
    title: t('community.guides.report.title'),
    copy: t('community.guides.report.copy'),
    action: t('community.guides.report.action'),
    href: '#ask-a-question',
  },
  {
    icon: 'solar:lightbulb-bolt-linear',
    tag: t('community.guides.suggest.tag'),
    title: t('community.guides.suggest.title'),
    copy: t('community.guides.suggest.copy'),
    action: t('community.guides.suggest.action'),
    href: '#request-a-feature',
  },
  {
    icon: 'solar:heart-angle-linear',
    tag: t('community.guides.support.tag'),
    title: t('community.guides.support.title'),
    copy: t('community.guides.support.copy'),
    action: t('community.guides.support.action'),
    href: '#feature-board',
  },
])

const postingTips = computed(() => [
  {
    title: t('community.postingTips.1.title'),
    copy: t('community.postingTips.1.copy'),
  },
  {
    title: t('community.postingTips.2.title'),
    copy: t('community.postingTips.2.copy'),
  },
  {
    title: t('community.postingTips.3.title'),
    copy: t('community.postingTips.3.copy'),
  },
])

const featureCoverage = computed(() => [
  {
    icon: 'solar:shop-2-linear',
    tag: t('community.coverageCards.commerce.tag'),
    title: t('community.coverageCards.commerce.title'),
    copy: t('community.coverageCards.commerce.copy'),
  },
  {
    icon: 'solar:wallet-money-linear',
    tag: t('community.coverageCards.money.tag'),
    title: t('community.coverageCards.money.title'),
    copy: t('community.coverageCards.money.copy'),
  },
  {
    icon: 'solar:gift-linear',
    tag: t('community.coverageCards.rewards.tag'),
    title: t('community.coverageCards.rewards.title'),
    copy: t('community.coverageCards.rewards.copy'),
  },
  {
    icon: 'solar:cup-star-linear',
    tag: t('community.coverageCards.gamification.tag'),
    title: t('community.coverageCards.gamification.title'),
    copy: t('community.coverageCards.gamification.copy'),
  },
])

const ROLE_VALUES = ['Buyer', 'Merchant', 'Driver', 'Partner', 'Community member'] as const
const AREA_VALUES = ['Buyer app', 'Merchant tools', 'Driver app', 'Logistics', 'Payments', 'Community'] as const

const roleOptions = computed(() =>
  ROLE_VALUES.map((value) => ({
    value,
    label: displayRole(value),
  }))
)
const areaOptions = computed(() =>
  AREA_VALUES.map((value) => ({
    value,
    label: displayArea(value),
  }))
)

const questionForm = reactive({
  name: '',
  role: 'Merchant',
  title: '',
  body: '',
})

const featureForm = reactive({
  name: '',
  area: 'Merchant tools',
  title: '',
  why: '',
})

const questionMessageKey = ref<CommunityMessageCode | ''>('')
const featureMessageKey = ref<CommunityMessageCode | ''>('')
const boardErrorKey = ref<CommunityMessageCode | ''>('')
const isLoadingBoard = ref(true)
const questionSubmitting = ref(false)
const featureSubmitting = ref(false)
const supportedIdeaIds = ref<number[]>([])

const replyDrafts = reactive<Record<number, ReplyDraft>>({})
const replyMessageKeys = reactive<Record<number, CommunityMessageCode | ''>>({})
const replySubmitting = reactive<Record<number, boolean>>({})
const voteSubmitting = reactive<Record<number, boolean>>({})

const threads = ref<CommunityThread[]>([])
const featureIdeas = ref<CommunityFeatureRequest[]>([])

const totalReplies = computed(() =>
  threads.value.reduce((sum, thread) => sum + thread.replies.length, 0)
)
const listeningCount = computed(() =>
  featureIdeas.value.filter((idea) => normalizeFeatureStatus(idea.status) === 'listening').length
)
const plannedCount = computed(() =>
  featureIdeas.value.filter((idea) => normalizeFeatureStatus(idea.status) === 'planned').length
)
const shippedCount = computed(() =>
  featureIdeas.value.filter((idea) => normalizeFeatureStatus(idea.status) === 'shipped').length
)

onMounted(() => {
  hydrateSupportedIdeaIds()
  void loadBoard()
})

async function loadBoard() {
  isLoadingBoard.value = true
  boardErrorKey.value = ''

  try {
    const [threadResponse, featureResponse] = await Promise.all([
      listCommunityThreads(),
      listCommunityFeatureRequests(),
    ])

    threads.value = threadResponse.results.map(normalizeThread)
    featureIdeas.value = featureResponse.results
    syncReplyDrafts(threads.value)
  } catch (error) {
    console.error('[Community] Failed to load board', error)
    boardErrorKey.value = 'boardError'
  } finally {
    isLoadingBoard.value = false
  }
}

function hydrateSupportedIdeaIds() {
  if (typeof window === 'undefined') return

  try {
    const raw = window.localStorage.getItem(SUPPORTED_IDEA_STORAGE_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      supportedIdeaIds.value = parsed.filter((item): item is number => typeof item === 'number')
    }
  } catch (error) {
    console.warn('[Community] Failed to load supported ideas', error)
  }
}

function persistSupportedIdeaIds() {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(SUPPORTED_IDEA_STORAGE_KEY, JSON.stringify(supportedIdeaIds.value))
}

function syncReplyDrafts(items: CommunityThread[]) {
  items.forEach((thread) => ensureReplyDraft(thread.id))
}

function ensureReplyDraft(threadId: number) {
  if (replyDrafts[threadId]) return

  replyDrafts[threadId] = {
    name: '',
    role: 'Community member',
    body: '',
  }
}

function normalizeThread(thread: CommunityThread): CommunityThread {
  return {
    ...thread,
    replies: Array.isArray(thread.replies) ? thread.replies : [],
  }
}

async function submitQuestion() {
  if (!questionForm.title || !questionForm.body) {
    questionMessageKey.value = 'questionValidation'
    return
  }

  questionSubmitting.value = true
  questionMessageKey.value = ''

  try {
    const thread = normalizeThread(
      await createCommunityThread({
        name: questionForm.name,
        role: questionForm.role,
        title: questionForm.title,
        body: questionForm.body,
      })
    )

    threads.value = [thread, ...threads.value]
    ensureReplyDraft(thread.id)

    questionForm.name = ''
    questionForm.role = 'Merchant'
    questionForm.title = ''
    questionForm.body = ''
    questionMessageKey.value = 'questionSuccess'
  } catch (error) {
    console.error('[Community] Failed to create thread', error)
    questionMessageKey.value = 'questionError'
  } finally {
    questionSubmitting.value = false
  }
}

async function submitReply(threadId: number) {
  ensureReplyDraft(threadId)

  const draft = replyDrafts[threadId]
  const body = draft.body.trim()
  if (!body) {
    replyMessageKeys[threadId] = 'replyValidation'
    return
  }

  replySubmitting[threadId] = true
  replyMessageKeys[threadId] = ''

  try {
    const reply = await createCommunityReply(threadId, {
      name: draft.name,
      role: draft.role,
      body,
    })

    const thread = threads.value.find((item) => item.id === threadId)
    if (thread) {
      thread.replies = [...thread.replies, reply]
    }

    draft.name = ''
    draft.role = 'Community member'
    draft.body = ''
    replyMessageKeys[threadId] = 'replySuccess'
  } catch (error) {
    console.error('[Community] Failed to create reply', error)
    replyMessageKeys[threadId] = 'replyError'
  } finally {
    replySubmitting[threadId] = false
  }
}

async function submitFeature() {
  if (!featureForm.title || !featureForm.why) {
    featureMessageKey.value = 'featureValidation'
    return
  }

  featureSubmitting.value = true
  featureMessageKey.value = ''

  try {
    const idea = await createCommunityFeatureRequest({
      name: featureForm.name,
      area: featureForm.area,
      title: featureForm.title,
      summary: featureForm.why,
    })

    featureIdeas.value = [idea, ...featureIdeas.value]
    markIdeaSupported(idea.id)

    featureForm.name = ''
    featureForm.area = 'Merchant tools'
    featureForm.title = ''
    featureForm.why = ''
    featureMessageKey.value = 'featureSuccess'
  } catch (error) {
    console.error('[Community] Failed to create feature request', error)
    featureMessageKey.value = 'featureError'
  } finally {
    featureSubmitting.value = false
  }
}

async function voteForIdea(id: number) {
  if (hasSupportedIdea(id) || voteSubmitting[id]) return

  voteSubmitting[id] = true

  try {
    const updatedIdea = await supportCommunityFeatureRequest(id)
    featureIdeas.value = featureIdeas.value.map((idea) => (idea.id === id ? updatedIdea : idea))
    markIdeaSupported(id)
  } catch (error) {
    console.error('[Community] Failed to support idea', error)
    boardErrorKey.value = 'supportError'
  } finally {
    voteSubmitting[id] = false
  }
}

function markIdeaSupported(id: number) {
  if (hasSupportedIdea(id)) return

  supportedIdeaIds.value = [...supportedIdeaIds.value, id]
  persistSupportedIdeaIds()
}

function hasSupportedIdea(id: number) {
  return supportedIdeaIds.value.includes(id)
}

function supportLabel(id: number) {
  if (voteSubmitting[id]) return t('community.actions.savingSupport')
  if (hasSupportedIdea(id)) return t('community.actions.supported')
  return t('community.actions.supportThis')
}

function normalizeFeatureStatus(status: string): CommunityFeatureStatus {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'planned' || normalized === 'shipped') {
    return normalized
  }
  return 'listening'
}

function statusClass(status: string) {
  const normalized = normalizeFeatureStatus(status)
  if (normalized === 'planned') return 'status-label--planned'
  if (normalized === 'shipped') return 'status-label--shipped'
  return 'status-label--listening'
}

function statusLabel(status: string) {
  const normalized = normalizeFeatureStatus(status)
  if (normalized === 'planned') return t('community.statuses.planned')
  if (normalized === 'shipped') return t('community.statuses.shipped')
  return t('community.statuses.listening')
}

function messageText(code: CommunityMessageCode | '') {
  switch (code) {
    case 'boardError':
      return t('community.messages.boardError')
    case 'questionValidation':
      return t('community.messages.questionValidation')
    case 'questionSuccess':
      return t('community.messages.questionSuccess')
    case 'questionError':
      return t('community.messages.questionError')
    case 'featureValidation':
      return t('community.messages.featureValidation')
    case 'featureSuccess':
      return t('community.messages.featureSuccess')
    case 'featureError':
      return t('community.messages.featureError')
    case 'replyValidation':
      return t('community.messages.replyValidation')
    case 'replySuccess':
      return t('community.messages.replySuccess')
    case 'replyError':
      return t('community.messages.replyError')
    case 'supportError':
      return t('community.messages.supportError')
    default:
      return ''
  }
}

function displayRole(value: string) {
  switch (value.trim().toLowerCase()) {
    case 'buyer':
      return t('community.roles.buyer')
    case 'merchant':
      return t('community.roles.merchant')
    case 'driver':
      return t('community.roles.driver')
    case 'partner':
      return t('community.roles.partner')
    case 'community':
    case 'community member':
      return t('community.roles.communityMember')
    default:
      return value
  }
}

function displayArea(value: string) {
  switch (value.trim().toLowerCase()) {
    case 'buyer app':
      return t('community.areas.buyerApp')
    case 'merchant tools':
      return t('community.areas.merchantTools')
    case 'driver app':
      return t('community.areas.driverApp')
    case 'logistics':
      return t('community.areas.logistics')
    case 'payments':
      return t('community.areas.payments')
    case 'community':
      return t('community.areas.community')
    default:
      return value
  }
}

function replyInitial(name: string) {
  const initial = name.trim().charAt(0)
  return initial ? initial.toUpperCase() : 'K'
}

function currentIntlLocale() {
  if (locale.value === 'sw') return 'sw-TZ'
  if (locale.value === 'fr') return 'fr-FR'
  return 'en'
}

function formatRelativeTime(value: string) {
  const createdAt = new Date(value)
  if (Number.isNaN(createdAt.getTime())) return t('community.time.recently')

  const diffMs = Date.now() - createdAt.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const rtf = new Intl.RelativeTimeFormat(currentIntlLocale(), { numeric: 'auto' })

  if (diffMs < minute) return t('community.time.justNow')
  if (diffMs < hour) return rtf.format(-Math.max(1, Math.round(diffMs / minute)), 'minute')
  if (diffMs < day) return rtf.format(-Math.max(1, Math.round(diffMs / hour)), 'hour')
  if (diffMs < week) return rtf.format(-Math.max(1, Math.round(diffMs / day)), 'day')

  return createdAt.toLocaleDateString(currentIntlLocale(), {
    month: 'short',
    day: 'numeric',
    year: createdAt.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}
</script>

<style scoped>
:deep(.lp-layout) {
  --cm-primary: var(--kkoo-primary, var(--bs-kkoo-primary, #5c308f));
  --cm-primary-rgb: var(--bs-kkoo-primary-rgb, 92, 48, 143);
  --cm-primary-dark: var(--kkoo-primary-dark, #3b1a5a);
  --cm-primary-light: var(--kkoo-primary-light, #7b46b3);
  --cm-gold: var(--kkoo-accent, var(--bs-kkoo-secondary, #f7a829));
  --cm-gold-rgb: var(--bs-kkoo-secondary-rgb, 247, 168, 41);
  --cm-gold-dark: var(--kkoo-accent-dark, #e8940f);
  --cm-gold-light: var(--kkoo-gold-light, #f8b44b);
  --cm-accent-light: var(--kkoo-accent-light, #c9a0e8);
}

.community-hero,
.guidance-surface,
.listening-surface,
.roadmap-surface {
  background:
    radial-gradient(circle at top right, rgba(var(--cm-gold-rgb), 0.1), transparent 26%),
    radial-gradient(circle at left center, rgba(var(--cm-primary-rgb), 0.08), transparent 34%);
}

.community-hero-grid,
.guide-grid,
.status-grid,
.coverage-grid,
.posting-grid,
.composer-grid,
.thread-list,
.feature-grid {
  display: grid;
  gap: 1.3rem;
}

.guide-tag,
.hero-metric span,
.status-label,
.thread-tag,
.thread-age,
.feature-area {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
  font-weight: 700;
}

.community-hero .lp-section-heading {
  text-wrap: balance;
}

.section-heading {
  margin-bottom: clamp(1.75rem, 2vw, 2.5rem);
}

.community-actions,
.community-proof-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.community-actions {
  margin-top: 1.5rem;
}

.community-proof-row {
  margin-top: 1.2rem;
}

.community-proof-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.2rem;
  padding: 0.52rem 0.88rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--cm-primary-rgb), 0.08);
  background: rgba(255, 255, 255, 0.82);
  color: var(--bs-emphasis-color);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 12px 24px rgba(35, 20, 46, 0.05);
}

.community-note {
  margin-top: 1.1rem;
  color: var(--lp-body-ink, var(--bs-secondary-color));
  font-size: 1.08rem;
  font-weight: 400;
  line-height: 1.65;
  max-width: 58ch;
}

.community-note--error {
  color: #b42318;
}

.hero-board.lp-program-card {
  overflow: hidden;
  padding: 0;
}

.hero-board-media.lp-buyers-visual {
  min-height: 22rem;
}

.hero-board-badge {
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.38rem 0.72rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--cm-primary-dark) 82%, transparent);
  color: var(--lp-text-on-purple, #fff6ef);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  backdrop-filter: blur(14px);
}

.hero-board-metrics {
  position: absolute;
  inset: auto 1rem 1rem 1rem;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.hero-metric {
  border-radius: 1.1rem;
  padding: 0.95rem;
  background: rgba(15, 18, 28, 0.76);
  color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
}

.hero-metric span {
  display: block;
  opacity: 0.72;
  margin-bottom: 0.35rem;
}

.hero-metric strong {
  display: block;
  font-size: 1.3rem;
  line-height: 1.1;
}

.hero-board-body,
.guide-card,
.status-card,
.coverage-card,
.posting-guide,
.composer-card,
.thread-card,
.feature-card,
.empty-state {
  padding: 1.4rem;
}

.hero-board-title {
  margin: 0 0 1rem;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cm-primary-dark);
}

.hero-board-summary {
  display: grid;
  gap: 0.9rem;
}

.hero-board-summary-item {
  padding-top: 0.9rem;
  border-top: 1px solid color-mix(in srgb, var(--cm-primary) 12%, transparent);
}

.hero-board-summary-item:first-child {
  padding-top: 0;
  border-top: 0;
}

.composer-message,
.empty-state {
  margin: 0.45rem 0 0;
  line-height: 1.65;
  text-wrap: pretty;
}

.composer-message {
  color: var(--cm-primary-dark);
  font-weight: 600;
}

.guide-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.guide-top,
.coverage-top,
.feature-head,
.feature-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
}

.guide-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--cm-primary) 12%, transparent);
  color: var(--cm-primary-dark);
  font-size: 1.35rem;
}

.guide-tag,
.coverage-tag {
  color: var(--cm-primary-dark);
}

.guide-link {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-top: auto;
  color: var(--cm-primary-dark);
  font-weight: 700;
  text-decoration: none;
  transition: color 180ms ease;
}

.guide-link:hover {
  color: var(--cm-primary);
}

.guide-link:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--cm-gold) 58%, transparent);
  outline-offset: 3px;
}

.status-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.community-stat {
  margin: 0.8rem 0 0.35rem;
}

.status-label,
.thread-tag,
.thread-age,
.feature-area {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.34rem 0.6rem;
  border-radius: 999px;
}

.status-label--listening {
  color: var(--cm-gold-dark);
  background: color-mix(in srgb, var(--cm-gold) 20%, transparent);
}

.status-label--planned {
  color: var(--cm-primary-dark);
  background: color-mix(in srgb, var(--cm-primary) 16%, transparent);
}

.status-label--shipped {
  color: var(--cm-primary);
  background: color-mix(in srgb, var(--cm-accent-light) 40%, transparent);
}

.posting-grid {
  grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
  align-items: start;
}

.posting-guide-head {
  margin-bottom: 1rem;
}

.posting-list {
  display: grid;
  gap: 0.95rem;
}

.posting-tip {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.95rem;
  align-items: start;
  padding-top: 0.95rem;
  border-top: 1px solid color-mix(in srgb, var(--cm-primary) 12%, transparent);
}

.posting-tip:first-child {
  padding-top: 0;
  border-top: 0;
}

.posting-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--cm-primary) 12%, transparent);
  color: var(--cm-primary-dark);
  font-size: 0.78rem;
  font-weight: 800;
}

.composer-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.composer-card--accent {
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--cm-gold) 18%, transparent), transparent 32%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--cm-gold) 10%, var(--lp-card-bg, #fff)),
      var(--lp-card-bg, #fff)
    );
}

.composer-card__title {
  font-size: clamp(1.2rem, 0.45vw + 1.05rem, 1.42rem);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: normal;
  color: var(--lp-heading-ink, var(--bs-heading-color));
  text-wrap: balance;
}

.composer-card__accent {
  display: inline;
  color: var(--cm-primary-dark);
  font-weight: 800;
}

.composer-form,
.reply-form,
.community-form {
  display: grid;
  gap: 1rem;
}

.community-form {
  margin-top: 1.15rem;
  padding-top: 1.15rem;
  border-top: 1px solid color-mix(in srgb, var(--cm-primary) 16%, transparent);
}

.field-row {
  display: grid;
  gap: 1rem;
}

.composer-form label,
.reply-form label,
.community-form label {
  display: grid;
  gap: 0.5rem;
}

.composer-form label > span,
.reply-form label > span,
.community-form label > span {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: normal;
  color: var(--lp-heading-ink, var(--bs-heading-color));
}

.composer-form input,
.composer-form textarea,
.composer-form select,
.reply-form input,
.reply-form select,
.reply-form textarea,
.community-form input,
.community-form textarea,
.community-form select {
  width: 100%;
  border-radius: 0.85rem;
  border: 1.5px solid color-mix(in srgb, var(--cm-primary) 26%, var(--lp-border-color, #d8d0e4));
  background: var(--lp-card-bg, #fff);
  color: var(--bs-body-color);
  font-size: 1rem;
  line-height: 1.5;
  padding: 0.75rem 0.95rem;
  outline: none;
  box-shadow: 0 1px 0 color-mix(in srgb, #fff 80%, transparent) inset;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.composer-form textarea,
.reply-form textarea,
.community-form textarea {
  min-height: 6.5rem;
  resize: vertical;
}

.composer-form select,
.reply-form select,
.community-form select {
  padding-right: 2.25rem;
}

.composer-form input::placeholder,
.composer-form textarea::placeholder,
.reply-form input::placeholder,
.reply-form textarea::placeholder,
.community-form input::placeholder,
.community-form textarea::placeholder {
  color: var(--lp-text-soft, var(--bs-secondary-color));
  font-size: 1rem;
  opacity: 1;
}

.composer-form input:focus,
.composer-form textarea:focus,
.composer-form select:focus,
.reply-form input:focus,
.reply-form textarea:focus,
.reply-form select:focus,
.community-form input:focus,
.community-form textarea:focus,
.community-form select:focus {
  border-color: color-mix(in srgb, var(--cm-primary) 55%, var(--cm-gold) 45%);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--cm-primary) 14%, transparent),
    0 1px 0 color-mix(in srgb, #fff 80%, transparent) inset;
}

.composer-submit,
.reply-form .lp-btn-pill {
  justify-self: start;
}

.composer-submit:disabled,
.reply-form .lp-btn-pill:disabled,
.vote-button:disabled {
  opacity: 0.72;
  cursor: default;
}

.thread-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.thread-tag,
.thread-age,
.feature-area {
  background: color-mix(in srgb, var(--cm-primary) 12%, transparent);
  color: var(--cm-primary-dark);
}

.thread-author {
  font-weight: 700;
  color: var(--bs-heading-color);
}

.reply-list {
  display: grid;
  gap: 1rem;
  margin-top: 1.2rem;
}

.reply-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  border-radius: 1.2rem;
  background: color-mix(in srgb, var(--lp-card-bg, #fff) 88%, var(--cm-primary) 12%);
  border: 1px solid color-mix(in srgb, var(--cm-primary) 12%, transparent);
}

.reply-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--cm-primary) 12%, transparent);
  color: var(--cm-primary-dark);
  font-weight: 800;
}

.reply-avatar--team {
  background: var(--cm-primary);
  color: var(--lp-text-on-purple, #fff6ef);
}

.reply-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.reply-meta span {
  color: var(--bs-secondary-color);
  font-size: 0.88rem;
}

.reply-team-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.24rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--cm-gold) 18%, transparent);
  color: var(--cm-gold-dark);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.feature-foot {
  margin-top: 1.2rem;
}

.coverage-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.coverage-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: rgba(var(--cm-gold-rgb), 0.14);
  color: var(--cm-gold);
  font-size: 1.35rem;
}

@media (min-width: 992px) {
  .community-hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
    align-items: center;
  }
}

@media (max-width: 991.98px) {
  .guide-grid,
  .status-grid,
  .coverage-grid,
  .posting-grid,
  .composer-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .community-hero .lp-section-heading {
    max-width: none;
  }

  .community-hero-grid {
    gap: 1.75rem;
  }
}

@media (min-width: 768px) {
  .field-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767.98px) {
  .hero-board-metrics {
    grid-template-columns: 1fr;
  }

  .reply-card {
    grid-template-columns: 1fr;
  }

  .feature-head,
  .feature-foot,
  .guide-top {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* Dark mode — readable cards + copy on marketing shell */
html[data-bs-theme='dark'] .community-hero,
html[data-bs-theme='dark'] .guidance-surface,
html[data-bs-theme='dark'] .listening-surface,
html[data-bs-theme='dark'] .roadmap-surface {
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--cm-gold) 12%, transparent), transparent 26%),
    radial-gradient(circle at left center, color-mix(in srgb, var(--cm-primary) 14%, transparent), transparent 34%);
}

html[data-bs-theme='dark'] .community-proof-pill {
  background: color-mix(in srgb, var(--cm-primary-dark) 55%, transparent);
  border-color: color-mix(in srgb, var(--cm-accent-light) 18%, transparent);
  color: var(--bs-emphasis-color);
}

html[data-bs-theme='dark'] .hero-metric {
  background: color-mix(in srgb, var(--cm-primary-dark) 76%, transparent);
  color: var(--lp-text-on-purple, #fff6ef);
}

html[data-bs-theme='dark'] .composer-card--accent {
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--cm-gold) 14%, transparent), transparent 32%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--cm-primary-dark) 92%, #000 8%),
      color-mix(in srgb, var(--cm-primary-dark) 78%, #000 22%)
    );
}

html[data-bs-theme='dark'] .composer-card__accent {
  color: var(--cm-gold-light);
}

html[data-bs-theme='dark'] .community-form {
  border-top-color: color-mix(in srgb, var(--cm-accent-light) 18%, transparent);
}

html[data-bs-theme='dark'] .composer-form input,
html[data-bs-theme='dark'] .composer-form textarea,
html[data-bs-theme='dark'] .composer-form select,
html[data-bs-theme='dark'] .reply-form input,
html[data-bs-theme='dark'] .reply-form select,
html[data-bs-theme='dark'] .reply-form textarea,
html[data-bs-theme='dark'] .community-form input,
html[data-bs-theme='dark'] .community-form textarea,
html[data-bs-theme='dark'] .community-form select {
  background: color-mix(in srgb, var(--cm-primary-dark) 55%, #000 45%);
  border-color: color-mix(in srgb, var(--cm-accent-light) 28%, transparent);
  color: var(--bs-body-color);
  box-shadow: 0 1px 0 color-mix(in srgb, #fff 6%, transparent) inset;
}

html[data-bs-theme='dark'] .composer-form input:focus,
html[data-bs-theme='dark'] .composer-form textarea:focus,
html[data-bs-theme='dark'] .composer-form select:focus,
html[data-bs-theme='dark'] .reply-form input:focus,
html[data-bs-theme='dark'] .reply-form textarea:focus,
html[data-bs-theme='dark'] .reply-form select:focus,
html[data-bs-theme='dark'] .community-form input:focus,
html[data-bs-theme='dark'] .community-form textarea:focus,
html[data-bs-theme='dark'] .community-form select:focus {
  border-color: color-mix(in srgb, var(--cm-gold) 45%, var(--cm-accent-light) 55%);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cm-primary) 22%, transparent);
}

html[data-bs-theme='dark'] .reply-card {
  background: color-mix(in srgb, var(--cm-primary-dark) 35%, transparent);
  border-color: color-mix(in srgb, var(--cm-accent-light) 16%, transparent);
}

html[data-bs-theme='dark'] .guide-icon {
  background: color-mix(in srgb, var(--cm-primary) 28%, transparent);
  color: var(--cm-gold-light);
}

html[data-bs-theme='dark'] .coverage-icon {
  color: var(--cm-gold-light);
  background: color-mix(in srgb, var(--cm-gold) 18%, transparent);
}

html[data-bs-theme='dark'] .guide-tag,
html[data-bs-theme='dark'] .coverage-tag,
html[data-bs-theme='dark'] .guide-link,
html[data-bs-theme='dark'] .vote-button,
html[data-bs-theme='dark'] .thread-tag,
html[data-bs-theme='dark'] .thread-age,
html[data-bs-theme='dark'] .feature-area,
html[data-bs-theme='dark'] .posting-index {
  color: var(--cm-gold-light);
}

html[data-bs-theme='dark'] .guide-link:hover {
  color: var(--cm-accent-light);
}
</style>
