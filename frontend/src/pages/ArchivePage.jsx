import { useState, useEffect } from 'react'
import {
  Archive,
  RefreshCw,
  FolderOpen,
  Calendar,
  Tag,
  Trash2,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react'
import { taskService } from '../services/taskService'
import { categoryService } from '../services/categoryService'
import CategoryIcon from '../components/CategoryIcon'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../components/ConfirmationModal'
import Notification from '../components/Notification'

const ArchivePage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    priority: 'all',
    category: 'all',
  })
  const [stats, setStats] = useState({
    total: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    oldest: null,
  })
  const [confirmRestore, setConfirmRestore] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [filters])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getArchivedTasks({
          priority: filters.priority !== 'all' ? filters.priority : undefined,
          categoryId: filters.category !== 'all' ? filters.category : undefined,
        }),
        categoryService.getCategories(),
      ])

      setTasks(tasksData.tasks || [])
      setCategories(categoriesData.categories || [])

      // Calculate stats
      calculateStats(tasksData.tasks || [])
    } catch (error) {
      console.error('Failed to fetch archived data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (taskList) => {
    const high = taskList.filter((t) => t.priority === 'high').length
    const medium = taskList.filter((t) => t.priority === 'medium').length
    const low = taskList.filter((t) => t.priority === 'low').length

    // Find oldest archived task
    const oldest =
      taskList.length > 0
        ? taskList.reduce((oldest, task) =>
            new Date(task.updatedAt) < new Date(oldest.updatedAt)
              ? task
              : oldest
          )
        : null

    setStats({
      total: taskList.length,
      byPriority: { high, medium, low },
      oldest: oldest ? new Date(oldest.updatedAt).toLocaleDateString() : null,
    })
  }

  // Replace handleRestoreTask function:
  const handleRestoreTask = (taskId) => {
    setConfirmRestore(taskId)
  }

  const handleConfirmRestore = async () => {
    if (!confirmRestore) return

    try {
      await taskService.restoreTask(confirmRestore)
      // Remove from local state
      setTasks(tasks.filter((task) => task.id !== confirmRestore))
      setNotification({
        message: 'Task restored to garden successfully!',
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to restore task:', error)
      setNotification({
        message: 'Failed to restore task. Please try again.',
        type: 'error',
      })
    } finally {
      setConfirmRestore(null)
    }
  }

  // Replace handleDeleteTask function:
  const handleDeleteTask = (taskId) => {
    setConfirmDelete(taskId)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return

    try {
      await taskService.deleteTask(confirmDelete)
      setTasks(tasks.filter((task) => task.id !== confirmDelete))
      setNotification({
        message: 'Task permanently deleted!',
        type: 'success',
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      setNotification({
        message: 'Failed to delete task.',
        type: 'error',
      })
    } finally {
      setConfirmDelete(null)
    }
  }

  // Priority Colors
  const priorityColors = {
    high: 'bg-blossom-red-bg text-blossom-red-text',
    medium: 'bg-blossom-yellow-bg text-blossom-yellow-text',
    low: 'bg-blossom-green-bg text-blossom-green-text',
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-blossom-pink">Loading your archived petals...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blossom-pink hover:text-blossom-dark mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Garden
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-blossom-dark flex items-center gap-3">
              <Archive className="w-8 h-8" />
              Flower Archive
            </h1>
            <p className="text-blossom-pink mt-1">
              {stats.total} preserved flowers •{' '}
              {stats.oldest
                ? `Oldest: ${stats.oldest}`
                : 'No archived tasks yet'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="btn-blossom-outline flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Filters Card */}
        <div className="card-blossom flex-1 mb-0">
          <div className="h-full flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="text-blossom-dark font-semibold whitespace-nowrap">
                Filter
              </span>

              {/* Priority Filter */}
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                className="input-blossom flex-1 text-blossom-pink text-sm py-2"
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
                className="input-blossom flex-1 text-blossom-pink text-sm py-2"
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

        {/* Stats Card */}
        {stats.total > 0 && (
          <div className="card-blossom flex-1 mb-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-full items-center">
              <div className="text-center">
                <div className="text-2xl font-heading text-blossom-dark">
                  {stats.total}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-tight text-blossom-pink">
                  Total
                </div>
              </div>
              <div className="text-center border-l border-blossom-bg">
                <div className="text-xl font-heading text-blossom-red-text">
                  {stats.byPriority.high}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-tight text-blossom-pink">
                  High
                </div>
              </div>
              <div className="text-center border-l border-blossom-bg">
                <div className="text-xl font-heading text-blossom-yellow-text">
                  {stats.byPriority.medium}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-tight text-blossom-pink">
                  Med
                </div>
              </div>
              <div className="text-center border-l border-blossom-bg">
                <div className="text-xl font-heading text-blossom-green-text">
                  {stats.byPriority.low}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-tight text-blossom-pink">
                  Low
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="card-blossom text-center py-12">
            <FolderOpen className="w-16 h-16 text-blossom-pink/50 mx-auto mb-4" />
            <h3 className="text-xl font-heading text-blossom-dark mb-2">
              Archive is empty
            </h3>
            <p className="text-blossom-pink">
              Archived tasks will appear here. Try archiving some completed
              tasks!
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="card-blossom opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-start justify-between">
                {/* Task Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    {/* Archived Icon */}
                    <Archive className="w-5 h-5 text-blossom-pink mt-1 flex-shrink-0" />

                    <div>
                      <h3 className="text-lg text-blossom-dark">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-blossom-pink text-sm mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Task Info */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Priority */}
                        <span
                          className={`petal-badge ${priorityColors[task.priority]}`}
                        >
                          {task.priority}
                        </span>

                        {/* Category */}
                        {task.category && (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium opacity-80"
                            style={{
                              backgroundColor: `${task.category.color}30`,
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

                        {/* Archived Date */}
                        <span className="inline-flex items-center gap-1 text-sm text-blossom-pink">
                          <Calendar className="w-3 h-3" />
                          Archived:{' '}
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </span>

                        {/* Original Due Date (if any) */}
                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1 text-sm text-blossom-pink opacity-70">
                            Was due:{' '}
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleRestoreTask(task.id)}
                    className="text-blossom-green-text hover:text-blossom-green-text/80 transition-colors p-2"
                    title="Restore to garden"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-blossom-pink hover:text-blossom-red-text transition-colors p-2"
                    title="Permanently delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Restore Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmRestore !== null}
        onClose={() => setConfirmRestore(null)}
        onConfirm={handleConfirmRestore}
        title="Restore Task"
        message="Restore this task to your main garden?"
        confirmText="Restore"
        type="restore"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete"
        message="Are you sure you want to permanently delete this archived task? This action cannot be undone."
        confirmText="Delete Forever"
        type="delete"
      />

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  )
}

export default ArchivePage
