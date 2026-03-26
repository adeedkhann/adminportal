import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import logo from "../assets/mlcoelogo1.svg"
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Replace with your API endpoint
      // const response = await axios.post('YOUR_API_URL/api/auth/login', {
      //   email,
      //   password,
      // })

      // Demo hardcoded validation
      if (email === 'admin@mlcoe.com' && password === 'convo@2620') {
        const adminData = {
          email: email,
          name: 'Admin User'
        }
        onLogin(adminData)
        navigate('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Error connecting to server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className=" px-6 py-8 text-black">
            <img className='w-full' src={logo} alt="" />
            
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8">
            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiLogIn size={18} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  )
}

export default LoginPage
