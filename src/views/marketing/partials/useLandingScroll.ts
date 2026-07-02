import { useRoute } from 'vue-router'

export function useLandingScroll() {
  const route = useRoute()

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

  function onAnchorClick(id: string, event: MouseEvent) {
    if (route.name !== 'pages.landing') return
    event.preventDefault()
    scrollToSection(id)
  }

  return { scrollToSection, onAnchorClick }
}
