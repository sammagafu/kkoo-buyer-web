<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="food-combo"
      role="presentation"
      @click="emit('close')"
    >
      <div
        class="food-combo__panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.stop
      >
        <div class="food-combo__handle" aria-hidden="true" />

        <header class="food-combo__head">
          <div>
            <h2 :id="titleId" class="food-combo__title">{{ t('buyerXp.eats.comboTitle') }}</h2>
            <p class="food-combo__sub">{{ t('buyerXp.eats.comboSub') }}</p>
          </div>
          <button type="button" class="food-combo__close" :aria-label="t('common.close')" @click="emit('close')">
            <Icon icon="solar:close-circle-linear" width="22" height="22" />
          </button>
        </header>

        <div class="food-combo__steps" aria-hidden="true">
          <span class="food-combo__step" :class="{ 'is-done': !!main, 'is-active': !main }">1</span>
          <span class="food-combo__rail" />
          <span class="food-combo__step" :class="{ 'is-done': !!side, 'is-active': !!main && !side }">2</span>
          <span class="food-combo__rail" />
          <span class="food-combo__step" :class="{ 'is-done': !!drink, 'is-active': !!main && !!side && !drink }">3</span>
        </div>

        <section class="food-combo__section">
          <h3>
            {{ t('buyerXp.eats.comboMain') }}
            <span class="food-combo__req">{{ t('buyerXp.eats.comboRequired') }}</span>
          </h3>
          <div class="food-combo__chips" role="listbox" :aria-label="t('buyerXp.eats.comboMain')">
            <button
              v-for="item in mains"
              :key="`m-${item.id}`"
              type="button"
              role="option"
              class="food-combo__chip"
              :class="{ 'is-selected': main?.id === item.id }"
              :aria-selected="main?.id === item.id"
              @click="main = item"
            >
              <span class="food-combo__chip-name">{{ item.title }}</span>
              <span class="food-combo__chip-price">{{ formatTzs(priceOf(item)) }}</span>
            </button>
          </div>
        </section>

        <section v-if="sides.length" class="food-combo__section">
          <h3>
            {{ t('buyerXp.eats.comboSide') }}
            <span class="food-combo__opt">{{ t('buyerXp.eats.comboOptional') }}</span>
          </h3>
          <div class="food-combo__chips" role="listbox" :aria-label="t('buyerXp.eats.comboSide')">
            <button
              v-for="item in sides"
              :key="`s-${item.id}`"
              type="button"
              role="option"
              class="food-combo__chip"
              :class="{ 'is-selected': side?.id === item.id }"
              :aria-selected="side?.id === item.id"
              @click="side = side?.id === item.id ? null : item"
            >
              <span class="food-combo__chip-name">{{ item.title }}</span>
              <span class="food-combo__chip-price">{{ formatTzs(priceOf(item)) }}</span>
            </button>
          </div>
        </section>

        <section v-if="drinks.length" class="food-combo__section">
          <h3>
            {{ t('buyerXp.eats.comboDrink') }}
            <span class="food-combo__opt">{{ t('buyerXp.eats.comboOptional') }}</span>
          </h3>
          <div class="food-combo__chips" role="listbox" :aria-label="t('buyerXp.eats.comboDrink')">
            <button
              v-for="item in drinks"
              :key="`d-${item.id}`"
              type="button"
              role="option"
              class="food-combo__chip"
              :class="{ 'is-selected': drink?.id === item.id }"
              :aria-selected="drink?.id === item.id"
              @click="drink = drink?.id === item.id ? null : item"
            >
              <span class="food-combo__chip-name">{{ item.title }}</span>
              <span class="food-combo__chip-price">{{ formatTzs(priceOf(item)) }}</span>
            </button>
          </div>
        </section>

        <footer class="food-combo__footer">
          <div class="food-combo__total">
            <span>{{ t('buyerXp.eats.comboTotal') }}</span>
            <strong>{{ formatTzs(total) }}</strong>
          </div>
          <button
            type="button"
            class="food-combo__submit kkoo-btn kkoo-btn--primary kkoo-btn--block kkoo-btn--lg"
            :disabled="!main || adding"
            @click="submit"
          >
            <span class="kkoo-btn__label">
              {{ adding ? t('buyerXp.eats.comboAdding') : t('buyerXp.eats.comboAdd') }}
            </span>
          </button>
          <p class="food-combo__hint">{{ t('buyerXp.eats.comboHint') }}</p>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import type { RestaurantMenuItem } from '@/api/superApp'
import { formatTzs, priceOf } from '@/utils/foodMenuUtils'

const props = defineProps<{
  open: boolean
  mains: RestaurantMenuItem[]
  sides: RestaurantMenuItem[]
  drinks: RestaurantMenuItem[]
  adding?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [items: RestaurantMenuItem[]]
}>()

const { t } = useI18n()
const titleId = 'food-combo-title'
const main = ref<RestaurantMenuItem | null>(null)
const side = ref<RestaurantMenuItem | null>(null)
const drink = ref<RestaurantMenuItem | null>(null)

watch(
  () => props.open,
  (isOpen, _, onCleanup) => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return
    }
    main.value = null
    side.value = null
    drink.value = null
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
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

const total = computed(() => {
  let sum = 0
  if (main.value) sum += priceOf(main.value)
  if (side.value) sum += priceOf(side.value)
  if (drink.value) sum += priceOf(drink.value)
  return sum
})

function submit() {
  if (!main.value) return
  const items = [main.value]
  if (side.value) items.push(side.value)
  if (drink.value) items.push(drink.value)
  emit('submit', items)
}
</script>
