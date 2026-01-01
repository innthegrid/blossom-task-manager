import api from '../api/axiosConfig'

export const taskService = {
  // Get all tasks for user
  async getTasks(filters = {}) {
    try {
      const response = await api.get('/tasks', { params: filters })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get tasks' }
    }
  },

  // Get a single task
  async getTask(id) {
    try {
      const response = await api.get(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get task' }
    }
  },

  // Create a new task
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create task' }
    }
  },

  // Update a task
  async updateTask(id, updates) {
    try {
      // Clean the updates object before sending
      const cleanedUpdates = { ...updates };

      // Convert empty categoryId to null
      if (cleanedUpdates.categoryId === '') {
        cleanedUpdates.categoryId = null;
      }

      // Convert empty dueDate to null
      if (cleanedUpdates.dueDate === '') {
        cleanedUpdates.dueDate = null;
      }

      console.log('Sending cleaned updates:', cleanedUpdates); // Debug

      const response = await api.put(`/tasks/${id}`, cleanedUpdates);
      return response.data;
    } catch (error) {
      console.error('Update task error details:', {
        error: error.response?.data,
        status: error.response?.status,
        updates: updates
      });
      throw error.response?.data || { error: 'Failed to update task' };
    }
  },

  // Delete a task
  async deleteTask(id) {
    try {
      const response = await api.delete(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete task' }
    }
  },

  // Toggle task completion
  async toggleTask(id, completed) {
    try {
      const response = await api.patch(`/tasks/${id}/toggle`, { completed })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to toggle task' }
    }
  },

  // Get task statistics
  async getStats() {
    try {
      const response = await api.get('/tasks/stats')
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get stats' }
    }
  }
}