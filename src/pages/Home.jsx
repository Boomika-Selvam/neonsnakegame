import React, { useState, useEffect, useRef } from 'react'
import Navbar        from '../components/Navbar.jsx'
import GameBoard     from '../components/GameBoard.jsx'
import ScorePanel    from '../components/ScorePanel.jsx'
import Controls      from '../components/Controls.jsx'
import GameOverModal from '../components/GameOverModal.jsx'
import Instructions  from '../components/Instructions.jsx'
import Footer        from '../components/Footer.jsx'

// ─── Constants ───────────────────────────────────────────────────────────────
const GRID = 20

const DIFFICULTY_SETTINGS = {
  easy:   { baseInterval: 180, pointsPerFood: 10 },
  medium: { baseInterval: 130, pointsPerFood: 15 },
  hard:   { baseInterval:  85, pointsPerFood: 25 },
}

const LEVEL_THRESHOLDS = [0, 50, 120, 220, 350, 520, 730, 1000]

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x:  9, y: 10 },
  { x:  8, y: 10 },
]

function randomFood(snake) {
  const snakeSet = new Set(snake.map(s => `${s.x},${s.y}`))
  let pos
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (snakeSet.has(`${pos.x},${pos.y}`))
  return pos
}

function getLevel(score) {
  let lvl = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (score >= LEVEL_THRESHOLDS[i]) lvl = i + 1
  }
  return lvl
}

function getInterval(difficulty, level) {
  const base = DIFFICULTY_SETTINGS[difficulty].baseInterval
  return Math.max(base - (level - 1) * 8, 60)
}

