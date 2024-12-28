import Header from './components/Header'
import GameBoard from './components/GameBoard'
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);


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
