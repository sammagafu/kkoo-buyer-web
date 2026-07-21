import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

export type HouseTheme = 'light' | 'dark'

const STORAGE_KEY = 'kkoo-house-theme'

function systemTheme(): HouseTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readTheme(): HouseTheme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return systemTheme()
}

export function useHouseTheme(root: Ref<HTMLElement | null>) {
  const theme = ref<HouseTheme>('light')

  const apply = (next: HouseTheme) => {
    theme.value = next
    if (root.value) root.value.dataset.theme = next
  }

  let mq: MediaQueryList | null = null
  const onSystemChange = () => {
    if (!localStorage.getItem(STORAGE_KEY)) apply(systemTheme())
  }

  onMounted(() => {
    apply(readTheme())
    mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', onSystemChange)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', onSystemChange)
  })

  watch(
    () => root.value,
    (el) => {
      if (el) el.dataset.theme = theme.value
    },
  )

  const setTheme = (next: HouseTheme) => {
    localStorage.setItem(STORAGE_KEY, next)
    apply(next)
  }

  const toggleTheme = () => setTheme(theme.value === 'light' ? 'dark' : 'light')

  return { theme, setTheme, toggleTheme }
}
