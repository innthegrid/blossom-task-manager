import api from '../api/axiosConfig'

export const categoryService = {
  // Get all categories for user
  async getCategories() {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get categories' }
    }
  },

  // Create a new category
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create category' }
    }
  },

  // Update a category
  async updateCategory(id, updates) {
    try {
      const response = await api.put(`/categories/${id}`, updates)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update category' }
    }
  },

  // Delete a category
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete category' }
    }
  }
}