import { useMemo, useState } from 'react'

function buildGrid(events, range) {
  const now = new Date()
  const rangeDays = { '30d': 30, '3mo': 90, '6mo': 180, '1y': 365 }[range] || 365
  const activeCutoff = new Date(now)
  activeCutoff.setDate(activeCutoff.getDate() - rangeDays)

  const pushMap = {}
  if (Array.isArray(events)) {
    for (const e of events) {
      const date = e.created_at?.slice(0, 10)
      if (date) pushMap[date] = (pushMap[date] || 0) + 1
    }
  }

  const weeks = []
  // Always show full 52 weeks (~365 days), aligned to Sunday
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - 364)
  const dayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOfWeek)

  let current = new Date(startDate)
  let week = []
  while (current <= now) {
    const dateStr = current.toISOString().slice(0, 10)
    const cellDate = new Date(current)
    week.push({
      date: dateStr,
      count: pushMap[dateStr] || 0,
      label: cellDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      inRange: cellDate >= activeCutoff,
    })
    if (current.getDay() === 6 && week.length > 0) {
      weeks.push(week)
      week = []
    }
    current.setDate(current.getDate() + 1)
  }
  if (week.length > 0) weeks.push(week)

  return { weeks }
}

function getIntensityClass(count) {
  if (count === 0) return 'int-0'
  if (count <= 2) return 'int-1'
  if (count <= 5) return 'int-2'
  return 'int-3'
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function CommitHeatmap({ events }) {
  const [range, setRange] = useState('1y')
  const [hovered, setHovered] = useState(null)

  const { weeks } = useMemo(() => buildGrid(events, range), [events, range])

  const totalPushes = weeks.reduce((s, w) => s + w.reduce((ws, c) => ws + (c.inRange ? c.count : 0), 0), 0)

  return (
    <div className="heatmap-card">
      <div className="heatmap-header">
        <h2 className="heatmap-title">Commit Pulse</h2>
        <div className="heatmap-range">
          {['30d', '3mo', '6mo', '1y'].map((r) => (
            <button
              key={r}
              className={`heatmap-range-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <p className="heatmap-summary">{totalPushes} pushes in selected range</p>

      <div className="heatmap-grid-wrap">
        <div className="heatmap-grid">
          <div className="heatmap-y-labels">
            {DAY_LABELS.map((label, i) => (
              <span key={i} className="heatmap-day-label">{label}</span>
            ))}
          </div>
          <div className="heatmap-cells-wrap">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {Array.from({ length: 7 }).map((_, di) => {
                  const cell = week[di]
                  if (!cell) return <div key={di} className="heatmap-cell heatmap-empty" />
                  return (
                    <div
                      key={di}
                      className={`heatmap-cell heatmap-${getIntensityClass(cell.count)} ${cell.inRange ? '' : 'dimmed'}`}
                      onMouseEnter={() => setHovered(cell)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        {hovered && (
          <div className="heatmap-tooltip">
            <span>{hovered.count} commits · {hovered.label}</span>
          </div>
        )}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        <span className="heatmap-cell heatmap-int-0" />
        <span className="heatmap-cell heatmap-int-1" />
        <span className="heatmap-cell heatmap-int-2" />
        <span className="heatmap-cell heatmap-int-3" />
        <span>More</span>
      </div>
    </div>
  )
}

export default CommitHeatmap