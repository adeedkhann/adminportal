import { useState, useEffect } from 'react'
import { FiX, FiSave } from 'react-icons/fi'
import { gradeTeam } from '@/services/api'

const criteriaConfig = {
  understanding: 40,
  approach: 30,
  result: 20,
  presentation: 10,
}

function ScoreForm({ team, round, onClose, onSave }) {
  const [scores, setScores] = useState({
    understanding: 0,
    approach: 0,
    result: 0,
    presentation: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Extract existing scores from team if available
    if (team.scores && team.scores.length > 0) {
      const roundNum = extractRoundNumber(round)
      const existingScore = team.scores.find(s => s.round === roundNum)
      if (existingScore) {
        setScores({
          understanding: existingScore.understanding || 0,
          approach: existingScore.approach || 0,
          result: existingScore.result || 0,
          presentation: existingScore.presentation || 0,
        })
      }
    }
  }, [team, round])

  const extractRoundNumber = (roundStr) => {
    // Convert "round1", "round2", "round3" to 1, 2, 3
    return parseInt(roundStr.replace('round', '')) || 1
  }

  const handleScoreChange = (criterion, value) => {
    const maxValue = criteriaConfig[criterion] || 100
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0), maxValue)
    setScores({
      ...scores,
      [criterion]: numValue,
    })
  }

  const calculateTotal = () => {
    const values = Object.values(scores)
    const sum = values.reduce((acc, val) => acc + Number(val), 0)
    return sum.toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const roundNum = extractRoundNumber(round)
      const teamId = team._id
      
      if (!teamId) {
        setError('Team ID not available')
        setLoading(false)
        return
      }
      
      await gradeTeam(teamId, {
        round: roundNum,
        understanding: scores.understanding,
        approach: scores.approach,
        result: scores.result,
        presentation: scores.presentation,
      })

      // Success - call onSave to refresh
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving scores')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const roundName = round === 'round1' ? 'Round 1' : round === 'round2' ? 'Round 2' : 'Round 3'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold">Score Form</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-gray-800 p-1 rounded transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Team Info */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600 mb-1">Team</p>
          <p className="font-semibold text-gray-900">{team.teamName}</p>
          <p className="text-sm text-gray-600 mt-3 mb-1">Round</p>
          <p className="font-semibold text-gray-900">{roundName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {/* Criteria Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(criteriaConfig).map(([criterion, maxScore]) => (
              <div key={criterion}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {criterion.charAt(0).toUpperCase() + criterion.slice(1)} (max {maxScore})
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max={maxScore}
                    step="0.5"
                    value={scores[criterion]}
                    onChange={(e) => handleScoreChange(criterion, e.target.value)}
                    placeholder="0"
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100 text-sm"
                  />
                  <span className="ml-2 text-xs text-gray-500 font-semibold">/ {maxScore}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Total Score */}
          <div className="mb-6 p-4 bg-black text-white rounded-lg">
            <p className="text-sm text-gray-300 mb-1">Total Score</p>
            <p className="text-3xl font-bold">{calculateTotal()}</p>
            <p className="text-xs text-gray-400 mt-1">out of 100</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiSave size={18} />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScoreForm
