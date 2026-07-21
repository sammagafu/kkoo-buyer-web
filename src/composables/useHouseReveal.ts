import { onMounted, onUnmounted, type Ref } from 'vue'

export function useHouseReveal(
  target: Ref<HTMLElement | null>,
  options: { immediate?: boolean } = {},
) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const node = target.value
    if (!node) return

    const show = () => node.classList.add('is-visible')

    if (
      options.immediate ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      show()
      return
    }

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      show()
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          show()
          observer?.unobserve(node)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
  })

  onUnmounted(() => observer?.disconnect())
}
