<template>
  <MarketingLayout>
    <div class="cm-page">
      <section class="lp-section cm-hero">
        <div class="lh-page cm-hero__inner">
          <p class="cm-kicker">{{ t('community.eyebrow') }}</p>
          <h1 class="cm-title">
            {{ t('community.heroTitle') }}
            <span>{{ t('community.heroTitleAccent') }}</span>
          </h1>
          <p class="cm-lead">{{ t('community.heroLead') }}</p>
          <div class="cm-actions">
            <LhButton as="a" href="#ask-a-question" variant="primary" size="lg" with-well>
              {{ t('community.actions.askQuestion') }}
            </LhButton>
            <LhButton as="a" href="#request-a-feature" variant="ghost" size="lg">
              {{ t('community.actions.requestFeature') }}
            </LhButton>
          </div>
          <p v-if="boardErrorKey" class="cm-note cm-note--error">{{ messageText(boardErrorKey) }}</p>
        </div>
      </section>

      <section class="lp-section cm-band">
        <div class="lh-page">
          <div class="cm-pulse" aria-label="Board status">
            <div class="cm-pulse__item">
              <strong>{{ listeningCount }}</strong>
              <span>{{ t('community.statuses.listening') }}</span>
            </div>
            <div class="cm-pulse__item">
              <strong>{{ plannedCount }}</strong>
              <span>{{ t('community.statuses.planned') }}</span>
            </div>
            <div class="cm-pulse__item">
              <strong>{{ shippedCount }}</strong>
              <span>{{ t('community.statuses.shipped') }}</span>
            </div>
            <div class="cm-pulse__item">
              <strong>{{ threads.length }}</strong>
              <span>{{ t('community.metrics.openQuestions') }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="lp-section cm-band">
        <div class="lh-page">
          <div class="cm-composers">
            <article id="ask-a-question" class="cm-panel">
              <p class="cm-kicker">{{ t('community.ask.kicker') }}</p>
              <h2 class="cm-panel__title">{{ t('community.ask.title') }}</h2>
              <p v-if="questionMessageKey" class="cm-note">{{ messageText(questionMessageKey) }}</p>
              <form class="cm-form" @submit.prevent="submitQuestion">
                <div class="cm-form__row">
                  <label class="lh-field">
                    <span>{{ t('community.labels.yourName') }}</span>
                    <input v-model.trim="questionForm.name" type="text" :placeholder="t('community.placeholders.nameExample1')" />
                  </label>
                  <label class="lh-field">
                    <span>{{ t('community.labels.yourRole') }}</span>
                    <select v-model="questionForm.role">
                      <option v-for="role in roleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
                    </select>
                  </label>
                </div>
                <label class="lh-field">
                  <span>{{ t('community.labels.questionTitle') }}</span>
                  <input v-model.trim="questionForm.title" type="text" :placeholder="t('community.placeholders.questionTitle')" />
                </label>
                <label class="lh-field">
                  <span>{{ t('community.labels.details') }}</span>
                  <textarea v-model.trim="questionForm.body" rows="4" :placeholder="t('community.placeholders.questionBody')" />
                </label>
                <LhButton type="submit" variant="primary" size="lg" with-well :disabled="questionSubmitting">
                  {{ questionSubmitting ? t('community.actions.postingQuestion') : t('community.actions.postQuestion') }}
                </LhButton>
              </form>
            </article>

            <article id="request-a-feature" class="cm-panel">
              <p class="cm-kicker">{{ t('community.feature.kicker') }}</p>
              <h2 class="cm-panel__title">{{ t('community.feature.title') }}</h2>
              <p v-if="featureMessageKey" class="cm-note">{{ messageText(featureMessageKey) }}</p>
              <form class="cm-form" @submit.prevent="submitFeature">
                <div class="cm-form__row">
                  <label class="lh-field">
                    <span>{{ t('community.labels.yourName') }}</span>
                    <input v-model.trim="featureForm.name" type="text" :placeholder="t('community.placeholders.nameExample2')" />
                  </label>
                  <label class="lh-field">
                    <span>{{ t('community.labels.area') }}</span>
                    <select v-model="featureForm.area">
                      <option v-for="area in areaOptions" :key="area.value" :value="area.value">{{ area.label }}</option>
                    </select>
                  </label>
                </div>
                <label class="lh-field">
                  <span>{{ t('community.labels.featureTitle') }}</span>
                  <input v-model.trim="featureForm.title" type="text" :placeholder="t('community.placeholders.featureTitle')" />
                </label>
                <label class="lh-field">
                  <span>{{ t('community.labels.whyItMatters') }}</span>
                  <textarea v-model.trim="featureForm.why" rows="4" :placeholder="t('community.placeholders.featureWhy')" />
                </label>
                <LhButton type="submit" variant="secondary" size="lg" with-well :disabled="featureSubmitting">
                  {{ featureSubmitting ? t('community.actions.savingFeature') : t('community.actions.addFeature') }}
                </LhButton>
              </form>
            </article>
          </div>
        </div>
      </section>

      <section class="lp-section cm-band">
        <div class="lh-page">
          <header class="cm-section-head">
            <p class="cm-kicker">{{ t('community.sections.repliesKicker') }}</p>
            <h2 class="cm-section-title">{{ t('community.sections.repliesTitle') }}</h2>
          </header>

          <div v-if="isLoadingBoard" class="cm-empty">{{ t('community.empty.threadsLoading') }}</div>
          <div v-else-if="threads.length === 0" class="cm-empty">{{ t('community.empty.threads') }}</div>
          <div v-else class="cm-threads">
            <article v-for="thread in threads" :key="thread.id" class="cm-panel cm-thread">
              <div class="cm-thread__meta">
                <span class="cm-tag">{{ displayRole(thread.author_role) }}</span>
                <span class="cm-author">{{ thread.author_name }}</span>
                <span class="cm-age">{{ formatRelativeTime(thread.created_at) }}</span>
              </div>
              <h3 class="cm-thread__title">{{ thread.title }}</h3>
              <p class="cm-thread__body">{{ thread.body }}</p>

              <div v-if="thread.replies.length" class="cm-replies">
                <div v-for="reply in thread.replies" :key="reply.id" class="cm-reply">
                  <div class="cm-reply__avatar" :class="{ 'is-team': reply.is_team_reply }" aria-hidden="true">
                    {{ replyInitial(reply.author_name) }}
                  </div>
                  <div>
                    <div class="cm-reply__meta">
                      <strong>{{ reply.author_name }}</strong>
                      <span>{{ displayRole(reply.author_role) }}</span>
                      <span v-if="reply.is_team_reply" class="cm-tag cm-tag--gold">{{ t('community.replies.teamBadge') }}</span>
                    </div>
                    <p>{{ reply.body }}</p>
                  </div>
                </div>
              </div>

              <form class="cm-form cm-form--reply" @submit.prevent="submitReply(thread.id)">
                <div class="cm-form__row">
                  <label class="lh-field">
                    <span>{{ t('community.labels.yourName') }}</span>
                    <input
                      v-model.trim="replyDrafts[thread.id].name"
                      type="text"
                      :placeholder="t('community.placeholders.replyName')"
                    />
                  </label>
                  <label class="lh-field">
                    <span>{{ t('community.labels.yourRole') }}</span>
                    <select v-model="replyDrafts[thread.id].role">
                      <option v-for="role in roleOptions" :key="role.value" :value="role.value">{{ role.label }}</option>
                    </select>
                  </label>
                </div>
                <label class="lh-field">
                  <span class="visually-hidden">{{ t('community.actions.reply') }}</span>
                  <textarea
                    v-model.trim="replyDrafts[thread.id].body"
                    rows="2"
                    :placeholder="t('community.placeholders.replyBody')"
                  />
                </label>
                <p v-if="replyMessageKeys[thread.id]" class="cm-note">{{ messageText(replyMessageKeys[thread.id]) }}</p>
                <LhButton type="submit" variant="primary" size="md" with-well :disabled="replySubmitting[thread.id]">
                  {{ replySubmitting[thread.id] ? t('community.actions.postingReply') : t('community.actions.reply') }}
                </LhButton>
              </form>
            </article>
          </div>
        </div>
      </section>

      <section id="feature-board" class="lp-section cm-band">
        <div class="lh-page">
          <header class="cm-section-head">
            <p class="cm-kicker">{{ t('community.sections.featureBoardKicker') }}</p>
            <h2 class="cm-section-title">{{ t('community.sections.featureBoardTitle') }}</h2>
          </header>

          <div v-if="isLoadingBoard" class="cm-empty">{{ t('community.empty.featuresLoading') }}</div>
          <div v-else-if="featureIdeas.length === 0" class="cm-empty">{{ t('community.empty.features') }}</div>
          <div v-else class="cm-features">
            <article v-for="idea in featureIdeas" :key="idea.id" class="cm-panel cm-feature">
              <div class="cm-feature__head">
                <span class="cm-tag" :class="statusClass(idea.status)">{{ statusLabel(idea.status) }}</span>
                <span class="cm-age">{{ displayArea(idea.area) }}</span>
              </div>
              <h3 class="cm-thread__title">{{ idea.title }}</h3>
              <p class="cm-thread__body">{{ idea.summary }}</p>
              <div class="cm-feature__foot">
                <LhButton
                  type="button"
                  variant="ghost"
                  :disabled="hasSupportedIdea(idea.id) || voteSubmitting[idea.id]"
                  @click="voteForIdea(idea.id)"
                >
                  {{ supportLabel(idea.id) }}
                </LhButton>
                <strong>{{ idea.votes }} {{ t('community.replies.supportersLabel') }}</strong>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import MarketingLayout from './MarketingLayout.vue'
import LhButton from './partials/house/LhButton.vue'
import {
  createCommunityFeatureRequest,
  createCommunityReply,
  createCommunityThread,
  listCommunityFeatureRequests,
  listCommunityThreads,
  supportCommunityFeatureRequest,
} from '@/api/community'
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

const ROLE_VALUES = ['Buyer', 'Merchant', 'Driver', 'Partner', 'Community member'] as const
const AREA_VALUES = ['Buyer app', 'Merchant tools', 'Driver app', 'Logistics', 'Payments', 'Community'] as const

const roleOptions = computed(() =>
  ROLE_VALUES.map((value) => ({
    value,
    label: displayRole(value),
  })),
)
const areaOptions = computed(() =>
  AREA_VALUES.map((value) => ({
    value,
    label: displayArea(value),
  })),
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

const listeningCount = computed(() =>
  featureIdeas.value.filter((idea) => normalizeFeatureStatus(idea.status) === 'listening').length,
)
const plannedCount = computed(() =>
  featureIdeas.value.filter((idea) => normalizeFeatureStatus(idea.status) === 'planned').length,
)
const shippedCount = computed(() =>
  featureIdeas.value.filter((idea) => normalizeFeatureStatus(idea.status) === 'shipped').length,
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
      }),
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
  if (normalized === 'planned') return 'cm-tag--planned'
  if (normalized === 'shipped') return 'cm-tag--shipped'
  return 'cm-tag--listening'
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
.cm-page {
  color: var(--lh-text, #1a1a1a);
}

.cm-hero {
  padding-block: clamp(2.5rem, 6vw, 4rem) !important;
}

.cm-hero__inner {
  max-width: 40rem;
}

.cm-kicker {
  margin: 0 0 0.5rem;
  font-family: var(--lh-font-display, 'Poppins', sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lh-eyebrow, #3b1a5a);
}

.cm-title {
  margin: 0;
  font-family: var(--lh-font-display, 'Poppins', sans-serif);
  font-size: clamp(1.75rem, 3.2vw, 2.618rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--lh-text, #1a1a1a);
  max-width: 12ch;
}

.cm-title span {
  display: block;
  color: var(--lh-eyebrow, #3b1a5a);
}

.cm-lead {
  margin: 0.75rem 0 0;
  max-width: 36ch;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.cm-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.35rem;
}

.cm-note {
  margin: 0.85rem 0 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.cm-note--error {
  color: #b42318;
}

.cm-band {
  padding-block: clamp(1.75rem, 4vw, 3rem) !important;
}

.cm-pulse {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .cm-pulse {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.cm-pulse__item {
  display: grid;
  gap: 0.2rem;
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  border: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  background: var(--lh-surface, #fff);
}

.cm-pulse__item strong {
  font-family: var(--lh-font-display, 'Poppins', sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--lh-text, #1a1a1a);
}

.cm-pulse__item span {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.cm-composers,
.cm-features {
  display: grid;
  gap: 1rem;
}

@media (min-width: 900px) {
  .cm-composers,
  .cm-features {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.cm-panel {
  padding: 1.25rem 1.35rem;
  border-radius: 1.25rem;
  border: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  background: var(--lh-surface, #fff);
}

.cm-panel__title,
.cm-section-title,
.cm-thread__title {
  margin: 0;
  font-family: var(--lh-font-display, 'Poppins', sans-serif);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--lh-text, #1a1a1a);
}

.cm-panel__title {
  font-size: clamp(1.15rem, 1.6vw, 1.618rem);
  margin-bottom: 0.35rem;
}

.cm-section-head {
  margin-bottom: 1.25rem;
}

.cm-section-title {
  font-size: clamp(1.25rem, 2vw, 1.618rem);
  max-width: 14ch;
}

.cm-form {
  display: grid;
  gap: 0.9rem;
  margin-top: 1rem;
}

.cm-form__row {
  display: grid;
  gap: 0.9rem;
}

@media (min-width: 640px) {
  .cm-form__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.cm-form :deep(.lh-field textarea) {
  min-height: 6rem;
  resize: vertical;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--lh-border-strong, rgba(26, 26, 26, 0.14));
  border-radius: var(--lh-radius-sm, 0.75rem);
  background: var(--lh-surface, #fff);
  color: var(--lh-text, #1a1a1a);
  font: inherit;
}

.cm-form :deep(.lh-field textarea:focus-visible) {
  outline: 2px solid var(--lh-focus, #5c308f);
  outline-offset: 2px;
}

.cm-threads {
  display: grid;
  gap: 1rem;
}

.cm-thread__meta,
.cm-feature__head,
.cm-feature__foot,
.cm-reply__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.cm-thread__meta {
  margin-bottom: 0.55rem;
}

.cm-thread__title {
  font-size: clamp(1rem, 1.1vw, 1.272rem);
  margin-bottom: 0.35rem;
}

.cm-thread__body {
  margin: 0;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
  line-height: 1.5;
}

.cm-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: color-mix(in srgb, var(--lh-text, #1a1a1a) 8%, transparent);
  color: var(--lh-text, #1a1a1a);
}

.cm-tag--listening {
  background: color-mix(in srgb, var(--lh-accent, #f7a829) 22%, transparent);
  color: #92400e;
}

.cm-tag--planned {
  background: color-mix(in srgb, var(--lh-text, #1a1a1a) 10%, transparent);
  color: var(--lh-text, #1a1a1a);
}

.cm-tag--shipped {
  background: color-mix(in srgb, #0d9488 18%, transparent);
  color: #0f766e;
}

.cm-tag--gold {
  background: color-mix(in srgb, var(--lh-accent, #f7a829) 22%, transparent);
  color: #92400e;
}

.cm-author {
  font-weight: 700;
}

.cm-age {
  font-size: 0.85rem;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.cm-replies {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}

.cm-reply {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  padding: 0.85rem;
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--lh-text, #1a1a1a) 4%, transparent);
}

.cm-reply__avatar {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  background: color-mix(in srgb, var(--lh-text, #1a1a1a) 10%, transparent);
  color: var(--lh-text, #1a1a1a);
}

.cm-reply__avatar.is-team {
  background: var(--lh-inverse, #3b1a5a);
  color: #fff;
}

.cm-reply p {
  margin: 0.2rem 0 0;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.cm-form--reply {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
}

.cm-feature__foot {
  margin-top: 1rem;
  justify-content: space-between;
}

.cm-empty {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px dashed var(--lh-border-strong, rgba(26, 26, 26, 0.14));
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
  text-align: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
