import axios from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '../constants'

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // GET request
  async get(url, config) {
    return this.client.get(url, config)
  }

  // POST request
  async post(url, data, config) {
    return this.client.post(url, data, config)
  }

  // PUT request
  async put(url, data, config) {
    return this.client.put(url, data, config)
  }

  // PATCH request
  async patch(url, data, config) {
    return this.client.patch(url, data, config)
  }

  // DELETE request
  async delete(url, config) {
    return this.client.delete(url, config)
  }

  // Upload file
  async upload(url, formData, config) {
    return this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

export const apiClient = new ApiClient() 