import axios from 'axios'

const API_BASE_URL = 'https://komputasiawan-memoria-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth Services
export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  login: async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
  }
}

// Journal Services
export const journalService = {
  getAll: async (search = '') => {
    const url = search ? `/journals?search=${encodeURIComponent(search)}` : '/journals'
    const response = await api.get(url)
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/journals/${id}`)
    return response.data
  },
  
  create: async (formData) => {
    const response = await api.post('/journals', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  
  update: async (id, formData) => {
    const response = await api.put(`/journals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/journals/${id}`)
    return response.data
  }
}

export default api