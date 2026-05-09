import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const AICoach: React.FC = () => {
  const { apiScore, recommendation, instability, connectionStatus, mouseVelocity, deepSeekAnalysis } = useTelemetryStore();

  const stabilityLabel = apiScore > 90 ? 'OPTIMAL' : apiScore > 70 ? 'GOOD' : 'CALIBRATE';
  const stabilityColor = apiScore > 90 ? 'text-secondary' : apiScore > 70 ? 'text-yellow-400' : 'text-error';

  const feedItems = [
    {
      time: 'DEEPSEEK-V4',
      type: 'positive',
      msg: deepSeekAnalysis,
    },
    {
      time: 'LIVE HEURISTICS',
      type: apiScore > 80 ? 'positive' : 'warning',
      msg: recommendation,
    },
    {
      time: 'SENSOR SCAN',
      type: 'neutral',
      msg: `Mouse velocity: ${mouseVelocity.toFixed(0)} px/s. API precision consistency: ${apiScore.toFixed(1)}%.`,
    },
  ];

  return (
    <div className="p-margin max-w-container-max mx-auto space-y-stack-lg">
      <header className="mb-stack-lg">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-h1 text-h1 text-on-background tracking-tighter uppercase font-black">AI Tactical Coach</h1>
            <p className="text-on-surface-variant font-body-md mt-2">Real-time DeepSeek-V4-Pro analysis of your competitive performance.</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Scanning Live Data</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Live Coaching Feed */}
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
          <div className="bg-white/5 backdrop-blur-xl border border-secondary/20 p-6 rounded-lg shadow-[inset_0_0_12px_rgba(0,180,216,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent,rgba(76,214,251,0.1),transparent)] pointer-events-none animate-pulse"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/50">
                <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">Active Intelligence Feed</h3>
                <p className="text-secondary font-label text-[10px] uppercase tracking-[0.2em] font-bold">
                  {connectionStatus === 'connected' ? 'Live · Engine: DeepSeek-V4-Pro @ vLLM' : connectionStatus === 'connecting' ? 'Connecting to vLLM...' : '⚠ Backend offline'}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              {feedItems.map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border transition-all duration-300 ${item.time === 'DEEPSEEK-V4' ? 'bg-secondary/20 border-secondary/50 shadow-[0_0_15px_rgba(76,214,251,0.1)]' : item.type === 'positive' ? 'bg-secondary/10 border-secondary/30' : item.type === 'warning' ? 'bg-error/10 border-error/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] text-on-surface-variant font-bold tracking-widest">{item.time}</span>
                    <span className={`font-label text-[10px] uppercase tracking-widest font-bold ${item.time === 'DEEPSEEK-V4' ? 'text-secondary' : item.type === 'positive' ? 'text-secondary' : item.type === 'warning' ? 'text-error' : 'text-on-surface-variant'}`}>{item.type}</span>
                  </div>
                  <p className={`font-body-sm italic ${item.time === 'DEEPSEEK-V4' ? 'text-on-background font-bold not-italic' : 'text-on-surface'}`}>"{item.msg}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drill Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
              <h3 className="font-label text-label text-secondary uppercase tracking-widest mb-4 font-bold">Recommended Drills</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 cursor-pointer transition-all border border-white/5">
                  <span className="font-body-sm font-bold uppercase tracking-tighter">Micro-Flick Precision</span>
                  <span className="material-symbols-outlined text-secondary">play_circle</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 cursor-pointer transition-all border border-white/5">
                  <span className="font-body-sm font-bold uppercase tracking-tighter">Vertical Tracking</span>
                  <span className="material-symbols-outlined text-secondary">play_circle</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
              <h3 className="font-label text-label text-on-surface-variant uppercase tracking-widest mb-4 font-bold">Session Goals</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-secondary">check</span>
                  </div>
                  <span className="font-body-sm opacity-70">Improve HS% by 5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-white/20"></div>
                  <span className="font-body-sm opacity-70">Minimize movement inaccuracy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Performance Radar */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg h-full flex flex-col items-center">
            <h3 className="font-label text-label text-on-surface-variant uppercase tracking-widest mb-8 font-bold self-start">Neural Performance Radar</h3>
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border border-white/5 rounded-full"></div>
              <div className="absolute inset-8 border border-white/5 rounded-full"></div>
              <div className="absolute inset-16 border border-white/5 rounded-full"></div>
              <svg className="w-full h-full -rotate-90">
                <polygon
                  points={`128,20 ${128 + 72 * (apiScore/100)},${128 - 48 * (apiScore/100)} 180,180 80,180 50,80`}
                  className="fill-secondary/20 stroke-secondary stroke-2"
                />
              </svg>
              <div className="absolute top-0 font-label text-[10px] text-secondary font-bold uppercase tracking-widest">AIM</div>
              <div className="absolute bottom-0 font-label text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">SPEED</div>
              <div className="absolute left-0 font-label text-[10px] text-on-surface-variant font-bold uppercase tracking-widest -rotate-90">REFLEX</div>
              <div className="absolute right-0 font-label text-[10px] text-on-surface-variant font-bold uppercase tracking-widest rotate-90">TACTIC</div>
            </div>
            <div className="mt-8 w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-on-surface-variant uppercase font-bold">Stability Rating</span>
                <span className={`font-mono font-bold ${stabilityColor}`}>{stabilityLabel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-on-surface-variant uppercase font-bold">Neural Sync Rate</span>
                <span className="text-secondary font-mono font-bold">{apiScore.toFixed(1)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary shadow-[0_0_10px_#4cd6fb] transition-all duration-500"
                  style={{ width: `${apiScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-on-surface-variant uppercase font-bold">ML Instability</span>
                <span className={`font-mono font-bold ${instability > 0.5 ? 'text-error' : 'text-secondary'}`}>{instability.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


export default AICoach;
