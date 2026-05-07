import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-surface-container-lowest overflow-hidden flex flex-col items-center justify-center">
      {/* Background Layer: Particle Field & Nebula Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0D2137]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,178,214,0.15)_0%,rgba(13,33,55,0)_70%)] opacity-60"></div>
        {/* Visual background patterns */}
        <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(76, 214, 251, 0.05) 50%, transparent 100%)', backgroundSize: '100% 4px' }}></div>
        
        {/* Decorative Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-secondary rounded-full shadow-[0_0_8px_#4cd6fb] opacity-40"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-secondary rounded-full shadow-[0_0_8px_#4cd6fb] opacity-20"></div>
        <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-secondary rounded-full shadow-[0_0_8px_#4cd6fb] opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-secondary rounded-full shadow-[0_0_8px_#4cd6fb] opacity-40"></div>
      </div>

      {/* Centered Visual Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* SenseGuard Logo */}
        <div className="relative group cursor-wait">
          {/* Outer Rotating Rings */}
          <div className="absolute inset-[-40px] border-2 border-secondary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-[-20px] border border-secondary/40 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
          
          {/* Main Logo Structure */}
          <div className="relative w-32 h-32 flex items-center justify-center bg-surface-container/30 backdrop-blur-md rounded-xl border border-secondary/30 shadow-[0_0_40px_rgba(0,180,216,0.3)]">
            <span className="material-symbols-outlined text-secondary text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            {/* Hexagonal Frame Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
              <path className="text-secondary" d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="none" stroke="currentColor" strokeWidth="1"></path>
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-stack-xl flex flex-col items-center gap-stack-md">
          <h1 className="font-h2 text-h2 text-on-surface tracking-tighter uppercase font-black">
            Sense<span className="text-secondary">Guard</span> AI
          </h1>
          <div className="flex flex-col items-center gap-stack-sm">
            <div className="flex items-center gap-stack-sm">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              <p className="font-mono text-secondary text-sm tracking-[0.2em] font-bold">
                INITIALIZING AI SYSTEMS... {progress}%
              </p>
            </div>
            {/* Tactical Loading Bar */}
            <div className="w-64 h-1 bg-surface-container-highest rounded-full overflow-hidden relative border border-white/5">
              <div 
                className="absolute top-0 left-0 h-full bg-secondary shadow-[0_0_10px_#4cd6fb] rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* System Specs Ticker */}
            <div className="mt-stack-sm flex gap-stack-lg text-[10px] font-mono text-on-surface-variant/60 uppercase">
              <span>NEURAL_LINK: ACTIVE</span>
              <span>OS_VER: 3.2.0</span>
              <span>MEM_FLUSH: COMPLETED</span>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Corner Elements */}
      <div className="fixed top-margin left-margin z-10 hidden md:block">
        <div className="flex flex-col gap-unit border-l-2 border-secondary/30 pl-stack-sm">
          <p className="font-mono text-[10px] text-secondary/50">SECURE_BOOT_INIT</p>
          <p className="font-mono text-[10px] text-secondary/80">LATENCY: 14MS</p>
        </div>
      </div>
      <div className="fixed bottom-margin right-margin z-10 hidden md:block">
        <div className="flex flex-col items-end gap-unit border-r-2 border-secondary/30 pr-stack-sm">
          <p className="font-mono text-[10px] text-secondary/50">EST_COMPLETE: {(100-progress)/100}S</p>
          <p className="font-mono text-[10px] text-secondary/80">ENCRYPTION: AES-256</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
