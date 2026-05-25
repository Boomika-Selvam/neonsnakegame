import React, { useState } from 'react'

/**
 * Instructions — collapsible panel explaining game controls and rules.
 */
export default function Instructions() {
  const [open, setOpen] = useState(false)

  return (
    <div className="neon-card rounded-xl border border-neon-purple/20 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3
                   hover:bg-neon-purple/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📖</span>
          <span className="font-rajdhani font-bold text-sm tracking-widest uppercase text-neon-purple glow-purple">
            How to Play
          </span>
        </div>
        <span className={`text-neon-purple transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {/* Collapsible body */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-4 pb-4 flex flex-col gap-3">

          {/* Controls */}
          <div>
            <p className="font-rajdhani text-xs text-gray-500 tracking-widest uppercase mb-2">Controls</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-rajdhani text-gray-300">
              {[
                ['⬆⬇⬅➡', 'Arrow Keys'],
                ['W A S D', 'WASD Keys'],
                ['Space / P', 'Pause / Resume'],
                ['Touch Buttons', 'Mobile D-Pad'],
                ['Swipe Board', 'Mobile Swipe'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-2 bg-dark-700/40 rounded-lg px-2 py-1.5 col-span-1">
                  <span className="text-neon-cyan font-semibold text-[11px] min-w-[60px]">{key}</span>
                  <span className="text-gray-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <p className="font-rajdhani text-xs text-gray-500 tracking-widest uppercase mb-2">Rules</p>
            <ul className="text-xs font-rajdhani text-gray-400 space-y-1">
              {[
                '🍎 Eat the pink food to grow and earn points',
                '🚧 Avoid hitting the walls or your own body',
                '⚡ Speed increases as your score rises',
                '🏆 High score is saved automatically',
                '🎯 Higher difficulty = faster snake from start',
              ].map(rule => (
                <li key={rule} className="flex items-start gap-1.5">{rule}</li>
              ))}
            </ul>
          </div>

          {/* Scoring */}
          <div>
            <p className="font-rajdhani text-xs text-gray-500 tracking-widest uppercase mb-2">Scoring</p>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-rajdhani">
              {[
                { label: 'Easy',   pts: '+10 pts', color: 'text-neon-green' },
                { label: 'Medium', pts: '+15 pts', color: 'text-neon-yellow' },
                { label: 'Hard',   pts: '+25 pts', color: 'text-neon-pink' },
              ].map(s => (
                <div key={s.label} className="bg-dark-700/40 rounded-lg p-2 text-center">
                  <p className={`font-bold ${s.color}`}>{s.pts}</p>
                  <p className="text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
