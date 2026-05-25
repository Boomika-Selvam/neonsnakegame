import React, { useEffect, useRef, useCallback } from 'react'

const GRID = 20 // 20×20 grid

/**
 * GameBoard — renders the snake game grid.
 * All game logic lives in the useSnakeGame hook (passed as props here).
 */
export default function GameBoard({
  snake,
  food,
  gameStatus,
  onStart,
  onPause,
  onResume,
  onSwipe,
}) {
  const boardRef   = useRef(null)
  const touchStart = useRef(null)

  // ── Keyboard focus so arrow keys register ──────────────────────────────
  useEffect(() => {
    if (boardRef.current) boardRef.current.focus()
  }, [gameStatus])

  // ── Touch / swipe detection ─────────────────────────────────────────────
  const handleTouchStart = useCallback((e) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (Math.max(absDx, absDy) < 20) return // too small
    if (absDx > absDy) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT')
    } else {
      onSwipe(dy > 0 ? 'DOWN' : 'UP')
    }
    touchStart.current = null
  }, [onSwipe])

  // ── Build a flat Set for O(1) lookup ────────────────────────────────────
  const snakeSet  = new Set(snake.map(s => `${s.x},${s.y}`))
  const headKey   = snake.length ? `${snake[0].x},${snake[0].y}` : null
  const foodKey   = `${food.x},${food.y}`

  const getCellClass = (key) => {
    if (key === headKey)  return 'snake-cell snake-head'
    if (snakeSet.has(key)) return 'snake-cell snake-body'
    if (key === foodKey)  return 'snake-cell food-cell'
    return 'snake-cell'
  }

  // ── Grid cells ──────────────────────────────────────────────────────────
  const cells = []
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const key = `${x},${y}`
      cells.push(
        <div
          key={key}
          className={getCellClass(key)}
          style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}
        >
          <div className={`absolute inset-0.5 rounded-sm ${getCellClass(key)}`} />
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Board wrapper */}
      <div
        className="game-board-wrapper rounded-xl overflow-hidden relative w-full"
        style={{ maxWidth: '480px', aspectRatio: '1 / 1', margin: '0 auto' }}
      >
        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline-overlay z-10 pointer-events-none rounded-xl" />

        {/* Grid */}
        <div
          ref={boardRef}
          tabIndex={0}
          className="w-full h-full outline-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID}, 1fr)`,
            gridTemplateRows:    `repeat(${GRID}, 1fr)`,
            background: 'linear-gradient(135deg, #030a14 0%, #040e1c 50%, #030a14 100%)',
            gap: '1px',
            padding: '4px',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {cells}
        </div>

        {/* ── Start overlay ─────────────────────────────────────────────── */}
        {gameStatus === 'idle' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm rounded-xl gap-4 animate-fade-in">
            <div className="text-6xl animate-float">🐍</div>
            <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-neon-green glow-green text-center px-4">
              NEON SNAKE
            </h2>
            <p className="font-rajdhani text-neon-cyan/80 text-sm tracking-widest uppercase">
              Are you ready?
            </p>
            <button
              onClick={onStart}
              className="neon-btn mt-2 font-orbitron font-bold text-sm sm:text-base px-8 py-3 rounded-lg
                         bg-neon-green/10 border-2 border-neon-green text-neon-green
                         hover:bg-neon-green/20 hover:shadow-neon-green transition-all duration-200
                         tracking-widest uppercase"
            >
              ▶ START GAME
            </button>
          </div>
        )}

        {/* ── Paused overlay ────────────────────────────────────────────── */}
        {gameStatus === 'paused' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-900/80 backdrop-blur-sm rounded-xl gap-4 animate-fade-in">
            <div className="text-5xl">⏸</div>
            <h2 className="font-orbitron font-black text-2xl text-neon-yellow glow-yellow">
              PAUSED
            </h2>
            <button
              onClick={onResume}
              className="neon-btn font-orbitron font-bold text-sm px-8 py-3 rounded-lg
                         bg-neon-yellow/10 border-2 border-neon-yellow text-neon-yellow
                         hover:bg-neon-yellow/20 transition-all duration-200 tracking-widest uppercase"
            >
              ▶ RESUME
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
