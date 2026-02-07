import { useMemo, useState } from 'react'
import { Card } from './components/Card'
import { initAudio, playNote } from './audio/audioEngine'

type GameCard = {
  id: string // id único
  pairId: string // identifica la pareja
  label: string // lo que se muestra al revelar
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App() {
  const cards = useMemo(() => {
    const pairs = ['C4', 'E4', 'G4', 'Bb4'] // 4 pares => 8 cartas
    const created: GameCard[] = pairs.flatMap((p, idx) => [
      { id: `${p}-1`, pairId: `${idx}`, label: p },
      { id: `${p}-2`, pairId: `${idx}`, label: p }
    ])
    return shuffle(created)
  }, [])

  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)

  const onCardClick = async (index: number) => {
    if (locked) return
    if (flipped.includes(index)) return
    if (matched.includes(cards[index].pairId)) return

    await initAudio()
    playNote(cards[index].label)

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setLocked(true)
      setMoves((m) => m + 1)

      const [i1, i2] = newFlipped
      const c1 = cards[i1]
      const c2 = cards[i2]

      if (c1.pairId === c2.pairId) {
        setMatched((prev) => [...prev, c1.pairId])
        setFlipped([])
        setLocked(false)
      } else {
        window.setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  const complete = matched.length === cards.length / 2

  return (
    <div style={{ padding: 24 }}>
      <h1>SonicMemory</h1>
      <p>
        Movimientos: {moves} {complete ? '✅ Completado' : ''}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 90px)',
          gap: 12
        }}
      >
        {cards.map((c, idx) => (
          <Card
            key={c.id}
            label={c.label}
            isRevealed={flipped.includes(idx)}
            isMatched={matched.includes(c.pairId)}
            onClick={() => onCardClick(idx)}
          />
        ))}
      </div>
    </div>
  )
}
