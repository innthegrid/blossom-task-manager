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
  Check,
  Leaf,
  HeartPlus,
  ChartColumn,
  Sprout,
  Pencil,
} from 'lucide-react'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'
import CategoryManagerModal from '../components/CategoryManagerModal'

const DashboardPage = () => {
  // States
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
  })
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    tags: [],
  })
  const [showCategoryManager, setShowCategoryManager] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getTasks(),
        categoryService.getCategories(),
      ])
      setTasks(tasksData.tasks || [])
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
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
        tags: [],
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
        setTasks(tasks.filter((task) => task.id !== taskId))
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }
  }

  // Start editing a task
  const handleStartEdit = (task) => {
    console.log('Original task for editing:', task) // Debug log

    setEditingTask(task)

    // Format dueDate for the date input (YYYY-MM-DD)
    let formattedDueDate = ''
    if (task.dueDate) {
      const date = new Date(task.dueDate)
      // Get YYYY-MM-DD format for date input
      formattedDueDate = date.toISOString().split('T')[0]
    }

    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: formattedDueDate,
      categoryId: task.categoryId || '',
      tags: task.tags || [],
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
        tags: [],
      })
      fetchData() // Refresh tasks
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  // Check if task is overdue
  const checkIsOverdue = (task) => {
    if (!task.dueDate || task.status === 'completed') return false
    const [year, month, day] = task.dueDate.split('T')[0].split('-').map(Number)
    const dueDate = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  // Toggle task completion
  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
      await taskService.updateTask(taskId, { status: newStatus })

      // Update local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  // Filter tasks based on current filteres
  const filteredTasks = tasks.filter((task) => {
    const isActuallyOverdue = checkIsOverdue(task)

    // Status Filter Logic
    if (filters.status !== 'all') {
      if (filters.status === 'overdue') {
        // "Overdue" filter: Show ONLY tasks that are overdue
        if (!isActuallyOverdue) return false
      } else if (filters.status === 'pending') {
        // "Growing" filter: Show anything NOT completed (includes Overdue + Pending)
        if (task.status === 'completed') return false
      } else if (filters.status === 'completed') {
        // "Completed" filter: Show ONLY completed
        if (task.status !== 'completed') return false
      }
    }

    // Priority and Category Filters
    if (filters.priority !== 'all' && task.priority !== filters.priority)
      return false
    if (filters.category !== 'all' && task.categoryId !== filters.category)
      return false

    return true
  })

  // Stats calculation
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    // Fix: Using the same logic as your date helper for consistency
    overdue: tasks.filter((t) => checkIsOverdue(t)).length,

    // High Priority
    highTotal: tasks.filter((t) => t.priority === 'high').length,
    highDone: tasks.filter(
      (t) => t.priority === 'high' && t.status === 'completed'
    ).length,

    // Medium Priority
    mediumTotal: tasks.filter((t) => t.priority === 'medium').length,
    mediumDone: tasks.filter(
      (t) => t.priority === 'medium' && t.status === 'completed'
    ).length,

    // Low Priority
    lowTotal: tasks.filter((t) => t.priority === 'low').length,
    lowDone: tasks.filter(
      (t) => t.priority === 'low' && t.status === 'completed'
    ).length,
  }

  // Check if given date is today
  const isToday = (dateStr) => {
    if (!dateStr) return false
    const today = new Date()
    const checkDate = new Date(dateStr)

    return (
      checkDate.getUTCDate() === today.getDate() &&
      checkDate.getUTCMonth() === today.getMonth() &&
      checkDate.getUTCFullYear() === today.getFullYear()
    )
  }

  // Check if given date is this week
  const isThisWeek = (dateStr) => {
    if (!dateStr) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    // Get the end of the current week (Saturday)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const checkDate = new Date(dateStr)

    // Use UTC methods to compare the database string correctly
    const checkTime = Date.UTC(
      checkDate.getUTCFullYear(),
      checkDate.getUTCMonth(),
      checkDate.getUTCDate()
    )

    return (
      checkTime >= startOfWeek.getTime() && checkTime <= endOfWeek.getTime()
    )
  }

  const calculateDateBasedStats = (tasks) => {
    // Use the raw strings so our UTC-aware helpers can handle them
    const tasksDueToday = tasks.filter((task) => isToday(task.dueDate))
    const tasksDueThisWeek = tasks.filter((task) => isThisWeek(task.dueDate))

    const completedTodayCount = tasks.filter((task) => {
      if (task.status !== 'completed') return false
      // Completed date is a full timestamp, so local comparison is fine here
      const completedDate = new Date(task.updatedAt || task.createdAt)
      const today = new Date()
      return (
        completedDate.getDate() === today.getDate() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getFullYear() === today.getFullYear()
      )
    }).length

    return {
      todayTotal: tasksDueToday.length,
      todayDone: tasksDueToday.filter((t) => t.status === 'completed').length,
      weekTotal: tasksDueThisWeek.length,
      weekDone: tasksDueThisWeek.filter((t) => t.status === 'completed').length,
      completedToday: completedTodayCount,
    }
  }

  const dateStats = calculateDateBasedStats(tasks)

  // Priority Colors
  const priorityColors = {
    high: 'bg-blossom-red-bg text-blossom-red-text',
    medium: 'bg-blossom-yellow-bg text-blossom-yellow-text',
    low: 'bg-blossom-green-bg text-blossom-green-text',
  }

  // Completion Status Icons
  const statusIcons = {
    completed: <CheckCircle className="w-5 h-5 text-blossom-green-text" />,
    overdue: <AlertCircle className="w-5 h-5 text-blossom-red-text" />,
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-bossom-pink">Loading your Blossom Garden...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3 */}
        <div className="lg:col-span-2">
          {/* Header with Quick Add */}
          <div className="mb-4">
            {/* Add this near your "Add New Flower" button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-heading text-blossom-dark">
                  Your Blossom Garden
                </h1>
                <p className="text-blossom-pink mt-1">
                  {stats.total} petals growing • {stats.completed} bloomed
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-blossom flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
                <button
                  onClick={() => setShowCategoryManager(true)}
                  className="btn-blossom-outline flex items-center gap-2"
                >
                  <Tag className="w-5 h-5" />
                  Categories
                </button>
              </div>
            </div>
          </div>

          {/* Task Creation/Editing Form */}
          {showTaskForm && (
            <div className="card-blossom mb-8">
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                {/* Form Title (New or Edit) */}
                <h3 className="text-xl font-heading text-blossom-dark">
                  {editingTask ? 'Edit Petal' : 'Plant a New Petal'}
                </h3>

                {/* X Button (Close Form) */}
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
                      tags: [],
                    })
                  }}
                  className="text-blossom-pink hover:text-blossom-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Data */}
              <form
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                className="space-y-4"
              >
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-blossom-dark mb-1">
                    Petal Title*
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="input-blossom text-blossom-dark"
                    placeholder="What needs to grow?"
                    required
                  />
                </div>

                {/* Task Description */}
                <div>
                  <label className="block text-sm font-medium text-blossom-dark mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="input-blossom text-blossom-dark resize-none min-h-[80px]"
                    placeholder="Add details about this petal..."
                  />
                </div>

                {/* Priority, Due Date, and Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Task Priority (Low/Medium/High) */}
                  <div>
                    <label className="block text-sm font-medium text-blossom-dark mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="input-blossom text-blossom-dark"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Task Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-blossom-dark mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                      className="input-blossom text-blossom-dark"
                    />
                  </div>

                  {/* Task Category */}
                  <div>
                    <label className="block text-sm font-medium text-blossom-dark mb-1">
                      Category
                    </label>
                    <select
                      value={newTask.categoryId}
                      onChange={(e) =>
                        setNewTask({ ...newTask, categoryId: e.target.value })
                      }
                      className="input-blossom text-blossom-dark"
                    >
                      <option value="">No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags Input */}
                  <div>
                    <label className="block text-sm font-medium text-blossom-dark mb-2">
                      Tags (press Enter to add)
                    </label>
                    <div className="input-blossom min-h-[44px] flex flex-wrap items-center gap-1 py-1">
                      {newTask.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blossom-bg text-blossom-pink text-xs rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              setNewTask({
                                ...newTask,
                                tags: newTask.tags.filter(
                                  (_, i) => i !== index
                                ),
                              })
                            }}
                            className="text-blossom-pink hover:text-blossom-dark"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        className="flex-1 min-w-[120px] border-0 bg-transparent focus:outline-none text-blossom-dark placeholder:text-blossom-pink/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault()
                            if (!newTask.tags.includes(e.target.value.trim())) {
                              setNewTask({
                                ...newTask,
                                tags: [...newTask.tags, e.target.value.trim()],
                              })
                            }
                            e.target.value = ''
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-blossom-pink/70 mt-1">
                      Press Enter to add tags for better organization
                    </p>
                  </div>
                </div>
                {/* End Form Data */}

                {/* Bottom Buttons Row */}
                <div className="flex gap-3 pt-2">
                  {/* Submit Buttons (Create or Update) */}
                  <button
                    type="submit"
                    className="btn-blossom flex-1 flex items-center justify-center gap-2"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>

                  {/* Cancel Button */}
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
                        tags: [],
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
          {/* End Form */}

          {/* Filters */}
          <div className="card-blossom mb-6">
            <div className="flex-1 flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Title */}
              <div className="flex items-center gap-2">
                <span className="text-blossom-dark font-medium">Filter</span>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="input-blossom text-blossom-pink text-sm py-2"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Growing</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                  className="input-blossom text-blossom-pink text-sm py-2"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Category Filter */}
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="input-blossom text-blossom-pink text-sm py-2"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4 mb-8">
            {/* If no tasks */}
            {filteredTasks.length === 0 ? (
              <div className="card-blossom text-center py-12">
                <h3 className="text-xl font-heading text-blossom-dark mb-2">
                  Your garden is empty.
                </h3>
                <p className="text-blossom-pink">
                  Plant your first flower to start growing!
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isTaskOverdue = checkIsOverdue(task)
                const displayStatus = isTaskOverdue ? 'overdue' : task.status

                return (
                  <div key={task.id} className="card-blossom group">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          task.status === 'completed'
                            ? 'bg-blossom-green-text border-blossom-green-text shadow-sm'
                            : 'border-blossom-pink hover:border-blossom-dark hover:scale-110'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div>
                          <div className="flex items-start justify-between">
                            {/* Title */}
                            <h3
                              className={`font-medium ${
                                task.status === 'completed'
                                  ? 'text-blossom-pink opacity-70'
                                  : 'text-blossom-dark'
                              }`}
                            >
                              {task.title}
                            </h3>

                            {/* Overdue & Actions */}
                            <div className="flex items-center gap-2 ml-2">
                              {/* If pending, allow edit and delete */}
                              {task.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStartEdit(task)}
                                    className="text-blossom-pink hover:text-blossom-dark transition-opacity"
                                    title="Edit task"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-blossom-pink hover:text-blossom-red-text transition-opacity"
                                    title="Delete task"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Display description if exists */}
                          {task.description && (
                            <p className="text-blossom-pink text-sm mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Task Info */}
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {/* Prority */}
                            <span
                              className={`petal-badge ${priorityColors[task.priority]} ${
                                task.status === 'completed' ? 'opacity-50' : ''
                              }`}
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {task.priority}
                            </span>

                            {/* Category */}
                            {task.category && (
                              <span className="inline-flex items-center gap-1 text-sm text-blossom-pink">
                                <Tag className="w-3 h-3" />
                                {task.category.name}
                              </span>
                            )}

                            {/* Due Date */}
                            {task.dueDate && (
                              <span
                                className={
                                  'inline-flex items-center gap-1 text-sm text-blossom-pink'
                                }
                              >
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString(
                                  undefined,
                                  { timeZone: 'UTC' }
                                )}
                              </span>
                            )}

                            {/* If overdue, warning */}
                            <div className="flex items-center">
                              {statusIcons[displayStatus]}
                            </div>

                            {/* Tags Display */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-blossom-bg text-blossom-pink text-xs rounded-full"
                                  >
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
                )
              })
            )}
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-6">
          {/* Blossom Tip */}
          <div className="card-blossom">
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-6 h-6 text-blossom-dark" />
              <h3 className="font-heading text-lg text-blossom-dark">
                Cherry Blossom Spirit
              </h3>
            </div>
            <div>
              <p className="text-blossom-pink text-sm">
                A single blossom is a promise; a garden tended is a dream
                realized. Check on your tasks today and watch your progress
                bloom.
              </p>
            </div>
          </div>

          {/* Garden Health */}
          <div className="card-blossom">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <HeartPlus className="w-6 h-6 text-blossom-dark" />
              <h3 className="font-heading text-lg text-blossom-dark">
                Garden Health
              </h3>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4">
              {/* Due Today Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blossom-pink">Due Today</span>
                  <span className="text-sm font-medium text-blossom-dark">
                    {dateStats.todayDone}/{dateStats.todayTotal}{' '}
                    {dateStats.todayTotal === 1 ? 'flower' : 'flowers'}
                  </span>
                </div>
                <div className="h-2 bg-blossom-pink/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blossom-pink transition-all duration-500 ease-out"
                    style={{
                      width: `${dateStats.todayTotal > 0 ? (dateStats.todayDone / dateStats.todayTotal) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Due This Week Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blossom-pink">
                    Due This Week
                  </span>
                  <span className="text-sm font-medium text-blossom-dark">
                    {dateStats.weekDone}/{dateStats.weekTotal}{' '}
                    {dateStats.weekTotal === 1 ? 'flower' : 'flowers'}
                  </span>
                </div>
                <div className="h-2 bg-blossom-pink/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blossom-yellow-text transition-all duration-500 ease-out"
                    style={{
                      width: `${dateStats.weekTotal > 0 ? (dateStats.weekDone / dateStats.weekTotal) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Completed Today Counter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-blossom-pink">
                    Completed Today
                  </span>
                  <span className="text-sm font-medium text-blossom-dark">
                    {dateStats.completedToday}{' '}
                    {dateStats.completedToday === 1 ? 'bloom' : 'blooms'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="card-blossom">
            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
              <ChartColumn className="w-6 h-6 text-blossom-dark" />
              <h3 className="font-heading text-lg text-blossom-dark">
                Statistics
              </h3>
            </div>

            <div className="space-y-6">
              {/* Priority Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blossom-pink">
                  Priority Progress
                </h4>

                {/* High Priority */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blossom-dark">
                      High Priority
                    </span>
                    <span className="text-xs font-medium text-blossom-red-text">
                      {stats.highDone}/{stats.highTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-blossom-red-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blossom-red-text transition-all duration-500"
                      style={{
                        width: `${stats.highTotal > 0 ? (stats.highDone / stats.highTotal) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Medium Priority */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blossom-dark">
                      Medium Priority
                    </span>
                    <span className="text-xs font-medium text-blossom-yellow-text">
                      {stats.mediumDone}/{stats.mediumTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-blossom-yellow-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blossom-yellow-text transition-all duration-500"
                      style={{
                        width: `${stats.mediumTotal > 0 ? (stats.mediumDone / stats.mediumTotal) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Low Priority */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blossom-dark">
                      Low Priority
                    </span>
                    <span className="text-xs font-medium text-blossom-green-text">
                      {stats.lowDone}/{stats.lowTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-blossom-green-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blossom-green-text transition-all duration-500"
                      style={{
                        width: `${stats.lowTotal > 0 ? (stats.lowDone / stats.lowTotal) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr className="border-blossom-pink/10" />

              {/* Category Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blossom-pink">
                  Category Progress
                </h4>
                {categories.length === 0 ? (
                  <p className="text-xs text-blossom-pink italic">
                    No categories yet
                  </p>
                ) : (
                  categories.map((cat) => {
                    const catTasks = tasks.filter(
                      (t) => t.categoryId === cat.id
                    )
                    const catTotal = catTasks.length
                    const catDone = catTasks.filter(
                      (t) => t.status === 'completed'
                    ).length

                    if (catTotal === 0) return null // Only show categories that have tasks

                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-blossom-dark">
                            {cat.icon} {cat.name}
                          </span>
                          <span className="text-xs font-medium text-blossom-pink">
                            {catDone}/{catTotal}
                          </span>
                        </div>
                        <div className="h-2 bg-blossom-pink/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blossom-pink transition-all duration-500"
                            style={{ width: `${(catDone / catTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        onCategoryCreated={fetchData}
      />
    </div>
  )
}

export default DashboardPage
