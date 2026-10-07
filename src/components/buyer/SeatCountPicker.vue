<template>
  <div class="seat-picker">
    <p v-if="label" class="seat-picker__label">{{ label }}</p>
    <svg
      class="seat-picker__table"
      :viewBox="`0 0 ${layout.w} ${layout.h}`"
      role="img"
      :aria-label="label || String(current)"
    >
      <rect x="1" y="1" :width="layout.w - 2" :height="layout.h - 2" rx="16" class="seat-picker__floor" />
      <ellipse :cx="layout.cx" :cy="layout.cy" :rx="layout.tableRx" :ry="layout.tableRy" class="seat-picker__top" />
      <g v-for="(chair, i) in layout.chairs" :key="i" :transform="`translate(${chair.x} ${chair.y}) rotate(${chair.rot})`">
        <rect
          :x="-chair.w / 2"
          :y="-chair.h / 2"
          :width="chair.w"
          :height="chair.h"
          rx="3"
          class="seat-picker__chair"
        />
      </g>
      <text :x="layout.cx" :y="layout.cy + 7" text-anchor="middle" class="seat-picker__count">
        {{ overflow ? '32+' : current }}
      </text>
    </svg>
    <div class="seat-picker__stepper">
      <button type="button" :disabled="current <= 1" @click="setCount(current - 1)">−</button>
      <strong>{{ overflow ? `${current} · 32+` : current }}</strong>
      <button type="button" :disabled="current >= ceiling" @click="setCount(current + 1)">+</button>
    </div>
    <div class="seat-picker__chips" role="group">
      <button
        v-for="n in quick"
        :key="n"
        type="button"
        :class="{ 'is-selected': current === n }"
        @click="setCount(n)"
      >
        {{ n }}
      </button>
      <button
        v-if="allowAboveMax && cap >= 32"
        type="button"
        :class="{ 'is-selected': overflow }"
        @click="setCount(33)"
      >
        32+
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const DRAW_CAP = 32

const props = withDefaults(
  defineProps<{
    modelValue: number
    maxSeats?: number
    allowAboveMax?: boolean
    aboveMaxLimit?: number
    label?: string
  }>(),
  {
    maxSeats: DRAW_CAP,
    allowAboveMax: false,
    aboveMaxLimit: 80,
    label: '',
  },
)

const emit = defineEmits<{ 'update:modelValue': [number] }>()

const cap = computed(() => Math.max(1, props.maxSeats))
const ceiling = computed(() => (props.allowAboveMax ? Math.max(cap.value, props.aboveMaxLimit) : cap.value))
const current = computed(() => Math.min(ceiling.value, Math.max(1, Number(props.modelValue) || 1)))
const overflow = computed(() => current.value > DRAW_CAP)
const drawn = computed(() => (overflow.value ? DRAW_CAP : current.value))

const quick = computed(() => {
  const values = [1, 2, 4, 6, 8, 12, 16, 24, 32].filter((n) => n <= cap.value && n <= DRAW_CAP)
  if (cap.value <= DRAW_CAP && !values.includes(cap.value)) values.push(cap.value)
  return values.sort((a, b) => a - b)
})

type Chair = { x: number; y: number; rot: number; w: number; h: number }

function ellipseCirc(rx: number, ry: number) {
  return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))
}

function evenAngles(n: number, rx: number, ry: number, stagger: boolean) {
  if (n <= 1) return [-Math.PI / 2]
  const samples = 720
  const lengths = [0]
  let prevX = rx * Math.cos(-Math.PI / 2)
  let prevY = ry * Math.sin(-Math.PI / 2)
  for (let i = 1; i <= samples; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / samples
    const x = rx * Math.cos(angle)
    const y = ry * Math.sin(angle)
    lengths.push(lengths[i - 1] + Math.hypot(x - prevX, y - prevY))
    prevX = x
    prevY = y
  }
  const step = lengths[samples] / n
  const offset = stagger ? step / 2 : 0
  const angles: number[] = []
  let cursor = 0
  for (let k = 0; k < n; k++) {
    const target = offset + step * k
    while (cursor < samples - 1 && lengths[cursor + 1] < target) cursor++
    angles.push(-Math.PI / 2 + (2 * Math.PI * cursor) / samples)
  }
  return angles
}

function ring(count: number, rx: number, ry: number, cx: number, cy: number, chairW: number, chairH: number, stagger: boolean): Chair[] {
  return evenAngles(count, rx, ry, stagger).map((angle) => ({
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle),
    rot: (angle * 180) / Math.PI + 90,
    w: chairW,
    h: chairH,
  }))
}

const layout = computed(() => {
  const n = drawn.value
  const h = n <= 8 ? 200 : n <= 16 ? 260 : 300
  const w = 320
  const cx = w / 2
  const cy = h / 2
  const chairW = n <= 6 ? 16 : n <= 14 ? 13 : 11
  const chairH = chairW * 0.68
  const minArc = chairW + 5
  const pad = chairH + 10
  const maxR = Math.min(w, h) / 2 - pad
  const maxRx = Math.min(w / 2 - pad, maxR * 1.12)
  const maxRy = Math.min(h / 2 - pad, maxR)
  const outerC = ellipseCirc(maxRx, maxRy)
  const twoRings = n > 8 && n * minArc > outerC

  if (!twoRings) {
    const scale = n <= 4 ? 0.78 : 0.92
    const rx = maxRx * scale
    const ry = maxRy * scale
    return {
      w,
      h,
      cx,
      cy,
      tableRx: Math.max(26, rx - chairH - 8),
      tableRy: Math.max(18, ry - chairH - 6),
      chairs: ring(n, rx, ry, cx, cy, chairW, chairH, false),
    }
  }

  const innerRx = maxRx * 0.6
  const innerRy = maxRy * 0.6
  const innerC = ellipseCirc(innerRx, innerRy)
  let innerN = Math.max(1, Math.min(n - 1, Math.round((n * innerC) / (innerC + outerC))))
  while (innerN > 1 && innerN * minArc > innerC) innerN--
  return {
    w,
    h,
    cx,
    cy,
    tableRx: Math.max(22, innerRx - chairH - 12),
    tableRy: Math.max(16, innerRy - chairH - 10),
    chairs: [
      ...ring(innerN, innerRx, innerRy, cx, cy, chairW, chairH, false),
      ...ring(n - innerN, maxRx, maxRy, cx, cy, chairW, chairH, true),
    ],
  }
})

function setCount(n: number) {
  emit('update:modelValue', Math.min(ceiling.value, Math.max(1, n)))
}
</script>

<style scoped>
.seat-picker {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
  width: min(100%, 22rem);
  max-width: 22rem;
}

.seat-picker__label {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
}

.seat-picker__table {
  width: 100%;
  height: auto;
  background: var(--bs-tertiary-bg, #f6f3f8);
  border-radius: 16px;
}

.seat-picker__floor {
  fill: transparent;
}

.seat-picker__top {
  fill: var(--bs-primary, #5c308f);
  stroke: #3b1a5a;
  stroke-width: 2;
}

.seat-picker__chair {
  fill: #f7a829;
  stroke: #e8940f;
}

.seat-picker__count {
  fill: #fff;
  font-size: 22px;
  font-weight: 700;
}

.seat-picker__stepper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.85rem;
  width: 100%;
}

.seat-picker__stepper button {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.3);
  background: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
}

.seat-picker__stepper button:disabled {
  opacity: 0.4;
  cursor: default;
}

.seat-picker__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.seat-picker__chips button {
  min-width: 2.4rem;
  min-height: 2.2rem;
  border-radius: 999px;
  border: 1.5px solid rgba(var(--bs-primary-rgb, 92, 48, 143), 0.25);
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}

.seat-picker__chips button.is-selected {
  background: var(--bs-primary, #5c308f);
  border-color: var(--bs-primary, #5c308f);
  color: #fff;
}
</style>
