import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const loginAdmin = (email, password) => api.post('/api/auth/login', { email, password })
export const fetchTeams = () => api.get('/api/teams')
export const saveScores = (payload) => api.post('/api/scores/save', payload)

export default api
