import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAnalytics, getTasks, getDocuments } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card p-5">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-3xl font-bold ${color || 'text-gray-900'} mb-1`}>{value ?? '—'}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAnalytics(), getTasks()])
      .then(([a, t]) => {
        setAnalytics(a.data)
        setRecentTasks(t.data.slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    </div>
  )

  const pct = analytics?.total_tasks > 0
    ? Math.round((analytics.completed_tasks / analytics.total_tasks) * 100)
    : 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening in your knowledge base today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={analytics?.total_tasks} />
        <StatCard label="Completed" value={analytics?.completed_tasks} color="text-emerald-600"
          sub={`${pct}% completion rate`} />
        <StatCard label="Pending" value={analytics?.pending_tasks} color="text-amber-600" />
        <StatCard label="Documents" value={analytics?.total_documents} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
            <Link to="/admin/tasks" className="text-xs text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTasks.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No tasks yet. Create one to get started.</div>
            ) : recentTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {t.assignee_name ? `Assigned to ${t.assignee_name}` : 'Unassigned'}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Badge label={t.difficulty} />
                  <Badge label={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Searches */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Top Searches</h2>
          </div>
          <div className="px-5 py-3 space-y-2">
            {analytics?.top_searches?.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No searches yet</p>
            ) : analytics?.top_searches?.slice(0, 8).map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-600 truncate flex-1">
                  {s.query?.replace('Query: "', '').replace('"', '') || s.query}
                </span>
                <span className="text-xs font-medium text-gray-400 flex-shrink-0">{s.count}×</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { to: '/admin/documents', label: 'Upload Documents', desc: 'Add PDFs or text files', icon: '📄' },
          { to: '/admin/tasks', label: 'Create Tasks', desc: 'Assign work to users', icon: '✓' },
          { to: '/admin/users', label: 'Manage Users', desc: 'Add or edit user accounts', icon: '👥' },
        ].map(({ to, label, desc, icon }) => (
          <Link key={to} to={to} className="card p-4 hover:shadow-card transition-shadow group">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
