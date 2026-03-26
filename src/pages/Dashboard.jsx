import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiEdit2, FiUser } from 'react-icons/fi'
import ScoreForm from '@/components/ScoreForm'
import { getAllTeams } from '@/services/api'
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
      const response = await getAllTeams()
      
      // Map backend response to frontend format
      const formattedTeams = response.data.data.map((team) => {
        // Extract scores for each round from the scores array
        const scoresByRound = {}
        team.scores.forEach(score => {
          scoresByRound[score.round] = score.totalScore
        })

        // Handle dataset - extract name or convert to string
        const datasetName = typeof team.dataset === 'object' 
          ? (team.dataset?.name || team.dataset?.title || 'N/A')
          : team.dataset || 'N/A'

        return {
          _id: team._id, // MongoDB ObjectId
          teamName: team.teamName,
          members: team.members,
          dataset: datasetName,
          scoreRound1: scoresByRound[1] || 0,
          scoreRound2: scoresByRound[2] || 0,
          scoreRound3: scoresByRound[3] || 0,
          scores: team.scores
        }
      })

      setTeams(formattedTeams)
      setError('')
    } catch (err) {
      setError('Failed to load teams')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditScore = (team, round) => {
    // For now, pass team object with teamName as identifier
    // Once backend returns _id or accepts teamName, this will work seamlessly
    setSelectedTeam(team)
    setSelectedRound(round)
    setShowForm(true)
  }

  const handleScoreSaved = async () => {
    // Refresh teams after saving
    await fetchTeams()
    setShowForm(false)
    setSelectedTeam(null)
    setSelectedRound(null)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const calculateTotalScore = (team) => {
    const round1 = Number(team.scoreRound1 || 0)
    const round2 = Number(team.scoreRound2 || 0)
    const round3 = Number(team.scoreRound3 || 0)
    return (round1 + round2 + round3).toFixed(2)
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
                {teams.map((team) => (
                  <tr
                    key={team._id || team.teamName}
                    className={`hover:bg-gray-100 transition`}
                  >
                    <td className="px-6 py-4 text-gray-900 font-semibold">{team.teamName}</td>
                    <td className="px-6 py-4 text-gray-700">{team.members && team.members.length > 0 ? team.members[0] : 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-700">{team.dataset}</td>
                    {[1, 2, 3].map((roundNum) => {
                      const score = Number(team[`scoreRound${roundNum}`] || 0)
                      return (
                        <td key={roundNum} className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <span className={`px-3 py-2 rounded-lg font-semibold ${
                              score > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {score > 0 ? score : '-'}
                            </span>
                            <button
                              onClick={() => handleEditScore(team, `round${roundNum}`)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                              title={`Edit Round ${roundNum} score`}
                            >
                              <FiEdit2 size={16} />
                            </button>
                          </div>
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
