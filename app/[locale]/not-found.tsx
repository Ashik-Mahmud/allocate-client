
'use client';

import React, { useState, MouseEvent } from 'react'
import Link from 'next/link'

type Props = {}

export default function NotFound() {
  // Store mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Calculate mouse position relative to the center of the viewport
    setMousePos({
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    });
  };

  // Helper function to calculate translate values
  const getTranslate = (factor: number) => {
    return `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white/50 dark:bg-slate-950 px-4 overflow-hidden relative"
      onMouseMove={handleMouseMove} suppressHydrationWarning
    >
      {/* Background Layer: Large, slow-moving "404" */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{ transform: getTranslate(0.01) }} // Moves the least
      >
        <h1 className="text-[40rem] font-black text-slate-900 dark:text-white leading-none tracking-tighter">
          404
        </h1>
      </div>

      {/* Middle Layer: The "floating" ghost */}
      <div
        className="relative z-10 mb-8 pointer-events-none"
        style={{ transform: getTranslate(-0.04) }} // Moves against the mouse
      >
        <div className="text-8xl animate-float">👻</div>
        {/* Shadow for the ghost */}
        <div className="w-16 h-3 bg-slate-900/10 dark:bg-white/10 rounded-full mt-4 mx-auto blur-sm animate-shadow"></div>
      </div>

      {/* Foreground Layer: Content & Button */}
      <div
        className="text-center relative z-20"
        style={{ transform: getTranslate(0.02) }} // Moves with the mouse
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tighter">
          Oops! Dead End.
        </h2>
        <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          It looks like you've reached a ghost town. The page you are looking for has moved or no longer exists.
        </p>

        {/* Action Button */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-10 py-4 text-lg font-semibold rounded-full shadow-lg text-white bg-rose-600 hover:bg-rose-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Take Me Home
          </Link>
        </div>
      </div>

      {/* Required CSS for Option 3 Floating Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shadow {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(0.7); opacity: 0.5; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shadow { animation: shadow 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