// ─── Sound helpers ────────────────────────────────────────────────────────────
let audioCtx = null
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}
function playBeep(freq = 440, duration = 0.08, type = 'square', vol = 0.15) {
  try {
    const ctx  = getAudioCtx()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (_) {}
}
function playEat(on) { on && playBeep(660, 0.1,  'sine',     0.2) }
function playDie(on) { on && playBeep(200, 0.4,  'sawtooth', 0.3) }

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [snake,       setSnake]       = useState(INITIAL_SNAKE)
  const [food,        setFood]        = useState(() => randomFood(INITIAL_SNAKE))
  const [gameStatus,  setGameStatus]  = useState('idle')
  const [score,       setScore]       = useState(0)
  const [highScore,   setHighScore]   = useState(
    () => parseInt(localStorage.getItem('neon_snake_hs') || '0', 10)
  )
  const [difficulty,  setDifficulty]  = useState('medium')
  const [soundOn,     setSoundOn]     = useState(true)
  const [isNewRecord, setIsNewRecord] = useState(false)

  const level = getLevel(score)

  // ── Refs that the interval closure reads (always fresh) ──────────────────
  const snakeRef      = useRef(INITIAL_SNAKE)
  const foodRef       = useRef(food)           // ← THE FIX: dedicated food ref
  const nextDirRef    = useRef('RIGHT')
  const dirRef        = useRef('RIGHT')
  const gameStatusRef = useRef('idle')
  const scoreRef      = useRef(0)
  const diffRef       = useRef('medium')
  const soundRef      = useRef(true)
  const intervalRef   = useRef(null)

  // Keep refs in sync with state
  useEffect(() => { snakeRef.current      = snake      }, [snake])
  useEffect(() => { foodRef.current       = food       }, [food])   // ← syncs food ref
  useEffect(() => { gameStatusRef.current = gameStatus }, [gameStatus])
  useEffect(() => { scoreRef.current      = score      }, [score])
  useEffect(() => { diffRef.current       = difficulty }, [difficulty])
  useEffect(() => { soundRef.current      = soundOn    }, [soundOn])

  // ── moveRef: always holds the latest tick logic, no stale closures ───────
  const moveRef = useRef(null)

  useEffect(() => {
    moveRef.current = () => {
      if (gameStatusRef.current !== 'playing') return

      // Apply queued direction (prevent 180° flip)
      const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }
      const d = nextDirRef.current
      if (d !== OPPOSITE[dirRef.current]) dirRef.current = d

      const head = snakeRef.current[0]
      let nx = head.x
      let ny = head.y

      if (dirRef.current === 'UP')    ny -= 1
      if (dirRef.current === 'DOWN')  ny += 1
      if (dirRef.current === 'LEFT')  nx -= 1
      if (dirRef.current === 'RIGHT') nx += 1

      // ── Wall collision ──────────────────────────────────────────────────
      if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID) {
        triggerGameOver(); return
      }

      // ── Self collision ──────────────────────────────────────────────────
      if (snakeRef.current.slice(1).some(s => s.x === nx && s.y === ny)) {
        triggerGameOver(); return
      }

      // ── Read food directly from foodRef (always current) ────────────────
      const currentFood = foodRef.current
      const ate = nx === currentFood.x && ny === currentFood.y

      const newHead  = { x: nx, y: ny }
      const newSnake = [newHead, ...snakeRef.current]
      if (!ate) newSnake.pop()

      // Update snake state
      snakeRef.current = newSnake
      setSnake(newSnake)

      if (ate) {
        playEat(soundRef.current)

        // Score
        const pts     = DIFFICULTY_SETTINGS[diffRef.current].pointsPerFood
        const newScore = scoreRef.current + pts
        scoreRef.current = newScore
        setScore(newScore)

        // Spawn new food immediately using the grown snake
        const newFood = randomFood(newSnake)
        foodRef.current = newFood   // update ref immediately so next tick sees it
        setFood(newFood)
      }
    }
  }) // no dep array — always reassigns so closure is always fresh

  // ── Game loop: restarts when status / difficulty / level changes ──────────
  useEffect(() => {
    if (gameStatus !== 'playing') {
      clearInterval(intervalRef.current)
      return
    }
    clearInterval(intervalRef.current)
    const ms = getInterval(difficulty, level)
    intervalRef.current = setInterval(() => moveRef.current?.(), ms)
    return () => clearInterval(intervalRef.current)
  }, [gameStatus, difficulty, level])

  // ── triggerGameOver (called inside moveRef, not a hook) ──────────────────
  function triggerGameOver() {
    playDie(soundRef.current)
    clearInterval(intervalRef.current)
    setGameStatus('gameover')
    const final = scoreRef.current
    const saved = parseInt(localStorage.getItem('neon_snake_hs') || '0', 10)
    if (final > saved) {
      localStorage.setItem('neon_snake_hs', String(final))
      setHighScore(final)
      setIsNewRecord(true)
    }
  }

  // ── Keyboard controls ─────────────────────────────────────────────────────
  useEffect(() => {
    const DIR_KEYS = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
    }
    const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }

    const handleKey = (e) => {
      const newDir = DIR_KEYS[e.key]
      if (newDir) {
        e.preventDefault()
        if (newDir !== OPPOSITE[dirRef.current]) {
          nextDirRef.current = newDir
        }
        if (gameStatusRef.current === 'idle') handleStart()
      }
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        if (gameStatusRef.current === 'playing') handlePause()
        else if (gameStatusRef.current === 'paused') handleResume()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, []) // eslint-disable-line

  // ── Game actions ──────────────────────────────────────────────────────────
  function handleStart() {
    clearInterval(intervalRef.current)
    const initFood = randomFood(INITIAL_SNAKE)
    snakeRef.current    = INITIAL_SNAKE
    foodRef.current     = initFood
    dirRef.current      = 'RIGHT'
    nextDirRef.current  = 'RIGHT'
    scoreRef.current    = 0
    setSnake(INITIAL_SNAKE)
    setFood(initFood)
    setScore(0)
    setIsNewRecord(false)
    setGameStatus('playing')
  }

  function handlePause() {
    clearInterval(intervalRef.current)
    setGameStatus('paused')
  }

  function handleResume() {
    setGameStatus('playing') // useEffect above restarts loop
  }

  function handleRestart() {
    clearInterval(intervalRef.current)
    handleStart()
  }

  function handleBackToMenu() {
    clearInterval(intervalRef.current)
    const initFood = randomFood(INITIAL_SNAKE)
    snakeRef.current   = INITIAL_SNAKE
    foodRef.current    = initFood
    dirRef.current     = 'RIGHT'
    nextDirRef.current = 'RIGHT'
    scoreRef.current   = 0
    setSnake(INITIAL_SNAKE)
    setFood(initFood)
    setScore(0)
    setIsNewRecord(false)
    setGameStatus('idle')
  }

  function handleDirection(dir) {
    const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }
    if (dir !== OPPOSITE[dirRef.current]) {
      nextDirRef.current = dir
    }
    if (gameStatusRef.current === 'idle') handleStart()
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar soundOn={soundOn} setSoundOn={setSoundOn} gameStatus={gameStatus} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start justify-center">

          {/* Left — board */}
          <div className="flex flex-col gap-3 w-full lg:max-w-[500px]">
            <ScorePanel score={score} highScore={highScore} level={level} />
            <GameBoard
              snake={snake}
              food={food}
              gameStatus={gameStatus}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onSwipe={handleDirection}
            />
          </div>

          {/* Right — controls & info */}
          <div className="flex flex-col gap-3 w-full lg:w-64 xl:w-72">
            <Controls
              onDirection={handleDirection}
              onPause={handlePause}
              onResume={handleResume}
              onRestart={handleRestart}
              gameStatus={gameStatus}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
            <Instructions />

            {/* Speed bar */}
            <div className="neon-card rounded-xl p-3 border border-neon-cyan/10">
              <p className="font-rajdhani text-xs text-gray-500 tracking-[0.2em] uppercase mb-2">Speed</p>
              <div className="flex gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      i < level ? 'bg-neon-green shadow-[0_0_4px_#00ff88]' : 'bg-dark-700/60'
                    }`}
                  />
                ))}
              </div>
              <p className="font-rajdhani text-xs text-neon-cyan mt-1.5 text-right">
                {Math.round(1000 / getInterval(difficulty, level))} moves/s
              </p>
            </div>

            {/* Keyboard hint */}
            <div className="hidden sm:block neon-card rounded-xl p-3 border border-gray-700/40">
              <p className="font-rajdhani text-xs text-gray-600 tracking-widest uppercase mb-2">Keyboard</p>
              <div className="grid grid-cols-3 gap-1 max-w-[100px] mx-auto">
                {['', '▲', '', '◀', '●', '▶', '', '▼', ''].map((k, i) => (
                  <div key={i} className={`h-7 w-7 rounded flex items-center justify-center text-xs
                    ${k ? 'bg-dark-600 border border-gray-700 text-gray-400' : 'bg-transparent'}`}>
                    {k}
                  </div>
                ))}
              </div>
              <p className="font-rajdhani text-[10px] text-gray-600 text-center mt-2">
                WASD / Arrow Keys · Space to pause
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <GameOverModal
        show={gameStatus === 'gameover'}
        score={score}
        highScore={highScore}
        isNewRecord={isNewRecord}
        onRestart={handleRestart}
        onBackToMenu={handleBackToMenu}
      />
    </div>
  )
}
