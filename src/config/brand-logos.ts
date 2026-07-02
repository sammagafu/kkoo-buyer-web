/** App icon — same assets as the index.html splash screen. */
export const brandIconLogo = {
  light: '/logo-icon.svg',
  dark: '/logo-icon-dark.svg',
} as const

export function brandIconLogoForTheme(theme: 'light' | 'dark'): string {
  return theme === 'dark' ? brandIconLogo.dark : brandIconLogo.light
}
