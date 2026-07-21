/** Canonical KKOO logo — same assets as the index.html splash screen. */
export const brandLogo = {
  light: '/logo-icon.svg',
  dark: '/logo-icon-dark.svg',
} as const

/** @deprecated Prefer brandLogo — kept for existing landing imports. */
export const brandIconLogo = brandLogo

export function brandLogoForTheme(theme: 'light' | 'dark'): string {
  return theme === 'dark' ? brandLogo.dark : brandLogo.light
}

/** @deprecated Prefer brandLogoForTheme */
export function brandIconLogoForTheme(theme: 'light' | 'dark'): string {
  return brandLogoForTheme(theme)
}
