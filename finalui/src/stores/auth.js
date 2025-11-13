import { defineStore } from 'pinia'
import axiosInstance from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    sessionId: localStorage.getItem('session-id') || null,
    profile: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.sessionId,
  },

  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null

      try {
        // Encode credentials (Base64)
        const credentials = btoa(`${username}:${password}`)

        // Send login request with Authorization header
        const response = await axiosInstance.post(
          '/api/',
          {},
          {
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          }
        )

        console.log('✅ Login response:', response.data)

        // Extract session ID from response
        const sessionId = response.data?.ss?.[0]?.[0]
        if (!sessionId) {
          throw new Error('No session ID returned from server')
        }

        // Store session data
        this.sessionId = sessionId
        this.profile = response.data.Profile || null

        localStorage.setItem('session-id', sessionId)
        
        // Set default Authorization header for future requests
        axiosInstance.defaults.headers.common['Session-Id'] = sessionId

        return true
      } catch (err) {
        console.error('❌ Login failed:', err)
        
        // Handle different error types
        if (err.response) {
          // Server responded with error
          this.error = err.response.data?.errors?.[0]?.[1] || 
                       err.response.data?.message || 
                       'Invalid username or password'
        } else if (err.request) {
          // Request made but no response
          this.error = 'Unable to connect to server. Please try again.'
        } else {
          // Something else happened
          this.error = err.message || 'Login failed. Please try again.'
        }
        
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.sessionId = null
      this.profile = null
      localStorage.removeItem('session-id')
      delete axiosInstance.defaults.headers.common['Session-Id']
    },

    // Initialize auth state on app load
    initializeAuth() {
      const sessionId = localStorage.getItem('session-id')
      if (sessionId) {
        this.sessionId = sessionId
        axiosInstance.defaults.headers.common['Session-Id'] = sessionId
      }
    },
  },
})