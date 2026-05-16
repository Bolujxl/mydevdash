const STORAGE_KEY = 'devdash_streak'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function loadStreak() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* noop */ }
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, history: {} }
}

export function recalcStreak(completedTasks, events) {
  const streak = loadStreak()
  const today = todayStr()

  const wasActiveToday = checkActiveToday(completedTasks, events, streak)
  const wasActiveYesterday = streak.lastActiveDate === yesterdayStr()

  if (wasActiveToday) {
    streak.history[today] = true
    if (streak.lastActiveDate !== today) {
      if (streak.lastActiveDate === yesterdayStr()) {
        streak.currentStreak++
      } else if (!wasActiveYesterday && streak.lastActiveDate !== today) {
        streak.currentStreak = 1
      }
      streak.lastActiveDate = today
    }
  } else if (!wasActiveYesterday && streak.lastActiveDate && streak.lastActiveDate !== today) {
    streak.currentStreak = 0
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(streak))
  } catch { /* noop */ }

  return streak
}

function checkActiveToday(completedTasks, events) {
  const today = todayStr()

  if (completedTasks > 0) {
    try {
      const tasks = JSON.parse(localStorage.getItem('devdash_tasks')) || []
      const doneToday = tasks.filter((t) => t.done && t.createdAt?.slice(0, 10) === today).length
      if (doneToday > 0) return true
    } catch { /* noop */ }
  }

  if (Array.isArray(events)) {
    for (const e of events) {
      if (e.created_at?.slice(0, 10) === today) {
        return true
      }
    }
  }

  return false
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function getStreakCopy(current) {
  if (current === 0) return 'Start something today.'
  if (current === 1) return 'One step. Keep going.'
  if (current <= 4) return 'Building momentum →'
  if (current <= 9) return "You're in a rhythm now."
  if (current <= 19) return 'Two weeks of showing up. Rare.'
  if (current <= 29) return 'This is discipline, not motivation.'
  return "You've earned this. Don't stop."
}