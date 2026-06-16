<template>
  <MarketingLayout>
    <section class="lp-section careers-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="careers-hero-grid">
          <div>
            <p class="careers-eyebrow">{{ t('careers.eyebrow') }}</p>
            <h1 class="careers-title">
              {{ t('careers.heroTitle') }}
              <span>{{ t('careers.heroAccent') }}</span>
            </h1>
            <p class="careers-lead">{{ t('careers.heroLead') }}</p>
          </div>
          <article class="careers-hero-card">
            <p class="mb-1 fw-semibold">{{ t('careers.heroCardTitle') }}</p>
            <p class="small text-muted mb-0">{{ t('careers.heroCardCopy') }}</p>
          </article>
        </div>
      </b-container>
    </section>

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
          <p v-if="loading" class="careers-note mb-0">{{ t('careers.loading') }}</p>
          <p v-else-if="error" class="careers-note careers-note--error mb-0">{{ error }}</p>
          <p v-else class="careers-note mb-0">{{ t('careers.openRoles', { count: postings.length }) }}</p>
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

        <p v-if="!loading && !error && postings.length === 0" class="careers-empty">{{ t('careers.empty') }}</p>
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
              <h3>{{ t('careers.requirements') }}</h3>
              <div v-html="formatBody(selectedPosting.requirements)" />
            </div>
          </div>

          <aside class="careers-apply">
            <h3>{{ t('careers.applyTitle') }}</h3>
            <p class="small text-muted">{{ t('careers.applyCopy') }}</p>
            <b-form @submit.prevent="submitApplication">
              <b-form-group :label="t('careers.form.name')">
                <b-form-input v-model="form.name" required />
              </b-form-group>
              <b-form-group :label="t('careers.form.email')">
                <b-form-input v-model="form.email" type="email" required />
              </b-form-group>
              <b-form-group :label="t('careers.form.phone')">
                <b-form-input v-model="form.phone" type="tel" />
              </b-form-group>
              <b-form-group :label="t('careers.form.coverLetter')">
                <b-form-textarea v-model="form.coverLetter" rows="4" />
              </b-form-group>
              <b-form-group :label="t('careers.form.resume')">
                <b-form-file v-model="resumeFile" accept=".pdf,.doc,.docx,image/*" required />
              </b-form-group>
              <p v-if="applyError" class="small text-danger">{{ applyError }}</p>
              <p v-if="applySuccess" class="small text-success">{{ applySuccess }}</p>
              <b-button type="submit" variant="primary" class="w-100" :disabled="applying">
                {{ applying ? t('careers.form.submitting') : t('careers.form.submit') }}
              </b-button>
            </b-form>
          </aside>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { careersApi, type CareerPosting } from '@/api/careers'
import { formatApiError } from '@/utils/formatApiError'

const { t } = useI18n()

const loading = ref(false)
const applying = ref(false)
const error = ref('')
const applyError = ref('')
const applySuccess = ref('')
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
  { id: 'all', label: t('careers.types.all') },
  { id: 'full-time', label: t('careers.types.fullTime') },
  { id: 'part-time', label: t('careers.types.partTime') },
  { id: 'contract', label: t('careers.types.contract') },
  { id: 'internship', label: t('careers.types.internship') },
])

function formatEmploymentType(value: string) {
  const map: Record<string, string> = {
    'full-time': t('careers.types.fullTime'),
    'part-time': t('careers.types.partTime'),
    contract: t('careers.types.contract'),
    internship: t('careers.types.internship'),
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
    error.value = formatApiError(e, t('careers.loadFailed'))
  } finally {
    loading.value = false
  }
}

function selectPosting(posting: CareerPosting) {
  selectedPosting.value = posting
  applyError.value = ''
  applySuccess.value = ''
}

