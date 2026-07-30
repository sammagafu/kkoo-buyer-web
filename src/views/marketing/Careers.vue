<template>
  <MarketingLayout>
    <section class="lp-section careers-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <p class="careers-eyebrow">{{ tx('eyebrow') }}</p>
        <h1 class="careers-title">
          {{ tx('heroTitle') }}
          <span>{{ tx('heroAccent') }}</span>
        </h1>
        <p class="careers-lead">{{ tx('heroLead') }}</p>
      </b-container>
    </section>

    <section v-if="submitted" class="lp-section careers-success-section">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="careers-success" role="status" aria-live="polite">
          <div class="careers-success__mark" aria-hidden="true">
            <Icon icon="solar:check-circle-bold" width="40" height="40" />
          </div>
          <p class="careers-success__eyebrow">{{ tx('successEyebrow') }}</p>
          <h2 class="careers-success__title">{{ tx('successTitle') }}</h2>
          <p class="careers-success__copy">{{ tx('successCopy') }}</p>
          <p v-if="submittedRole" class="careers-success__role">
            {{ tx('successRole', { role: submittedRole }) }}
          </p>
          <div class="careers-success__actions">
            <b-button variant="primary" @click="browseMore">
              {{ tx('successBrowse') }}
            </b-button>
            <b-button variant="outline-secondary" :to="buyerRoutes.marketplace">
              {{ tx('successHome') }}
            </b-button>
          </div>
        </div>
      </b-container>
    </section>

    <template v-else>
      <section class="lp-section careers-surface">
        <b-container class="px-3 px-sm-4 px-lg-4">
          <div class="careers-toolbar">
            <div class="careers-filters">
              <button
                v-for="type in employmentTypes"
                :key="type.id"
                type="button"
                class="careers-filter"
                :class="{ 'careers-filter--active': activeType === type.id }"
                @click="activeType = type.id; loadPostings()"
              >
                {{ type.label }}
              </button>
            </div>
            <p v-if="loading" class="careers-note mb-0">{{ tx('loading') }}</p>
            <p v-else-if="error" class="careers-note careers-note--error mb-0">{{ error }}</p>
            <p v-else class="careers-note mb-0">{{ tx('openRoles', { count: postings.length }) }}</p>
          </div>

          <div class="careers-grid">
            <article
              v-for="posting in postings"
              :key="posting.uuid || posting.id"
              class="careers-card"
              :class="{ 'careers-card--active': selectedPosting?.id === posting.id }"
              @click="selectPosting(posting)"
            >
              <div class="careers-card-top">
                <span v-if="posting.department" class="careers-tag">{{ posting.department }}</span>
                <span v-if="posting.employment_type" class="careers-tag careers-tag--soft">{{ formatEmploymentType(posting.employment_type) }}</span>
              </div>
              <h3>{{ posting.title }}</h3>
              <p class="careers-card-meta">
                <span v-if="posting.location"><Icon icon="solar:map-point-bold" /> {{ posting.location }}</span>
              </p>
            </article>
          </div>

          <p v-if="!loading && !error && postings.length === 0" class="careers-empty">{{ tx('empty') }}</p>
        </b-container>
      </section>

      <section v-if="selectedPosting" class="lp-section careers-detail">
        <b-container class="px-3 px-sm-4 px-lg-4">
          <div class="careers-detail-grid">
            <div>
              <h2 class="careers-detail-title">{{ selectedPosting.title }}</h2>
              <p class="careers-detail-meta">
                <span v-if="selectedPosting.location">{{ selectedPosting.location }}</span>
                <span v-if="selectedPosting.employment_type"> · {{ formatEmploymentType(selectedPosting.employment_type) }}</span>
              </p>
              <div class="careers-detail-body" v-html="formatBody(selectedPosting.description)" />
              <div v-if="selectedPosting.requirements" class="careers-requirements">
                <h3>{{ tx('requirements') }}</h3>
                <div v-html="formatBody(selectedPosting.requirements)" />
              </div>
            </div>

            <aside class="careers-apply">
              <h3>{{ tx('applyTitle') }}</h3>
              <p class="careers-apply-copy">{{ tx('applyCopy') }}</p>
              <b-form class="lh-apply-form" @submit.prevent="submitApplication">
                <b-form-group :label="tx('form.name')">
                  <b-form-input v-model="form.name" required />
                </b-form-group>
                <b-form-group :label="tx('form.email')">
                  <b-form-input v-model="form.email" type="email" required />
                </b-form-group>
                <b-form-group :label="tx('form.phone')">
                  <b-form-input v-model="form.phone" type="tel" />
                </b-form-group>
                <b-form-group :label="tx('form.coverLetter')">
                  <b-form-textarea v-model="form.coverLetter" rows="4" />
                </b-form-group>
                <b-form-group :label="tx('form.resume')">
                  <b-form-file v-model="resumeFile" accept=".pdf,.doc,.docx,image/*" required />
                </b-form-group>
                <p v-if="applyError" class="small text-danger">{{ applyError }}</p>
                <b-button type="submit" variant="primary" class="w-100" :disabled="applying">
                  {{ applying ? tx('form.submitting') : tx('form.submit') }}
                </b-button>
              </b-form>
            </aside>
          </div>
        </b-container>
      </section>
    </template>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { careersApi, type CareerPosting } from '@/api/careers'
