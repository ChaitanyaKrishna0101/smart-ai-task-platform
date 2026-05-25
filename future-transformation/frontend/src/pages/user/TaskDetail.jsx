import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTasks, submitTask, searchDocs } from '../../api/client'
import Badge from '../../components/Badge'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submission, setSubmission] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [showChunks, setShowChunks] = useState(false)

  useEffect(() => {
    getTasks().then((r) => {
      const t = r.data.find((x) => x.id === Number(id))
      setTask(t || null)
      if (t?.submission) setSubmission(t.submission)
    }).finally(() => setLoading(false))
  }, [id])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setSearchError('')
    setSearchResult(null)
    try {
      const res = await searchDocs({ query: query.trim(), n_results: 5 })
      setSearchResult(res.data)
    } catch (err) {
      setSearchError(err.response?.data?.detail || 'Search failed. Make sure documents are uploaded.')
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!submission.trim()) return
    setSubmitting(true)
    try {
      await submitTask(Number(id), { submission })
      setSubmitted(true)
    } catch (err) {
      alert(err.response?.data?.detail || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-64" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    </div>
  )

  if (!task) return (
    <div className="p-8 text-center">
      <div className="text-4xl mb-2">🔍</div>
      <div className="text-sm text-gray-500">Task not found</div>
      <button className="btn-secondary mt-4" onClick={() => navigate('/dashboard')}>Back to tasks</button>
    </div>
  )

  if (submitted || (task.status === 'completed' && task.submission)) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
          ← Back to tasks
        </button>
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Task Completed!</h2>
          <p className="text-sm text-gray-500 mb-6">Your submission has been recorded.</p>
          <div className="text-left p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">Your Submission</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.submission || submission}</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">Back to Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
        ← Back to tasks
      </button>

      {/* Task Header */}
      <div className="card p-5 mb-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold text-gray-900">{task.title}</h1>
              <Badge label={task.difficulty} />
            </div>
            {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
          </div>
        </div>
        {task.document_title && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 rounded-lg text-xs text-brand-700 font-medium">
            📄 Reference: {task.document_title}
          </div>
        )}
      </div>

      {/* AI Search */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">🔍 AI Knowledge Search</h2>
        <p className="text-xs text-gray-500 mb-4">Search the knowledge base to find relevant information for this task.</p>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            className="input flex-1"
            placeholder="e.g. What are the leave types available?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary flex-shrink-0" disabled={searching || !query.trim()}>
            {searching ? '…' : 'Search'}
          </button>
        </form>

        {searchError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{searchError}</div>
        )}

        {searchResult && (
          <div className="space-y-3">
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
              <div className="text-xs font-semibold text-brand-700 mb-2 flex items-center gap-1">
                <span>✨</span> AI Answer
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{searchResult.answer}</div>
            </div>
            <button
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              onClick={() => setShowChunks(!showChunks)}
            >
              {showChunks ? '▲' : '▼'} {searchResult.chunks.length} source chunks
            </button>
            {showChunks && (
              <div className="space-y-2">
                {searchResult.chunks.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="text-xs text-gray-400 mb-1">Chunk {i + 1} · Doc #{c.doc_id}</div>
                    <div className="text-xs text-gray-600 line-clamp-4">{c.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submission */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">📝 Your Submission</h2>
        <p className="text-xs text-gray-500 mb-4">
          Read the AI response, understand the content, then write your own summary or answer below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="textarea"
            rows={6}
            placeholder="Write your final answer or summary here after researching the knowledge base…"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary w-full justify-center py-2.5"
            disabled={submitting || !submission.trim()}
          >
            {submitting ? 'Submitting…' : '✓ Submit Task'}
          </button>
        </form>
      </div>
    </div>
  )
}
