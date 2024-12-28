import { useState } from 'react'
import Card from './Card'

const PlayerSetup = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(2)
  const [playerNames, setPlayerNames] = useState(['', ''])
  const [error, setError] = useState('')

  const handlePlayerCountChange = (e) => {
    const count = parseInt(e.target.value)
    setPlayerCount(count)
    // Adjust the playerNames array based on the new count
    setPlayerNames(prevNames => {
      const newNames = [...prevNames]
      if (count > prevNames.length) {
        // Add empty strings for new players
        return [...newNames, ...Array(count - prevNames.length).fill('')]
      } else {
        // Remove extra players
        return newNames.slice(0, count)
      }
    })
  }

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames]
    newNames[index] = value
    setPlayerNames(newNames)
    setError('') // Clear error when user types
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate that all names are filled and unique
    const filledNames = playerNames.every(name => name.trim() !== '')
    const uniqueNames = new Set(playerNames).size === playerNames.length

    if (!filledNames) {
      setError('Please fill in all player names')
      return
    }

    if (!uniqueNames) {
      setError('All player names must be unique')
      return
    }

    onStartGame(playerNames)
  }

  return (
    <div className="animate-in slide-in-bottom active">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Player Setup</h2>
        <p className="text-gray-600 mt-1">Who's playing today?</p>
      </div>

      <div className="game-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Number of Players
            </label>
            <select
              value={playerCount}
              onChange={handlePlayerCountChange}
              className="input"
            >
              {[2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} Players</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {playerNames.map((name, index) => (
              <div key={index} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Player {index + 1}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Enter name`}
                  className="input"
                  required
                  maxLength={20}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Start Game
          </button>
        </form>
      </div>
    </div>
  )
}

export default PlayerSetup
