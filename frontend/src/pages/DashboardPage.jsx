import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Flower,
  Calendar,
  Star,
  Leaf,
  Sparkles,
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
      status: 'pending',
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
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  }

  const statusIcons = {
    completed: <CheckCircle className="w-5 h-5 text-blossom-mint" />,
    pending: <Clock className="w-5 h-5 text-blossom-peach" />,
    overdue: <AlertCircle className="w-5 h-5 text-blossom-bright" />,
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blossom-pink to-blossom-bright rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading text-blossom-dark">
              Welcome back! 🌸
            </h1>
            <p className="text-blossom-soft">
              Your blossom garden is looking healthy today
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-soft text-sm">Total Petals</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-pink/10 rounded-full flex items-center justify-center">
              <Flower className="w-6 h-6 text-blossom-pink" />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-soft text-sm">Bloomed</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-mint/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blossom-mint" />
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-soft text-sm">Growing</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-peach/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blossom-peach" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="card-blossom">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blossom-soft text-sm">Garden Health</p>
              <p className="text-3xl font-bold text-blossom-dark mt-1">
                {stats.completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blossom-bright/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blossom-bright" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading text-blossom-dark">
              Recent Petals
            </h2>
            <a
              href="/tasks"
              className="text-blossom-pink hover:text-blossom-bright text-sm font-medium flex items-center gap-2"
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
                    <div className="w-10 h-10 bg-blossom-bg rounded-lg flex items-center justify-center">
                      <span className="text-xl">{task.emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-blossom-dark">
                        {task.title}
                      </h3>
                      <p className="text-blossom-soft text-sm mt-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span
                          className={`petal-badge ${priorityColors[task.priority]}`}
                        >
                          {task.priority} priority
                        </span>
                        <div className="flex items-center gap-1 text-blossom-soft text-sm">
                          <Calendar className="w-4 h-4" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusIcons[task.status]}
                    <button className="text-blossom-soft hover:text-blossom-pink transition-colors">
                      <span className="sr-only">Edit</span>
                      ✏️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Task */}
          <div className="mt-8 card-blossom">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blossom-pink/10 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-blossom-pink" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blossom-dark mb-1">
                  Add a new petal
                </h3>
                <p className="text-blossom-soft text-sm">
                  What goal would you like to grow today?
                </p>
              </div>
              <button className="btn-blossom">Create Task</button>
            </div>
          </div>
        </div>

        {/* Sidebar - Garden Tips & Quick Stats */}
        <div className="space-y-6">
          {/* Garden Health */}
          <div className="card-blossom">
            <h3 className="font-heading text-lg text-blossom-dark mb-4">
              🌸 Garden Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blossom-soft">Today's Progress</span>
                <span className="font-medium text-blossom-dark">
                  3/5 petals
                </span>
              </div>
              <div className="h-2 bg-blossom-bg rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blossom-pink to-blossom-bright"
                  style={{ width: '60%' }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-blossom-soft">Weekly Streak</span>
                <span className="font-medium text-blossom-dark flex items-center gap-1">
                  <Flame className="w-4 h-4 text-blossom-bright" />7 days
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-blossom">
            <h3 className="font-heading text-lg text-blossom-dark mb-4">
              📊 Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-blossom-soft">High Priority</span>
                </div>
                <span className="font-bold text-blossom-dark">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-blossom-soft">Due This Week</span>
                </div>
                <span className="font-bold text-blossom-dark">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-blossom-soft">Completed Today</span>
                </div>
                <span className="font-bold text-blossom-dark">1</span>
              </div>
            </div>
          </div>

          {/* Blossom Tip */}
          <div className="card-blossom bg-gradient-to-br from-blossom-pink/5 to-blossom-mint/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h4 className="font-heading text-blossom-dark mb-2">
                  Blossom Tip
                </h4>
                <p className="text-blossom-soft text-sm">
                  Just like cherry blossoms, tasks are most beautiful when given
                  attention at the right time. Check your high-priority petals
                  daily!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-blossom">
            <h3 className="font-heading text-lg text-blossom-dark mb-4">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blossom-bg transition-colors">
                <span className="text-blossom-dark">Mark All Today's Done</span>
                <span className="text-blossom-pink">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blossom-bg transition-colors">
                <span className="text-blossom-dark">Schedule for Tomorrow</span>
                <span className="text-blossom-pink">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-blossom-bg transition-colors">
                <span className="text-blossom-dark">View Completed</span>
                <span className="text-blossom-pink">→</span>
              </button>
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
