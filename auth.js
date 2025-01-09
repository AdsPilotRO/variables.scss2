import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Hibás bejelentkezési adatok')
        }

        const data = await response.json()
        this.setToken(data.token)
        this.setUser(data.user)
        return data
      } catch (error) {
        throw error
      }
    },

    async initializeAuth() {
      if (this.token) {
        try {
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          })

          if (!response.ok) {
            throw new Error('Token érvénytelen')
          }

          const user = await response.json()
          this.setUser(user)
        } catch (error) {
          console.error('Auth inicializálási hiba:', error)
          if (error.message === 'Token érvénytelen') {
            this.logout()
          }
        }
      }
    },

    setToken(token) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    setUser(user) {
      this.user = user
      this.isAdmin = user?.isAdmin || false
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isAdmin', JSON.stringify(user.isAdmin || false))
      } else {
        localStorage.removeItem('user')
        localStorage.removeItem('isAdmin')
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAdmin = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isAdmin')
    }
  },

  getters: {
    isAuthenticated: state => !!state.token && !!state.user,
    currentUser: state => state.user,
    userIsAdmin: state => state.isAdmin
  }
}) 