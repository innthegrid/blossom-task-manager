function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function localDayKey(date) {
  // Match the YYYY-MM-DD prefix of due dates, which the API stores at UTC midnight.
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .toISOString().slice(0, 10)
}

export function calculateDateBasedStats(tasks, now = new Date()) {
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const tomorrow = addDays(today, 1)
  const weekStart = addDays(today, -today.getDay())
  const todayKey = localDayKey(today)
  const weekStartKey = localDayKey(weekStart)
  const nextWeekKey = localDayKey(addDays(weekStart, 7))

  const activeTasks = tasks.filter((task) => task.status !== 'archived')
  const tasksDueToday = activeTasks.filter((task) =>
    task.dueDate?.slice(0, 10) === todayKey
  )
  const tasksDueThisWeek = activeTasks.filter((task) => {
    const dueDay = task.dueDate?.slice(0, 10)
    return dueDay >= weekStartKey && dueDay < nextWeekKey
  })
  const completedToday = tasks.filter((task) => {
    const completionTime = Date.parse(task.completedAt)
    return completionTime >= today.getTime() && completionTime < tomorrow.getTime()
  }).length

  return {
    todayTotal: tasksDueToday.length,
    todayDone: tasksDueToday.filter((task) => task.status === 'completed').length,
    weekTotal: tasksDueThisWeek.length,
    weekDone: tasksDueThisWeek.filter((task) => task.status === 'completed').length,
    completedToday,
  }
}
