<template>
  <div class="buyer-xp">
    <header class="buyer-page-head">
      <button type="button" class="buyer-page-head__back" @click="router.push({ name: 'buyer.settings' })">
        <Icon icon="solar:arrow-left-linear" />
      </button>
      <h1 class="buyer-page-head__title">{{ t('buyerXp.settings.editProfile') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.settings.editProfileSub') }}</p>
    </header>

    <section class="buyer-detail-card">
      <p v-if="successMessage" class="buyer-xp-toast buyer-xp-toast--ok">{{ successMessage }}</p>
      <p v-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

      <form v-if="loaded" @submit.prevent="save">
        <div class="profile-avatar-row">
          <div class="profile-avatar-wrap">
            <img v-if="avatarPreview" :src="avatarPreview" alt="" class="profile-avatar-img" />
            <div v-else class="profile-avatar-placeholder">{{ initials }}</div>
            <span v-if="avatarUploading" class="profile-avatar-spinner" role="status" />
          </div>
          <div>
            <button type="button" class="buyer-venue__chip" :disabled="avatarUploading" @click="triggerAvatarPick">
              {{ avatarPreview ? t('buyerXp.profileEdit.changePhoto') : t('buyerXp.profileEdit.uploadPhoto') }}
            </button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              class="visually-hidden"
              @change="onAvatarSelected"
            />
            <p class="buyer-page-head__meta mt-2">{{ t('buyerXp.profileEdit.photoHint') }}</p>
          </div>
        </div>

        <div class="buyer-ride-field mt-3">
          <label for="first_name">{{ t('buyerXp.profileEdit.firstName') }}</label>
          <input id="first_name" v-model="form.first_name" type="text" :placeholder="t('buyerXp.profileEdit.firstName')" />
        </div>
        <div class="buyer-ride-field mt-2">
          <label for="last_name">{{ t('buyerXp.profileEdit.lastName') }}</label>
          <input id="last_name" v-model="form.last_name" type="text" :placeholder="t('buyerXp.profileEdit.lastName')" />
        </div>
        <div class="buyer-ride-field mt-2">
          <label for="email">{{ t('buyerXp.profileEdit.email') }}</label>
          <input id="email" v-model="form.email" type="email" :placeholder="t('buyerXp.profileEdit.email')" />
        </div>
        <div class="buyer-ride-field mt-2">
          <label for="phone_number">{{ t('buyerXp.profileEdit.phone') }}</label>
          <input id="phone_number" v-model="form.phone_number" type="tel" placeholder="+255..." readonly disabled />
          <p class="buyer-page-head__meta mt-1">{{ t('buyerXp.profileEdit.phoneReadonlyHint') }}</p>
        </div>

        <div class="buyer-btn-row buyer-form-actions mt-3">
          <button type="submit" class="buyer-venue__chip buyer-venue__chip--primary" :disabled="saving">
            {{ saving ? t('buyerXp.profileEdit.saving') : t('buyerXp.profileEdit.saveProfile') }}
          </button>
        </div>

        <div class="mt-4 pt-3" style="border-top: 1px solid var(--buyer-border)">
          <p class="buyer-page-head__meta mb-2">{{ t('buyerXp.profileEdit.backupCodesTitle') }}</p>
          <router-link :to="{ name: 'account.backup-codes' }" class="buyer-venue__chip">
            {{ t('buyerXp.profileEdit.viewBackupCodes') }}
          </router-link>
        </div>
      </form>
      <p v-else-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/api'
import { resolveAssetUrl } from '@/utils/assetUrl'
import { formatApiError } from '@/utils/formatApiError'
import { toastSuccess, toastError } from '@/utils/toast'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const loaded = ref(false)
const error = ref('')
const successMessage = ref('')
const saving = ref(false)
const avatarUploading = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUrl = ref('')

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
})

const initials = computed(() => {
  const a = form.first_name.trim()[0] ?? ''
  const b = form.last_name.trim()[0] ?? ''
  const s = `${a}${b}`.toUpperCase()
  return s || '?'
})

const avatarPreview = computed(() => resolveAssetUrl(avatarUrl.value) ?? '')

function applyUserFields(u: Record<string, unknown> | null | undefined) {
  if (!u) return
  form.first_name = String(u.first_name ?? '')
  form.last_name = String(u.last_name ?? '')
  form.email = String(u.email ?? '')
  form.phone_number = String(u.phone_number ?? '')
  avatarUrl.value = String(u.avatar_url ?? u.avatar ?? '')
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    applyUserFields(auth.user as Record<string, unknown>)
    loaded.value = true
  } catch (e: unknown) {
    error.value = formatApiError(e, t('buyerXp.profileEdit.loadFailed'))
  } finally {
    loading.value = false
  }
})

function triggerAvatarPick() {
  avatarInput.value?.click()
}

async function onAvatarSelected(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  avatarUploading.value = true
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('avatar', file)
    const { data } = await userApi.uploadAvatar(fd)
    const d = data as { avatar_url?: string; avatar?: string; user?: Record<string, unknown> }
    const url = String(d.avatar_url ?? d.avatar ?? '')
    if (url) avatarUrl.value = url
    if (d.user && auth.user) {
      auth.setUser({ ...auth.user, ...d.user, avatar_url: url, avatar: url })
    } else if (auth.user && url) {
      auth.setUser({ ...auth.user, avatar_url: url, avatar: url })
    }
    toastSuccess(t('buyerXp.profileEdit.photoUpdated'))
  } catch (e: unknown) {
    toastError(formatApiError(e, t('buyerXp.profileEdit.photoUploadFailed')))
  } finally {
    avatarUploading.value = false
  }
}

async function save() {
  error.value = ''
  successMessage.value = ''
  saving.value = true
  try {
    await userApi.updateMe({
      first_name: form.first_name.trim() || undefined,
      last_name: form.last_name.trim() || undefined,
      email: form.email.trim() || undefined,
    })
    if (auth.user) {
      auth.setUser({
        ...auth.user,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        avatar_url: avatarUrl.value,
        avatar: avatarUrl.value,
      })
    }
    successMessage.value = t('buyerXp.profileEdit.saved')
  } catch (e: unknown) {
    const err = e as { response?: { data?: { detail?: string } }; message?: string }
    error.value = err.response?.data?.detail ?? err.message ?? t('buyerXp.profileEdit.saveFailed')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.profile-avatar-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 576px) {
  .profile-avatar-row {
    flex-direction: row;
    align-items: flex-start;
  }
}

.profile-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar-img,
.profile-avatar-placeholder {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  object-fit: cover;
}

.profile-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  background: var(--buyer-chip-bg);
  color: var(--kkoo-primary, #5b3a8c);
}

.profile-avatar-spinner {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--buyer-border);
  border-top-color: var(--kkoo-primary);
  border-radius: 50%;
  animation: profile-spin 0.7s linear infinite;
}

@keyframes profile-spin {
  to {
    transform: rotate(360deg);
  }
}

.buyer-ride-field input:disabled {
  opacity: 0.7;
}
</style>
