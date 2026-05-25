import React from 'react'

/**
 * Controls — mobile D-pad, difficulty selector, and game action buttons.
 */

const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   color: 'text-neon-green',  border: 'border-neon-green/30'  },
  { key: 'medium', label: 'Medium', color: 'text-neon-yellow', border: 'border-neon-yellow/30' },
  { key: 'hard',   label: 'Hard',   color: 'text-neon-pink',   border: 'border-neon-pink/30'   },
]

export default function Controls({
  onDirection,
  onPause,
  onResume,
  onRestart,
  gameStatus,
  difficulty,
  setDifficulty,
}) {
  const isPlaying = gameStatus === 'playing'
  const isPaused  = gameStatus === 'paused'
  const isIdle    = gameStatus === 'idle'

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ── Difficulty selector ─────────────────────────────────────────── */}
      <div className="neon-card rounded-xl p-3 border border-neon-green/10">
        <p className="font-rajdhani text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 text-center">
          Difficulty
        </p>
        <div className="flex gap-2">
          {DIFFICULTIES.map(d => (
            <button
              key={d.key}
              onClick={() => !isPlaying && !isPaused && setDifficulty(d.key)}
              disabled={isPlaying || isPaused}
              className={`flex-1 font-rajdhani font-semibold text-sm py-2 rounded-lg border
                          tracking-wider uppercase transition-all duration-200
                          ${difficulty === d.key
                            ? 'diff-btn-active'
                            : `${d.color} ${d.border} bg-transparent hover:bg-white/5`
                          }
                          disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Action buttons ──────────────────────────────────────────────── */}
      <div className="flex gap-2">
        {/* Pause / Resume */}
        <button
          onClick={isPlaying ? onPause : onResume}
          disabled={isIdle || gameStatus === 'gameover'}
          className="ctrl-btn flex-1 rounded-xl py-2.5 font-rajdhani font-bold tracking-widest
                     uppercase text-sm flex items-center justify-center gap-2
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isPlaying ? '⏸ Pause' : '▶ Resume'}
        </button>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="ctrl-btn flex-1 rounded-xl py-2.5 font-rajdhani font-bold tracking-widest
                     uppercase text-sm flex items-center justify-center gap-2
                     text-neon-pink border-neon-pink/30 hover:bg-neon-pink/10 hover:shadow-neon-pink"
        >
          ↺ Restart
        </button>
      </div>

      {/* ── Mobile D-pad (only shown on touch screens) ──────────────────── */}
      <div className="neon-card rounded-xl p-3 border border-neon-cyan/10 sm:hidden">
        <p className="font-rajdhani text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 text-center">
          Touch Controls
        </p>
        <div className="flex flex-col items-center gap-1" style={{ userSelect: 'none' }}>
          {/* Up */}
          <button
            onPointerDown={() => onDirection('UP')}
            className="ctrl-btn w-14 h-10 rounded-lg text-xl font-bold flex items-center justify-center"
          >
            ▲
          </button>
          {/* Middle row */}
          <div className="flex gap-1">
            <button
              onPointerDown={() => onDirection('LEFT')}
              className="ctrl-btn w-14 h-10 rounded-lg text-xl font-bold flex items-center justify-center"
            >
              ◀
            </button>
            <div className="w-14 h-10 rounded-lg bg-dark-700/50 border border-neon-green/5 flex items-center justify-center">
              <span className="text-neon-green/30 text-xs font-orbitron">OK</span>
            </div>
            <button
              onPointerDown={() => onDirection('RIGHT')}
              className="ctrl-btn w-14 h-10 rounded-lg text-xl font-bold flex items-center justify-center"
            >
              ▶
            </button>
          </div>
          {/* Down */}
          <button
            onPointerDown={() => onDirection('DOWN')}
            className="ctrl-btn w-14 h-10 rounded-lg text-xl font-bold flex items-center justify-center"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  )
}
