import { defineStore } from 'pinia'
import { login as loginRequest } from '../services/authServices'

const TOKEN_KEY = 'eventhub_token'
const USER_KEY = 'eventhub_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials) {
      const response = await loginRequest(credentials)

      this.token = response.data.token
      this.user = response.data.user

      localStorage.setItem(TOKEN_KEY, this.token)
      localStorage.setItem(USER_KEY, JSON.stringify(this.user))

      return response
    },

    setUser(user) {
      this.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.user = null

      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },

    restoreSession() {
      this.token = localStorage.getItem(TOKEN_KEY)

      const storedUser = localStorage.getItem(USER_KEY)
      this.user = storedUser ? JSON.parse(storedUser) : null
    }
  }
})