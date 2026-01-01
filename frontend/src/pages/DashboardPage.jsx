import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Clock,
  Archive,
  AlertCircle,
  Plus,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  Star,
  Check,
  HeartPlus,
  ChartColumn,
  Sprout,
} from 'lucide-react'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'
import CategoryManagerModal from '../components/CategoryManagerModal'
import TaskFormModal from '../components/TaskFormModal'
import CategoryIcon from '../components/CategoryIcon'
import Notification from '../components/Notification'
import ConfirmationModal from '../components/ConfirmationModal'

const DashboardPage = () => {
  // States
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
  })
  const [showTaskFormModal, setShowTaskFormModal] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [notification, setNotification] = useState(null)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

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

  const handleDeleteTask = (taskId) => {
    setConfirmDelete(taskId)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return

    try {
      await taskService.deleteTask(confirmDelete)
      setTasks(tasks.filter((task) => task.id !== confirmDelete))
      setNotification({
        message: 'Task deleted successfully!',
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      setNotification({
        message: 'Failed to delete task',
        type: 'error',
      })
    } finally {
      setConfirmDelete(null)
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

  // Toggle subtask completion
  const handleToggleSubtask = async (task, subtaskIndex) => {
    try {
      const updatedSubtasks = [...task.subtasks]

      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        completed: !updatedSubtasks[subtaskIndex].completed,
      }

      await taskService.updateTask(task.id, { subtasks: updatedSubtasks })

      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, subtasks: updatedSubtasks } : t
        )
      )
    } catch (error) {
      console.error('Failed to toggle subtask:', error)
    }
  }

  // Filter tasks based on current filteres
  const filteredTasks = tasks.filter((task) => {
    // EXCLUDE ARCHIVED TASKS FROM MAIN DASHBOARD
    if (task.status === 'archived') return false

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
    // Filter out archived tasks from all stats
    total: tasks.filter((t) => t.status !== 'archived').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    overdue: tasks.filter((t) => checkIsOverdue(t) && t.status !== 'archived')
      .length,

    // High Priority (exclude archived)
    highTotal: tasks.filter(
      (t) => t.priority === 'high' && t.status !== 'archived'
    ).length,
    highDone: tasks.filter(
      (t) => t.priority === 'high' && t.status === 'completed'
    ).length,

    // Medium Priority (exclude archived)
    mediumTotal: tasks.filter(
      (t) => t.priority === 'medium' && t.status !== 'archived'
    ).length,
    mediumDone: tasks.filter(
      (t) => t.priority === 'medium' && t.status === 'completed'
    ).length,

    // Low Priority (exclude archived)
    lowTotal: tasks.filter(
      (t) => t.priority === 'low' && t.status !== 'archived'
    ).length,
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

  const handleArchiveCompleted = () => {
    if (stats.completed === 0) {
      setNotification({
        message: 'No completed tasks to archive!',
        type: 'info',
      })
      return
    }
    setConfirmArchive(true)
  }

  const handleConfirmArchive = async () => {
    try {
      const result = await taskService.archiveCompletedTasks()
      setNotification({
        message: result.message,
        type: 'success',
      })
      fetchData()
    } catch (error) {
      console.error('Failed to archive tasks:', error)
      setNotification({
        message: 'Failed to archive tasks. Please try again.',
        type: 'error',
      })
    } finally {
      setConfirmArchive(false)
    }
  }

  const customConfirm = (message, title = 'Confirm') => {
    return new Promise((resolve) => {
      const modal = document.createElement('div')
      modal.className =
        'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'

      modal.innerHTML = `
      <div class="card-blossom max-w-md w-full">
        <h3 class="text-xl font-heading text-blossom-dark mb-2">${title}</h3>
        <p class="text-blossom-pink mb-6">${message}</p>
        <div class="flex gap-3 justify-end">
          <button id="cancel-btn" class="btn-blossom-outline">Cancel</button>
          <button id="confirm-btn" class="btn-blossom">Archive</button>
        </div>
      </div>
    `

      document.body.appendChild(modal)

      modal.querySelector('#confirm-btn').onclick = () => {
        document.body.removeChild(modal)
        resolve(true)
      }

      modal.querySelector('#cancel-btn').onclick = () => {
        document.body.removeChild(modal)
        resolve(false)
      }

      // Close on backdrop click
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal)
          resolve(false)
        }
      }
    })
  }

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
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-heading text-blossom-dark">
                  Your Blossom Garden
                </h1>
                <p className="text-blossom-pink mt-1">
                  {stats.total} petals growing • {stats.completed} bloomed
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditingTask(null)
                    setShowTaskFormModal(true)
                  }}
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

                <button
                  onClick={handleArchiveCompleted}
                  disabled={stats.completed === 0}
                  className={`btn-blossom-outline flex items-center gap-2 ${
                    stats.completed === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Archive className="w-5 h-5" />
                  Archive
                </button>
              </div>
            </div>
          </div>

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
                            <div className="flex gap-2">
                              {/* Title */}
                              <h3
                                className={`font-medium text-xl ${
                                  task.status === 'completed'
                                    ? 'text-blossom-pink opacity-70'
                                    : 'text-blossom-dark'
                                }`}
                              >
                                {task.title}
                              </h3>

                              {/* Category */}
                              {task.category && (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-s font-medium font-bold transition-all duration-300 ${
                                    task.status === 'completed'
                                      ? 'opacity-30'
                                      : 'opacity-100'
                                  }`}
                                  style={{
                                    backgroundColor: `${task.category.color}40`,
                                    color: task.category.color,
                                  }}
                                >
                                  <CategoryIcon
                                    name={task.category.icon}
                                    className="w-3.5 h-3.5"
                                  />
                                  {task.category.name}
                                </span>
                              )}
                            </div>

                            {/* Complete & Actions */}
                            <div className="flex items-center gap-2 ml-2">
                              {task.status === 'completed' && (
                                <div title="This petal has bloomed!">
                                  <CheckCircle className="w-5 h-5 text-blossom-green-text" />
                                </div>
                              )}

                              {/* If pending, allow edit and delete */}
                              {task.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingTask(task)
                                      setShowTaskFormModal(true)
                                    }}
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
                            <p
                              className={`text-blossom-pink text-sm mt-1 line-clamp-2 ${
                                task.status === 'completed' ? 'opacity-70' : ''
                              }`}
                            >
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

                            {/* Due Date */}
                            {task.dueDate && (
                              <span
                                className={`inline-flex items-center gap-1 text-sm text-blossom-pink ${
                                  task.status === 'completed'
                                    ? 'opacity-70'
                                    : ''
                                }`}
                              >
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString(
                                  undefined,
                                  { timeZone: 'UTC' }
                                )}
                              </span>
                            )}

                            {isTaskOverdue && (
                              <div
                                className="flex items-center ml-1"
                                title="This petal is overdue!"
                              >
                                <AlertCircle className="w-5 h-5 text-blossom-red-text animate-pulse-slow" />
                              </div>
                            )}

                            {/* Tags Display */}
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-0.5 bg-blossom-bg text-blossom-pink text-xs rounded-full ${
                                      task.status === 'completed'
                                        ? 'opacity-70'
                                        : ''
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subtasks Display */}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div
                            className={`mt-4 space-y-2 bg-blossom-bg/20 p-3 rounded-blossom border border-blossom-bg transition-opacity duration-300 ${
                              task.status === 'completed'
                                ? 'opacity-50 grayscale-[20%]'
                                : 'opacity-100'
                            }`}
                          >
                            <div className="text-s uppercase text-blossom-pink font-bold mb-2">
                              Petal Progress
                            </div>
                            <div className="space-y-2">
                              {task.subtasks.map((subtask, index) => (
                                <div
                                  key={subtask.id || index}
                                  className="flex items-center gap-3"
                                >
                                  <button
                                    // Disable interaction if the main task is done
                                    disabled={task.status === 'completed'}
                                    onClick={() =>
                                      handleToggleSubtask(task, index)
                                    }
                                    className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                      subtask.completed ||
                                      task.status === 'completed'
                                        ? 'bg-blossom-green-text border-blossom-green-text'
                                        : 'border-blossom-pink hover:border-blossom-dark'
                                    }`}
                                  >
                                    {(subtask.completed ||
                                      task.status === 'completed') && (
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    )}
                                  </button>
                                  <span
                                    className={`text-s transition-colors ${
                                      subtask.completed ||
                                      task.status === 'completed'
                                        ? 'line-through text-blossom-pink/60'
                                        : 'text-blossom-dark'
                                    }`}
                                  >
                                    {subtask.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                            {cat.name}
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
      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskFormModal}
        onClose={() => {
          setShowTaskFormModal(false)
          setEditingTask(null)
        }}
        editingTask={editingTask}
        onTaskSaved={fetchData}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => {
          setShowCategoryManager(false)
          fetchData()
        }}
        onCategoryCreated={fetchData}
        onCategoryUpdated={fetchData}
        onCategoryDeleted={fetchData}
      />

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={handleConfirmArchive}
        title="Archive Completed Tasks"
        message={`Archive all ${stats.completed} completed tasks? They will be moved to the Archive page.`}
        confirmText="Archive All"
        type="archive"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  )
}

export default DashboardPage
