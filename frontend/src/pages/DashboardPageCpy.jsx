import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  Tag,
  Filter,
  ChevronDown,
  Edit2,
  Trash2,
  ChevronRight,
  Star,
  X,
  Check
} from 'lucide-react'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'

const DashboardPage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all'
  })

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    tags: []
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getTasks(),
        categoryService.getCategories()
      ])
      setTasks(tasksData.tasks || [])
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle task completion
  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      await taskService.updateTask(taskId, { status: newStatus })
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      await taskService.createTask(newTask)
      setShowTaskForm(false)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categoryId: '',
        tags: []
      })
      fetchData() // Refresh tasks
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId)
        setTasks(tasks.filter(task => task.id !== taskId))
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      categoryId: task.categoryId || '',
      tags: task.tags || []
    })
    setShowTaskForm(true)
  }

  // Update a task
  const handleUpdateTask = async (e) => {
    e.preventDefault()
    try {
      await taskService.updateTask(editingTask.id, newTask)
      setShowTaskForm(false)
      setEditingTask(null)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        categoryId: '',
        tags: []
      })
      fetchData() // Refresh tasks
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false
    if (filters.category !== 'all' && task.categoryId !== filters.category) return false
    return true
  })

  // Stats calculations
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false
      return new Date(t.dueDate) < new Date()
    }).length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    mediumPriority: tasks.filter(t => t.priority === 'medium').length,
    lowPriority: tasks.filter(t => t.priority === 'low').length
  }

  // Priority colors
  const priorityColors = {
    high: 'bg-blossom-red-bg text-blossom-red-text',
    medium: 'bg-blossom-yellow-bg text-blossom-yellow-text',
    low: 'bg-blossom-green-bg text-blossom-green-text'
  }

  // Status icons
  const statusIcons = {
    completed: <CheckCircle className="w-5 h-5 text-blossom-green-text" />,
    pending: <Clock className="w-5 h-5 text-blossom-yellow-text" />,
    overdue: <AlertCircle className="w-5 h-5 text-blossom-red-text" />
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-blossom-pink">Loading your blossom garden...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      {/* Header with Quick Add */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-blossom-dark">
              Your Blossom Garden
            </h1>
            <p className="text-blossom-pink mt-1">
              {stats.total} petals growing • {stats.completed} bloomed
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn-blossom flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            Add New Petal
          </button>
        </div>
      </div>

      {/* Task Creation/Editing Form */}
      {showTaskForm && (
        <div className="card-blossom mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-heading text-blossom-dark">
              {editingTask ? 'Edit Petal' : 'Plant a New Petal'}
            </h3>
            <button
              onClick={() => {
                setShowTaskForm(false)
                setEditingTask(null)
                setNewTask({
                  title: '',
                  description: '',
                  priority: 'medium',
                  dueDate: '',
                  categoryId: '',
                  tags: []
                })
              }}
              className="text-blossom-pink hover:text-blossom-dark"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blossom-dark mb-1">
                Petal Title *
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="input-blossom"
                placeholder="What needs to grow?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blossom-dark mb-1">
                Description
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="input-blossom resize-none min-h-[80px]"
                placeholder="Add details about this petal..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blossom-dark mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="input-blossom"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-blossom-dark mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="input-blossom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blossom-dark mb-1">
                Category
              </label>
              <select
                value={newTask.categoryId}
                onChange={(e) => setNewTask({...newTask, categoryId: e.target.value})}
                className="input-blossom"
              >
                <option value="">No Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="btn-blossom flex-1 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingTask ? 'Update Petal' : 'Plant Petal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTaskForm(false)
                  setEditingTask(null)
                  setNewTask({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    categoryId: '',
                    tags: []
                  })
                }}
                className="btn-blossom-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card-blossom mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blossom-dark" />
            <span className="text-blossom-dark font-medium">Filter Petals</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="input-blossom text-sm py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Growing</option>
              <option value="completed">Bloomed</option>
              <option value="overdue">Wilting</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="input-blossom text-sm py-2"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="input-blossom text-sm py-2"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="card-blossom text-center py-12">
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-heading text-blossom-dark mb-2">
              Your garden is empty
            </h3>
            <p className="text-blossom-pink mb-6">
              Plant your first petal to start growing!
            </p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-blossom"
            >
              <Plus className="w-5 h-5 mr-2" />
              Plant Your First Petal
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="card-blossom group">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleTask(task.id, task.status)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status === 'completed'
                      ? 'bg-blossom-green-text border-blossom-green-text'
                      : 'border-blossom-pink hover:border-blossom-dark'
                  }`}
                >
                  {task.status === 'completed' && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className={`${task.status === 'completed' ? 'line-through text-blossom-pink' : ''}`}>
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium text-blossom-dark ${task.status === 'completed' ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-2">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-1">
                          {statusIcons[task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'overdue' : task.status]}
                        </div>
                        
                        {/* Edit & Delete Buttons */}
                        <button
                          onClick={() => handleStartEdit(task)}
                          className="opacity-0 group-hover:opacity-100 text-blossom-pink hover:text-blossom-dark transition-opacity"
                          title="Edit task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-blossom-pink hover:text-blossom-red-text transition-opacity"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-blossom-pink text-sm mt-1">
                        {task.description}
                      </p>
                    )}

                    {/* Task Metadata */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {/* Priority Badge */}
                      <span className={`petal-badge ${priorityColors[task.priority]}`}>
                        <Star className="w-3 h-3 mr-1" />
                        {task.priority} priority
                      </span>

                      {/* Category */}
                      {task.category && (
                        <span className="inline-flex items-center gap-1 text-blossom-pink text-sm">
                          <Tag className="w-3 h-3" />
                          {task.category.name}
                        </span>
                      )}

                      {/* Due Date */}
                      {task.dueDate && (
                        <span className="inline-flex items-center gap-1 text-blossom-pink text-sm">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blossom-bg text-blossom-pink text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats Sidebar */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-pink text-sm">Total Petals</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-pink/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌸</span>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-pink text-sm">Bloomed</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-green-bg rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blossom-green-text" />
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-pink text-sm">Growing</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-yellow-bg rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blossom-yellow-text" />
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-pink text-sm">Wilting</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.overdue}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-red-bg rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blossom-red-text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage