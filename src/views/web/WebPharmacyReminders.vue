<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" @click="router.back()">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 class="buyer-page-head__title">{{ t('buyerXp.pharmacyReminders.title') }}</h1>
      </div>
    </header>

    <section class="buyer-detail-card">
      <BuyerSectionHeader :title="t('buyerXp.pharmacyReminders.addSection')" />
      <div class="buyer-ride-field">
        <label>{{ t('buyerXp.pharmacyReminders.medicineName') }}</label>
        <input v-model="form.medicine_name" type="text" :placeholder="t('buyerXp.pharmacyReminders.medicinePlaceholder')" />
      </div>
      <div class="buyer-ride-field mt-2">
        <label>{{ t('buyerXp.pharmacyReminders.dosage') }}</label>
        <input v-model="form.dosage" type="text" :placeholder="t('buyerXp.pharmacyReminders.dosagePlaceholder')" />
      </div>
      <button type="button" class="buyer-ride-bar__btn mt-2" style="position:static" :disabled="saving" @click="create">
        {{ saving ? t('buyerXp.common.saving') : t('buyerXp.pharmacyReminders.addReminder') }}
      </button>
    </section>

    <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

    <section v-else class="buyer-hub-list">
      <article v-for="r in reminders" :key="String(r.id)" class="buyer-detail-card">
        <div class="buyer-detail-row"><strong>{{ r.medicine_name }}</strong><span>{{ r.dosage }}</span></div>
        <div class="buyer-detail-row"><span>{{ t('buyerXp.pharmacyReminders.next') }}</span><span>{{ formatDate(r.next_reminder_at) }}</span></div>
        <div class="d-flex gap-2 mt-2">
          <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="markTaken(r)">{{ t('buyerXp.pharmacyReminders.taken') }}</button>
          <button type="button" class="buyer-venue__chip" @click="remove(r)">{{ t('buyerXp.pharmacyReminders.delete') }}</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { pharmacyApi, type MedicineReminder } from '@/api/pharmacy'
import { formatApiError } from '@/utils/formatApiError'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'

const router = useRouter()
const { t } = useI18n()
const reminders = ref<MedicineReminder[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const form = reactive({ medicine_name: '', dosage: '' })

function normalizeList(data: unknown): MedicineReminder[] {
  if (Array.isArray(data)) return data
  return ((data as { results?: MedicineReminder[] })?.results ?? []) as MedicineReminder[]
}

function formatDate(v?: string) {
  if (!v) return '—'
  return new Date(v).toLocaleString()
}

async function load() {
  loading.value = true
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
  try {
    await pharmacyApi.createReminder({ medicine_name: form.medicine_name.trim(), dosage: form.dosage })
    form.medicine_name = ''
    form.dosage = ''
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
