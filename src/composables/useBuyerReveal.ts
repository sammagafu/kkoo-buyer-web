import { onMounted, onUnmounted, type Ref } from 'vue'

function revealNode(
  node: HTMLElement,
  index: number,
  observer: IntersectionObserver | null,
) {
  if (node.classList.contains('is-visible')) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    node.classList.add('is-visible')
    return
  }

  node.style.setProperty('--buyer-reveal-delay', `${Math.min(index * 70, 420)}ms`)

  const rect = node.getBoundingClientRect()
  if (rect.top < window.innerHeight * 0.92) {
    node.classList.add('is-visible')
    return
  }

  observer?.observe(node)
}

/** Staggered house-style reveal for dashboard sections / tiles (incl. async v-if blocks). */
export function useBuyerReveal(
  root: Ref<HTMLElement | null>,
  selector = '.buyer-reveal',
) {
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null
  let nodeIndex = 0

  function scanRoot(el: HTMLElement) {
    const nodes = el.querySelectorAll<HTMLElement>(`${selector}:not(.is-visible)`)
    nodes.forEach((node) => revealNode(node, nodeIndex++, observer))
  }

  onMounted(() => {
    const el = root.value
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
      )
    }

    scanRoot(el)

    mutationObserver = new MutationObserver(() => {
      scanRoot(el)
    })
    mutationObserver.observe(el, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    mutationObserver?.disconnect()
  })
}
