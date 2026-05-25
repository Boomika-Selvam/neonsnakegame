import React from 'react'

/**
 * Footer — bottom bar with credits and tech stack badges.
 */
export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      {/* Bottom border */}
      <div className="h-0.5 w-full animated-border opacity-50" />

      <div className="bg-dark-800/80 backdrop-blur-md border-t border-neon-green/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">

          {/* Left */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🐍</span>
            <span className="font-orbitron text-xs text-gray-600 tracking-widest">
              NEON SNAKE ARENA
            </span>
          </div>

          {/* Center — tech badges */}
          <div className="flex items-center gap-2">
            {['React', 'Vite', 'Tailwind'].map(tech => (
              <span
                key={tech}
                className="font-rajdhani text-[10px] tracking-widest uppercase
                           border border-gray-700 text-gray-600 rounded px-2 py-0.5"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Right */}
          <p className="font-rajdhani text-xs text-gray-600">
            Built for internship showcase &nbsp;·&nbsp;
            <span className="text-neon-green/40">2024</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
