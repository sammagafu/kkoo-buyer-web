<template>
  <MarketingLayout>
    <section class="lp-section web-search-hero">
      <b-container class="px-3 px-sm-4 px-lg-4">
        <p class="web-search-kicker mb-2">Search KKOO</p>
        <h1 class="web-search-title mb-3">Find products, groceries, and restaurants</h1>
        <form class="web-search-form" @submit.prevent="submit">
          <Icon icon="solar:magnifer-linear" class="web-search-form-icon" />
          <input
            ref="inputRef"
            v-model.trim="query"
            type="search"
            placeholder="Search stores and products"
            autocomplete="off"
          />
          <b-button type="submit" variant="primary" size="sm">Search</b-button>
        </form>
        <p class="text-muted small mt-3 mb-0">Results open in Marketplace — same catalog as the mobile app.</p>
      </b-container>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'

const router = useRouter()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function submit() {
  void router.push({
    name: 'buyer.marketplace',
    query: query.value ? { q: query.value } : {},
  })
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.web-search-kicker {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--bs-primary);
}

.web-search-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
}

.web-search-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(var(--bs-body-color-rgb), 0.12);
  border-radius: 999px;
  background: var(--bs-body-bg);
  max-width: 28rem;
}

.web-search-form-icon {
  font-size: 1.25rem;
  color: var(--bs-secondary-color);
  flex-shrink: 0;
}

.web-search-form input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  min-width: 0;
}
</style>