import { buyerRoutes } from '@/config/landing-links'
import { formatApiError } from '@/utils/formatApiError'

const { t } = useI18n()
const route = useRoute()

const copyNs = computed(() => (route.meta.careersSurface === 'hustle' ? 'hustle' : 'careers'))

function tx(key: string, params?: Record<string, unknown>) {
  return params ? t(`${copyNs.value}.${key}`, params) : t(`${copyNs.value}.${key}`)
}

const loading = ref(false)
const applying = ref(false)
const submitted = ref(false)
const submittedRole = ref('')
const error = ref('')
const applyError = ref('')
const postings = ref<CareerPosting[]>([])
const selectedPosting = ref<CareerPosting | null>(null)
const activeType = ref('all')
const resumeFile = ref<File | null>(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
  coverLetter: '',
})

const employmentTypes = computed(() => [
  { id: 'all', label: tx('types.all') },
  { id: 'full-time', label: tx('types.fullTime') },
  { id: 'part-time', label: tx('types.partTime') },
  { id: 'contract', label: tx('types.contract') },
  { id: 'internship', label: tx('types.internship') },
])

function formatEmploymentType(value: string) {
  const map: Record<string, string> = {
    'full-time': tx('types.fullTime'),
    'part-time': tx('types.partTime'),
    contract: tx('types.contract'),
    internship: tx('types.internship'),
  }
  return map[value] ?? value
}

function formatBody(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join('')
}

async function loadPostings() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await careersApi.list({
      employment_type: activeType.value === 'all' ? undefined : activeType.value,
    })
    postings.value = data.results ?? []
    if (!selectedPosting.value && postings.value.length) {
      selectedPosting.value = postings.value[0]
    }
  } catch (e) {
    error.value = formatApiError(e, tx('loadFailed'))
  } finally {
    loading.value = false
  }
}

function selectPosting(posting: CareerPosting) {
  selectedPosting.value = posting
  applyError.value = ''
}

