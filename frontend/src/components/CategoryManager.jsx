import { useState } from 'react'
import { Tag, Plus, X, Edit2, Trash2 } from 'lucide-react'
import { categoryService } from '../services/categoryService'

// Preset icons for categories
const PRESET_ICONS = [
  '🌸', '📚', '💼', '🏠', '🛒', '🏋️', '🎨', '🎵', '✈️', '🎓',
  '💻', '📞', '🍽️', '🧹', '💵', '❤️', '🐾', '🌱', '🎯', '📅'
]

const PRESET_COLORS = [
  '#FFB7C5', '#D4A5A5', '#B5EAD7', '#FFDAC1', '#E2F0CB',
  '#B5B5FF', '#FFB347', '#C7CEEA', '#FF9AA2', '#FFB7B2'
]

const CategoryManager = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '🌸',
    color: '#FFB7C5'
  })

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

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
    if (window.confirm('Delete this category? Tasks will become uncategorized.')) {
      try {
        await categoryService.deleteCategory(categoryId)
        fetchCategories()
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading text-blossom-dark">Categories</h3>
        <button
          onClick={() => setShowForm(true)}
          className="text-blossom-pink hover:text-blossom-dark flex items-center gap-1 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="card-blossom">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blossom-dark">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h4>
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

          <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-3">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              className="input-blossom text-sm"
              placeholder="Category name"
              required
            />

            <div>
              <label className="block text-xs text-blossom-pink mb-1">Icon</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_ICONS.slice(0, 10).map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCategory({...newCategory, icon})}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      newCategory.icon === icon ? 'ring-2 ring-blossom-pink' : 'bg-blossom-bg'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-blossom-pink mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.slice(0, 10).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory({...newCategory, color})}
                    className={`w-6 h-6 rounded-full ${
                      newCategory.color === color ? 'ring-2 ring-blossom-dark' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="btn-blossom flex-1 text-sm py-2"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCategory(null)
                  setNewCategory({ name: '', icon: '🌸', color: '#FFB7C5' })
                }}
                className="btn-blossom-outline flex-1 text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-blossom-bg group"
          >
            <button
              onClick={() => onCategorySelect?.(category.id)}
              className="flex items-center gap-3 flex-1 text-left"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: category.color }}
              >
                <span className="text-sm">{category.icon}</span>
              </div>
              <span className="text-blossom-dark">{category.name}</span>
            </button>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingCategory(category)
                  setNewCategory({
                    name: category.name,
                    icon: category.icon,
                    color: category.color
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
        ))}

        {categories.length === 0 && !showForm && (
          <div className="text-center py-4 text-blossom-pink text-sm">
            <Tag className="w-4 h-4 mx-auto mb-2" />
            No categories yet. Create one to organize your petals!
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryManager