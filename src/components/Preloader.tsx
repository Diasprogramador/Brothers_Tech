import { useEffect, useState } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

// SVGs das letras já existem em assets/loader/
const LETTERS_UP = ['B', 'R', 'O', 'T', 'H', 'E', 'R', 'S']  // BROTHERS
const LETTERS_DOWN = ['t', 'e', 'c', 'h']                      // tech

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isDone, setIsDone] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Barra de progresso
    const barInterval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 2 : p))
    }, 40)

    // Timer principal: 3s total
    const LAST_LETTER_DELAY = 120 + 11 * 180 + 520 // ~2.6s
    const TOTAL_MS = 3000

    const doneTimer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(() => setIsDone(true), 350)
      setTimeout(() => {
        onComplete()
        // remove do DOM
        const el = document.getElementById('preloader')
        if (el) el.remove()
      }, 900)
    }, Math.min(LAST_LETTER_DELAY, TOTAL_MS))

    // Safety net: 5s
    const safetyTimer = setTimeout(() => {
      if (!isComplete) {
        setIsComplete(true)
        setIsDone(true)
        onComplete()
      }
    }, 5000)

    return () => {
      clearInterval(barInterval)
      clearTimeout(doneTimer)
      clearTimeout(safetyTimer)
    }
  }, [isComplete, onComplete])

  return (
    <div
      id="preloader"
      className={`preloader ${isDone ? 'is-done' : ''} ${isComplete ? 'is-complete' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando Brothers Tech"
    >
      <div className="preloader-words">
        <div className="preloader-row preloader-row-up">
          {LETTERS_UP.map((letter, i) => (
            <div key={letter} className="letter" style={
              { ['--i' as any]: i } as React.CSSProperties
            }>
              <img src={`/assets/loader/${letter}.svg`} alt="" />
            </div>
          ))}
        </div>
        <div className="preloader-row preloader-row-down">
          {LETTERS_DOWN.map((letter, i) => (
            <div key={letter} className="letter" style={
              { ['--i' as any]: i + 8 } as React.CSSProperties
            }>
              <img src={`/assets/loader/${letter}.svg`} alt="" />
            </div>
          ))}
        </div>
      </div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
