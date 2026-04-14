export type AppTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'workout-app:theme'

export function getSystemThemePreference(): AppTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function loadThemeFromStorage(): AppTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const rawValue = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (rawValue === 'light' || rawValue === 'dark') {
    return rawValue
  }

  return getSystemThemePreference()
}

export function saveThemeToStorage(theme: AppTheme): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function applyThemeToDocument(theme: AppTheme): void {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', theme)
}
