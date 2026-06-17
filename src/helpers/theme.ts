export type AppTheme = 'light' | 'dark'

/** Apply Bootstrap + KKOO theme on <html> (works before/after mount). */
export function applyDocumentTheme(theme: AppTheme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-bs-theme', theme)
  root.classList.toggle('theme-dark', theme === 'dark')
  root.classList.toggle('theme-light', theme === 'light')
  root.style.colorScheme = theme
}
