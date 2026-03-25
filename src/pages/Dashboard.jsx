import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiLogOut, FiEdit2, FiUser } from 'react-icons/fi'
import ScoreForm from '@/components/ScoreForm'
import mlcoelogo1 from '@/assets/mlcoelogo1.svg'

function Dashboard({ admin, onLogout }) {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedRound, setSelectedRound] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      // TODO: Replace with your API endpoint
      // const response = await axios.get('YOUR_API_URL/api/teams')
      // setTeams(response.data)

      // Demo data
      const demoTeams = [
        {
          id: 1,
          name: 'Vision Coders',
          leader: 'Ananya Rao',
          dataset: 'Smart Domain Set',
          scoreRound1: 0,
          scoreRound2: 0,
          scoreRound3: 0
        },
        {
          id: 2,
          name: 'Data Warriors',
          leader: 'John Doe',
          dataset: 'Financial Analytics',
          scoreRound1: 0,
          scoreRound2: 0,
          scoreRound3: 0
        },
        {
          id: 3,
          name: 'AI Innovators',
          leader: 'Alex Johnson',
          dataset: 'ML Predictions',
          scoreRound1: 0,
          scoreRound2: 0,
          scoreRound3: 0
        }
      ]
      setTeams(demoTeams)
      setError('')
    } catch (err) {
      setError('Failed to load teams')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditScore = (team, round) => {
    setSelectedTeam(team)
    setSelectedRound(round)
    setShowForm(true)
  }

  const handleScoreSaved = (updatedTeam) => {
    const updated = teams.map(t => (t.id === updatedTeam.id ? updatedTeam : t))
    setTeams(updated)
    setShowForm(false)
    setSelectedTeam(null)
    setSelectedRound(null)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const calculateTotalScore = (team) => {
    const a = Number(team.scoreRound1 || 0)
    const b = Number(team.scoreRound2 || 0)
    const c = Number(team.scoreRound3 || 0)
    return (a + b + c).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo and Text */}
          <img className='sm:w-30 w-80' src={mlcoelogo1} alt="" />

          {/* User Profile Icon */}
          <button
            
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
            title={`Sign out as ${admin.email}`}
          >
            <FiUser size={20} className="text-gray-700" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Team Scoreboard</h2>
          <p className="text-gray-600 mt-1">Total score = Round1 + Round2 + Round3 (each max 100)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="text-gray-600 mt-4">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No teams found</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Team Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Leader</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Dataset</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Round 1</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Round 2</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Round 3</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100  transition`}
                  >
                    <td className="px-6 py-4 text-gray-900 font-semibold">{team.name}</td>
                    <td className="px-6 py-4 text-gray-700">{team.leader}</td>
                    <td className="px-6 py-4 text-gray-700">{team.dataset}</td>
                    {[1, 2, 3].map((roundNum) => {
                      const score = Number(team[`scoreRound${roundNum}`] || 0)
                      return (
                        <td key={roundNum} className="px-6 py-4  text-center">
                          <button
                            onClick={() => handleEditScore(team, `round${roundNum}`)}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition ${
                              score > 0
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {score > 0 ? score : <><FiEdit2 size={16} /> Edit</>}
                          </button>
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{calculateTotalScore(team)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showForm && selectedTeam && selectedRound && (
        <ScoreForm
          team={selectedTeam}
          round={selectedRound}
          onClose={() => setShowForm(false)}
          onSave={handleScoreSaved}
        />
      )}
    </div>
  )
}

export default Dashboard
