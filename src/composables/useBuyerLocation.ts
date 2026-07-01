import { onMounted, ref } from 'vue'

const STORAGE_KEY = 'kkoo_buyer_area_label'
const DEFAULT_AREA = 'Kariakoo, DSM'

export function useBuyerLocation() {
  const areaLabel = ref(DEFAULT_AREA)
  const loading = ref(false)

  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved?.trim()) areaLabel.value = saved.trim()
    } catch {
      // ignore
    }

    if (!navigator.geolocation) return

    loading.value = true
    navigator.geolocation.getCurrentPosition(
      () => {
        loading.value = false
      },
      () => {
        loading.value = false
      },
      { timeout: 8000, maximumAge: 300_000 },
    )
  })

  function setAreaLabel(label: string) {
    const trimmed = label.trim()
    if (!trimmed) return
    areaLabel.value = trimmed
    try {
      localStorage.setItem(STORAGE_KEY, trimmed)
    } catch {
      // ignore
    }
  }

  return { areaLabel, loading, setAreaLabel }
}
