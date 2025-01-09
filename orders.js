import { defineStore } from 'pinia'
import { ordersApi } from '@/api/orders'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchOrders() {
      try {
        this.loading = true
        this.error = null
        
        const orders = await ordersApi.getAll()
        this.orders = orders
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(orderData) {
      try {
        this.loading = true
        this.error = null
        
        const newOrder = await ordersApi.create(orderData)
        this.orders.unshift(newOrder)
        return newOrder
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchOrderById(orderId) {
      try {
        this.loading = true
        this.error = null
        
        const order = await ordersApi.getById(orderId)
        this.currentOrder = order
        return order
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Helper methods
    setError(error) {
      this.error = error
    },

    clearError() {
      this.error = null
    },

    clearCurrentOrder() {
      this.currentOrder = null
    }
  },

  getters: {
    allOrders: state => state.orders,
    currentOrder: state => state.currentOrder,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error
  }
}) 