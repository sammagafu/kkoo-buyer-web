<template>
  <Teleport to="body">
    <Transition name="buyer-cart-overlay">
      <div
        v-if="open"
        class="buyer-cart-overlay product-share-sheet"
        role="presentation"
        @click.self="closeShareSheet"
      >
        <aside
          class="product-share-sheet__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="t('buyerXp.shareEarn.productSheetTitle')"
          @click.stop
        >
          <header class="buyer-cart-overlay__head">
            <div>
              <h2 class="buyer-cart-overlay__title">{{ t('buyerXp.shareEarn.productSheetTitle') }}</h2>
              <p class="buyer-notify-overlay__sub">{{ t('buyerXp.shareEarn.productSheetSub') }}</p>
            </div>
            <button type="button" class="buyer-cart-overlay__close" :aria-label="t('common.close')" @click="closeShareSheet">
              <Icon icon="solar:close-circle-bold" />
            </button>
          </header>

          <div v-if="preview" class="product-share-sheet__card">
            <div class="product-share-sheet__visual">
              <img
                v-if="preview.imageUrl"
                :src="preview.imageUrl"
                :alt="preview.title || ''"
                class="product-share-sheet__image"
              />
              <div v-else class="product-share-sheet__image product-share-sheet__placeholder">
                <Icon icon="solar:gallery-minimalistic-bold-duotone" />
              </div>
              <span class="product-share-sheet__badge">{{ t('buyerXp.shareEarn.overline') }}</span>
            </div>
            <div class="product-share-sheet__meta">
              <h3 class="product-share-sheet__title">{{ preview.title || t('buyerXp.products.productFallback') }}</h3>
              <p v-if="preview.priceLabel" class="product-share-sheet__price">{{ preview.priceLabel }}</p>
            </div>
          </div>

          <p v-if="loading" class="shop-products__status">{{ t('buyerXp.shareEarn.generatingLink') }}</p>
          <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>

          <template v-else-if="shareLink()">
            <p class="product-share-sheet__link text-break">{{ shareLink() }}</p>
            <div class="buyer-btn-row product-share-sheet__actions">
              <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="copyLink">
                {{ copiedLink ? t('buyerXp.common.copied') : t('buyerXp.shareEarn.copyLink') }}
              </button>
              <button type="button" class="buyer-venue__chip" @click="copyMessage">
                {{ copiedMessage ? t('buyerXp.common.copied') : t('buyerXp.shareEarn.copyMessage') }}
              </button>
              <a
                v-if="whatsappUrl()"
                class="buyer-venue__chip"
                :href="whatsappUrl()"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
            <RouterLink :to="{ name: 'buyer.share-earn' }" class="product-share-sheet__dashboard" @click="closeShareSheet">
              {{ t('buyerXp.shareEarn.viewEarnings') }}
            </RouterLink>
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useProductShareEarn } from '@/composables/useProductShareEarn'

const { t } = useI18n()
const { open, loading, error, preview, closeShareSheet, shareLink, shareMessage, whatsappUrl } = useProductShareEarn()

const copiedLink = ref(false)
const copiedMessage = ref(false)

async function copyText(value: string, flag: typeof copiedLink) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    flag.value = true
    setTimeout(() => { flag.value = false }, 2000)
  } catch {
    // ignore
  }
}

function copyLink() {
  copyText(shareLink(), copiedLink)
}

function copyMessage() {
  copyText(shareMessage(), copiedMessage)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) closeShareSheet()
}

watch(open, () => {
  copiedLink.value = false
  copiedMessage.value = false
})

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.product-share-sheet.buyer-cart-overlay {
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.product-share-sheet__panel {
  width: min(100%, 26rem);
  max-height: min(92vh, 40rem);
  margin: auto;
  overflow: auto;
  border-radius: 1.25rem;
  background: var(--buyer-surface, #fff);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
  padding: 1rem 1rem 1.25rem;
}

.product-share-sheet__card {
  border: 1px solid var(--buyer-border-strong, rgba(15, 23, 42, 0.08));
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.product-share-sheet__visual {
  position: relative;
}

.product-share-sheet__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.product-share-sheet__placeholder {
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.04);
  font-size: 2rem;
  color: var(--buyer-muted, #64748b);
}

.product-share-sheet__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--buyer-accent, #0d9488);
  color: #fff;
}

.product-share-sheet__meta {
  padding: 0.85rem 1rem 1rem;
}

.product-share-sheet__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.product-share-sheet__price {
  margin: 0.35rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--buyer-accent, #0d9488);
}

.product-share-sheet__link {
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  opacity: 0.85;
  word-break: break-all;
}

.product-share-sheet__actions {
  flex-wrap: wrap;
}

.product-share-sheet__dashboard {
  display: inline-block;
  margin-top: 0.85rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--buyer-accent, #0d9488);
  text-decoration: none;
}

.product-share-sheet__dashboard:hover {
  text-decoration: underline;
}
</style>
