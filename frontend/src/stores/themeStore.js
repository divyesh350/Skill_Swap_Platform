import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { STORAGE_KEYS } from '../constants'

export const useThemeStore = create(
  devtools(
    (set, get) => ({
      // State
      theme: 'system',

      // Actions
      setTheme: (theme) => {
        set({ theme })
        localStorage.setItem(STORAGE_KEYS.THEME, theme)
        
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          // System theme
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          if (isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },

      initTheme: () => {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
        const theme = savedTheme || 'system'
        get().setTheme(theme)
      },

      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'theme-store',
    }
  )
) 