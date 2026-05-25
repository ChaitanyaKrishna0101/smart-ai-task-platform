import axios from 'axios'

const api = axios.create({
  baseURL: 'https://smart-ai-task-platform-3.onrender.com',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Auth
export const login = (data) => api.post('/auth/login', data)

// Users
export const getUsers = () => api.get('/users/')
export const createUser = (data) => api.post('/users/', data)
export const updateUser = (id, data) => api.patch(`/users/${id}`, data)
export const deleteUser = (id) => api.delete(`/users/${id}`)

// Documents
export const getDocuments = () => api.get('/documents/')
export const uploadDocument = (formData) =>
  api.post('/documents/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteDocument = (id) => api.delete(`/documents/${id}`)

// Tasks
export const getTasks = (params) => api.get('/tasks/', { params })
export const createTask = (data) => api.post('/tasks/', data)
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data)
export const submitTask = (id, data) => api.post(`/tasks/${id}/submit`, data)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)

// Search
export const searchDocs = (data) => api.post('/search/', data)

// Analytics
export const getAnalytics = () => api.get('/analytics/')