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
          <template v-for="(kind, i) in flow" :key="kind">
            <span v-if="i > 0" class="food-combo__rail" />
            <span class="food-combo__step" :class="{ 'is-done': step > i, 'is-active': step === i }">{{ i + 1 }}</span>
          </template>
        </div>

        <section v-if="currentKind !== 'review'" class="food-combo__section">
          <h3>
            {{ stepTitle }}
            <span :class="currentKind === 'main' ? 'food-combo__req' : 'food-combo__opt'">
              {{ currentKind === 'main' ? t('buyerXp.eats.comboRequired') : t('buyerXp.eats.comboOptional') }}
            </span>
          </h3>
          <div class="food-combo__chips" role="listbox" :aria-label="stepTitle">
            <button
              v-for="item in currentItems"
              :key="`${currentKind}-${item.id}`"
              type="button"
              role="option"
              class="food-combo__chip"
              :class="{ 'is-selected': selected?.id === item.id }"
              :aria-selected="selected?.id === item.id"
              @click="pick(item)"
            >
              <span class="food-combo__chip-name">{{ item.title }}</span>
              <span class="food-combo__chip-price">{{ formatTzs(priceOf(item)) }}</span>
            </button>
          </div>
        </section>

        <section v-else class="food-combo__section">
          <h3>{{ t('buyerXp.eats.comboReview') }}</h3>
          <ul class="food-combo__review">
            <li v-if="main"><span>{{ main.title }}</span><strong>{{ formatTzs(priceOf(main)) }}</strong></li>
            <li v-if="side"><span>{{ side.title }}</span><strong>{{ formatTzs(priceOf(side)) }}</strong></li>
            <li v-if="drink"><span>{{ drink.title }}</span><strong>{{ formatTzs(priceOf(drink)) }}</strong></li>
          </ul>
        </section>

        <footer class="food-combo__footer">
          <div class="food-combo__total">
            <span>{{ t('buyerXp.eats.comboTotal') }}</span>
            <strong>{{ formatTzs(total) }}</strong>
          </div>
          <div class="food-combo__nav">
            <button v-if="step > 0" type="button" class="food-combo__back" @click="back">
              {{ t('buyerXp.eats.comboBack') }}
            </button>
            <button
              v-if="currentKind !== 'review'"
              type="button"
              class="food-combo__submit kkoo-btn kkoo-btn--primary kkoo-btn--block kkoo-btn--lg"
              :disabled="currentKind === 'main' && !main"
              @click="next"
            >
              <span class="kkoo-btn__label">
                {{ currentKind === 'main' || selected ? t('buyerXp.eats.comboNext') : t('buyerXp.eats.comboSkip') }}
              </span>
            </button>
            <template v-else>
              <button
                type="button"
                class="food-combo__submit kkoo-btn kkoo-btn--primary kkoo-btn--block kkoo-btn--lg"
                :disabled="!main || adding"
                @click="submit(false)"
              >
                <span class="kkoo-btn__label">
                  {{ adding ? t('buyerXp.eats.comboAdding') : t('buyerXp.eats.comboAdd') }}
                </span>
              </button>
              <button
                type="button"
                class="food-combo__book"
                :disabled="!main || adding"
                @click="submit(true)"
              >
                {{ t('buyerXp.eats.comboAndBook') }}
              </button>
              <p class="food-combo__hint">{{ t('buyerXp.eats.comboBookHint') }}</p>
            </template>
          </div>
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
  submit: [items: RestaurantMenuItem[], bookTable: boolean]
}>()

const { t } = useI18n()
const titleId = 'food-combo-title'
const step = ref(0)
const main = ref<RestaurantMenuItem | null>(null)
const side = ref<RestaurantMenuItem | null>(null)
const drink = ref<RestaurantMenuItem | null>(null)

const flow = computed(() => {
  const kinds: Array<'main' | 'side' | 'drink' | 'review'> = ['main']
  if (props.sides.length) kinds.push('side')
  if (props.drinks.length) kinds.push('drink')
  kinds.push('review')
  return kinds
})

const currentKind = computed(() => flow.value[step.value] ?? 'review')
const currentItems = computed(() => {
  if (currentKind.value === 'side') return props.sides
  if (currentKind.value === 'drink') return props.drinks
  return props.mains
})
const selected = computed(() => {
  if (currentKind.value === 'side') return side.value
  if (currentKind.value === 'drink') return drink.value
  if (currentKind.value === 'main') return main.value
  return null
})
const stepTitle = computed(() => {
  if (currentKind.value === 'side') return t('buyerXp.eats.comboSide')
  if (currentKind.value === 'drink') return t('buyerXp.eats.comboDrink')
  return t('buyerXp.eats.comboMain')
})

function pick(item: RestaurantMenuItem) {
  if (currentKind.value === 'side') {
    side.value = side.value?.id === item.id ? null : item
    return
  }
  if (currentKind.value === 'drink') {
    drink.value = drink.value?.id === item.id ? null : item
    return
  }
  main.value = item
  next()
}

function next() {
  if (currentKind.value === 'main' && !main.value) return
  if (step.value < flow.value.length - 1) step.value += 1
}

function back() {
  if (step.value > 0) step.value -= 1
}

watch(
  () => props.open,
  (isOpen, _, onCleanup) => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return
    }
    step.value = 0
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

function submit(bookTable: boolean) {
  if (!main.value) return
  const items = [main.value]
  if (side.value) items.push(side.value)
  if (drink.value) items.push(drink.value)
  emit('submit', items, bookTable)
}
</script>
