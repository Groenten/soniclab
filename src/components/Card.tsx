type CardProps = {
  label: string
  isRevealed: boolean
  isMatched: boolean
  onClick: () => void
}

export function Card({ isRevealed, isMatched, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isMatched}
      style={{
        width: 90,
        height: 90,
        borderRadius: 12,
        border: '1px solid #ccc',
        fontSize: 22,
        cursor: isMatched ? 'default' : 'pointer',
        opacity: isMatched ? 0.5 : 1
      }}
    >
      {isRevealed || isMatched ? '🔊' : '?'}
    </button>
  )
}
