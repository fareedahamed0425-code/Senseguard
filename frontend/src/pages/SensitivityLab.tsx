import React, { useState } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const SensitivityLab: React.FC = () => {
  const [currentDPI, setCurrentDPI] = useState(800);
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const { mouseVelocity, apiScore } = useTelemetryStore();

  const proProfiles = [
    { name: 'TenZ', dpi: 800, sens: 0.35, eDPI: 280, color: 'text-[#FF4655]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-4Zjc6iwEvxjEfpddolNg0kKIV2awr7gh-Y-xgjzerkqwUTO4I98RiCvWZBkckrAD82vFCjgpxj1d5dKhlRM2s2zF4z2EsO4Lc7I947wHXfbS-NJ4SQs2DVycMDX0cSk6yBBpUrv2JBToSe0e4oqaCKNFG7nbKRaCFasF6pP3gT3WDpjePHmDF9HjwR0uh9H8BGI-KJnnu0zCU_wbqj-nD42IgxRaM9Q7x-wBbQ4u6TtOoplH778KLZy-OeRw_mjuAuahM_PDXFM' },
    { name: 'Shroud', dpi: 450, sens: 0.8, eDPI: 360, color: 'text-[#4CD6FB]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3R1N_yF6_B6X0Xq8P4zK_zR0qjH3Y-v0h7yq_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w' },
    { name: 's1mple', dpi: 400, sens: 3.09, eDPI: 1236, color: 'text-[#F9D024]', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-z6_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w7zP1y_X0w' }
  ];

  const recommendedSens = (selectedPro ? proProfiles.find(p => p.name === selectedPro)?.eDPI || 280 : 312) / currentDPI;

  return (
    <div className="p-margin max-w-container-max mx-auto space-y-stack-lg pb-10">
      <header className="mb-stack-lg">
        <h1 className="font-h1 text-h1 text-on-background tracking-tighter uppercase font-black">Sensitivity Laboratory</h1>
        <p className="text-on-surface-variant font-body-md mt-2">Fine-tune your mechanical input for peak synchronization.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column: Calibration Controls */}
        <section className="md:col-span-7 space-y-gutter">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-lg space-y-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="font-label text-label text-on-surface uppercase tracking-widest font-bold">Hardware Input</h3>
              <span className="material-symbols-outlined text-secondary">tune</span>
            </div>
            
            {/* DPI Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="font-label text-label text-on-surface-variant uppercase tracking-widest font-bold">Mouse DPI</span>
                <span className="font-h2 text-h2 text-secondary font-black">{currentDPI}</span>
              </div>
              <input 
                type="range" 
                min="400" 
                max="12000" 
                step="50" 
                value={currentDPI}
                onChange={(e) => setCurrentDPI(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant opacity-50 font-bold tracking-widest">
                <span>400 DPI</span>
                <span>6000 DPI</span>
                <span>12000 DPI</span>
              </div>
            </div>

            {/* In-game Sensitivity */}
            <div className="grid grid-cols-2 gap-gutter">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Current Sens</span>
                <p className="font-h3 text-h3 text-on-background font-black">0.312</p>
              </div>
              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <span className="material-symbols-outlined text-secondary text-sm">stars</span>
                </div>
                <span className="font-label text-[10px] text-secondary uppercase tracking-widest font-bold">Recommended</span>
                <p className="font-h3 text-h3 text-on-background font-black">{recommendedSens.toFixed(3)}</p>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-secondary text-on-secondary font-label text-label uppercase tracking-widest hover:brightness-110 transition-all font-bold rounded"
              onClick={() => alert(`Applied Sensitivity: ${recommendedSens.toFixed(3)} @ ${currentDPI} DPI`)}
            >
              Apply Recommended Calibration
            </button>
          </div>

          {/* Movement Path Visualizer */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg relative min-h-[300px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-label text-label text-on-surface-variant uppercase tracking-widest font-bold">Live Movement Path Analysis</h3>
              <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded font-bold">REAL-TIME</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute inset-0 grid grid-cols-12 opacity-5 pointer-events-none">
                {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white"></div>)}
              </div>
              <svg className="w-full h-48 opacity-60">
                <path d="M 50,100 Q 150,20 250,100 T 450,100 T 650,50" fill="none" stroke="#4cd6fb" strokeWidth="2" />
                <path d="M 50,110 Q 150,190 250,110 T 450,110 T 650,60" fill="none" stroke="#a9c7ff" strokeWidth="1" strokeDasharray="4" />
                <circle cx="650" cy="50" r="4" fill="#4cd6fb" className="animate-pulse" />
              </svg>
            </div>
            <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest text-center opacity-50 font-bold italic mt-4">Live velocity: {mouseVelocity.toFixed(0)} px/s — Path variance within acceptable tolerances</p>
          </div>
        </section>

        {/* Right Column: Pro Profiles & Benchmarking */}
        <section className="md:col-span-5 space-y-gutter">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
            <h3 className="font-label text-label text-on-surface-variant uppercase tracking-widest mb-6 font-bold flex items-center justify-between">
              Pro-Player Benchmarking
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            </h3>
            <div className="space-y-4">
              {proProfiles.map((pro, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedPro(pro.name)}
                  className={`p-4 border transition-all cursor-pointer rounded-lg group ${selectedPro === pro.name ? 'bg-secondary/10 border-secondary shadow-[0_0_15px_rgba(76,214,251,0.2)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-surface-container-highest border border-white/10 overflow-hidden ${selectedPro === pro.name ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'} transition-all`}>
                        <img src={pro.img} alt={pro.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-body-md font-bold text-on-surface">{pro.name}</span>
                    </div>
                    <span className={`font-mono text-sm font-bold ${pro.color}`}>{pro.eDPI} eDPI</span>
                  </div>
                  <div className="flex gap-4 text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold">
                    <span>DPI: {pro.dpi}</span>
                    <span>SENS: {pro.sens}</span>
                  </div>
                  {selectedPro === pro.name && (
                    <div className="mt-4 pt-4 border-t border-secondary/20 flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Matched as Baseline</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-container/10 border border-secondary/20 p-6 rounded-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/20 transition-all duration-1000"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">AI Kinetic Insight</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
                "Kinetic analysis reveals horizontal over-flicking in close-range reactive tracking. Applying the {selectedPro || 'recommended'} baseline will likely improve your micro-adjustment consistency by <span className="text-secondary font-bold">~{Math.max(0, 100 - apiScore).toFixed(1)}%</span>."
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-secondary/20 text-secondary text-[8px] font-bold uppercase tracking-widest rounded">Target: Stability</span>
                <span className="px-2 py-1 bg-white/10 text-on-surface-variant text-[8px] font-bold uppercase tracking-widest rounded">API Score: {apiScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SensitivityLab;
