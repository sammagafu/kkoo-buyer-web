<template>
  <div class="wa-preview">
    <header class="wa-preview__header">
      <h1>{{ t('whatsappPreview.title') }}</h1>
      <p class="wa-preview__subtitle">{{ t('whatsappPreview.subtitle') }}</p>
    </header>

    <p v-if="loading" class="wa-preview__state">{{ t('common.loading') }}</p>
    <p v-else-if="error" class="wa-preview__state wa-preview__state--error">{{ error }}</p>

    <template v-else-if="data">
      <div class="wa-preview__badge" :class="`wa-preview__badge--${data.status}`">
        {{ statusLabel }}
      </div>

      <p v-if="data.public_visible" class="wa-preview__note wa-preview__note--live">
        {{ t('whatsappPreview.liveInApp') }}
      </p>
      <p v-else class="wa-preview__note">
        {{ t('whatsappPreview.pendingNote') }}
      </p>

      <section v-if="data.product" class="wa-preview__card">
        <img
          v-if="coverImage"
          :src="coverImage"
          :alt="data.product.title"
          class="wa-preview__image"
        />
        <h2>{{ data.product.title }}</h2>
        <p class="wa-preview__price">{{ formatPrice(data.product.base_price) }}</p>
        <p>{{ data.product.description }}</p>
      </section>

      <section v-else-if="data.document" class="wa-preview__card">
        <h2>{{ docTypeLabel }}</h2>
        <p>{{ t('whatsappPreview.documentStatus', { status: data.document.status }) }}</p>
        <a v-if="docFileUrl" :href="docFileUrl" target="_blank" rel="noopener">
          {{ t('whatsappPreview.viewDocument') }}
        </a>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchWhatsAppPreview, type WhatsAppPreviewResponse } from '@/api/whatsappPreview'
import { resolveApiBaseUrl } from '@/utils/apiBaseUrl'

const route = useRoute()
const { t } = useI18n()

const loading = ref(true)
const error = ref('')
const data = ref<WhatsAppPreviewResponse | null>(null)

const token = computed(() => String(route.params.token ?? ''))

const statusLabel = computed(() => {
  const s = data.value?.status ?? 'pending'
  if (s === 'approved') return t('whatsappPreview.statusApproved')
  if (s === 'rejected') return t('whatsappPreview.statusRejected')
  return t('whatsappPreview.statusPending')
})

const coverImage = computed(() => {
  const media = data.value?.product?.media
  if (!media?.length) return ''
  const primary = media.find((m) => m.is_primary) ?? media[0]
  const file = primary?.file ?? ''
  if (!file) return ''
  if (file.startsWith('http')) return file
  const api = resolveApiBaseUrl().replace(/\/api\/v1\/?$/, '')
  return `${api}${file.startsWith('/') ? '' : '/'}${file}`
})

const docFileUrl = computed(() => {
  const doc = data.value?.document
  const file = doc?.file_path ?? doc?.file ?? ''
  if (!file) return ''
  if (file.startsWith('http')) return file
  const api = resolveApiBaseUrl().replace(/\/api\/v1\/?$/, '')
  return `${api}${file.startsWith('/') ? '' : '/'}${file}`
})

const docTypeLabel = computed(() => {
  const type = data.value?.document?.document_type ?? 'document'
  return type.replace(/_/g, ' ')
})

function formatPrice(amount: number) {
  return new Intl.NumberFormat('sw-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(
    amount,
  )
}

onMounted(async () => {
  if (!token.value) {
    error.value = t('whatsappPreview.notFound')
    loading.value = false
    return
  }
  try {
    data.value = await fetchWhatsAppPreview(token.value)
  } catch {
    error.value = t('whatsappPreview.notFound')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.wa-preview {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.wa-preview__header h1 {
  font-size: 1.35rem;
  margin: 0 0 0.35rem;
}

.wa-preview__subtitle {
  color: var(--kkoo-text-muted, #666);
  margin: 0 0 1.25rem;
}

.wa-preview__badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;

  &--pending {
    background: #fff3cd;
    color: #856404;
  }
  &--approved {
    background: #d4edda;
    color: #155724;
  }
  &--rejected {
    background: #f8d7da;
    color: #721c24;
  }
}

.wa-preview__note {
  font-size: 0.9rem;
  color: var(--kkoo-text-muted, #666);
  margin: 0 0 1rem;

  &--live {
    color: #155724;
  }
}

.wa-preview__card {
  border: 1px solid var(--kkoo-border, #e5e5e5);
  border-radius: 12px;
  padding: 1rem;
}

.wa-preview__image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  object-fit: cover;
  max-height: 240px;
}

.wa-preview__price {
  font-weight: 700;
  font-size: 1.1rem;
}

.wa-preview__state {
  color: var(--kkoo-text-muted, #666);

  &--error {
    color: #c0392b;
  }
}
</style>
