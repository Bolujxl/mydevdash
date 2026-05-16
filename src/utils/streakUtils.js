const STORAGE_KEY = 'devdash_streak'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function loadStreak() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* noop */ }
  return { current: 0, longest: 0, lastDate: null }
}

export function recalcStreak(completedCount, events) {
  const streak = loadStreak()
  const today = todayStr()
  const yesterday = yesterdayStr()

  const activeToday = isActiveToday(events)

  if (activeToday) {
    if (streak.lastDate === yesterday) {
      // Consecutive day — streak continues
      streak.current++
    } else if (streak.lastDate !== today) {
      // Not consecutive — start new streak
      streak.current = 1
    }
    streak.lastDate = today
  } else if (streak.lastDate && streak.lastDate !== today && streak.lastDate !== yesterday) {
    // Inactive today AND not active yesterday either — reset
    streak.current = 0
  }

  if (streak.current > streak.longest) {
    streak.longest = streak.current
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(streak))
  } catch { /* noop */ }

  return streak
}

function isActiveToday(events) {
  const today = todayStr()

  // Check GitHub events from today
  if (Array.isArray(events)) {
    for (const e of events) {
      if (e.created_at?.slice(0, 10) === today) return true
    }
  }

  // Check tasks completed today
  try {
    const tasks = JSON.parse(localStorage.getItem('devdash_tasks')) || []
    if (tasks.some((t) => t.done && t.createdAt?.slice(0, 10) === today)) return true
  } catch { /* noop */ }

  return false
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