import { apiClient } from './apiClient'

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Verify token
  async verifyToken() {
    try {
      const response = await apiClient.get('/auth/verify')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token verification failed')
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed')
    }
  },

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await apiClient.upload('/auth/avatar', formData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Avatar upload failed')
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed')
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed')
    }
  },
} 