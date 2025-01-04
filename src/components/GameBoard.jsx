import { useState, useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image';

import Card from './Card'
import PlayerSetup from './PlayerSetup'
import CategorySelection from './CategorySelection'
import useLocalStorage from '../hooks/useLocalStorage'
import { categories } from '../data/categories'
import { generateQuestion } from '../utils/bedrock';

const GameBoard = () => {
  const componentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [gameStage, setGameStage] = useLocalStorage('gameStage', 'setup') // 'setup' | 'category' | 'playing'
  const [selectedCategory, setSelectedCategory] = useLocalStorage('selectedCategory', null)
  const [players, setPlayers] = useLocalStorage('players', [])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useLocalStorage('currentPlayerIndex', 0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answerPhase, setAnswerPhase] = useState(false) // false = choosing truth/dare, true = answering


  const handlePlayersSubmit = (playerNames) => {
    const newPlayers = playerNames.map(name => ({
      name,
      score: 0,
      history: [] // Track player's answers
    }))
    setPlayers(newPlayers)
    setGameStage('category')
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setGameStage('playing')
  }

  const handleChoice = async (choice) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentCategory = getCurrentCategory();
      const question = await generateQuestion(choice, currentCategory.name);

      if (question) {
        setCurrentQuestion({ type: choice, text: question });
        setAnswerPhase(true);
      } else {
        throw new Error('Failed to generate question');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate question. Please try again.');
      // Use fallback question
      const fallbackQuestion = choice === 'truth'
        ? "What's your biggest fear?"
        : "Dance like nobody's watching for 30 seconds";
      setCurrentQuestion({ type: choice, text: fallbackQuestion });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (completed) => {
    // Update player's score and history
    const updatedPlayers = [...players]
    const currentPlayer = updatedPlayers[currentPlayerIndex]

    if (completed) {
      currentPlayer.score += 1
      currentPlayer.history.push({
        type: currentQuestion.type,
        question: currentQuestion.text,
        completed: true
      })
    } else {
      currentPlayer.history.push({
        type: currentQuestion.type,
        question: currentQuestion.text,
        completed: false
      })
    }

    setPlayers(updatedPlayers)

    // Move to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
    setCurrentQuestion(null)
    setAnswerPhase(false)
  }

  const handleShare = async () => {
  try {
    setIsSharing(true);

    // Capture the screenshot from the referenced component
    const canvas = await toCanvas(componentRef.current);
    const dataUrl = canvas.toDataURL('image/png');

    // Convert base64 to Blob
    const blob = await (await fetch(dataUrl)).blob();

    // Create a file from the blob
    const file = new File([blob], 'truth-or-dare-game.png', { type: 'image/png' });

    // Check if Web Share API is supported by the browser
    if (navigator.share) {
      await navigator.share({
        title: 'Truth or Dare Game',
        text: 'Check out my Truth or Dare game!',
        files: [file], // Sharing the image file
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareData = {
        title: 'Truth or Dare Game',
        text: 'Check out my Truth or Dare game!',
      };

      // If Web Share API is not available, attempt clipboard text copy
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.text);
        alert('Game link copied to clipboard!');
      } else {
        alert('Sorry, sharing is not supported on this browser.');
      }
    }
  } catch (error) {
    console.error('Error sharing:', error);
    alert('There was an issue while sharing the screenshot.');
  } finally {
    setIsSharing(false); // Reset the sharing state
  }
};

  const resetGame = () => {
    setPlayers([])
    setCurrentPlayerIndex(0)
    setSelectedCategory(null)
    setGameStage('setup')
    setCurrentQuestion(null)
    setAnswerPhase(false)
  }

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === selectedCategory)
  }

  // Step 1 & 2: Player Setup
  if (gameStage === 'setup') {
    return <PlayerSetup onStartGame={handlePlayersSubmit} />
  }

  // Step 3: Category Selection
  if (gameStage === 'category') {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Players Ready!</h2>
          <p className="text-gray-600">Now choose a category to start the game</p>
        </div>
        <CategorySelection onCategorySelect={handleCategorySelect} />
      </div>
    )
  }

  // Step 4: Game Play
  return (
    <div className="max-w-md mx-auto space-y-4" >
      <Card className="text-center p-6">
        <div className="mb-4">
          <span className={`inline-block px-4 py-2 rounded-full text-white ${getCurrentCategory()?.color}`}>
            {getCurrentCategory()?.icon} {getCurrentCategory()?.name}
          </span>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          {players[currentPlayerIndex]?.name}'s Turn
        </h2>

        {!answerPhase ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleChoice('truth')}
                disabled={isLoading}
                className={`bg-primary text-white px-6 py-3 rounded-lg transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
              >
                {isLoading ? 'Generating...' : 'Truth'}
              </button>
              <button
                onClick={() => handleChoice('dare')}
                disabled={isLoading}
                className={`bg-secondary text-white px-6 py-3 rounded-lg transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
              >
                {isLoading ? 'Generating...' : 'Dare'}
              </button>
            </div>
          ) : (
          // Question and Answer phase
          <div className="space-y-4 mb-6" >
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-lg font-medium">
                {currentQuestion?.type.toUpperCase()}: {currentQuestion?.text}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Completed
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Skipped
              </button>
            </div>
          </div>
        )}

        <div className="border-t pt-4"  ref={componentRef}>
          <h3 className="text-lg font-bold mb-3">Players</h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  index === currentPlayerIndex ? getCurrentCategory()?.color + ' text-white' : 'bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{player.name}</span>
                  <span>Score: {player.score}</span>
                </div>
                {player.history.length > 0 && (
                  <div className="text-sm mt-1 text-left">
                    Last: {player.history[player.history.length - 1].type} -
                    {player.history[player.history.length - 1].completed ? ' ✓' : ' ✗'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center mt-4" >
          <button
            onClick={handleShare}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Share Game
          </button>
        <button
          onClick={resetGame}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}

export default GameBoard
