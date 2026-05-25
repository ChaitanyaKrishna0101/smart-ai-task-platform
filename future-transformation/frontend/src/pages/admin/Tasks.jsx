import React, { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getUsers, getDocuments } from '../../api/client'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'

const EMPTY = { title: '', description: '', difficulty: 'medium', assigned_to: '', document_id: '' }

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ status: '', assigned_to: '' })

  const load = () => {
    const params = {}
    if (filter.status) params.status = filter.status
    if (filter.assigned_to) params.assigned_to = filter.assigned_to
    return getTasks(params).then((r) => setTasks(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => {
    Promise.all([getUsers(), getDocuments()]).then(([u, d]) => {
      setUsers(u.data.filter((x) => x.role === 'user'))
      setDocs(d.data)
    })
  }, [])

  useEffect(() => { setLoading(true); load() }, [filter])

  const openCreate = () => { setEditTask(null); setForm(EMPTY); setError(''); setShowModal(true) }
  const openEdit = (t) => {
    setEditTask(t)
    setForm({ title: t.title, description: t.description || '', difficulty: t.difficulty,
      assigned_to: t.assigned_to || '', document_id: t.document_id || '' })
    setError('')
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      document_id: form.document_id ? Number(form.document_id) : null,
    }
    try {
      if (editTask) await updateTask(editTask.id, payload)
      else await createTask(payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    await deleteTask(id)
    load()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and assign tasks to users</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Task</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select className="select w-40" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select className="select w-44" value={filter.assigned_to} onChange={(e) => setFilter({ ...filter, assigned_to: e.target.value })}>
          <option value="">All users</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">✓</div>
          <div className="text-sm font-medium text-gray-600">No tasks found</div>
          <div className="text-xs text-gray-400 mt-1">Create your first task to assign to a user</div>
        </div>
      ) : (
        <div className="card divide-y divide-gray-50">
          {tasks.map((t) => (
            <div key={t.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{t.title}</span>
                    <Badge label={t.difficulty} />
                    <Badge label={t.status} />
                  </div>
                  {t.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">{t.description}</p>
                  )}
                  <div className="text-xs text-gray-400">
                    {t.assignee_name ? `👤 ${t.assignee_name}` : 'Unassigned'} &nbsp;·&nbsp;
                    {t.document_title ? `📄 ${t.document_title}` : 'No document'} &nbsp;·&nbsp;
                    {new Date(t.created_at).toLocaleDateString()}
                  </div>
                  {t.status === 'completed' && t.submission && (
                    <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                      <div className="text-xs font-medium text-emerald-700 mb-1">Submission:</div>
                      <div className="text-xs text-gray-600 line-clamp-3">{t.submission}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="btn-secondary text-xs py-1 px-2" onClick={() => openEdit(t)}>Edit</button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editTask ? 'Edit Task' : 'New Task'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>}
            <div>
              <label className="label">Title *</label>
              <input className="input" placeholder="Task title" required
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="textarea" rows={4} placeholder="What should the user do?"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Difficulty</label>
                <select className="select" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="label">Assign to</label>
                <select className="select" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Related Document</label>
              <select className="select" value={form.document_id} onChange={(e) => setForm({ ...form, document_id: e.target.value })}>
                <option value="">None</option>
                {docs.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1 justify-center" disabled={saving}>
                {saving ? 'Saving…' : editTask ? 'Update Task' : 'Create Task'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
