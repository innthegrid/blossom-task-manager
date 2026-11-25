import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateDateBasedStats } from '../src/utils/taskDateStats.js'

process.env.TZ = 'America/New_York'

test('counts completions within the local day across the spring daylight saving change', () => {
  const now = new Date('2026-03-08T16:00:00Z')
  const tasks = [
    { status: 'completed', completedAt: '2026-03-08T04:59:59.999Z', updatedAt: now.toISOString() },
    { status: 'completed', completedAt: '2026-03-08T05:00:00.000Z' },
    { status: 'archived', completedAt: '2026-03-09T03:59:59.999Z' },
    { status: 'completed', completedAt: '2026-03-09T04:00:00.000Z' },
    { status: 'completed', completedAt: null, updatedAt: now.toISOString() },
    { status: 'pending', completedAt: null },
  ]

  assert.equal(calculateDateBasedStats(tasks, now).completedToday, 2)
})

test('compares due dates as calendar days and excludes archived work from due totals', () => {
  const now = new Date('2026-03-08T16:00:00Z')
  const tasks = [
    { status: 'pending', dueDate: '2026-03-07T00:00:00.000Z' },
    { status: 'pending', dueDate: '2026-03-08T00:00:00.000Z' },
    { status: 'completed', dueDate: '2026-03-08T00:00:00.000Z' },
    { status: 'archived', dueDate: '2026-03-08T00:00:00.000Z' },
    { status: 'completed', dueDate: '2026-03-14T00:00:00.000Z' },
    { status: 'pending', dueDate: '2026-03-15T00:00:00.000Z' },
    { status: 'pending', dueDate: null },
  ]

  assert.deepEqual(calculateDateBasedStats(tasks, now), {
    todayTotal: 2,
    todayDone: 1,
    weekTotal: 3,
    weekDone: 2,
    completedToday: 0,
  })
})
