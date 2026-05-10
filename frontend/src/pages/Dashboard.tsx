import React, { useMemo } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const Dashboard: React.FC = () => {
  const {
    apiScore, cpuUsage, gpus, ramUsagePct, ramUsedGb, ramTotalGb,
    mouseVelocityHistory, recommendation, connectionStatus, thermalThrottling, thermalMsg,
    activeWindow, deepSeekAnalysis, perfStatus
  } = useTelemetryStore();

  const gpuLoad = gpus[0]?.load ?? 0;
  const gpuTemp = gpus[0]?.temperature ?? 0;

  // Build SVG polyline from velocity history (normalized)
  const aimGraph = useMemo(() => {
    if (mouseVelocityHistory.length < 2) return '';
    const W = 1200;
    const H = 280;
    const maxV = Math.max(...mouseVelocityHistory, 1);
    return mouseVelocityHistory
      .map((v, i) => {
        const x = (i / (mouseVelocityHistory.length - 1)) * W;
        const y = H - (v / maxV) * H * 0.85;
        return `${x},${y}`;
      })
      .join(' ');
  }, [mouseVelocityHistory]);

  const isSimulated = perfStatus === 'simulated';

  const connectionColor =
    connectionStatus === 'connected' ? (isSimulated ? 'bg-yellow-500' : 'bg-secondary') :
    connectionStatus === 'connecting' ? 'bg-yellow-400' :
    'bg-red-500';

  const connectionLabel =
    connectionStatus === 'connected' ? (isSimulated ? 'Simulated Mode' : 'Session Active') :
    connectionStatus === 'connecting' ? 'Connecting...' :
    'Disconnected';

  const handleOptimize = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const backendPort = urlParams.get('backendPort') || '8000';
      const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://localhost:${backendPort}`;
      await fetch(`${backendUrl}/action/optimize`, { method: 'POST' });
      alert('Optimization command sent to AI Core.');
    } catch (err) {
      console.error('Failed to trigger optimization', err);
    }
  };

  return (
    <div className="p-margin max-w-container-max mx-auto space-y-stack-lg">
      {/* Simulation Mode Banner */}
      {isSimulated && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/40 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-yellow-500">sensors_off</span>
            <span className="font-label text-label text-yellow-500 uppercase tracking-widest font-bold">
              Web Version: Local AI Core not detected. Showing simulation data.
            </span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] font-bold text-yellow-500 border border-yellow-500/30 px-3 py-1 hover:bg-yellow-500 hover:text-black transition-all uppercase tracking-widest"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Thermal Throttling Alert */}
      {thermalThrottling && (
        <div className="p-4 bg-error/10 border border-error/40 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-error">warning</span>
          <span className="font-label text-label text-error uppercase tracking-widest font-bold">{thermalMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter">
        <div>
          <h1 className="font-h1 text-h1 text-on-background tracking-tighter uppercase">Tactical Overview</h1>
          <p className="text-on-surface-variant font-body-md mt-2">Neural companion synchronized. Monitoring live competitive session.</p>
        </div>
        <div className="flex items-center gap-stack-md">
          <div className={`px-4 py-2 border flex items-center gap-2 rounded-full transition-all duration-500 ${isSimulated ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-secondary/10 border-secondary/20'}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulated ? 'bg-yellow-500' : 'bg-secondary'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulated ? 'bg-yellow-500' : 'bg-secondary'}`}></span>
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isSimulated ? 'text-yellow-500' : 'text-secondary'}`}>
              {isSimulated ? 'Demo Mode' : 'AI Active'}
            </span>
          </div>
          <div className="bg-surface-container-high px-4 py-2 border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${connectionColor}`}></div>
            <span className="font-label text-label text-secondary uppercase tracking-widest font-bold">{connectionLabel}</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Active Application Card — Real-Time */}
        <div className={`col-span-12 lg:col-span-4 bg-white/5 backdrop-blur-xl border p-6 relative overflow-hidden group rounded-lg transition-all duration-500 ${
          activeWindow.isGame
            ? 'border-secondary/40 shadow-[0_0_24px_rgba(76,214,251,0.15)]'
            : 'border-white/10'
        }`}>
          {activeWindow.isGame && (
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(76,214,251,0.08)_50%,transparent_100%)] pointer-events-none animate-pulse"></div>
          )}
          <div className="flex flex-col h-full gap-6 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-label text-label text-on-surface-variant uppercase tracking-widest font-bold">Active Application</span>
              <span className="material-symbols-outlined text-secondary">
                {activeWindow.isGame ? 'sports_esports' : 'window'}
              </span>
            </div>

            <div className="flex items-center gap-5 py-2">
              {/* App Icon */}
              <div className={`w-20 h-20 rounded border flex items-center justify-center text-4xl shrink-0 transition-all duration-500 ${
                activeWindow.isGame
                  ? 'bg-secondary/10 border-secondary/40'
                  : 'bg-surface-container-highest border-white/10'
              }`}>
                <span>{activeWindow.icon}</span>
              </div>

              {/* App Info */}
              <div className="space-y-1 min-w-0">
                <h2 className={`font-h3 text-h3 leading-tight font-bold uppercase truncate ${
                  activeWindow.isGame ? 'text-secondary' : 'text-on-background'
                }`}>
                  {activeWindow.displayName.length > 22
                    ? activeWindow.displayName.substring(0, 22) + '…'
                    : activeWindow.displayName || activeWindow.processName}
                </h2>
                <p className="text-on-surface-variant font-label text-[10px] tracking-widest font-bold uppercase truncate">
                  {activeWindow.processName}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className={`px-2 py-1 text-[10px] font-bold border ${
                    activeWindow.isGame
                      ? 'bg-secondary/10 border-secondary/30 text-secondary'
                      : 'bg-white/5 border-white/10 text-on-surface-variant'
                  }`}>
                    {activeWindow.isGame ? 'GAME' : 'APP'}
                  </span>
                  <span className="px-2 py-1 bg-white/5 border border-white/10 text-on-surface-variant text-[10px] font-bold font-mono">
                    PID {activeWindow.pid}
                  </span>
                </div>
              </div>
            </div>

            {/* Window Title sub-label */}
            {activeWindow.windowTitle && activeWindow.windowTitle !== activeWindow.displayName && (
              <p className="text-[10px] font-label text-on-surface-variant opacity-50 truncate border-t border-white/5 pt-3">
                {activeWindow.windowTitle}
              </p>
            )}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="col-span-12 lg:col-span-8 bg-white/5 backdrop-blur-xl border border-secondary/20 p-6 shadow-[0_0_20px_rgba(0,180,216,0.15)] flex flex-col gap-6 rounded-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-label text-label text-secondary uppercase tracking-widest font-bold">AI Performance Insights</span>
            <span className="material-symbols-outlined text-secondary">psychology</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="font-h1 text-h1 text-on-background font-black tracking-tighter">{apiScore.toFixed(0)}%</span>
                <span className="font-label text-label text-secondary uppercase tracking-widest font-bold">Aim Stability</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary shadow-[0_0_10px_rgba(76,214,251,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${apiScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold">
                <span>Baseline: 82%</span>
                <span className="text-secondary">+{Math.max(0, apiScore - 82).toFixed(1)}% Improvement</span>
              </div>
            </div>
            <div className="bg-primary-container/20 border border-secondary/30 p-4 rounded relative overflow-hidden flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/50">
                  <span className="material-symbols-outlined text-secondary">psychology</span>
                </div>
                <div className="space-y-1">
                  <div className="font-label text-label text-secondary uppercase tracking-widest font-bold">DeepSeek Tactical Analysis</div>
                  <p className="text-on-background text-body-sm font-bold leading-snug">"{deepSeekAnalysis}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-secondary/20 pt-2 mt-1">
                 <span className="material-symbols-outlined text-secondary text-[14px]">lightbulb</span>
                 <p className="text-on-surface-variant text-[10px] italic">Heuristic: {recommendation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Telemetry Panels */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* CPU */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all duration-300 rounded-lg">
            <div className="space-y-1">
              <div className="text-on-surface-variant font-label text-label uppercase tracking-widest font-bold">CPU Load</div>
              <div className="text-h2 font-h2 text-on-background font-black">{cpuUsage.toFixed(0)}<span className="text-body-sm font-label text-on-surface-variant">%</span></div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${cpuUsage}%` }}></div>
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
            </div>
          </div>

          {/* GPU Load */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all duration-300 rounded-lg">
            <div className="space-y-1">
              <div className="text-on-surface-variant font-label text-label uppercase tracking-widest font-bold">GPU Load</div>
              <div className="text-h2 font-h2 text-on-background font-black">{gpuLoad.toFixed(0)}<span className="text-body-sm font-label text-on-surface-variant">%</span></div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${gpuLoad}%` }}></div>
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>developer_board</span>
            </div>
          </div>

          {/* GPU Temp */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all duration-300 rounded-lg">
            <div className="space-y-1">
              <div className="text-on-surface-variant font-label text-label uppercase tracking-widest font-bold">GPU TEMP</div>
              <div className={`text-h2 font-h2 font-black ${gpuTemp > 85 ? 'text-red-400' : 'text-on-background'}`}>{gpuTemp.toFixed(0)}<span className="text-body-sm font-label text-on-surface-variant">°C</span></div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                <div className={`h-full transition-all duration-500 ${gpuTemp > 85 ? 'bg-red-400' : 'bg-secondary'}`} style={{ width: `${Math.min(100, gpuTemp)}%` }}></div>
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>thermostat</span>
            </div>
          </div>

          {/* RAM — now shows real GB used */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all duration-300 rounded-lg">
            <div className="space-y-1">
              <div className="text-on-surface-variant font-label text-label uppercase tracking-widest font-bold">RAM UTIL</div>
              <div className="text-h2 font-h2 text-on-background font-black">{ramUsedGb.toFixed(1)}<span className="text-body-sm font-label text-on-surface-variant">/{ramTotalGb.toFixed(0)} GB</span></div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${ramUsagePct}%` }}></div>
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>reorder</span>
            </div>
          </div>
        </div>

        {/* Live Mouse Velocity / Aim Consistency Graph */}
        <div className="col-span-12 bg-white/5 backdrop-blur-xl border border-white/10 p-8 min-h-[340px] flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-h3 text-h3 text-on-background">Live Mouse Velocity Graph</h3>
              <p className="text-on-surface-variant text-body-sm">Real-time input speed — last {mouseVelocityHistory.length} samples</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-label text-on-surface-variant">VELOCITY</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <span className="text-[10px] font-label text-on-surface-variant">API: {apiScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          {/* Live Graph Area */}
          <div className="flex-1 w-full border-b border-l border-white/10 relative mt-4">
            {mouseVelocityHistory.length < 2 ? (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant font-label uppercase tracking-widest text-sm opacity-40">
                Move your mouse to generate data...
              </div>
            ) : (
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 280">
                <defs>
                  <linearGradient id="gradient-cyan" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4cd6fb" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <polyline
                  points={aimGraph}
                  fill="none"
                  stroke="#4cd6fb"
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_#4cd6fb]"
                />
              </svg>
            )}
            {/* Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-5 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border-r border-b border-white/20"></div>
              ))}
            </div>
          </div>
          <div className="flex justify-between font-label text-[10px] text-on-surface-variant uppercase tracking-widest px-2">
            <span>Oldest</span>
            <span>←  60 samples →</span>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
