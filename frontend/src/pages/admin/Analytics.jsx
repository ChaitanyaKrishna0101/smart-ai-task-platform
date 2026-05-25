import React, { useEffect, useState } from 'react'
import { getAnalytics } from '../../api/client'

function StatCard({ label, value, color, icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className={`text-3xl font-bold ${color || 'text-gray-900'}`}>{value ?? '—'}</div>
    </div>
  )
}

const ACTION_LABELS = {
  login: { label: 'Login', color: 'bg-blue-50 text-blue-700' },
  search: { label: 'Search', color: 'bg-purple-50 text-purple-700' },
  document_upload: { label: 'Upload', color: 'bg-brand-50 text-brand-700' },
  task_update: { label: 'Task', color: 'bg-emerald-50 text-emerald-700' },
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then((r) => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-32" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    </div>
  )

  const pct = data?.total_tasks > 0
    ? Math.round((data.completed_tasks / data.total_tasks) * 100)
    : 0

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">System usage and task overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={data?.total_tasks} icon="📋" />
        <StatCard label="Completed" value={data?.completed_tasks} color="text-emerald-600" icon="✅" />
        <StatCard label="Pending" value={data?.pending_tasks} color="text-amber-600" icon="⏳" />
        <StatCard label="Documents" value={data?.total_documents} icon="📄" />
      </div>

      {/* Progress bar */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900">Task Completion Rate</span>
          <span className="text-sm font-bold text-brand-600">{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{data?.completed_tasks} completed</span>
          <span>{data?.pending_tasks} pending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Searches */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Top Search Queries</h2>
          </div>
          <div className="px-5 py-3 space-y-2">
            {data?.top_searches?.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No searches yet</p>
            ) : data?.top_searches?.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-700 truncate">
                    {s.query}
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full mt-1">
                    <div
                      className="h-full bg-brand-300 rounded-full"
                      style={{ width: `${(s.count / (data.top_searches[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-500 flex-shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recent_activity?.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center px-5">No activity yet</p>
            ) : data?.recent_activity?.map((a) => {
              const meta = ACTION_LABELS[a.action] || { label: a.action, color: 'bg-gray-100 text-gray-600' }
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${meta.color}`}>
                    {meta.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-600 truncate">{a.detail}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(a.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
