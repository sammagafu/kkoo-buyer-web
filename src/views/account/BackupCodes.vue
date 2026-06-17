<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <button type="button" class="buyer-page-head__back" @click="router.push({ name: 'buyer.settings' })">
        <Icon icon="solar:arrow-left-linear" />
      </button>
      <h1 class="buyer-page-head__title">{{ t('buyerXp.settings.backupCodes') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.settings.backupCodesSub') }}</p>
    </header>

    <section class="buyer-detail-card">
      <p class="buyer-page-head__meta">
        One-time codes you can use at sign-in if you cannot receive SMS OTP. Each code works once. Store them in a
        password manager or print them—KKOO cannot show the same codes again from the server after you leave this page.
      </p>

      <p v-if="error" class="buyer-xp-toast buyer-xp-toast--err mt-3">{{ error }}</p>
      <p v-if="statusNote && !allCodes.length" class="buyer-page-head__meta mt-2">{{ statusNote }}</p>

      <p v-if="loading" class="shop-products__status mt-3">Loading…</p>
      <template v-else>
        <div class="backup-stats mt-3">
          <div class="buyer-stat-card">
            <span class="buyer-page-head__meta">Unused codes</span>
            <strong class="backup-stats__value">{{ unusedCount }}</strong>
          </div>
          <div class="buyer-stat-card">
            <span class="buyer-page-head__meta">Already used</span>
            <strong class="backup-stats__value">{{ consumedCount }}</strong>
          </div>
        </div>

        <div v-if="allCodes.length" class="mt-4">
          <BuyerSectionHeader title="All your codes" subtitle="Saved on this browser. Copy or print them—regenerating replaces unused codes on the server." />
          <div class="backup-codes-grid mt-2">
            <div v-for="(code, index) in allCodes" :key="`${index}-${code}`" class="backup-code-tile">
              <span class="backup-code-index">{{ index + 1 }}</span>
              <code class="backup-code-value">{{ code }}</code>
            </div>
          </div>
          <button type="button" class="buyer-venue__chip mt-3" @click="copyCodes">Copy all</button>
        </div>

        <p v-else-if="unusedCount > 0" class="buyer-xp-toast mt-3">
          You have {{ unusedCount }} unused code(s) on the server, but this browser does not have them saved. Regenerate
          to see all codes here (old unused codes will stop working).
        </p>

        <p v-if="newCodesBanner" class="buyer-xp-toast buyer-xp-toast--ok mt-3">{{ newCodesBanner }}</p>

        <div class="buyer-btn-row buyer-form-actions mt-4">
          <button
            type="button"
            class="buyer-venue__chip buyer-venue__chip--primary"
            :disabled="regenerating || !codesAvailable"
            @click="confirmRegenerate"
          >
            {{ unusedCount > 0 || allCodes.length ? 'Regenerate backup codes' : 'Generate backup codes' }}
          </button>
          <span v-if="!codesAvailable" class="buyer-page-head__meta">Backup codes are not available in this environment.</span>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/api'
import { formatApiError } from '@/utils/formatApiError'
import { toastSuccess, toastError } from '@/utils/toast'
import { loadStoredBackupCodes, saveStoredBackupCodes } from '@/utils/backupCodesStorage'
import BuyerSectionHeader from '@/components/buyer/experience/BuyerSectionHeader.vue'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const regenerating = ref(false)
const error = ref('')
const unusedCount = ref(0)
const consumedCount = ref(0)
const codesAvailable = ref(true)
const statusNote = ref('')
const allCodes = ref<string[]>([])
const newCodesBanner = ref('')

const userId = computed(() => auth.user?.id)

async function loadStatus(showSpinner = true) {
  if (showSpinner) {
    loading.value = true
  }
  error.value = ''
  try {
    const { data } = await userApi.getBackupCodesStatus()
    const d = data as {
      unused_count?: number
      consumed_count?: number
      available?: boolean
      note?: string
    }
    unusedCount.value = typeof d.unused_count === 'number' ? d.unused_count : 0
    consumedCount.value = typeof d.consumed_count === 'number' ? d.consumed_count : 0
    codesAvailable.value = d.available !== false
    statusNote.value = typeof d.note === 'string' ? d.note : ''
    allCodes.value = loadStoredBackupCodes(userId.value)
  } catch (e: unknown) {
    error.value = formatApiError(e, 'Failed to load backup code status')
  } finally {
    if (showSpinner) {
      loading.value = false
    }
  }
}

async function confirmRegenerate() {
  const ok =
    typeof window !== 'undefined'
      ? window.confirm(
          unusedCount.value > 0
            ? 'This will invalidate your current unused backup codes and create a new set. Continue?'
            : 'Generate a new set of backup codes? All codes will appear below.',
        )
      : true
  if (!ok) return
  await doRegenerate()
}

async function doRegenerate() {
  regenerating.value = true
  error.value = ''
  newCodesBanner.value = ''
  try {
    const { data } = await userApi.regenerateBackupCodes()
    const d = data as { backup_codes?: string[]; backup_codes_message?: string }
    const list = Array.isArray(d.backup_codes) ? d.backup_codes.map(String).filter((s) => s.trim()) : []
    if (!list.length) {
      toastError('No codes returned')
      return
    }
    saveStoredBackupCodes(userId.value, list)
    allCodes.value = list
    if (d.backup_codes_message) {
      newCodesBanner.value = d.backup_codes_message
    }
    await loadStatus(false)
    toastSuccess('All backup codes are shown below—copy and store them safely.')
  } catch (e: unknown) {
    error.value = formatApiError(e, 'Regenerate failed')
    toastError(error.value)
  } finally {
    regenerating.value = false
  }
}

async function copyCodes() {
  const text = allCodes.value.join('\n').trim()
  if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(text)
    toastSuccess('Copied to clipboard')
  } catch {
    toastError('Could not copy')
  }
}

onMounted(loadStatus)
</script>

<style scoped>
.backup-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.backup-stats__value {
  display: block;
  font-size: 1.5rem;
  margin-top: 0.25rem;
  color: var(--buyer-ink);
}

.backup-codes-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.backup-code-tile {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid var(--buyer-border);
  background: var(--buyer-chip-bg);
}

.backup-code-index {
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--kkoo-primary);
  flex-shrink: 0;
}

.backup-code-value {
  font-size: 1.05rem;
  letter-spacing: 0.08em;
  color: var(--buyer-ink);
}
</style>
