import React from 'react'

/**
 * ScorePanel — displays Score, High Score, and Level cards.
 * Each card has a neon-themed colour and glowing label.
 */
function StatCard({ label, value, color, icon }) {
  const colorMap = {
    green:  { text: 'text-neon-green',  glow: 'glow-green',  border: 'border-neon-green/20',  bg: 'from-neon-green/5'  },
    cyan:   { text: 'text-neon-cyan',   glow: 'glow-cyan',   border: 'border-neon-cyan/20',   bg: 'from-neon-cyan/5'   },
    yellow: { text: 'text-neon-yellow', glow: 'glow-yellow', border: 'border-neon-yellow/20', bg: 'from-neon-yellow/5' },
  }
  const c = colorMap[color] || colorMap.green

  return (
    <div className={`neon-card rounded-xl p-3 sm:p-4 border ${c.border} bg-gradient-to-br ${c.bg} to-transparent flex-1 min-w-0`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg sm:text-xl">{icon}</span>
        <span className={`font-rajdhani text-[10px] sm:text-xs tracking-[0.15em] uppercase font-semibold ${c.text} opacity-70`}>
          {label}
        </span>
      </div>
      <div className={`font-orbitron font-black text-xl sm:text-2xl md:text-3xl ${c.text} ${c.glow} tabular-nums`}>
        {String(value).padStart(5, '0')}
      </div>
    </div>
  )
}

export default function ScorePanel({ score, highScore, level }) {
  return (
    <div className="flex gap-2 sm:gap-3 w-full">
      <StatCard label="Score"     value={score}     color="green"  icon="⚡" />
      <StatCard label="Best"      value={highScore}  color="cyan"   icon="🏆" />
      <StatCard label="Level"     value={level}      color="yellow" icon="🎯" />
    </div>
  )
}
