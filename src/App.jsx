import Header from './components/Header'
import GameBoard from './components/GameBoard'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <GameBoard />
      </main>
    </div>
  )
}

export default App
