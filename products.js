import { defineStore } from 'pinia'
import { productsApi } from '@/api/products'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    currentProduct: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchProducts() {
      try {
        this.loading = true
        this.error = null
        
        const products = await productsApi.getAll()
        this.products = products
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(productId) {
      try {
        this.loading = true
        this.error = null
        
        const product = await productsApi.getById(productId)
        this.currentProduct = product
        return product
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(productId) {
      try {
        this.loading = true
        this.error = null
        
        await productsApi.delete(productId)
        this.products = this.products.filter(p => p.id !== productId)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(product) {
      try {
        this.loading = true
        this.error = null
        
        const updatedProduct = await productsApi.update(product.id, product)
        const index = this.products.findIndex(p => p.id === updatedProduct.id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        return updatedProduct
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Helper methods
    setCurrentProduct(product) {
      this.currentProduct = product
    },

    clearCurrentProduct() {
      this.currentProduct = null
    },

    clearError() {
      this.error = null
    }
  },

  getters: {
    allProducts: state => state.products,
    currentProduct: state => state.currentProduct,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error,
    
    // Új hasznos getterek
    getProductById: state => id => state.products.find(p => p.id === id),
    getProductsByCategory: state => category => 
      state.products.filter(p => p.category === category)
  }
}) 