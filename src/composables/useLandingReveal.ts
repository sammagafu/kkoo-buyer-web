import { onMounted, onUnmounted, type Ref } from 'vue'

export function useLandingReveal(target: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = target.value
    if (!el) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      el.classList.add('is-inview')
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}

export function observeRevealChildren(root: HTMLElement | null) {
  if (!root) return () => {}

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('.ui-reveal, .lp-premium-reveal'))

  if (prefersReduced) {
    for (const node of nodes) node.classList.add('is-inview')
    return () => {}
  }

  // Stagger siblings inside the same container for a cascading reveal.
  const byParent = new Map<Element, HTMLElement[]>()
  for (const node of nodes) {
    const parent = node.parentElement
    if (!parent) continue
    const group = byParent.get(parent) ?? []
    group.push(node)
    byParent.set(parent, group)
  }
  for (const group of byParent.values()) {
    group.forEach((node, i) => {
      node.style.setProperty('--reveal-delay', `${Math.min(i * 90, 540)}ms`)
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -28px 0px' },
  )

  for (const node of nodes) observer.observe(node)
  return () => observer.disconnect()
}
