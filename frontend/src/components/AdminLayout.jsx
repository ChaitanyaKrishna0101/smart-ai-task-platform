import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/documents', label: 'Documents', icon: '📄' },
  { to: '/admin/tasks', label: 'Tasks', icon: '✓' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shadow-soft flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="text-xs font-semibold text-brand-600 tracking-widest uppercase mb-0.5">Future</div>
          <div className="text-sm font-bold text-gray-900 leading-tight">Transformation</div>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-brand-50 rounded-full">
            <span className="text-xs font-medium text-brand-700">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary w-full justify-center text-xs py-1.5">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
