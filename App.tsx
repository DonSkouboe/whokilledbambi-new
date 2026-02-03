import React, { useState, useEffect, useCallback } from 'react';
import { IntroSequence } from './components/IntroSequence';

// --- KONFIGURATION AF URL ---
// Ændr denne konstant for at pege på den rigtige hjemmeside
const TARGET_URL = "https://www.whokilledbambi.dk/"; 

export default function App() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirect = useCallback(() => {
    if (isRedirecting) return;
    
    setIsRedirecting(true);
    console.log(`Redirecting to: ${TARGET_URL}`);
    
    // Small buffer to allow any exit animations if needed, then redirect
    setTimeout(() => {
      window.location.href = TARGET_URL;
    }, 500);
  }, [isRedirecting]);

  return (
    <main 
      className="relative w-full h-screen overflow-hidden cursor-pointer group"
      onClick={handleRedirect}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* 
          High-quality Placeholder Image. 
          Grayscale and brightness filters applied via Tailwind.
        */}
        <img 
          src="https://picsum.photos/1920/1080?grayscale" 
          alt="Classical Ensemble Background" 
          className="w-full h-full object-cover opacity-40 grayscale brightness-50 transition-transform duration-[10s] ease-linear scale-105 group-hover:scale-110"
        />
        {/* Gradient Overlay for drama */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/90"></div>
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <IntroSequence onComplete={handleRedirect} />
      </div>

      {/* Skip Indicator (Subtle) */}
      <div className="absolute bottom-8 text-white/30 text-sm font-light tracking-widest uppercase animate-pulse pointer-events-none">
        Tryk for at springe over
      </div>
    </main>
  );
}