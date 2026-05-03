// import React from 'react'
// import Link from 'next/link'

// type Props = {}

// const NotFoundPage = (props: Props) => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/50 px-4">
//       <div className="text-center">
//         {/* Animated "404" */}
//         <h1 className="text-[12rem] font-extrabold text-slate-200 dark:text-slate-800 animate-pulse tracking-tighter leading-none">
//           404
//         </h1>
        
//         {/* Main Content */}
//         <div className="-mt-16 relative z-10">
//           <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
//             Lost in Space?
//           </h2>
//           <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
//             The page you are looking for has either vanished into a black hole or never existed in this dimension.
//           </p>

//           {/* Action Button */}
//           <div className="mt-10">
//             <Link 
//               href="/"
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 transition-colors duration-200"
//             >
//               Return to Mission Control
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NotFoundPage
// import React from 'react'
// import Link from 'next/link'

// const NotFoundPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white/50 dark:bg-slate-950/50 px-4 overflow-hidden">
//       <div className="relative group">
//         {/* Main 404 Text */}
//         <h1 className="text-[10rem] md:text-[15rem] font-black text-slate-900 dark:text-white leading-none relative tracking-tighter">
//           <span className="relative z-10">404</span>
          
//           {/* Glitch Layer 1 - Red/Fuchsia */}
//           <span className="absolute top-0 left-0 w-full h-full text-fuchsia-500 opacity-70 -translate-x-1 hidden group-hover:block animate-glitch-1 z-0">
//             404
//           </span>
          
//           {/* Glitch Layer 2 - Cyan */}
//           <span className="absolute top-0 left-0 w-full h-full text-cyan-400 opacity-70 translate-x-1 hidden group-hover:block animate-glitch-2 z-0">
//             404
//           </span>
//         </h1>
        
//         {/* Background Glow */}
//         <div className="absolute inset-0 bg-fuchsia-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//       </div>

//       <div className="text-center relative z-10 -mt-8 md:-mt-16">
//         <h2 className="text-2xl md:text-3xl font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
//           System Error: 404
//         </h2>
        
//         <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-mono text-sm border-l-2 border-slate-300 dark:border-slate-700 pl-4 py-1">
//           &gt; The requested route does not exist. <br />
//           &gt; Verification failed. <br />
//           &gt; Please return to safe territory.
//         </p>

//         <div className="mt-12">
//           <Link 
//             href="/"
//             className="inline-flex items-center px-8 py-3 border-2 border-slate-900 dark:border-white text-sm font-mono uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all duration-300"
//           >
//             [ Go_Home ]
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NotFoundPage

'use client'; // Required for mouse event handling

import React, { useState, MouseEvent } from 'react'
import Link from 'next/link'

type Props = {}

const NotFoundPage = (props: Props) => {
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
      onMouseMove={handleMouseMove}
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

export default NotFoundPage