import api from '../api/axiosConfig'

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken)
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      // Check for backend validation errors
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      } else if (error.response?.data?.errors) {
        // Handle express-validator errors
        const errors = error.response.data.errors
        const errorMessages = errors.map(err => err.msg).join(', ')
        throw new Error(errorMessages)
      }
      throw new Error('Registration failed. Please try again.')
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken)
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' }
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get profile' }
    }
  },

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  async validateToken() {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return { valid: false }
      
      const response = await api.post('/auth/validate')
      return response.data
    } catch (error) {
      return { valid: false }
    }
  }
}