<template>
  <Teleport to="body">
    <Transition name="buyer-cart-overlay">
      <div
        v-if="modelValue"
        class="buyer-cart-overlay"
        role="presentation"
        @click.self="close"
      >
        <aside
          class="buyer-cart-overlay__panel buyer-notify-overlay__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
          @click.stop
        >
          <header class="buyer-cart-overlay__head">
            <div>
              <h2 class="buyer-cart-overlay__title">Notifications</h2>
              <p v-if="unreadCount > 0" class="buyer-notify-overlay__sub">{{ unreadCount }} unread</p>
            </div>
            <button type="button" class="buyer-cart-overlay__close" aria-label="Close notifications" @click="close">
              <Icon icon="solar:close-circle-bold" />
            </button>
          </header>

          <div class="buyer-notify-overlay__toolbar">
            <button
              v-if="unreadCount > 0"
              type="button"
              class="buyer-notify-overlay__clear"
              :disabled="markingAll"
              @click="markAllRead"
            >
              {{ markingAll ? 'Clearing…' : 'Mark all read' }}
            </button>
          </div>

          <div class="buyer-notify-overlay__body">
            <p v-if="!auth.isAuthenticated" class="buyer-notify-overlay__empty">
              <RouterLink :to="{ name: 'auth.sign-in' }" @click="close">Sign in</RouterLink> to see notifications.
            </p>
            <p v-else-if="loading" class="buyer-notify-overlay__empty">Loading…</p>
            <p v-else-if="!items.length" class="buyer-notify-overlay__empty">No notifications yet.</p>
            <ul v-else class="buyer-notify-overlay__list">
              <li v-for="n in items" :key="n.id">
                <RouterLink
                  :to="notificationLink(n)"
                  class="buyer-notify-overlay__item"
                  :class="{ 'buyer-notify-overlay__item--unread': !n.read_at }"
                  @click="onOpen(n)"
                >
                  <span class="buyer-notify-overlay__icon" aria-hidden="true">
                    <Icon icon="solar:bell-bold" />
                  </span>
                  <span class="buyer-notify-overlay__content">
                    <span class="buyer-notify-overlay__title">{{ n.title || 'Notification' }}</span>
                    <span v-if="n.message" class="buyer-notify-overlay__message">{{ n.message }}</span>
                    <span class="buyer-notify-overlay__time">{{ formatRelativeDate(n.created_at) }}</span>
                  </span>
                </RouterLink>
              </li>
            </ul>
          </div>

          <footer class="buyer-notify-overlay__foot">
            <RouterLink :to="{ name: 'account.notifications' }" class="buyer-notify-overlay__all" @click="close">
              View all
            </RouterLink>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/auth'
import { notificationLink, useBuyerNotifications } from '@/composables/useBuyerNotifications'

const modelValue = defineModel<boolean>({ default: false })
const auth = useAuthStore()
const { items, unreadCount, loading, markingAll, loadNotifications, markRead, markAllRead, formatRelativeDate } =
  useBuyerNotifications()

function close() {
  modelValue.value = false
}

function onOpen(n: (typeof items.value)[number]) {
  void markRead(n)
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modelValue.value) close()
}

watch(modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open && auth.isAuthenticated) void loadNotifications(true)
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
