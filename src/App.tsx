import { useState } from 'react'
import GameBoard from './GameBoard'

export default function App() {
  const [level, setLevel] = useState(1)

  return (
    <div style={{ padding: 24 }}>
      <h1>SonicMemory</h1>

      <GameBoard
        key={level}
        level={level}
        onNextLevel={() => setLevel((l) => l + 1)}
        onRestart={() => setLevel(1)}
      />
    </div>
  )
}
