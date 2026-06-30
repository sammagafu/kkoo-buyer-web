<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 class="buyer-page-head__title">{{ t('buyerXp.pharmacyReminders.title') }}</h1>
      </div>
      <p class="buyer-page-head__meta">{{ t('buyerXp.pharmacyReminders.subtitle') }}</p>
    </header>

    <section class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.pharmacyReminders.addSection')" :subtitle="t('buyerXp.pharmacyReminders.addSectionSub')" />
      <div class="buyer-ride-field">
        <label>{{ t('buyerXp.pharmacyReminders.medicineName') }}</label>
        <input v-model="form.medicine_name" type="text" :placeholder="t('buyerXp.pharmacyReminders.medicinePlaceholder')" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.pharmacyReminders.dosage') }}</label>
        <input v-model="form.dosage" type="text" :placeholder="t('buyerXp.pharmacyReminders.dosagePlaceholder')" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.pharmacyReminders.frequency') }}</label>
        <select v-model="form.frequency">
          <option value="daily">{{ t('buyerXp.pharmacyReminders.freqDaily') }}</option>
          <option value="twice_daily">{{ t('buyerXp.pharmacyReminders.freqTwice') }}</option>
          <option value="every_8h">{{ t('buyerXp.pharmacyReminders.freq8h') }}</option>
          <option value="every_12h">{{ t('buyerXp.pharmacyReminders.freq12h') }}</option>
          <option value="weekly">{{ t('buyerXp.pharmacyReminders.freqWeekly') }}</option>
        </select>
      </div>
      <div v-if="showTimePickers" class="buyer-stat-grid buyer-stat-grid--compact mt-2">
        <div class="buyer-ride-field">
          <label>{{ t('buyerXp.pharmacyReminders.morning') }}</label>
          <input v-model="form.morning" type="time" />
        </div>
        <div v-if="form.frequency === 'daily' || form.frequency === 'twice_daily'" class="buyer-ride-field">
          <label>{{ t('buyerXp.pharmacyReminders.evening') }}</label>
          <input v-model="form.evening" type="time" />
        </div>
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.pharmacyReminders.notes') }}</label>
        <textarea v-model="form.notes" rows="2" :placeholder="t('buyerXp.pharmacyReminders.notesPlaceholder')" />
      </div>
      <button type="button" class="buyer-ride-bar__btn mt-2" style="position:static" :disabled="saving" @click="create">
        {{ saving ? t('buyerXp.common.saving') : t('buyerXp.pharmacyReminders.addReminder') }}
      </button>
    </section>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else class="buyer-hub-list">
      <BuyerEmptyState
        v-if="!reminders.length"
        icon="solar:alarm-bold"
        :title="t('buyerXp.pharmacyReminders.emptyTitle')"
        :message="t('buyerXp.pharmacyReminders.emptyMessage')"
      />
      <article v-for="r in reminders" :key="String(r.id)" class="buyer-detail-card">
        <div class="buyer-detail-row">
          <div>
            <strong>{{ r.medicine_name }}</strong>
            <p v-if="assignedLabel(r)" class="pharmacy-reminder__assigned">{{ assignedLabel(r) }}</p>
          </div>
          <span>{{ r.dosage || '—' }}</span>
        </div>
        <div class="buyer-detail-row">
          <span>{{ t('buyerXp.pharmacyReminders.schedule') }}</span>
          <span>{{ formatSchedule(r) }}</span>
        </div>
        <div class="buyer-detail-row">
          <span>{{ t('buyerXp.pharmacyReminders.next') }}</span>
          <span>{{ formatDate(r.next_reminder_at) }}</span>
        </div>
        <div class="buyer-btn-row mt-2">
          <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="markTaken(r)">
            {{ t('buyerXp.pharmacyReminders.taken') }}
          </button>
          <button type="button" class="buyer-venue__chip" @click="remove(r)">{{ t('buyerXp.pharmacyReminders.delete') }}</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { pharmacyApi, type MedicineReminder } from '@/api/pharmacy'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

const router = useRouter()
const { t } = useI18n()
const reminders = ref<MedicineReminder[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const form = reactive({
  medicine_name: '',
  dosage: '1 tablet',
  frequency: 'daily',
  morning: '08:00',
  evening: '20:00',
  notes: '',
})

const showTimePickers = computed(
  () => form.frequency !== 'every_8h' && form.frequency !== 'every_12h',
)

function reminderTimes() {
  if (!showTimePickers.value) return [form.morning]
  if (form.frequency === 'twice_daily' || form.frequency === 'daily') {
    return [form.morning, form.evening]
  }
  return [form.morning]
}

function normalizeList(data: unknown): MedicineReminder[] {
  if (Array.isArray(data)) return data
  return ((data as { results?: MedicineReminder[] })?.results ?? []) as MedicineReminder[]
}

function parseTimes(r: MedicineReminder): string[] {
  const raw = r.reminder_times
  if (Array.isArray(raw)) return raw.map(String)
  if (typeof raw === 'string' && raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as string[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function formatDate(v?: string) {
  if (!v) return '—'
  return new Date(v).toLocaleString()
}

function formatSchedule(r: MedicineReminder) {
  const times = parseTimes(r).join(', ')
  const freq = r.frequency || 'daily'
  return times ? `${freq} · ${times}` : freq
}

function assignedLabel(r: MedicineReminder) {
  if (r.assignment_source === 'doctor' && r.prescriber_name) {
    return t('buyerXp.pharmacyReminders.assignedByDoctor', { name: r.prescriber_name })
  }
  if (r.assignment_source === 'pharmacist') {
    return t('buyerXp.pharmacyReminders.assignedByPharmacy')
  }
  return ''
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await pharmacyApi.listReminders()
    reminders.value = normalizeList(data)
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.pharmacyReminders.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function create() {
  if (!form.medicine_name.trim()) return
  saving.value = true
  error.value = ''
  try {
    await pharmacyApi.createReminder({
      medicine_name: form.medicine_name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency,
      reminder_times: reminderTimes(),
      notes: form.notes.trim() || undefined,
    })
    form.medicine_name = ''
    form.dosage = '1 tablet'
    form.notes = ''
    await load()
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.pharmacyReminders.couldNotCreate'))
  } finally {
    saving.value = false
  }
}

async function markTaken(r: MedicineReminder) {
  if (!r.id) return
  await pharmacyApi.markReminderTaken(r.id)
  await load()
}

async function remove(r: MedicineReminder) {
  if (!r.id) return
  await pharmacyApi.deleteReminder(r.id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.pharmacy-reminder__assigned {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: var(--buyer-accent, #0d9488);
}

.buyer-ride-field select,
.buyer-ride-field input,
.buyer-ride-field textarea {
  width: 100%;
  border-radius: 0.75rem;
  padding: 0.65rem;
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-input-bg);
  color: var(--buyer-ink);
}
</style>