function browseMore() {
  submitted.value = false
  submittedRole.value = ''
  applyError.value = ''
  nextTick(() => {
    document.querySelector('.careers-surface')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

async function submitApplication() {
  if (!selectedPosting.value || !resumeFile.value) return
  applying.value = true
  applyError.value = ''
  try {
    const ref = selectedPosting.value.slug || selectedPosting.value.uuid || String(selectedPosting.value.id)
    const body = new FormData()
    body.append('name', form.value.name.trim())
    body.append('email', form.value.email.trim())
    if (form.value.phone.trim()) body.append('phone', form.value.phone.trim())
    if (form.value.coverLetter.trim()) body.append('cover_letter', form.value.coverLetter.trim())
    body.append('resume', resumeFile.value)
    await careersApi.apply(ref, body)
    submittedRole.value = selectedPosting.value.title
    form.value = { name: '', email: '', phone: '', coverLetter: '' }
    resumeFile.value = null
    submitted.value = true
    await nextTick()
    document.querySelector('.careers-success-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch (e) {
    applyError.value = formatApiError(e, tx('applyFailed'))
  } finally {
    applying.value = false
  }
}

onMounted(loadPostings)
</script>

<style scoped>
.careers-hero {
  padding-block: clamp(2.5rem, 6vw, 4rem);
}
.careers-eyebrow { margin: 0 0 0.5rem; }
.careers-title { margin: 0; }
.careers-lead { margin: 0.75rem 0 0; }
.careers-toolbar { display: grid; gap: 1rem; margin-bottom: 1.25rem; }
.careers-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.careers-filter {
  border: 1px solid var(--lh-border-strong, rgba(26, 26, 26, 0.14));
  background: var(--lh-surface, #fff);
  color: var(--lh-text, #1a1a1a);
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  font-weight: 600;
}
.careers-filter--active {
  background: var(--lh-text, #1a1a1a);
  color: #fff;
  border-color: var(--lh-text, #1a1a1a);
}
.careers-note { font-size: 0.92rem; color: var(--lh-text-muted, rgba(26, 26, 26, 0.62)); }
.careers-note--error { color: #b42318; }
.careers-grid { display: grid; gap: 0.75rem; }
@media (min-width: 768px) { .careers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.careers-card {
  border: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  border-radius: 1rem;
  padding: 1rem;
  background: var(--lh-surface, #fff);
  cursor: pointer;
  color: var(--lh-text, #1a1a1a);
}
.careers-card--active {
  border-color: var(--lh-border-strong, rgba(26, 26, 26, 0.14));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--lh-text, #1a1a1a) 12%, transparent);
}
.careers-card-top { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.careers-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--lh-eyebrow, #3b1a5a);
  background: color-mix(in srgb, var(--lh-text, #1a1a1a) 6%, transparent);
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}
.careers-tag--soft { color: var(--lh-text-muted, rgba(26, 26, 26, 0.62)); }
.careers-card h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.35rem; }
.careers-card-meta { font-size: 0.85rem; color: var(--lh-text-muted, rgba(26, 26, 26, 0.62)); margin: 0; display: inline-flex; align-items: center; gap: 0.35rem; }
.careers-empty { text-align: center; color: var(--lh-text-muted, rgba(26, 26, 26, 0.62)); padding: 2rem 0; }
.careers-detail-grid { display: grid; gap: 1.5rem; align-items: start; }
@media (min-width: 992px) { .careers-detail-grid { grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr); } }
.careers-detail-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; margin-bottom: 0.35rem; color: var(--lh-text, #1a1a1a); }
.careers-detail-meta { color: var(--lh-text-muted, rgba(26, 26, 26, 0.62)); margin-bottom: 1rem; }
.careers-detail-body :deep(p), .careers-requirements :deep(p) { margin-bottom: 0.65rem; color: var(--lh-text-muted, rgba(26, 26, 26, 0.62)); }
.careers-requirements { margin-top: 1.25rem; }
.careers-requirements h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--lh-text, #1a1a1a); }
.careers-apply {
  border: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  border-radius: 1.25rem;
  padding: 1.25rem;
  background: var(--lh-surface, #fff);
  color: var(--lh-text, #1a1a1a);
}
.careers-apply h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.35rem; }
.careers-apply-copy {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
  line-height: 1.45;
}

.careers-success-section {
  padding-block: clamp(2rem, 5vw, 3.5rem);
}

.careers-success {
  max-width: 34rem;
  margin-inline: auto;
  text-align: center;
  display: grid;
  gap: 0.75rem;
  justify-items: center;
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border: 1px solid var(--lh-border, rgba(26, 26, 26, 0.08));
  border-radius: 1.35rem;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--lh-success, #10b981) 8%, transparent), transparent 42%),
    var(--lh-surface, #fff);
}

.careers-success__mark {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 999px;
  color: var(--lh-success, #10b981);
  background: color-mix(in srgb, var(--lh-success, #10b981) 14%, transparent);
}

.careers-success__eyebrow {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
}

.careers-success__title {
  margin: 0;
  font-size: clamp(1.45rem, 3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--lh-text, #1a1a1a);
}

.careers-success__copy {
  margin: 0;
  max-width: 28rem;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.62));
  line-height: 1.5;
}

.careers-success__role {
  margin: 0;
  padding: 0.55rem 0.9rem;
  border-radius: 0.75rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--lh-text, #1a1a1a);
  background: color-mix(in srgb, var(--lh-text, #1a1a1a) 5%, transparent);
}

.careers-success__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
  margin-top: 0.5rem;
}
</style>
