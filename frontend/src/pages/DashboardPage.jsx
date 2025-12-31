import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Flower2,
  Calendar,
  Star,
  Leaf,
  HeartPlus,
  ChartColumn,
  Sprout,
  Pencil,
} from 'lucide-react'

const DashboardPage = () => {
  // Mock data for now - we'll replace with real API data later
  const stats = {
    total: 12,
    completed: 8,
    pending: 3,
    overdue: 1,
    completionRate: 67,
  }

  const recentTasks = [
    {
      id: 1,
      title: 'Water cherry blossoms',
      description: 'Keep them hydrated and healthy',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-04-10',
      emoji: '💧',
    },
    {
      id: 2,
      title: 'Prune branches',
      description: 'Trim for better growth',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-04-15',
      emoji: '✂️',
    },
    {
      id: 3,
      title: 'Add fertilizer',
      description: 'Nutrients for spring blooming',
      status: 'overdue',
      priority: 'low',
      dueDate: '2024-04-20',
      emoji: '🌱',
    },
    {
      id: 4,
      title: 'Photograph blossoms',
      description: 'Capture the beauty',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-04-12',
      emoji: '📸',
    },
  ]

  const priorityColors = {
    high: 'bg-blossom-red-bg text-blossom-red-text',
    medium: 'bg-blossom-yellow-bg text-blossom-yellow-text',
    low: 'bg-blossom-green-bg text-blossom-green-text',
  }

  const statusIcons = {
    completed: <CheckCircle className="w-5 h-5 text-blossom-green-text" />,
    pending: <Clock className="w-5 h-5 text-blossom-yellow-text" />,
    overdue: <AlertCircle className="w-5 h-5 text-blossom-red-text" />,
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div>
            <h1 className="text-3xl font-heading text-blossom-dark">
              Welcome back! Let's tend to your productivity garden.
            </h1>
          </div>
        </div>
      </div>

      {/* Quick Add Task & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

          {/* Quick Add Task */}
          <div className="card-blossom">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blossom-pink/10 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blossom-pink" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blossom-dark mb-1">
                  Add a new flower
                </h3>
                <p className="text-blossom-pink text-sm">
                  What goal would you like to grow today?
                </p>
              </div>
              <button className="btn-blossom">Create Task</button>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="mt-8 flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading text-blossom-dark">
              Recently Planted
            </h2>
            <a
              href="/tasks"
              className="text-blossom-pink hover:text-blossom-dark text-sm font-medium flex items-center gap-2"
            >
              View all
              <span className="text-lg">→</span>
            </a>
          </div>

          <div className="space-y-4">
            {recentTasks.map((task) => (
              <div key={task.id} className="card-blossom">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <span className="text-xl">{task.emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-blossom-dark">
                        {task.title}
                      </h3>
                      <p className="text-blossom-pink text-sm mt-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span
                          className={`petal-badge ${priorityColors[task.priority]}`}
                        >
                          {task.priority} priority
                        </span>
                        <div className="flex items-center gap-1 text-blossom-pink text-sm">
                          <Calendar className="w-4 h-4" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusIcons[task.status]}
                    <button className="text-blossom-pink hover:text-blossom-dark transition-colors">
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Garden Tips & Quick Stats */}
        <div className="space-y-6">
          {/* Garden Health */}
          <div className="card-blossom">
            <div className="flex items-center gap-2 mb-2">
              <HeartPlus className="w-6 h-6 text-blossom-dark" />
              <h3 className="font-heading text-lg text-blossom-dark">
                Garden Health
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blossom-pink">Today's Progress</span>
                <span className="font-medium text-blossom-dark">
                  3/5 petals
                </span>
              </div>
              <div className="h-2 bg-blossom-pink/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blossom-pink transition-all duration-500 ease-out"
                  style={{ width: '90%' }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-blossom-pink">Weekly Streak</span>
                <span className="font-medium text-blossom-dark flex items-center gap-1">
                  <Flame className="w-4 h-4 text-blossom-red-text" />7 days
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-blossom">
            <div className="flex items-center gap-2 mb-2">
              <ChartColumn className="w-6 h-6 text-blossom-dark" />
              <h3 className="font-heading text-lg text-blossom-dark">
                Quick Stats
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blossom-red-bg rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-blossom-red-text" />
                  </div>
                  <span className="text-blossom-pink">High Priority</span>
                </div>
                <span className="font-bold text-blossom-dark">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blossom-yellow-bg rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-blossom-yellow-text" />
                  </div>
                  <span className="text-blossom-pink">Due This Week</span>
                </div>
                <span className="font-bold text-blossom-dark">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blossom-green-bg rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blossom-green-text" />
                  </div>
                  <span className="text-blossom-pink">Completed Today</span>
                </div>
                <span className="font-bold text-blossom-dark">1</span>
              </div>
            </div>
          </div>

          {/* Blossom Tip */}
          <div className="card-blossom">
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-6 h-6 text-blossom-dark" />
              <h3 className="font-heading text-lg text-blossom-dark">
                Blossom Tip
              </h3>
            </div>
            <div>
              <p className="text-blossom-pink text-sm">
                Just like cherry blossoms, tasks are most beautiful when given
                attention at the right time. Check your high-priority petals
                daily!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add the missing Flame icon import at the top
const Flame = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
    />
  </svg>
)

export default DashboardPage