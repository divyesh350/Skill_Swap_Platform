import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { STORAGE_KEYS } from '../constants'
import { authService } from '../services/authService'

export const useUserStore = create(
  devtools(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
        if (user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER)
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.login(email, password)
          get().setUser(response.data.user)
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token)
        } catch (error) {
          set({ error: error.message || 'Login failed' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.register(userData)
          get().setUser(response.data.user)
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token)
        } catch (error) {
          set({ error: error.message || 'Registration failed' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        get().setUser(null)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
          const userData = localStorage.getItem(STORAGE_KEYS.USER)

          if (token && userData) {
            const user = JSON.parse(userData)
            set({ user, isAuthenticated: true })
            
            // Verify token with backend
            try {
              await authService.verifyToken()
            } catch {
              get().logout()
            }
          }
        } catch (error) {
          get().logout()
        }
      },

      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.updateProfile(profileData)
          get().setUser(response.data.user)
        } catch (error) {
          set({ error: error.message || 'Profile update failed' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'user-store',
    }
  )
) 