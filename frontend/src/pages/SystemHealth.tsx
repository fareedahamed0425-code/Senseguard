import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const SystemHealth: React.FC = () => {
  const { cpuUsage, ramUsagePct, ramUsedGb, ramTotalGb, gpus, deepSeekAnalysis } = useTelemetryStore();
  const gpu = gpus[0] || { name: 'N/A', load: 0, temperature: 0 };

  return (
    <div className="p-margin space-y-gutter max-w-container-max mx-auto">
      {/* Hero Bento Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Real-time Monitor (CPU/GPU) */}
        <div className="col-span-12 lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col relative overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 h-0.5 w-full bg-secondary opacity-20 animate-pulse"></div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">Processing Matrices</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time core oscillation monitoring</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-secondary"></span>
                <span className="font-label text-label uppercase opacity-70 tracking-widest font-bold">CPU ({cpuUsage.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary"></span>
                <span className="font-label text-label uppercase opacity-70 tracking-widest font-bold">GPU ({gpu.load.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
          {/* Mock Chart Visualization */}
          <div className="h-64 w-full flex items-end gap-1 relative border-l border-b border-white/5 px-2">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <polyline fill="none" points="0,150 50,120 100,160 150,80 200,100 250,50 300,90 350,40 400,60 450,20 500,40 550,10 600,30 650,25 700,5 750,15" stroke="#4cd6fb" strokeWidth="2"></polyline>
              <polyline fill="none" points="0,180 50,160 100,170 150,140 200,150 250,120 300,140 350,110 400,130 450,100 500,110 550,90 600,100 650,85 700,75 750,80" stroke="#a9c7ff" strokeWidth="2"></polyline>
            </svg>
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-5">
              {[...Array(6)].map((_, i) => <div key={i} className="w-px h-full bg-white"></div>)}
            </div>
          </div>
        </div>

        {/* Temperature Monitoring */}
        <div className="col-span-12 lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between rounded-lg">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">Thermals</h3>
              <span className="material-symbols-outlined text-secondary">thermostat</span>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-on-surface-variant font-label text-label uppercase tracking-widest font-bold">
                  <span>System Average</span>
                  <span className="text-secondary font-mono">{(cpuUsage / 2 + 30).toFixed(0)}°C</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 overflow-hidden rounded-full">
                  <div className="h-full bg-secondary shadow-[0_0_10px_#4cd6fb]" style={{ width: `${Math.min(100, cpuUsage / 2 + 30)}%` }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-on-surface-variant font-label text-label uppercase tracking-widest font-bold">
                  <span>{gpu.name || 'GPU Cluster'}</span>
                  <span className={`${gpu.temperature > 80 ? 'text-error' : 'text-secondary'} font-mono`}>{gpu.temperature.toFixed(0)}°C</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 overflow-hidden relative rounded-full">
                  <div className={`h-full ${gpu.temperature > 80 ? 'bg-error' : 'bg-secondary'} shadow-[0_0_10px_#4cd6fb]`} style={{ width: `${gpu.temperature}%` }}></div>
                  {gpu.temperature > 80 && <div className="absolute top-0 right-0 w-2 h-full bg-white animate-pulse"></div>}
                </div>
              </div>
            </div>
          </div>
          {gpu.temperature > 80 && (
            <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded">
              <p className="font-body-sm text-body-sm text-error flex items-center gap-2 font-bold uppercase tracking-tighter">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                CRITICAL HEAT IN {gpu.name.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        {/* DeepSeek Neural Engine Monitor */}
        <div className="col-span-12 bg-white/5 backdrop-blur-xl border border-secondary/30 p-6 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">vLLM Sychronized</span>
             </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/50 shadow-[0_0_15px_rgba(76,214,251,0.2)]">
              <span className="material-symbols-outlined text-secondary">psychology</span>
            </div>
            <div>
              <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">DeepSeek-V4-Pro Engine</h3>
              <p className="font-body-sm text-[10px] text-secondary font-bold uppercase tracking-widest">Neural Computation Layer</p>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded border border-white/5">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Latest Tactical Output</span>
                <span className="text-[10px] font-mono text-secondary">Latency: 42ms</span>
             </div>
             <p className="text-on-background font-body-sm italic">"{deepSeekAnalysis}"</p>
          </div>
        </div>

        {/* Power Mode Controls */}
        <div className="col-span-12 md:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
          <h3 className="font-h3 text-h3 text-on-background mb-6 font-bold uppercase tracking-tight">Power Infrastructure</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="group flex items-center justify-between p-4 bg-secondary/10 border border-secondary/50 hover:bg-secondary/20 transition-all cursor-pointer rounded-lg">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">bolt</span>
                <div className="text-left">
                  <div className="font-label text-label uppercase text-secondary font-bold tracking-widest">MAX PERFORMANCE</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant opacity-60">Zero-latency throughput active</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary">check_circle</span>
            </button>
            <button className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer rounded-lg">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant">visibility_off</span>
                <div className="text-left">
                  <div className="font-label text-label uppercase text-on-surface font-bold tracking-widest">STEALTH</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant opacity-60">Minimized background footprint</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Active Process List */}
        <div className="col-span-12 md:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-h3 text-on-background font-bold uppercase tracking-tight">Live Threads</h3>
            <span className="font-label text-[10px] bg-white/5 px-2 py-1 rounded uppercase tracking-widest font-bold">24 ACTIVE</span>
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            {[
              { name: 'GAME_ENGINE.EXE', pid: '49201', cpu: `${(cpuUsage * 0.4).toFixed(1)}%`, ram: '4.2 GB', icon: 'sports_esports' },
              { name: 'SENSEGUARD_AI_CORE', pid: '11022', cpu: `${(cpuUsage * 0.1).toFixed(1)}%`, ram: '0.8 GB', icon: 'smart_toy', active: true },
              { name: 'SYNCHRONIZER', pid: '08212', cpu: '0.1%', ram: '12 MB', icon: 'cloud_done' }
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 transition-colors rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded ${p.active ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[18px]">{p.icon}</span>
                  </div>
                  <div>
                    <div className={`font-label text-[10px] uppercase font-bold tracking-widest ${p.active ? 'text-secondary' : 'text-on-surface'}`}>{p.name}</div>
                    <div className="font-mono text-[10px] text-on-surface-variant opacity-50">PID: {p.pid}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-secondary font-mono text-[12px] font-bold">{p.cpu} CPU</div>
                  <div className="text-on-surface-variant font-mono text-[10px] opacity-60">{p.ram} RAM</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Status Bottom Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mt-gutter">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center gap-4 rounded-lg">
          <div className="p-2 bg-secondary/10 text-secondary rounded">
            <span className="material-symbols-outlined">memory</span>
          </div>
          <div>
            <div className="font-mono text-[16px] font-bold">{ramUsedGb.toFixed(1)} / {ramTotalGb.toFixed(0)} GB</div>
            <div className="font-label text-[10px] uppercase opacity-60 font-bold tracking-widest">System RAM ({ramUsagePct.toFixed(0)}%)</div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center gap-4 rounded-lg">
          <div className="p-2 bg-primary/10 text-primary rounded">
            <span className="material-symbols-outlined">speed</span>
          </div>
          <div>
            <div className="font-mono text-[16px] font-bold">5.2 GHz</div>
            <div className="font-label text-[10px] uppercase opacity-60 font-bold tracking-widest">Clock Speed</div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center gap-4 rounded-lg">
          <div className="p-2 bg-tertiary/10 text-tertiary rounded">
            <span className="material-symbols-outlined">network_check</span>
          </div>
          <div>
            <div className="font-mono text-[16px] font-bold">2 ms</div>
            <div className="font-label text-[10px] uppercase opacity-60 font-bold tracking-widest">IO Latency</div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center gap-4 rounded-lg">
          <div className="p-2 bg-on-secondary-container/10 text-secondary rounded">
            <span className="material-symbols-outlined">storage</span>
          </div>
          <div>
            <div className="font-mono text-[16px] font-bold">92%</div>
            <div className="font-label text-[10px] uppercase opacity-60 font-bold tracking-widest">SSD Health</div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SystemHealth;
