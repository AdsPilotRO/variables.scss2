import { defineStore } from 'pinia'
import axios from '@/axios'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('/admin/users')
        this.users = response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateUserRole(userId, isAdmin) {
      this.isLoading = true
      this.error = null
      
      try {
        await axios.put(`/admin/users/${userId}/role`, { is_admin: isAdmin })
        // Frissítjük a felhasználót a listában
        const user = this.users.find(u => u.id === userId)
        if (user) {
          user.is_admin = isAdmin
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateUserStatus(userId, status) {
      this.isLoading = true
      this.error = null
      
      try {
        await axios.put(`/admin/users/${userId}/status`, { status })
        // Frissítjük a felhasználót a listában
        const user = this.users.find(u => u.id === userId)
        if (user) {
          user.status = status
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    }
  },

  getters: {
    hasError: state => !!state.error,
    errorMessage: state => state.error,
    activeUsers: state => state.users.filter(user => user.status === 'active'),
    adminUsers: state => state.users.filter(user => user.is_admin),
    regularUsers: state => state.users.filter(user => !user.is_admin)
  }
}) 