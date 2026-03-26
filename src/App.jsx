import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import { useState, useEffect } from 'react'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin)
        setAdmin(adminData)
        setIsLoggedIn(true)
      } catch (err) {
        console.error('Failed to restore auth state:', err)
        localStorage.removeItem('admin')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (adminData) => {
    setAdmin(adminData)
    setIsLoggedIn(true)
    localStorage.setItem('admin', JSON.stringify(adminData))
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAdmin(null)
    localStorage.removeItem('admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard admin={admin} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

export default App
