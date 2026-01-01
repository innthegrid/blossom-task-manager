import { useState, useEffect } from 'react'
import {
  X,
  Plus,
  Tag,
  Edit2,
  Trash2,
} from 'lucide-react'
import { categoryService } from '../services/categoryService'
import CategoryIcon, { ICON_MAP } from '../components/CategoryIcon'

// Map string names to the actual Lucide components
const PRESET_ICONS = Object.keys(ICON_MAP)

const PRESET_COLORS = [
  '#7d7d7d',
  '#a67e6f',
  '#ff9191',
  '#FFB347',
  '#f2bf16',
  '#87cf51',
  '#3ad6af',
  '#519aed',
  '#807feb',
  '#bb7be8',
  '#e87bdd',
]

const CategoryManagerModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'Sprout',
    color: '#ff8fa5ff',
  })

  // Helper to render the icon dynamically
  const IconComponent = ({ name, className }) => {
    const LucideIcon = ICON_MAP[name] || Tag
    return <LucideIcon className={className} />
  }

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
      resetForm()
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
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setNewCategory({ name: '', icon: 'Sprout', color: '#FFB7C5' })
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-blossom-bg">
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

        <div className="flex-1 overflow-y-auto p-6">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-blossom-outline w-full mb-6"
            >
              <Plus className="w-4 h-4 mr-2 inline" /> Add New Category
            </button>
          )}

          {showForm && (
            <div className="card-blossom mb-6 bg-blossom-bg/10">
              <h3 className="font-medium text-blossom-dark mb-4">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <form
                onSubmit={
                  editingCategory ? handleUpdateCategory : handleCreateCategory
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-blossom-pink mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="input-blossom w-full"
                    placeholder="e.g., Garden, Reading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-blossom-pink mb-1">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() =>
                          setNewCategory({ ...newCategory, icon: iconName })
                        }
                        className={`p-2 flex items-center justify-center rounded-lg transition-all ${
                          newCategory.icon === iconName
                            ? 'bg-blossom-pink text-white scale-110 shadow-sm'
                            : 'bg-white text-blossom-pink hover:bg-blossom-bg'
                        }`}
                      >
                        <IconComponent name={iconName} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-blossom-pink mb-1">
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
                        className={`w-6 h-6 rounded-full transition-transform ${
                          newCategory.color === color
                            ? 'ring-2 ring-blossom-dark ring-offset-2 scale-110'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="btn-blossom flex-1 py-2">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-blossom-outline flex-1 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-medium text-blossom-dark">
              Current Categories
            </h3>
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border border-blossom-bg group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    <IconComponent name={category.icon} className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-blossom-dark">
                    {category.name}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingCategory(category)
                      setNewCategory(category)
                      setShowForm(true)
                    }}
                    className="p-1 text-blossom-pink hover:text-blossom-dark"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-blossom-pink hover:text-blossom-red-text"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryManagerModal
