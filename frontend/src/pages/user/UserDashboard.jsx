import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTasks } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'

export default function UserDashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const params = filter ? { status: filter } : {}
    getTasks(params).then((r) => setTasks(r.data)).finally(() => setLoading(false))
  }, [filter])

  const pending = tasks.filter((t) => t.status === 'pending').length
  const completed = tasks.filter((t) => t.status === 'completed').length

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your assigned tasks — use AI search to complete them.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Total Tasks</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{pending}</div>
          <div className="text-xs text-gray-400 mt-0.5">Pending</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{completed}</div>
          <div className="text-xs text-gray-400 mt-0.5">Completed</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['', 'pending', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-sm font-medium text-gray-600">
            {filter === 'completed' ? 'No completed tasks yet' : 'No tasks assigned yet'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Check back later or ask your admin</div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <Link
              key={t.id}
              to={`/dashboard/task/${t.id}`}
              className="card p-4 flex items-start gap-4 hover:shadow-card transition-shadow group block"
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                t.status === 'completed'
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-gray-300 group-hover:border-brand-400'
              }`}>
                {t.status === 'completed' && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold group-hover:text-brand-600 transition-colors ${
                    t.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                  }`}>{t.title}</span>
                  <Badge label={t.difficulty} />
                </div>
                {t.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{t.description}</p>
                )}
                {t.document_title && (
                  <div className="text-xs text-brand-500 mt-1 font-medium">📄 {t.document_title}</div>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs text-brand-600 font-medium group-hover:underline">
                  {t.status === 'pending' ? 'Open →' : 'View →'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
