<template>
  <MarketingLayout>
    <section class="lp-section lp-legal">
      <div class="container px-3 px-sm-4 px-lg-4 lp-legal-wrap">
        <p class="lp-legal-kicker">Legal</p>
        <h1 class="lp-legal-title">{{ doc.title }}</h1>
        <p class="lp-legal-updated">Last updated: {{ doc.lastUpdated }}</p>

        <div class="lp-legal-content">
          <p class="lp-legal-intro">{{ doc.intro }}</p>

          <section v-for="(section, idx) in doc.sections" :key="idx" class="lp-legal-section">
            <h2 class="lp-legal-h2">{{ section.title }}</h2>
            <template v-for="(block, bIdx) in section.blocks" :key="bIdx">
              <p v-if="block.type === 'p'" class="lp-legal-p">{{ block.text }}</p>
              <p v-else-if="block.type === 'note'" class="lp-legal-note">{{ block.text }}</p>
              <ul v-else-if="block.type === 'ul'" class="lp-legal-list">
                <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
              </ul>
              <ol v-else-if="block.type === 'ol'" class="lp-legal-list lp-legal-list--ol">
                <li v-for="(item, i) in block.items" :key="i">{{ item }}</li>
              </ol>
            </template>
          </section>

          <nav v-if="relatedLinks.length" class="lp-legal-related" aria-label="Related legal pages">
            <p class="lp-legal-related__label">Related</p>
            <ul>
              <li v-for="link in relatedLinks" :key="link.to">
                <router-link :to="link.to">{{ link.label }}</router-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarketingLayout from '@/views/marketing/MarketingLayout.vue'
import { legalDocuments, type LegalDocKey } from '@/content/legalDocuments'

const props = defineProps<{
  docKey: LegalDocKey
}>()

const doc = computed(() => legalDocuments[props.docKey])

const relatedLinks = computed(() => {
  const all: { key: LegalDocKey; to: string; label: string }[] = [
    { key: 'terms', to: '/terms-of-use', label: 'Terms of use' },
    { key: 'privacy', to: '/privacy-policy', label: 'Privacy policy' },
    { key: 'cookies', to: '/cookie-policy', label: 'Cookie policy' },
    { key: 'refunds', to: '/refund-policy', label: 'Refund policy' },
    { key: 'acceptableUse', to: '/acceptable-use', label: 'Acceptable use' },
    { key: 'dataDeletion', to: '/data-deletion', label: 'Data deletion' },
  ]
  return all.filter((l) => l.key !== props.docKey)
})
</script>

<style scoped>
.lp-legal-wrap {
  max-width: 48rem;
  margin-inline: auto;
  padding-top: 1.5rem;
  padding-bottom: 3.5rem;
}

.lp-legal-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.55));
}

.lp-legal-title {
  max-width: none !important;
  margin-bottom: 0.35rem;
}

.lp-legal-updated {
  margin: 0 0 1.75rem;
  font-size: 0.875rem;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.55));
}

.lp-legal-intro {
  font-size: 1.05rem;
  margin-bottom: 2rem;
  white-space: pre-line;
}

.lp-legal-section + .lp-legal-section {
  margin-top: 0.25rem;
}

.lp-legal-h2 {
  max-width: none !important;
}

.lp-legal-p,
.lp-legal-note {
  white-space: pre-line;
}

.lp-legal-note {
  margin: 0.75rem 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--kkoo-primary, #5c308f) 8%, transparent);
  color: var(--lh-text, #1a1a1a);
  font-size: 0.95rem;
}

.lp-legal-list {
  margin: 0.5rem 0 1.1rem;
  padding-left: 1.25rem;
}

.lp-legal-list li {
  margin-bottom: 0.45rem;
  line-height: 1.6;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.72));
}

.lp-legal-list--ol {
  list-style: decimal;
}

.lp-legal-related {
  margin-top: 2.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lh-border, rgba(26, 26, 26, 0.1));
}

.lp-legal-related__label {
  margin: 0 0 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--lh-text-muted, rgba(26, 26, 26, 0.55));
}

.lp-legal-related ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.lp-legal-related a {
  color: var(--kkoo-primary, #5c308f);
  font-weight: 600;
  text-decoration: none;
}

.lp-legal-related a:hover {
  text-decoration: underline;
}
</style>
