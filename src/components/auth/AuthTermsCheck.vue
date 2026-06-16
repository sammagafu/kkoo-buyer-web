<template>
  <label class="auth-terms">
    <input
      type="checkbox"
      class="auth-terms__input"
      :checked="modelValue"
      :required="required"
      @change="onChange"
    />
    <span class="auth-terms__text">
      {{ t('auth.acceptTermsPrefix') }}
      <router-link
        :to="{ name: 'pages.terms' }"
        target="_blank"
        rel="noopener noreferrer"
        class="auth-terms__link"
        @click.stop
      >
        {{ t('auth.termsLink') }}
      </router-link>
    </span>
  </label>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

type Props = {
  modelValue: boolean
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  required: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>
