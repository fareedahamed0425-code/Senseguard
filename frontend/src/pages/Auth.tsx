import React, { useState } from 'react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const addToTerminal = (msg: string) => {
    setTerminalOutput(prev => [...prev, `> ${msg}`].slice(-5));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToTerminal("ERROR: CREDENTIALS_REQUIRED");
      return;
    }

    setIsLoggingIn(true);
    addToTerminal("INITIATING_HANDSHAKE...");
    
    setTimeout(() => {
      addToTerminal("ENCRYPTING_SESSION...");
      setTimeout(() => {
        addToTerminal("ACCESS_GRANTED");
        setTimeout(() => {
          onLogin();
        }, 500);
      }, 800);
    }, 800);
  };

  return (
    <div className="h-screen w-full bg-[#0d0e11] flex items-center justify-center p-6 relative overflow-hidden text-on-surface">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(76,214,251,0.05)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[420px] bg-surface-container-low/80 backdrop-blur-2xl border border-white/10 p-10 relative z-10 shadow-2xl rounded-2xl group">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30">
          <div className={`h-full bg-secondary shadow-[0_0_15px_#4cd6fb] transition-all duration-1000 ${isLoggingIn ? 'w-full' : 'w-0'}`}></div>
        </div>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/30 mb-6 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          </div>
          <h1 className="font-h2 text-h2 text-on-background tracking-tighter uppercase font-black">Access Terminal</h1>
          <p className="text-on-surface-variant font-body-sm mt-2 opacity-60 uppercase tracking-widest font-bold">Encrypted Node: S-712</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Operator Identity</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">person</span>
              <input 
                type="email" 
                placeholder="ID@SENSEGUARD.AI"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 p-4 pl-12 text-on-surface outline-none focus:border-secondary transition-colors rounded-lg font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Neural Key</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 p-4 pl-12 text-on-surface outline-none focus:border-secondary transition-colors rounded-lg font-bold"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-4 bg-secondary text-on-secondary font-label text-label uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all font-black rounded-lg relative overflow-hidden group/btn ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={isLoggingIn ? 'opacity-0' : ''}>Initialize Session</span>
            {isLoggingIn && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Terminal Debug Output */}
        <div className="mt-8 p-4 bg-black/40 rounded border border-white/5 font-mono text-[10px] text-secondary/60 space-y-1 min-h-[80px]">
          {terminalOutput.length === 0 && <span className="animate-pulse">_ TERMINAL_READY</span>}
          {terminalOutput.map((line, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300 font-bold">{line}</div>
          ))}
        </div>

        <div className="mt-8 flex justify-between text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold">
          <span className="cursor-pointer hover:text-secondary transition-colors">Lost Cipher?</span>
          <span className="cursor-pointer hover:text-secondary transition-colors">Register Unit</span>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-secondary/20"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-secondary/20"></div>
    </div>
  );
};

export default Auth;
