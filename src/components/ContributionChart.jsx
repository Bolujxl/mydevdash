import { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid
} from 'recharts'
import { Activity } from 'lucide-react'
import '../styles/ContributionChart.css'

function buildChartData(events) {
  if (!Array.isArray(events) || events.length === 0) return []

  const days = []
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      short: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: 0,
    })
  }

  for (const e of events) {
    const dateStr = e.created_at?.slice(0, 10)
    const day = days.find((d) => d.date === dateStr)
    if (day) day.count++
  }

  return days
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">{data.label}</span>
      <span className="chart-tooltip-value">
        {data.count} event{data.count !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

function ContributionChart({ events }) {
  const data = useMemo(() => buildChartData(events), [events])
  const total = data.reduce((s, d) => s + d.count, 0)
  const hasData = data.some((d) => d.count > 0)

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">
          <Activity size={16} /> Activity Pulse
        </h2>
        <span className="chart-subtitle">Last 14 days · {total} events</span>
      </div>

      {!hasData ? (
        <p className="chart-empty">No activity in the past 14 days.</p>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" vertical={false} />
              <XAxis
                dataKey="short"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
                width={20}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-primary)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#chartGradient)"
                dot={false}
                activeDot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--bg-surface)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default ContributionChart