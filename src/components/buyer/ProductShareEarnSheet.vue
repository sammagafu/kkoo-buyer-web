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

            <p class="product-share-sheet__step">{{ t('buyerXp.shareEarn.chooseApp') }}</p>
            <div class="product-share-sheet__apps" role="list">
              <button
                v-for="app in SHARE_APPS"
                :key="app.id"
                type="button"
                class="product-share-sheet__app"
                :class="[
                  `product-share-sheet__app--${app.tone}`,
                  { 'is-active': selectedAppId === app.id },
                ]"
                @click="selectApp(app.id)"
              >
                <Icon :icon="app.icon" />
                <span>{{ app.label }}</span>
              </button>
            </div>

            <template v-if="selectedApp">
              <p class="product-share-sheet__step">
                {{ t('buyerXp.shareEarn.chooseAction', { app: selectedApp.label }) }}
              </p>
              <div class="product-share-sheet__actions-grid" role="group">
                <button
                  v-for="action in selectedApp.actions"
                  :key="action.id"
                  type="button"
                  class="product-share-sheet__action"
                  @click="runAction(selectedApp, action)"
                >
                  {{ t(action.labelKey) }}
                </button>
              </div>
            </template>

            <p v-if="actionHint" class="product-share-sheet__hint">{{ actionHint }}</p>

            <div class="buyer-btn-row product-share-sheet__actions">
              <button type="button" class="buyer-venue__chip buyer-venue__chip--primary" @click="copyLink">
                {{ copiedLink ? t('buyerXp.common.copied') : t('buyerXp.shareEarn.copyLink') }}
              </button>
              <button type="button" class="buyer-venue__chip" @click="copyMessage">
                {{ copiedMessage ? t('buyerXp.common.copied') : t('buyerXp.shareEarn.copyMessage') }}
              </button>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useProductShareEarn } from '@/composables/useProductShareEarn'
import {
  SHARE_APPS,
  hintKeyForAction,
  type ShareAction,
  type ShareApp,
  type ShareAppId,
} from '@/utils/productSocialShare'

const { t } = useI18n()
const {
  open,
  loading,
  error,
  preview,
  closeShareSheet,
  shareLink,
  shareMessage,
  shareViaSystem,
} = useProductShareEarn()

const copiedLink = ref(false)
const copiedMessage = ref(false)
const selectedAppId = ref<ShareAppId | null>(null)
const actionHint = ref('')

const selectedApp = computed(() => SHARE_APPS.find((a) => a.id === selectedAppId.value) ?? null)

async function copyText(value: string, flag?: typeof copiedLink) {
  if (!value) return false
  try {
    await navigator.clipboard.writeText(value)
    if (flag) {
      flag.value = true
      setTimeout(() => { flag.value = false }, 2000)
    }
    return true
  } catch {
    return false
  }
}

function copyLink() {
  copyText(shareLink(), copiedLink)
}

function copyMessage() {
  copyText(shareMessage(), copiedMessage)
}

function selectApp(id: ShareAppId) {
  selectedAppId.value = id
  actionHint.value = ''
}

async function runAction(app: ShareApp, action: ShareAction) {
  const link = shareLink()
  const message = shareMessage()
  actionHint.value = ''

  if (app.id === 'system') {
    const ok = await shareViaSystem()
    if (!ok) {
      await copyText(message || link, copiedMessage)
      actionHint.value = t('buyerXp.shareEarn.hintCopied')
    }
    return
  }

  if (action.copyFirst) {
    await copyText(message || link, copiedMessage)
    actionHint.value = t(hintKeyForAction(app.id, action.id))
  }

  const href = action.href?.(link, message) ?? ''
  if (href) {
    window.open(href, '_blank', 'noopener,noreferrer')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) closeShareSheet()
}

watch(open, () => {
  copiedLink.value = false
  copiedMessage.value = false
  selectedAppId.value = null
  actionHint.value = ''
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
  max-height: min(92vh, 44rem);
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

.product-share-sheet__step {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--buyer-muted, #64748b);
}

.product-share-sheet__apps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.product-share-sheet__app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-height: 4.25rem;
  padding: 0.55rem 0.35rem;
  border-radius: 0.85rem;
  border: 1px solid var(--buyer-border-strong, rgba(15, 23, 42, 0.1));
  background: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.product-share-sheet__app :deep(svg) {
  font-size: 1.35rem;
}

.product-share-sheet__app.is-active {
  outline: 2px solid var(--buyer-accent, #0d9488);
  outline-offset: 1px;
}

.product-share-sheet__app--wa { color: #128c7e; background: #ecfdf5; }
.product-share-sheet__app--fb { color: #1877f2; background: #eff6ff; }
.product-share-sheet__app--ig { color: #c13584; background: #fdf2f8; }
.product-share-sheet__app--tt { color: #111; background: #f4f4f5; }
.product-share-sheet__app--sys { color: #0f766e; background: #f0fdfa; }

.product-share-sheet__actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
  margin-bottom: 0.75rem;
}

.product-share-sheet__action {
  min-height: 2.4rem;
  border-radius: 0.7rem;
  border: 1px solid var(--buyer-border-strong, rgba(15, 23, 42, 0.12));
  background: rgba(15, 23, 42, 0.03);
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

.product-share-sheet__action:hover {
  background: rgba(13, 148, 136, 0.08);
}

.product-share-sheet__hint {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  color: var(--buyer-muted, #64748b);
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
