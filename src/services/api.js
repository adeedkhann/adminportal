import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Admin endpoints
export const getAllTeams = () => api.get('/api/v1/admin/getAllTeams')
export const getTeamDetails = (teamId) => api.post(`/api/v1/admin/teamDetails/${teamId}`)
export const gradeTeam = (teamId, scores) => api.post(`/api/v1/admin/grade/${teamId}`, scores)

export default api
