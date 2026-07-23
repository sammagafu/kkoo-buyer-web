<template>
  <component
    :is="tag"
    class="kkoo-signin-btn"
    :class="[`kkoo-signin-btn--${size}`, { 'kkoo-signin-btn--block': block }]"
    :type="tag === 'button' ? type : undefined"
    :href="href"
    :disabled="disabled || undefined"
    @click="onClick"
  >
    <span class="kkoo-signin-btn__mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
        <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.15" />
        <path
          d="M8 22V10h4.2c2.5 0 4.1 1.4 4.1 3.5 0 1.4-.8 2.5-2.1 3l2.6 5.5h-3.1l-2.3-5H11v5H8Zm3-7.4h1c1.1 0 1.7-.5 1.7-1.4S13.1 12 12 12H11v2.6Z"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="kkoo-signin-btn__label">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
/**
 * AllAuth-style “Sign in with KKOO” control for partner sites / pop-ups.
 * Use as a button that starts OAuth, or as a link to your authorize URL.
 */
withDefaults(
  defineProps<{
    label?: string
    size?: 'md' | 'lg'
    block?: boolean
    href?: string
    tag?: 'button' | 'a'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    label: 'Sign in with KKOO',
    size: 'md',
    block: true,
    tag: 'button',
    type: 'button',
    disabled: false,
  },
)

const emit = defineEmits<{ click: [MouseEvent] }>()

function onClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<style scoped>
.kkoo-signin-btn {
  --kkoo-btn-bg: #5c308f;
  --kkoo-btn-fg: #fff;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border: 0;
  border-radius: 0.75rem;
  background: var(--kkoo-btn-bg);
  color: var(--kkoo-btn-fg);
  font-family: var(--kkoo-font-display, 'Syne', sans-serif);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease;
  box-shadow: 0 8px 20px rgba(92, 48, 143, 0.28);
}

.kkoo-signin-btn:hover:not(:disabled) {
  filter: brightness(1.05);
  color: var(--kkoo-btn-fg);
  text-decoration: none;
}

.kkoo-signin-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.kkoo-signin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.kkoo-signin-btn--md {
  min-height: 2.75rem;
  padding: 0.55rem 1rem;
  font-size: 0.95rem;
}

.kkoo-signin-btn--lg {
  min-height: 3.15rem;
  padding: 0.7rem 1.15rem;
  font-size: 1rem;
}

.kkoo-signin-btn--block {
  width: 100%;
}

.kkoo-signin-btn__mark {
  display: grid;
  place-items: center;
  color: #f7a829;
}

.kkoo-signin-btn__label {
  letter-spacing: 0.01em;
}
</style>
