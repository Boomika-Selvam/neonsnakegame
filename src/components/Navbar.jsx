import React from 'react'

/**
 * Navbar — top navigation bar with branding, sound toggle, and game status.
 */
export default function Navbar({ soundOn, setSoundOn, gameStatus }) {
  return (
    <nav className="w-full z-50 relative">
      {/* Animated top border */}
      <div className="h-0.5 w-full animated-border" />

      <div className="bg-dark-800/90 backdrop-blur-md border-b border-neon-green/10 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl animate-float select-none">🐍</span>
            <div>
              <h1 className="font-orbitron font-black text-base sm:text-xl text-neon-green glow-green leading-none tracking-wider">
                NEON SNAKE
              </h1>
              <p className="font-rajdhani text-xs text-neon-cyan/60 tracking-[0.2em] uppercase">
                Arena
              </p>
            </div>
          </div>

          {/* Center — game status badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${
              gameStatus === 'playing'
                ? 'bg-neon-green shadow-neon-green animate-pulse'
                : gameStatus === 'paused'
                ? 'bg-neon-yellow animate-pulse'
                : 'bg-gray-600'
            }`} />
            <span className="font-rajdhani text-sm tracking-widest uppercase text-gray-400">
              {gameStatus === 'playing'
                ? 'Live'
                : gameStatus === 'paused'
                ? 'Paused'
                : gameStatus === 'gameover'
                ? 'Game Over'
                : 'Ready'}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Sound toggle */}
            <button
              onClick={() => setSoundOn(v => !v)}
              title={soundOn ? 'Mute' : 'Unmute'}
              className="ctrl-btn rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm font-rajdhani font-semibold tracking-wider flex items-center gap-1.5"
            >
              <span className="text-base">{soundOn ? '🔊' : '🔇'}</span>
              <span className="hidden sm:inline text-xs uppercase tracking-widest">
                {soundOn ? 'SFX On' : 'SFX Off'}
              </span>
            </button>

            {/* GitHub-style badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-rajdhani text-gray-500 border border-gray-700 rounded px-2 py-1">
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
