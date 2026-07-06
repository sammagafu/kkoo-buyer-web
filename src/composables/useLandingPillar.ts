import { ref } from 'vue'
import type { SuperAppPillarId } from '@/config/landing-superapp'

const activePillar = ref<SuperAppPillarId>('eat')

const pillarHashRe = /^#services-(eat|buy|go|sell)$/

export function parsePillarHash(hash: string): SuperAppPillarId | null {
  const m = hash.match(pillarHashRe)
  return m ? (m[1] as SuperAppPillarId) : null
}

export function useLandingPillar() {
  function setPillar(id: SuperAppPillarId) {
    activePillar.value = id
  }

  function navigateToPillar(id: SuperAppPillarId, scroll = true) {
    setPillar(id)
    const hash = `#services-${id}`
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash)
    }
    if (!scroll) return
    const root = document.querySelector('.mk-landing')
    const target =
      root?.querySelector<HTMLElement>('#services') ?? document.getElementById('services')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function syncPillarFromHash() {
    const parsed = parsePillarHash(window.location.hash)
    if (parsed) activePillar.value = parsed
  }

  return { activePillar, setPillar, navigateToPillar, syncPillarFromHash, parsePillarHash }
}
