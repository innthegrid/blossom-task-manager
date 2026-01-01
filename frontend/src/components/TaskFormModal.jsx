import { useState, useEffect } from 'react'
import { X, Calendar, Tag, Tags, Star, Check, Plus, Pencil } from 'lucide-react'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'

const TaskFormModal = ({ isOpen, onClose, editingTask, onTaskSaved }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    tags: [],
    subtasks: [],
  })

  const [newTag, setNewTag] = useState('')
  const [newSubtask, setNewSubtask] = useState('')

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCategories()
      if (editingTask) {
        // Format dueDate for the date input (YYYY-MM-DD)
        let formattedDueDate = ''
        if (editingTask.dueDate) {
          const date = new Date(editingTask.dueDate)
          formattedDueDate = date.toISOString().split('T')[0]
        }

        setFormData({
          title: editingTask.title,
          description: editingTask.description || '',
          priority: editingTask.priority,
          dueDate: formattedDueDate,
          categoryId: editingTask.categoryId || '',
          tags: editingTask.tags || [],
          subtasks: editingTask.subtasks || [],
        })
      } else {
        // Reset form for new task
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          categoryId: '',
          tags: [],
          subtasks: [],
        })
      }
    }
  }, [isOpen, editingTask])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData)
      } else {
        await taskService.createTask(formData)
      }

      onTaskSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData({
        ...formData,
        subtasks: [
          ...formData.subtasks,
          { title: newSubtask.trim(), completed: false },
        ],
      })
      setNewSubtask('')
    }
  }

  const handleRemoveSubtask = (index) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter((_, i) => i !== index),
    })
  }

  const handleToggleSubtask = (index) => {
    const updatedSubtasks = [...formData.subtasks]
    updatedSubtasks[index] = {
      ...updatedSubtasks[index],
      completed: !updatedSubtasks[index].completed,
    }
    setFormData({
      ...formData,
      subtasks: updatedSubtasks,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-blossom shadow-blossom max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 border-b border-blossom-bg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              {editingTask ? (
                <Pencil className="w-6 h-6 text-blossom-dark" />
              ) : (
                <Plus className="w-6 h-6 text-blossom-dark" />
              )}
            </div>
            <h2 className="text-xl font-heading text-blossom-dark">
              {editingTask ? 'Edit Flower' : 'Plant a New Flower'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-blossom-pink hover:text-blossom-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-blossom-dark mb-2">
                Flower Title*
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-blossom text-blossom-dark"
                placeholder="What needs to grow?"
                required
              />
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-blossom-dark mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-blossom text-blossom-dark resize-none min-h-[100px]"
                placeholder="Add details about this flower..."
              />
            </div>

            {/* Priority, Due Date, Category, Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-blossom-dark mb-2">
                  <Star className="w-4 h-4 inline mr-1" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="input-blossom text-blossom-dark"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-blossom-dark mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="input-blossom text-blossom-dark"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-blossom-dark mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="input-blossom text-blossom-dark"
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium text-blossom-dark mb-2">
                  <Tags className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <div className="space-y-2">
                  {/* Tags Display */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blossom-bg text-blossom-pink text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blossom-pink hover:text-blossom-dark transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tag Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      className="input-blossom text-blossom-dark flex-1"
                      placeholder="Add a tag..."
                    />
                  </div>
                  <p className="text-xs text-blossom-pink/70">
                    Press Enter to add tags for better organization
                  </p>
                </div>
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <label className="block text-sm font-medium text-blossom-dark mb-2">
                Subtasks
              </label>
              <div className="space-y-3">
                {/* Existing Subtasks */}
                {formData.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(index)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        subtask.completed
                          ? 'bg-blossom-green-text border-blossom-green-text'
                          : 'border-blossom-pink hover:border-blossom-dark'
                      }`}
                    >
                      {subtask.completed && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${subtask.completed ? 'line-through text-blossom-pink' : 'text-blossom-dark'}`}
                    >
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-blossom-pink hover:text-blossom-red-text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add New Subtask */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSubtask()
                      }
                    }}
                    className="input-blossom text-blossom-dark flex-1"
                    placeholder="Add a subtask..."
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="btn-blossom-outline whitespace-nowrap"
                  >
                    Add Subtask
                  </button>
                </div>
                <p className="text-xs text-blossom-pink/70">
                  Break down complex flowers into smaller petals
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-blossom flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingTask ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {editingTask ? 'Update Flower' : 'Plant Flower'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-blossom-outline flex-1"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer Hint */}
        <div className="px-6 pb-6 border-t border-blossom-bg bg-blossom-bg/30">
          <div className="flex items-center gap-2 text-sm text-blossom-pink">
            <span className="w-2 h-2 bg-blossom-pink rounded-full"></span>
            <p>Each flower makes your garden more beautiful!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskFormModal
