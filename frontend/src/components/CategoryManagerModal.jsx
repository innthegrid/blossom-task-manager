import { useState, useEffect } from 'react'
import { X, Plus, Tag, Edit2, Trash2, Check } from 'lucide-react'
import { categoryService } from '../services/categoryService'

// Preset icons for categories
const PRESET_ICONS = [
  '🌸',
  '📚',
  '💼',
  '🏠',
  '🛒',
  '🏋️',
  '🎨',
  '🎵',
  '✈️',
  '🎓',
  '💻',
  '📞',
  '🍽️',
  '🧹',
  '💵',
  '❤️',
  '🐾',
  '🌱',
  '🎯',
  '📅',
]

const PRESET_COLORS = [
  '#FFB7C5',
  '#D4A5A5',
  '#7bd4b3',
  '#FFDAC1',
  '#B5B5FF',
  '#FFB347',
  '#C7CEEA',
  '#FF9AA2',
  '#79cad1',
  '#E2F0CB',
]

const CategoryManagerModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🌸',
    color: '#FFB7C5',
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      await categoryService.createCategory(newCategory)
      setShowForm(false)
      setNewCategory({ name: '', icon: '🌸', color: '#FFB7C5' })
      fetchCategories()
      onCategoryCreated?.()
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    try {
      await categoryService.updateCategory(editingCategory.id, newCategory)
      setShowForm(false)
      setEditingCategory(null)
      setNewCategory({ name: '', icon: '🌸', color: '#FFB7C5' })
      fetchCategories()
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        'Delete this category? Tasks in this category will become uncategorized.'
      )
    ) {
      try {
        await categoryService.deleteCategory(categoryId)
        fetchCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-blossom shadow-blossom max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-blossom-bg">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blossom-dark" />
            <h2 className="text-xl font-heading text-blossom-dark">
              Manage Categories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-blossom-pink hover:text-blossom-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Category Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex btn-blossom-outline w-full mb-6"
            >
              + Add New Category
            </button>
          )}

          {/* Category Form */}
          {showForm && (
            <div className="card-blossom mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-blossom-dark">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                    setNewCategory({ name: '', icon: '🌸', color: '#FFB7C5' })
                  }}
                  className="text-blossom-pink hover:text-blossom-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={
                  editingCategory ? handleUpdateCategory : handleCreateCategory
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-blossom-dark mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="input-blossom"
                    placeholder="e.g., Work, Personal, Health"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blossom-dark mb-2">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_ICONS.slice(0, 10).map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewCategory({ ...newCategory, icon })}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg ${
                          newCategory.icon === icon
                            ? 'ring-2 ring-blossom-pink bg-blossom-bg'
                            : 'bg-blossom-bg hover:bg-blossom-pink/10'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blossom-dark mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setNewCategory({ ...newCategory, color })
                        }
                        className={`w-8 h-8 rounded-full ${
                          newCategory.color === color
                            ? 'ring-2 ring-blossom-dark ring-offset-2'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="btn-blossom flex-1 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCategory(null)
                      setNewCategory({ name: '', icon: '🌸', color: '#FFB7C5' })
                    }}
                    className="btn-blossom-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-3">
            <h3 className="font-medium text-blossom-dark mb-2">
              Your Categories ({categories.length})
            </h3>

            {categories.length === 0 ? (
              <div className="text-center py-8 text-blossom-pink">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No categories yet. Create your first one!</p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blossom-bg group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-blossom-dark">
                        {category.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingCategory(category)
                        setNewCategory({
                          name: category.name,
                          icon: category.icon,
                          color: category.color,
                        })
                        setShowForm(true)
                      }}
                      className="text-blossom-pink hover:text-blossom-dark"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-blossom-pink hover:text-blossom-red-text"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blossom-bg">
          <button onClick={onClose} className="btn-blossom w-full">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryManagerModal
