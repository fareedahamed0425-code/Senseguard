import React, { useState } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const Sessions: React.FC = () => {
  const { apiScore } = useTelemetryStore();
  const [selectedSession, setSelectedSession] = useState(0);

  const sessions = [
    { id: 0, title: 'Cyber-City Strike', duration: '34:12', type: 'Ranked', status: 'ACTIVE NOW', kd: '3.24', winRate: '68%', adr: '142.5', grade: apiScore > 90 ? 'S' : apiScore > 80 ? 'A+' : 'B' },
    { id: 1, title: 'Neon District', duration: '18:45', type: 'Scrim', status: '2H AGO', kd: '1.85', winRate: '100%', adr: '110.2', grade: 'A' },
    { id: 2, title: 'Orbital Station', duration: '22:10', type: 'Ranked', status: '5H AGO', kd: '0.92', winRate: '0%', adr: '95.4', grade: 'C' }
  ];

  const active = sessions[selectedSession];

  return (
    <div className="p-margin lg:p-stack-lg max-w-container-max mx-auto space-y-stack-lg pb-10">
      <header className="mb-stack-lg">
        <h1 className="font-h1 text-h1 text-on-background mb-stack-xs tracking-tighter uppercase font-black">Tactical Archive</h1>
        <p className="text-on-surface-variant font-body-md mt-2">Analyze tactical performance and AI-derived biometric markers from your history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Match History Timeline */}
        <section className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg shadow-[inset_0_0_10px_rgba(0,180,216,0.1)]">
            <div className="flex justify-between items-center mb-stack-md">
              <h2 className="font-h3 text-h3 text-secondary uppercase tracking-widest font-bold">Session History</h2>
              <span className="material-symbols-outlined text-on-surface-variant opacity-50 cursor-pointer">filter_list</span>
            </div>
            
            <div className="relative space-y-gutter before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {sessions.map((s, i) => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedSession(i)}
                  className="relative pl-8 group cursor-pointer transition-transform active:scale-[0.98]"
                >
                  <div className={`absolute left-0 top-1 w-[22px] h-[22px] rounded-full z-10 border-4 border-[#0d0e11] ${selectedSession === i ? 'bg-secondary shadow-[0_0_10px_rgba(76,214,251,0.5)]' : 'bg-white/20'}`}></div>
                  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-lg transition-all ${selectedSession === i ? 'border-l-2 border-l-secondary bg-white/10' : 'hover:bg-white/10'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-label text-[10px] tracking-widest font-bold ${s.status === 'ACTIVE NOW' ? 'text-secondary animate-pulse' : 'text-on-surface-variant opacity-50'}`}>{s.status}</span>
                      <span className="font-data-sm text-[10px] text-on-surface-variant uppercase font-bold">{s.type}</span>
                    </div>
                    <h4 className="font-h3 text-body-lg text-on-background font-bold uppercase">{s.title}</h4>
                    <p className="text-on-surface-variant font-body-sm opacity-60">{s.duration} Duration</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-stack-lg py-3 border border-white/10 text-on-surface-variant font-label text-label uppercase tracking-widest hover:border-secondary/50 hover:text-secondary transition-all font-bold">
              Load More History
            </button>
          </div>
        </section>

        {/* Middle Column: Performance Analytics & Heatmap */}
        <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Heatmap Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg shadow-[inset_0_0_10px_rgba(0,180,216,0.1)] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-stack-lg">
              <div>
                <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">Kinetic Mapping</h3>
                <p className="font-body-sm text-on-surface-variant">Movement Heatmap - {active.title}</p>
              </div>
              <span className="material-symbols-outlined text-secondary">map</span>
            </div>
            <div className="relative aspect-square w-full rounded-lg bg-surface-container-highest border border-white/5 overflow-hidden">
              <img 
                alt="Map overlay" 
                className="w-full h-full object-cover opacity-40 grayscale group-hover:scale-110 transition-transform duration-[10s]" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvL404jDY6VUsxEQUqMeB25QgxLcLB1c5nAlK10DZ7LWi9Had2vfZbPG8oAl02jK2QW5_yN-Eu67_nqOiE5bol4de2g1YYficImp07AJFvfetvxitI9EsjI65Gl0zuug1D-UpZDLe4kxucIk8dWxjRwGZxA-bjvbH6ooOxiOEjUvj8TeQ-9BWwLIw2LUe6GPCXY5DoyAaeq7NovDnuYdFks8gYGkQobUs2tJAXN8S-Pd0-98-dU8kguuDsKMywcfD9RO67_8jOgTM" 
              />
              <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-error/10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Skill Growth Metrics */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-stack-lg">
              <div>
                <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">Neural Growth</h3>
                <p className="font-body-sm text-on-surface-variant">Last 6 Sessions Comparison</p>
              </div>
              <span className="material-symbols-outlined text-secondary">bar_chart</span>
            </div>
            <div className="flex flex-col gap-stack-sm h-[180px] justify-end mt-4">
              <div className="flex items-end gap-stack-sm h-full w-full px-2">
                {[40, 55, 45, 85, 60, 75].map((h, i) => (
                  <div key={i} className={`flex-1 ${i === 3 ? 'bg-secondary' : 'bg-primary/20'} hover:bg-opacity-40 transition-all rounded-t-sm relative group`} style={{ height: `${h}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-mono text-[10px] text-secondary font-bold">{(h/40).toFixed(1)}x</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between w-full px-2 pt-2 border-t border-white/10 font-label text-[10px] text-on-surface-variant font-bold tracking-widest">
                <span>M1</span><span>M2</span><span>M3</span><span className="text-secondary">M4</span><span>M5</span><span>M6</span>
              </div>
            </div>
          </div>

          {/* Session Detail Card (Large) */}
          <div className="md:col-span-2 bg-gradient-to-br from-surface-container-low to-background border border-secondary/20 p-8 rounded-lg shadow-[0_0_30px_rgba(0,180,216,0.05)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md mb-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-2 border-secondary flex items-center justify-center bg-secondary/10 shadow-[0_0_20px_rgba(76,214,251,0.2)]">
                  <span className="font-h1 text-h2 text-secondary font-black">{active.grade}</span>
                </div>
                <div>
                  <h3 className="font-h3 text-h2 text-on-background font-black tracking-tight uppercase">{active.title}</h3>
                  <p className="font-label text-label text-secondary uppercase tracking-[0.2em] font-bold">Performance Breakdown</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <p className="font-label text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest font-bold">K/D RATIO</p>
                  <p className="font-h3 text-h3 text-on-background font-black">{active.kd}</p>
                </div>
                <div className="text-right">
                  <p className="font-label text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest font-bold">WIN RATE</p>
                  <p className="font-h3 text-h3 text-on-background font-black">{active.winRate}</p>
                </div>
                <div className="text-right">
                  <p className="font-label text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest font-bold">ADR</p>
                  <p className="font-h3 text-h3 text-on-background font-black">{active.adr}</p>
                </div>
              </div>
            </div>

            {/* AI Tactical Review */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              <div className="flex items-center gap-stack-sm mb-4">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h4 className="font-label text-label uppercase tracking-widest text-secondary font-bold">Neural Heuristic Review</h4>
              </div>
              <div className="space-y-6">
                <p className="font-body-md text-on-surface leading-relaxed italic">
                  "Analytical review of session {active.title} indicates a strong correlation between your positioning in Sector-B7 and successful kinetic outcomes. Accuracy consistency maintained at {active.id === 0 ? apiScore.toFixed(1) : '92.4'}%."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-secondary">check_circle</span>
                    <div>
                      <p className="text-on-background font-bold text-sm uppercase tracking-tighter">Recoil Stabilization</p>
                      <p className="text-[12px] text-on-surface-variant opacity-70">Spray patterns for AR-class weapons are within 5% of elite tier benchmarks.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-error">warning</span>
                    <div>
                      <p className="text-on-background font-bold text-sm uppercase tracking-tighter">Peek Inconsistency</p>
                      <p className="text-[12px] text-on-surface-variant opacity-70">Exposure duration at wide angles is excessive. Recommended: Narrow-peek drills.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button className="px-6 py-2 bg-secondary/10 border border-secondary/30 text-secondary font-label text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-on-secondary transition-all font-bold">
                    View Full Kinetic Breakdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Sessions;
