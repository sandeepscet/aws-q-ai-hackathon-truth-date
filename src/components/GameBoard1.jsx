import { useState } from 'react'
import Card from './Card'
import PlayerForm from './PlayerForm'
import CategorySelection from './CategorySelection'
import useLocalStorage from '../hooks/useLocalStorage'

const GameBoard = () => {
  const [gameType, setGameType] = useState(null) // 'truth' or 'dare'
  const [players, setPlayers] = useLocalStorage('players', [])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useLocalStorage('currentPlayerIndex', 0)
  const [gameStarted, setGameStarted] = useState(false)

  const handlePlayersSubmit = (playerNames) => {
    setPlayers(playerNames.map(name => ({
      name,
      score: 0
    })))
    setGameStarted(true)
  }

  const resetGame = () => {
    setPlayers([])
    setCurrentPlayerIndex(0)
    setGameStarted(false)
    setGameType(null)
  }

  if (!gameStarted) {
    return <PlayerForm onSubmit={handlePlayersSubmit} />
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="text-center">
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Current Player: {players[currentPlayerIndex]?.name}
          </h2>
        </div>

        {!gameType ? (
          <div className="space-y-4">
            <h3 className="text-lg">Choose Your Path</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setGameType('truth')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Truth
              </button>
              <button
                onClick={() => setGameType('dare')}
                className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Dare
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg">
              You chose: {gameType.toUpperCase()}
            </h3>
            <button
              onClick={() => setGameType(null)}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Choose Again
            </button>
          </div>
        )}
      </Card>

      {/* Players List */}
      <Card>
        <h3 className="text-lg font-bold mb-3">Players</h3>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                index === currentPlayerIndex ? 'bg-primary text-white' : 'bg-gray-100'
              }`}
            >
              {player.name} - Score: {player.score}
            </div>
          ))}
        </div>
      </Card>

      {/* Reset Game Button */}
      <button
        onClick={resetGame}
        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Reset Game
      </button>
    </div>
  )
}

export default GameBoard
