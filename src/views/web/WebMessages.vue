<template>
  <div class="buyer-xp" :class="{ 'buyer-xp--wide': !activeId }">
    <header v-if="!activeId" class="buyer-page-head">
      <h1 class="buyer-page-head__title">{{ t('buyerXp.messages.title') }}</h1>
      <p class="buyer-page-head__meta">{{ t('buyerXp.messages.meta') }}</p>
    </header>

    <header v-else class="buyer-page-head">
      <div class="buyer-page-head__row">
        <button type="button" class="buyer-page-head__back" @click="router.push({ name: 'buyer.messages' })">
          <Icon icon="solar:arrow-left-linear" />
        </button>
        <h1 class="buyer-page-head__title">{{ threadTitle }}</h1>
      </div>
    </header>

    <!-- Thread list -->
    <section v-if="!activeId">
      <p v-if="loading" class="shop-products__status">{{ t('buyerXp.common.loading') }}</p>
      <p v-else-if="error" class="buyer-xp-toast buyer-xp-toast--err">{{ error }}</p>
      <div v-else-if="conversations.length" class="buyer-hub-list">
        <button
          v-for="conv in conversations"
          :key="conv.id"
          type="button"
          class="buyer-detail-card buyer-detail-card--clickable"
          @click="openThread(conv.id)"
        >
          <div class="buyer-detail-row">
            <strong>{{ conv.other_user_display_name }}</strong>
            <span v-if="conv.unread_count" class="buyer-side-nav__counter">{{ conv.unread_count }}</span>
          </div>
          <p class="buyer-page-head__meta text-truncate">{{ conv.last_message || t('buyerXp.messages.noMessages') }}</p>
        </button>
      </div>
      <BuyerEmptyState
        v-else
        icon="solar:chat-round-bold"
        :title="t('buyerXp.messages.emptyTitle')"
        :message="t('buyerXp.messages.emptyMessage')"
      />
    </section>

    <!-- Active thread -->
    <section v-else class="buyer-chat">
      <div ref="scrollEl" class="buyer-chat__messages">
        <p v-if="loadingMessages" class="shop-products__status">{{ t('buyerXp.messages.loading') }}</p>
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="buyer-chat__bubble"
          :class="{ 'buyer-chat__bubble--mine': msg.sender_id === myUserId }"
        >
          {{ msg.text }}
        </div>
      </div>
      <form class="buyer-chat__composer" @submit.prevent="send">
        <input v-model="draft" type="text" :placeholder="t('buyerXp.messages.placeholder')" />
        <button type="submit" :disabled="sending || !draft.trim()">{{ t('buyerXp.messages.send') }}</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import {
  listConversations,
  listMessages,
  sendMessage,
  markConversationRead,
  openChatStream,
  type ChatStreamController,
} from '@/api/chat'
import type { Conversation, Message } from '@/types/chat'
import { useAuthStore } from '@/stores/auth'
import { formatApiError } from '@/utils/formatApiError'
import BuyerEmptyState from '@/components/buyer/experience/BuyerEmptyState.vue'

const props = defineProps<{ id?: string }>()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()
const { user, accessToken } = storeToRefs(auth)

const activeId = computed(() => {
  const raw = props.id ?? route.params.id
  if (raw == null || raw === '') return null
  return Number(raw)
})

const myUserId = computed(() => user.value?.id ?? 0)
const conversations = ref<Conversation[]>([])
const messages = ref<Message[]>([])
const loading = ref(false)
const loadingMessages = ref(false)
const error = ref('')
const draft = ref('')
const sending = ref(false)
const scrollEl = ref<HTMLElement | null>(null)
let stream: ChatStreamController | null = null

const threadTitle = computed(() => {
  const conv = conversations.value.find((c) => c.id === activeId.value)
  return conv?.other_user_display_name || t('buyerXp.messages.chatFallback')
})

function openThread(id: number) {
  router.push({ name: 'buyer.messages.thread', params: { id: String(id) } })
}

async function loadConversations() {
  loading.value = true
  try {
    const data = await listConversations({ page_size: 50 })
    conversations.value = data.results ?? []
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.messages.couldNotLoad'))
  } finally {
    loading.value = false
  }
}

async function loadThread(id: number) {
  loadingMessages.value = true
  try {
    const data = await listMessages(id, { page_size: 100 })
    messages.value = data.results ?? []
    await markConversationRead(id)
    await nextTick()
    scrollEl.value?.scrollTo({ top: scrollEl.value.scrollHeight })
    startStream(id)
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.messages.couldNotLoad'))
  } finally {
    loadingMessages.value = false
  }
}

function startStream(id: number) {
  stream?.close()
  const token = accessToken.value
  if (!token) return
  stream = openChatStream(id, token, {
    onMessage: (msg) => {
      if (!messages.value.some((m) => m.id === msg.id)) {
        messages.value.push(msg)
        nextTick(() => scrollEl.value?.scrollTo({ top: scrollEl.value!.scrollHeight }))
      }
    },
  })
}

async function send() {
  const id = activeId.value
  if (!id || !draft.value.trim()) return
  sending.value = true
  const text = draft.value.trim()
  draft.value = ''
  try {
    const msg = await sendMessage({ conversation_id: id, text })
    if (!messages.value.some((m) => m.id === msg.id)) messages.value.push(msg)
    await nextTick()
    scrollEl.value?.scrollTo({ top: scrollEl.value!.scrollHeight })
  } catch (e) {
    error.value = formatApiError(e, t('buyerXp.messages.couldNotSend'))
    draft.value = text
  } finally {
    sending.value = false
  }
}

watch(activeId, (id) => {
  if (id) void loadThread(id)
  else {
    stream?.close()
    stream = null
    messages.value = []
  }
})

onMounted(() => {
  void loadConversations()
  if (activeId.value) void loadThread(activeId.value)
})

onUnmounted(() => {
  stream?.close()
})
</script>

<style scoped>
.buyer-detail-card--clickable {
  width: 100%;
  text-align: left;
  cursor: pointer;
  border: none;
  background: var(--buyer-surface, #fff);
}
.buyer-chat__messages {
  min-height: 50vh;
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
}
.buyer-chat__bubble {
  align-self: flex-start;
  max-width: 80%;
  padding: 0.65rem 0.9rem;
  border-radius: 1rem;
  background: var(--buyer-chip-bg);
  color: var(--buyer-ink);
}
.buyer-chat__bubble--mine {
  align-self: flex-end;
  background: var(--kkoo-primary);
  color: #fff;
}
.buyer-chat__composer {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
}
.buyer-chat__composer input {
  flex: 1;
  border-radius: 999px;
  border: 1px solid var(--buyer-border-strong);
  background: var(--buyer-input-bg);
  color: var(--buyer-ink);
  padding: 0.65rem 1rem;
}
.buyer-chat__composer button {
  border: none;
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  background: var(--kkoo-primary);
  color: #fff;
  font-weight: 600;
}
</style>
