import React, { useState, useEffect } from 'react';

interface IntroSequenceProps {
  onComplete: () => void;
}

interface Member {
  name: string;
  instrument: string;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'names' | 'merge' | 'hold'>('names');
  
  // Liste over medlemmer og deres instrumenter
  const members: Member[] = [
    { name: "Anna Sakham Jalving", instrument: "Violinist" },
    { name: "Benedikte Borum Engell", instrument: "Cellist" },
    { name: "Mette Dahl Kristensen", instrument: "Bratschist" },
    { name: "Sophia Larsdotter", instrument: "Violinist" },
    { name: "Mathilde Helding", instrument: "Cellist" },
    { name: "Silke Kirstine Ekmann Kidholm", instrument: "Violinist" }
  ];

  useEffect(() => {
    // Timing Sequence
    // 0s - Starts showing names
    // 8s - Switch to Merge phase (Names fade out, Title fades in)
    // 10s - Merge phase complete, hold/glow phase
    // 14s - End/Redirect
    
    const mergeTimer = setTimeout(() => {
      setStep('merge');
    }, 8000); 

    const holdTimer = setTimeout(() => {
      setStep('hold');
    }, 10000); 

    const endTimer = setTimeout(() => {
      onComplete();
    }, 14000); 

    return () => {
      clearTimeout(mergeTimer);
      clearTimeout(holdTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-6xl flex flex-col items-center justify-center h-96">
      
      {/* Phase 1: Member Names & Instruments List */}
      <div 
        className={`
          flex flex-wrap gap-x-12 gap-y-12 items-start justify-center px-4
          transition-all duration-1000 ease-in-out
          ${step === 'names' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-sm translate-y-10'}
        `}
      >
        {members.map((member, index) => (
          <MemberCard 
            key={member.name} 
            member={member} 
            delay={index * 800} // Staggered entry
          />
        ))}
      </div>

      {/* Phase 2 & 3: Main Title */}
      <div 
        className={`
          absolute inset-0 flex items-center justify-center pointer-events-none
          transition-all duration-[2000ms] ease-out
          ${step === 'names' 
            ? 'opacity-0 scale-110 blur-2xl' 
            : 'opacity-100 scale-100 blur-0'}
        `}
      >
        <h1 
          className={`
            text-5xl md:text-7xl lg:text-9xl text-white font-semibold tracking-tighter italic
            ${step === 'hold' ? 'animate-glow' : ''}
          `}
        >
          WhoKilledBambi
        </h1>
      </div>
    </div>
  );
};

// Helper component for individual sliding member card
const MemberCard: React.FC<{ member: Member; delay: number }> = ({ member, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div 
      className={`
        flex flex-col items-center justify-center text-center min-w-[160px]
        transform transition-all duration-[1200ms] cubic-bezier(0.22, 1, 0.36, 1)
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}
      `}
    >
      <span className="text-2xl md:text-3xl text-gray-100 font-normal tracking-wide mb-2">
        {member.name}
      </span>
      
      {/* Separator Line */}
      <div className="w-8 h-px bg-gray-600/60 mb-2"></div>

      <span className="text-sm md:text-base text-gray-400 font-light italic tracking-widest uppercase">
        {member.instrument}
      </span>
    </div>
  );
};