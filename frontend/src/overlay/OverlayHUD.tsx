import React from 'react';
import { motion } from 'framer-motion';
import { useTelemetryStore } from '../store/useTelemetryStore';

export const OverlayHUD: React.FC = () => {
  const { apiScore, cpuUsage, gpus } = useTelemetryStore();
  const gpuLoad = gpus[0]?.load || 0;

  // Handle mouse pass-through for interactive elements
  const setIgnoreMouse = (ignore: boolean) => {
    const electron = (window as any).require('electron');
    electron.ipcRenderer.send('set-ignore-mouse-events', ignore, { forward: true });
  };

  return (
    <div className="fixed top-4 left-4 pointer-events-none select-none">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-1.5"
      >
        {/* Main Status Badge - Drag Handle */}
        <div 
          style={{ WebkitAppRegion: 'drag' } as any}
          onMouseEnter={() => setIgnoreMouse(false)}
          onMouseLeave={() => setIgnoreMouse(true)}
          className="bg-surface-container/60 backdrop-blur-xl border border-secondary/30 rounded px-3 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(0,180,216,0.15)] pointer-events-auto cursor-move group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-0.5 h-full bg-secondary"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface leading-none">SENSEGUARD_HUD</span>
          </div>
          
          <div className="h-3 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${apiScore > 80 ? 'bg-secondary' : 'bg-error'} animate-pulse`} />
            <span className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">SYNC</span>
          </div>

          {/* Window Controls */}
          <div className="flex items-center ml-2 border-l border-white/10 pl-2 gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button 
              onClick={() => (window as any).require('electron').ipcRenderer.send('window-minimize')}
              className="p-1 hover:bg-white/10 rounded transition-colors text-on-surface-variant hover:text-secondary pointer-events-auto"
            >
              <span className="material-symbols-outlined text-[14px]">remove</span>
            </button>
            <button 
              onClick={() => (window as any).require('electron').ipcRenderer.send('window-maximize')}
              className="p-1 hover:bg-white/10 rounded transition-colors text-on-surface-variant hover:text-secondary pointer-events-auto"
            >
              <span className="material-symbols-outlined text-[14px]">check_box_outline_blank</span>
            </button>
            <button 
              onClick={() => (window as any).require('electron').ipcRenderer.send('window-close')}
              className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors text-on-surface-variant pointer-events-auto"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="flex gap-1.5">
          <div className="bg-surface-container-lowest/40 backdrop-blur-md border border-white/5 rounded px-2 py-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[12px]">mouse</span>
            <span className="text-[9px] font-mono font-bold text-on-surface whitespace-nowrap">{apiScore.toFixed(0)} <span className="text-secondary">API</span></span>
          </div>
          <div className="bg-surface-container-lowest/40 backdrop-blur-md border border-white/5 rounded px-2 py-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[12px]">memory</span>
            <span className="text-[9px] font-mono font-bold text-on-surface whitespace-nowrap">{cpuUsage.toFixed(0)}% <span className="text-secondary">CPU</span></span>
          </div>
          <div className="bg-surface-container-lowest/40 backdrop-blur-md border border-white/5 rounded px-2 py-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[12px]">bolt</span>
            <span className="text-[9px] font-mono font-bold text-on-surface whitespace-nowrap">{gpuLoad.toFixed(0)}% <span className="text-secondary">GPU</span></span>
          </div>
        </div>

        {/* AI Tactical Warning */}
        {apiScore < 70 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-error/10 border-l-2 border-error p-2 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-error text-[14px] animate-pulse">warning</span>
            <span className="text-[9px] font-black text-error uppercase tracking-widest">DRIFT DETECTED: ADJUST CALIBRATION</span>
          </motion.div>
        )}

        {/* Bottom HUD Frame Decor */}
        <div className="w-12 h-0.5 bg-secondary/30 rounded-full mt-1 ml-1 opacity-50"></div>
      </motion.div>
    </div>
  );
};

