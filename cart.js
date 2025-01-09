import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems')) || []
  }),

  actions: {
    addItem(item) {
      const existingItem = this.items.find(i => i.productId === item.productId)
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.items.push({ ...item })
      }
      this.saveToLocalStorage()
    },

    updateItemQuantity({ productId, quantity }) {
      const item = this.items.find(i => i.productId === productId)
      if (item) {
        item.quantity = quantity
        this.saveToLocalStorage()
      }
    },

    removeItem(productId) {
      this.items = this.items.filter(item => item.productId !== productId)
      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      localStorage.removeItem('cartItems')
    },

    // Helper method
    saveToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.items))
    }
  },

  getters: {
    cartItems: state => state.items,
    cartTotal: state => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    itemCount: state => state.items.reduce((count, item) => count + item.quantity, 0)
  }
}) 