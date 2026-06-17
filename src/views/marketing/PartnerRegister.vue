<template>
  <MarketingLayout>
    <section class="lp-section partner-reg-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <div class="partner-reg-grid">
          <div>
            <p class="partner-reg-eyebrow">{{ t('partners.eyebrow') }}</p>
            <h1 class="partner-reg-title">
              {{ t('partners.heroTitle') }}
              <span>{{ t('partners.heroAccent') }}</span>
            </h1>
            <p class="partner-reg-lead">{{ t('partners.heroLead') }}</p>
            <ul class="partner-reg-bullets">
              <li v-for="item in bullets" :key="item">{{ item }}</li>
            </ul>
          </div>
          <article class="partner-reg-card">
            <h2 class="h5 fw-bold mb-3">{{ t('partners.formTitle') }}</h2>
            <b-form v-if="!submitted" @submit.prevent="submit">
              <b-form-group :label="t('partners.fields.company')">
                <b-form-input v-model="form.company_name" required />
              </b-form-group>
              <b-form-group :label="t('partners.fields.contact')">
                <b-form-input v-model="form.contact_name" required />
              </b-form-group>
              <b-form-group :label="t('partners.fields.email')">
                <b-form-input v-model="form.contact_email" type="email" required />
              </b-form-group>
              <b-form-group :label="t('partners.fields.phone')">
                <b-form-input v-model="form.contact_phone" type="tel" />
              </b-form-group>
              <b-form-group :label="t('partners.fields.website')">
                <b-form-input v-model="form.website" type="url" placeholder="https://" />
              </b-form-group>
              <b-form-group :label="t('partners.fields.country')">
                <b-form-input v-model="form.country" />
              </b-form-group>
              <b-form-group :label="t('partners.fields.useCase')">
                <b-form-textarea v-model="form.use_case" rows="3" />
              </b-form-group>
              <fieldset class="mb-3">
                <legend class="form-label fw-semibold small">{{ t('partners.fields.scopes') }}</legend>
                <div v-for="scope in availableScopes" :key="scope" class="form-check">
                  <input
                    :id="`scope-${scope}`"
                    v-model="form.requested_scopes"
                    class="form-check-input"
                    type="checkbox"
                    :value="scope"
                  />
                  <label class="form-check-label small" :for="`scope-${scope}`">{{ scope }}</label>
                </div>
              </fieldset>
              <p v-if="error" class="small text-danger">{{ error }}</p>
              <b-button type="submit" variant="primary" class="w-100" :disabled="submitting">
                {{ submitting ? t('partners.submitting') : t('partners.submit') }}
              </b-button>
            </b-form>
            <div v-else class="partner-reg-success">
              <p class="fw-semibold mb-2">{{ t('partners.successTitle') }}</p>
              <p class="small text-muted mb-2">{{ t('partners.successCopy') }}</p>
              <p class="small mb-0">
                <span class="text-muted">{{ t('partners.applicationId') }}</span>
                <code>{{ applicationUuid }}</code>
              </p>
            </div>
          </article>
        </div>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { partnersApi, type PartnerScope } from '@/api/partners'
import { formatApiError } from '@/utils/formatApiError'

const { t } = useI18n()

const bullets = computed(() => [
  t('partners.bullet1'),
  t('partners.bullet2'),
  t('partners.bullet3'),
])

const submitting = ref(false)
const submitted = ref(false)
const error = ref('')
const applicationUuid = ref('')
const availableScopes = ref<PartnerScope[]>([])

const form = ref({
  company_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  website: '',
  country: '',
  use_case: '',
  requested_scopes: [] as PartnerScope[],
})

async function loadScopes() {
  try {
    const { data } = await partnersApi.listScopes()
    availableScopes.value = data.results ?? []
    form.value.requested_scopes = availableScopes.value.filter((s) => s !== 'tickets:read')
  } catch {
    availableScopes.value = [
      'discover:read',
      'events:read',
      'hotels:read',
      'restaurants:read',
      'menu:read',
      'careers:read',
    ]
    form.value.requested_scopes = [...availableScopes.value]
  }
}

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const scopes = form.value.requested_scopes.length ? form.value.requested_scopes : undefined
    const { data } = await partnersApi.register({ ...form.value, requested_scopes: scopes })
    applicationUuid.value = data.application_uuid || ''
    submitted.value = true
  } catch (e) {
    error.value = formatApiError(e, t('partners.submitFailed'))
  } finally {
    submitting.value = false
  }
}

onMounted(loadScopes)
</script>

<style scoped>
.partner-reg-hero {
  background:
    radial-gradient(circle at 12% 18%, rgba(92, 48, 143, 0.12), transparent 32%),
    radial-gradient(circle at 88% 10%, rgba(247, 168, 41, 0.12), transparent 28%);
}
.partner-reg-grid { display: grid; gap: 1.5rem; align-items: start; }
@media (min-width: 992px) { .partner-reg-grid { grid-template-columns: minmax(0, 1fr) minmax(360px, 0.95fr); } }
.partner-reg-eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-weight: 800; font-size: 0.78rem; color: var(--kkoo-primary); }
.partner-reg-title { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; line-height: 1.05; color: var(--buyer-ink); }
.partner-reg-title span { color: var(--kkoo-primary); }
.partner-reg-lead { color: var(--buyer-muted); max-width: 40rem; }
.partner-reg-bullets { margin: 1rem 0 0; padding-left: 1.1rem; color: var(--buyer-muted); display: grid; gap: 0.35rem; }
.partner-reg-card { border-radius: 1.25rem; padding: 1.25rem; background: var(--buyer-surface); box-shadow: 0 18px 40px var(--buyer-shadow-color); border: 1px solid var(--buyer-border); color: var(--buyer-ink); }
.partner-reg-success { padding: 0.5rem 0; }
</style>
