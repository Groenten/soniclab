import { useMemo, useState } from 'react'
import { Card } from './components/Card'
import { initAudio, playNote } from './audio/audioEngine'

type GameCard = {
  id: string
  pairId: string
  label: string
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function GameBoard({
  level,
  onNextLevel,
  onRestart
}: {
  level: number
  onNextLevel: () => void
  onRestart: () => void
}) {
  const pairs = useMemo(() => {
    if (level === 1) return ['C4', 'E4', 'G4', 'Bb4'] // 4 pares
    return ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5'] // 8 pares
  }, [level])

  const cards = useMemo(() => {
    const created: GameCard[] = pairs.flatMap((p, idx) => [
      { id: `${level}-${p}-1`, pairId: `${idx}`, label: p },
      { id: `${level}-${p}-2`, pairId: `${idx}`, label: p }
    ])
    return shuffle(created)
  }, [pairs, level])

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
  const isLastLevel = level >= 2

  return (
    <div>
      <p>
        Nivel: {level} · Movimientos: {moves} {complete ? '✅ Completado' : ''}
      </p>

      {complete && (
        <div style={{ marginBottom: 16 }}>
          {!isLastLevel ? (
            <button onClick={onNextLevel}>Siguiente nivel ▶</button>
          ) : (
            <button onClick={onRestart}>Reiniciar juego ↺</button>
          )}
        </div>
      )}

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
