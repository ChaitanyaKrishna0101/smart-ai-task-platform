import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AdminLayout from './components/AdminLayout'
import UserLayout from './components/UserLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Documents from './pages/admin/Documents'
import Tasks from './pages/admin/Tasks'
import Analytics from './pages/admin/Analytics'
import Users from './pages/admin/Users'
import UserDashboard from './pages/user/UserDashboard'
import TaskDetail from './pages/user/TaskDetail'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400 text-sm">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="/dashboard" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
            <Route index element={<UserDashboard />} />
            <Route path="task/:id" element={<TaskDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
