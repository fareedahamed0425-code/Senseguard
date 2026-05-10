import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import SensitivityLab from './pages/SensitivityLab';
import SystemHealth from './pages/SystemHealth';
import Sessions from './pages/Sessions';
import AICoach from './pages/AICoach';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SplashScreen from './pages/SplashScreen';
import { OverlayHUD } from './overlay/OverlayHUD';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'lab' | 'health' | 'sessions' | 'coach' | 'settings' | 'profile'>('home');
  
  // Dynamic Port Discovery
  const urlParams = new URLSearchParams(window.location.search);
  const backendPort = urlParams.get('backendPort') || '8000';
  const explicitBackend = urlParams.get('backendUrl'); // e.g. ?backendUrl=wss://my-backend.com
  
  // Environment Check
  const isElectron = window.location.search.includes('electron') || (window as any).process?.versions?.electron;
  const isWeb = !isElectron;

  // URL Discovery: Prioritize explicit param, then env var, then fallback
  const WS_URL = explicitBackend || import.meta.env.VITE_WS_URL || 
                (isWeb && window.location.hostname !== 'localhost' 
                  ? `wss://${window.location.hostname.replace('frontend', 'backend')}/ws/telemetry` 
                  : `ws://127.0.0.1:${backendPort}/ws/telemetry`);

  useWebSocket(WS_URL);

  // Simple route detection via URL params (standard Electron trick for multiple windows)
  const isOverlay = window.location.search.includes('overlay');

  if (isOverlay) {
    return <OverlayHUD />;
  }

  if (!isLoaded) {
    return <SplashScreen onComplete={() => setIsLoaded(true)} />;
  }

  return (
    <div className="flex h-screen bg-background text-on-surface font-body-md overflow-hidden">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low/90 backdrop-blur-xl border-r border-white/10 py-6 z-50 shrink-0 shadow-2xl">
        <div className="px-6 mb-10 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <h1 className="font-h2 text-h2 font-black text-secondary tracking-tighter">SENSEGUARD</h1>
          <p className="font-label text-label uppercase tracking-widest text-on-surface-variant opacity-70">V3.2 COMMAND</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <div 
            onClick={() => setCurrentPage('home')}
            className={`px-4 py-3 flex items-center gap-3 group cursor-pointer transition-all duration-300 ${currentPage === 'home' ? 'text-secondary border-l-4 border-secondary bg-secondary/10' : 'text-on-surface-variant opacity-70 hover:bg-white/5 hover:opacity-100'}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label text-label uppercase tracking-widest font-bold">Dashboard</span>
          </div>
          
          <div 
            onClick={() => setCurrentPage('sessions')}
            className={`px-4 py-3 flex items-center gap-3 group cursor-pointer transition-all duration-300 ${currentPage === 'sessions' ? 'text-secondary border-l-4 border-secondary bg-secondary/10' : 'text-on-surface-variant opacity-70 hover:bg-white/5 hover:opacity-100'}`}
          >
            <span className="material-symbols-outlined">history</span>
            <span className="font-label text-label uppercase tracking-widest font-bold">Sessions</span>
          </div>

          <div 
            onClick={() => setCurrentPage('lab')}
            className={`px-4 py-3 flex items-center gap-3 group cursor-pointer transition-all duration-300 ${currentPage === 'lab' ? 'text-secondary border-l-4 border-secondary bg-secondary/10' : 'text-on-surface-variant opacity-70 hover:bg-white/5 hover:opacity-100'}`}
          >
            <span className="material-symbols-outlined">biotech</span>
            <span className="font-label text-label uppercase tracking-widest font-bold">Sensitivity Lab</span>
          </div>

          <div 
            onClick={() => setCurrentPage('coach')}
            className={`px-4 py-3 flex items-center gap-3 group cursor-pointer transition-all duration-300 ${currentPage === 'coach' ? 'text-secondary border-l-4 border-secondary bg-secondary/10' : 'text-on-surface-variant opacity-70 hover:bg-white/5 hover:opacity-100'}`}
          >
            <span className="material-symbols-outlined">psychology</span>
            <span className="font-label text-label uppercase tracking-widest font-bold">AI Coach</span>
          </div>

          <div 
            onClick={() => setCurrentPage('health')}
            className={`px-4 py-3 flex items-center gap-3 group cursor-pointer transition-all duration-300 ${currentPage === 'health' ? 'text-secondary border-l-4 border-secondary bg-secondary/10' : 'text-on-surface-variant opacity-70 hover:bg-white/5 hover:opacity-100'}`}
          >
            <span className="material-symbols-outlined">monitor_heart</span>
            <span className="font-label text-label uppercase tracking-widest font-bold">System Health</span>
          </div>

          <div 
            onClick={() => setCurrentPage('settings')}
            className={`px-4 py-3 flex items-center gap-3 group cursor-pointer transition-all duration-300 ${currentPage === 'settings' ? 'text-secondary border-l-4 border-secondary bg-secondary/10' : 'text-on-surface-variant opacity-70 hover:bg-white/5 hover:opacity-100'}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label text-label uppercase tracking-widest font-bold">Settings</span>
          </div>
        </nav>

        <div className="px-6 mt-auto">
          <button 
            onClick={async () => {
              try {
                const backendUrl = WS_URL.replace('ws://', 'http://').replace('wss://', 'https://').split('/ws/')[0];
                await fetch(`${backendUrl}/action/optimize`, { method: 'POST' });
                alert('System optimization triggered successfully.');
              } catch (err) {
                alert('Connection to AI Core failed. Ensure the backend is running.');
              }
            }}
            className="w-full bg-secondary/10 border border-secondary/30 text-secondary py-3 font-label text-label tracking-widest hover:bg-secondary hover:text-on-secondary transition-all active:scale-95 uppercase font-bold"
          >
            RUN DIAGNOSTICS
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* TopAppBar */}
        <header className="flex justify-between items-center px-margin h-16 w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-white/10 shadow-[0_0_20px_rgba(0,180,216,0.15)]" style={{ WebkitAppRegion: 'drag' } as any}>
          <div className="flex items-center gap-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <span className="md:hidden material-symbols-outlined text-secondary">menu</span>
            <h2 className="font-h3 text-h3 font-bold text-secondary tracking-tighter uppercase cursor-pointer" onClick={() => setCurrentPage('home')}>SenseGuard AI</h2>
            <div className="hidden lg:block h-4 w-[1px] bg-white/20 mx-2"></div>
            <span className="hidden lg:block font-label text-label text-on-surface-variant opacity-60 uppercase tracking-widest font-bold">Tactical Command</span>
          </div>

          <div className="flex items-center gap-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <div className="flex gap-3 px-4 py-2 bg-surface-container-high rounded-full border border-white/10">
              <span className="material-symbols-outlined text-secondary text-[18px] cursor-pointer">notifications</span>
              <span className="material-symbols-outlined text-secondary text-[18px] cursor-pointer">sensors</span>
              <div className="h-4 w-[1px] bg-white/20 mx-1"></div>
              <span className="font-label text-[10px] text-secondary animate-pulse uppercase tracking-widest font-bold">AI Active</span>
            </div>
            <div 
              className={`w-8 h-8 rounded-full border ${currentPage === 'profile' ? 'border-secondary' : 'border-secondary/40'} overflow-hidden cursor-pointer hover:border-secondary transition-colors`}
              onClick={() => setCurrentPage('profile')}
            >
              <img 
                alt="Profile" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-Gtvr_jUglCEQkGnHGeA7KNzUZd5chyuAdlpx--IQ_Vd9a2pSXlDmTRvtRIy2rx2ZfwHVD8aeLnCA6tDEHcoi2RVEcIPRzMJy9M43iiw_UXnQdmZXPfnoxfTq0wbYvoZWza0szmL1RCi0_XUPZau7RmdtX4mNBGLG_Yz3FZHnz_GFx-h8xY-ga8_-02OxYfDF-_2ViWv0oYY3RyuRCExRPVmb6PfKHUbWPa-d2FW2_Y352yWL-CtW7bQQPXqbYW66fq65lWHlQ4" 
              />
            </div>

            {/* Window Controls */}
            <div className="flex items-center ml-2 border-l border-white/10 pl-4 gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  (window as any).require('electron').ipcRenderer.send('window-minimize');
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors text-on-surface-variant hover:text-secondary pointer-events-auto"
                title="Minimize"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  (window as any).require('electron').ipcRenderer.send('window-maximize');
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors text-on-surface-variant hover:text-secondary pointer-events-auto"
                title="Maximize"
              >
                <span className="material-symbols-outlined text-[18px]">check_box_outline_blank</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  (window as any).require('electron').ipcRenderer.send('window-close');
                }}
                className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors text-on-surface-variant pointer-events-auto"
                title="Close"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentPage === 'home' && <Dashboard />}
          {currentPage === 'lab' && <SensitivityLab />}
          {currentPage === 'health' && <SystemHealth />}
          {currentPage === 'sessions' && <Sessions />}
          {currentPage === 'coach' && <AICoach />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'profile' && <Profile />}
        </div>
      </main>
    </div>
  );
}



export default App;

