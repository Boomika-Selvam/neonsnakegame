import React, { useEffect, useState } from 'react'

/**
 * GameOverModal — animated overlay shown when the snake dies.
 */
export default function GameOverModal({ show, score, highScore, isNewRecord, onRestart, onBackToMenu }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      // Slight delay for dramatic effect
      const t = setTimeout(() => setVisible(true), 200)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div
        className={`relative rounded-2xl overflow-hidden max-w-sm w-full transition-all duration-500
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        {/* Animated border */}
        <div className="animated-border p-0.5 rounded-2xl">
          <div className="bg-dark-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4">

            {/* Icon */}
            <div className="text-5xl sm:text-6xl animate-float">💀</div>

            {/* Title */}
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-neon-pink glow-pink text-center">
              GAME OVER
            </h2>

            {/* New record badge */}
            {isNewRecord && (
              <div className="flex items-center gap-2 bg-neon-yellow/10 border border-neon-yellow/40
                              rounded-full px-4 py-1.5 animate-pulse">
                <span className="text-neon-yellow">★</span>
                <span className="font-rajdhani font-bold text-neon-yellow text-sm tracking-widest uppercase">
                  New High Score!
                </span>
                <span className="text-neon-yellow">★</span>
              </div>
            )}

            {/* Score display */}
            <div className="w-full grid grid-cols-2 gap-3 mt-1">
              <div className="neon-card rounded-xl p-3 border border-neon-green/20 text-center">
                <p className="font-rajdhani text-xs text-gray-500 tracking-widest uppercase mb-1">Score</p>
                <p className="font-orbitron font-black text-xl text-neon-green glow-green">
                  {String(score).padStart(5, '0')}
                </p>
              </div>
              <div className="neon-card rounded-xl p-3 border border-neon-cyan/20 text-center">
                <p className="font-rajdhani text-xs text-gray-500 tracking-widest uppercase mb-1">Best</p>
                <p className="font-orbitron font-black text-xl text-neon-cyan glow-cyan">
                  {String(highScore).padStart(5, '0')}
                </p>
              </div>
            </div>

            {/* Performance rating */}
            <div className="text-center">
              <p className="font-rajdhani text-sm text-gray-400">
                {score === 0    ? 'Better luck next time 😅'
                : score < 50   ? 'Not bad, keep practicing! 💪'
                : score < 150  ? 'Solid run! You\'re improving 🔥'
                : score < 300  ? 'Impressive skills! 🎯'
                :                'Absolute legend! 🏆'}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full mt-1">
              <button
                onClick={onRestart}
                className="neon-btn flex-1 font-orbitron font-bold text-sm py-3 rounded-xl
                           bg-neon-green/10 border-2 border-neon-green text-neon-green
                           hover:bg-neon-green/20 hover:shadow-neon-green transition-all
                           tracking-widest uppercase"
              >
                ▶ Play Again
              </button>
              <button
                onClick={onBackToMenu}
                className="neon-btn flex-1 font-orbitron font-bold text-sm py-3 rounded-xl
                           bg-transparent border-2 border-gray-600 text-gray-400
                           hover:border-gray-400 hover:text-gray-200 transition-all
                           tracking-widest uppercase"
              >
                ⌂ Menu
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
