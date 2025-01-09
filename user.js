import { defineStore } from 'pinia'
import axios from '@/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    favorites: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProfile() {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get('/users/profile')
        this.profile = response.data
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.put('/users/profile', profileData)
        this.profile = { ...this.profile, ...response.data }
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchFavorites() {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get('/favorites')
        this.favorites = response.data
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(productId) {
      try {
        this.loading = true
        this.error = null
        
        await axios.post(`/favorites/${productId}`)
        await this.fetchFavorites() // Frissítjük a kedvencek listáját
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromFavorites(productId) {
      try {
        this.loading = true
        this.error = null
        
        await axios.delete(`/favorites/${productId}`)
        this.favorites = this.favorites.filter(item => item.id !== productId)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Helper methods
    clearProfile() {
      this.profile = null
    },

    clearFavorites() {
      this.favorites = []
    },

    clearError() {
      this.error = null
    }
  },

  getters: {
    userProfile: state => state.profile,
    userFavorites: state => state.favorites,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error,
    
    // Új hasznos getterek
    isFavorite: state => productId => 
      state.favorites.some(item => item.id === productId),
    favoritesCount: state => state.favorites.length
  }
}) 