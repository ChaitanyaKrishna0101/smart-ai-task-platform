import React, { useEffect, useState, useRef } from 'react'
import { getDocuments, uploadDocument, deleteDocument } from '../../api/client'
import Modal from '../../components/Modal'

export default function Documents() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const load = () => getDocuments().then((r) => setDocs(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please select a file')
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('file', file)
    try {
      await uploadDocument(fd)
      setShowModal(false)
      setForm({ title: '', description: '' })
      setFile(null)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? This also removes it from the AI index.')) return
    await deleteDocument(id)
    load()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload documents to build the knowledge base</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowModal(true); setError('') }}>
          + Upload Document
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📄</div>
          <div className="text-sm font-medium text-gray-600">No documents yet</div>
          <div className="text-xs text-gray-400 mt-1">Upload your first PDF or TXT file to get started</div>
        </div>
      ) : (
        <div className="card divide-y divide-gray-50">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{doc.file_type === 'pdf' ? '📄' : '📝'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{doc.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {doc.filename} &nbsp;·&nbsp;
                  <span className="uppercase font-medium">{doc.file_type}</span> &nbsp;·&nbsp;
                  {doc.chunk_count} chunks &nbsp;·&nbsp;
                  {new Date(doc.created_at).toLocaleDateString()}
                </div>
                {doc.description && <div className="text-xs text-gray-500 mt-1 truncate">{doc.description}</div>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  doc.chunk_count > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {doc.chunk_count > 0 ? '✓ Indexed' : '⚠ Not indexed'}
                </span>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Upload Document" onClose={() => setShowModal(false)}>
          <form onSubmit={handleUpload} className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>}
            <div>
              <label className="label">Document Title *</label>
              <input className="input" placeholder="e.g. Employee Handbook" required
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Description (optional)</label>
              <input className="input" placeholder="Brief description of this document"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label">File (PDF or TXT) *</label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-brand-300 hover:bg-brand-50/50 transition-colors"
                onClick={() => fileRef.current.click()}
              >
                {file ? (
                  <div className="text-sm text-gray-700 font-medium">{file.name}</div>
                ) : (
                  <>
                    <div className="text-2xl mb-1">📁</div>
                    <div className="text-sm text-gray-500">Click to select a PDF or TXT file</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden"
                onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1 justify-center" disabled={uploading}>
                {uploading ? 'Uploading & indexing…' : 'Upload'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
