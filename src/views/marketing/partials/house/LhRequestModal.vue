<template>
  <div
    v-if="open"
    class="lh-modal"
    role="presentation"
    @click="emit('close')"
  >
    <div
      class="lh-modal__panel"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @click.stop
    >
      <button
        type="button"
        class="lh-modal__close"
        :aria-label="t('landingHouse.modal.close')"
        @click="emit('close')"
      >
        <Icon icon="solar:close-circle-linear" width="20" height="20" />
      </button>

      <div v-if="sent" class="lh-modal__success">
        <p class="lh-modal__eyebrow">{{ t('landingHouse.modal.successEyebrow') }}</p>
        <h2 :id="titleId">{{ t('landingHouse.modal.successTitle') }}</h2>
        <p class="lh-modal__hint">{{ t('landingHouse.modal.successHint') }}</p>
        <LhButton
          as="router-link"
          :to="buyerRoutes.signUp"
          variant="primary"
          @click="emit('close')"
        >
          {{ t('landingHouse.modal.successCta') }}
        </LhButton>
      </div>

      <template v-else>
        <p class="lh-modal__eyebrow">{{ t('landingHouse.modal.eyebrow') }}</p>
        <h2 :id="titleId">{{ t('landingHouse.modal.title') }}</h2>
        <p class="lh-modal__hint">{{ t('landingHouse.modal.hint') }}</p>

        <div class="lh-modal__progress" aria-hidden="true">
          <span />
        </div>

        <form class="lh-modal__form" @submit.prevent="onSubmit">
          <label class="lh-field">
            <span>{{ t('landingHouse.modal.name') }}</span>
            <input
              ref="firstField"
              v-model="name"
              name="name"
              required
              autocomplete="name"
              :placeholder="t('landingHouse.modal.namePlaceholder')"
            />
          </label>
          <label class="lh-field">
            <span>{{ t('landingHouse.modal.phone') }}</span>
            <input
              v-model="phone"
              name="phone"
              type="tel"
              required
              autocomplete="tel"
              :placeholder="t('landingHouse.modal.phonePlaceholder')"
            />
          </label>
          <label class="lh-field">
            <span>{{ t('landingHouse.modal.city') }}</span>
            <select v-model="region" name="region">
              <option
                v-for="(key, i) in houseRegionKeys"
                :key="key"
                :value="key"
              >
                {{ t(`landingHouse.regions.${key}`) }}{{ i === 0 ? ` · ${t('landingHouse.modal.recommended')}` : '' }}
              </option>
            </select>
          </label>
          <LhButton type="submit" variant="primary" size="lg" with-arrow>
            {{ t('landingHouse.modal.submit') }}
          </LhButton>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { houseRegionKeys } from '@/config/landing-house'
import { buyerRoutes } from '@/config/landing-links'
import LhButton from './LhButton.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const titleId = 'lh-request-title'
const firstField = ref<HTMLInputElement | null>(null)
const sent = ref(false)
const name = ref('')
const phone = ref('')
const region = ref<string>(houseRegionKeys[0])

watch(
  () => props.open,
  async (isOpen, _, onCleanup) => {
    if (!isOpen) return

    sent.value = false
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    firstField.value?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') emit('close')
    }
    window.addEventListener('keydown', onKey)

    onCleanup(() => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    })
  },
)

function onSubmit() {
  sent.value = true
}
</script>
