import { useState } from 'react'
import Card from './Card'

const PlayerForm = ({ onSubmit }) => {
  const [playerCount, setPlayerCount] = useState('')
  const [players, setPlayers] = useState([])
  const [step, setStep] = useState(1) // 1 for count selection, 2 for names

  const handlePlayerCountSubmit = (e) => {
    e.preventDefault()
    const count = parseInt(playerCount)
    if (count > 0) {
      setPlayers(Array(count).fill(''))
      setStep(2)
    }
  }

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  const handleSubmitPlayers = (e) => {
    e.preventDefault()
    if (players.every(name => name.trim() !== '')) {
      onSubmit(players)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      {step === 1 ? (
        // Step 1: Number of Players
        <form onSubmit={handlePlayerCountSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-4">
            How many players are joining?
          </h2>
          <div className="flex flex-col items-center gap-4">
            <input
              type="number"
              min="2"
              max="10"
              value={playerCount}
              onChange={(e) => setPlayerCount(e.target.value)}
              className="w-20 text-center px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Next
            </button>
          </div>
        </form>
      ) : (
        // Step 2: Player Names
        <form onSubmit={handleSubmitPlayers} className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-4">
            Enter Player Names
          </h2>
          <div className="space-y-3">
            {players.map((player, index) => (
              <div key={index} className="flex items-center gap-2">
                <label className="w-24">Player {index + 1}:</label>
                <input
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder={`Enter name`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Start Game
            </button>
          </div>
        </form>
      )}
    </Card>
  )
}

export default PlayerForm
