import { computed } from 'vue'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'

export function useLandingScroll() {
  const route = useRoute()
  const router = useRouter()

  const isLandingPage = computed(() => route.name === 'pages.landing')

  function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
    const root = document.querySelector('.mk-landing')
    const target =
      root?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ?? document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior, block: 'start' })
    const hash = `#${id}`
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash)
    }
  }

  function sectionTo(id: string): RouteLocationRaw {
    return isLandingPage.value ? { hash: `#${id}` } : { path: '/', hash: `#${id}` }
  }

  function sectionHref(id: string): string {
    return isLandingPage.value ? `#${id}` : `/#${id}`
  }

  function onAnchorClick(id: string, event: MouseEvent) {
    event.preventDefault()
    if (isLandingPage.value) {
      scrollToSection(id)
      return
    }
    void router.push({ path: '/', hash: `#${id}` })
  }

  return { isLandingPage, scrollToSection, sectionTo, sectionHref, onAnchorClick }
}