async function submitApplication() {
  if (!selectedPosting.value || !resumeFile.value) return
  applying.value = true
  applyError.value = ''
  applySuccess.value = ''
  try {
    const ref = selectedPosting.value.slug || selectedPosting.value.uuid || String(selectedPosting.value.id)
    const body = new FormData()
    body.append('name', form.value.name.trim())
    body.append('email', form.value.email.trim())
    if (form.value.phone.trim()) body.append('phone', form.value.phone.trim())
    if (form.value.coverLetter.trim()) body.append('cover_letter', form.value.coverLetter.trim())
    body.append('resume', resumeFile.value)
    const { data } = await careersApi.apply(ref, body)
    applySuccess.value = data.message || t('careers.applySuccess')
    form.value = { name: '', email: '', phone: '', coverLetter: '' }
    resumeFile.value = null
  } catch (e) {
    applyError.value = formatApiError(e, t('careers.applyFailed'))
  } finally {
    applying.value = false
  }
}

onMounted(loadPostings)
</script>

<style scoped>
.careers-hero {
  background:
    radial-gradient(circle at 10% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 90% 8%, rgba(247, 168, 41, 0.12), transparent 28%);
}
.careers-hero-grid { display: grid; gap: 1.5rem; align-items: center; }
@media (min-width: 992px) { .careers-hero-grid { grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.7fr); } }
.careers-eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-weight: 800; font-size: 0.78rem; color: #5c308f; }
.careers-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.05; }
.careers-title span { color: #5c308f; }
.careers-lead { color: rgba(35, 20, 46, 0.72); max-width: 42rem; }
.careers-hero-card { border-radius: 1.25rem; padding: 1.25rem; background: rgba(255,255,255,0.92); box-shadow: 0 18px 40px rgba(35, 20, 46, 0.12); }
.careers-toolbar { display: grid; gap: 1rem; margin-bottom: 1.25rem; }
.careers-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.careers-filter { border: 1px solid rgba(92, 48, 143, 0.18); background: #fff; border-radius: 999px; padding: 0.45rem 0.9rem; font-size: 0.88rem; font-weight: 600; }
.careers-filter--active { background: #5c308f; color: #fff; border-color: #5c308f; }
.careers-note { font-size: 0.92rem; color: rgba(35, 20, 46, 0.65); }
.careers-note--error { color: #b42318; }
.careers-grid { display: grid; gap: 0.75rem; }
@media (min-width: 768px) { .careers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.careers-card { border: 1px solid rgba(92, 48, 143, 0.12); border-radius: 1rem; padding: 1rem; background: #fff; cursor: pointer; }
.careers-card--active { border-color: #5c308f; box-shadow: 0 0 0 2px rgba(92, 48, 143, 0.12); }
.careers-card-top { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.careers-tag { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #5c308f; background: rgba(92, 48, 143, 0.08); border-radius: 999px; padding: 0.2rem 0.55rem; }
.careers-tag--soft { color: rgba(35, 20, 46, 0.62); background: rgba(35, 20, 46, 0.06); }
.careers-card h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.35rem; }
.careers-card-meta { font-size: 0.85rem; color: rgba(35, 20, 46, 0.62); margin: 0; display: inline-flex; align-items: center; gap: 0.35rem; }
.careers-empty { text-align: center; color: rgba(35, 20, 46, 0.6); padding: 2rem 0; }
.careers-detail-grid { display: grid; gap: 1.5rem; align-items: start; }
@media (min-width: 992px) { .careers-detail-grid { grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr); } }
.careers-detail-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; margin-bottom: 0.35rem; }
.careers-detail-meta { color: rgba(35, 20, 46, 0.62); margin-bottom: 1rem; }
.careers-detail-body :deep(p), .careers-requirements :deep(p) { margin-bottom: 0.65rem; color: rgba(35, 20, 46, 0.78); }
.careers-requirements { margin-top: 1.25rem; }
.careers-requirements h3 { font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
.careers-apply { border: 1px solid rgba(92, 48, 143, 0.14); border-radius: 1rem; padding: 1rem; background: #fff; }
.careers-apply h3 { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.35rem; }
</style>
