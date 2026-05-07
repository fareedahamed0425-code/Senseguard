import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-margin max-w-container-max mx-auto space-y-stack-lg">
      <header className="mb-stack-lg">
        <h1 className="font-h1 text-h1 text-on-background tracking-tighter uppercase font-black">System Configuration</h1>
        <p className="text-on-surface-variant font-body-md mt-2">Manage your tactical environment and AI heuristics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column: Navigation categories */}
        <aside className="md:col-span-3 space-y-2">
          {['General', 'Overlay', 'AI Coach', 'Telemetry', 'Account', 'Security'].map((cat, i) => (
            <div key={i} className={`p-4 rounded-lg cursor-pointer transition-all ${cat === 'General' ? 'bg-secondary/10 text-secondary border-l-2 border-secondary' : 'hover:bg-white/5 text-on-surface-variant'}`}>
              <span className="font-label text-label uppercase tracking-widest font-bold">{cat}</span>
            </div>
          ))}
        </aside>

        {/* Right Column: Settings Form */}
        <section className="md:col-span-9 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-8 space-y-stack-lg">
          <div className="space-y-6">
            <h3 className="font-h3 text-h3 text-on-background border-b border-white/5 pb-4">General Preferences</h3>
            
            <div className="flex items-center justify-between group">
              <div>
                <p className="font-body-md text-on-surface font-bold">Auto-Initialize on Boot</p>
                <p className="text-body-sm text-on-surface-variant opacity-60">Launch SenseGuard when Windows starts.</p>
              </div>
              <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="font-body-md text-on-surface font-bold">Minimal Footprint Mode</p>
                <p className="text-body-sm text-on-surface-variant opacity-60">Reduce background CPU usage during non-gaming sessions.</p>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Default Display Mode</label>
              <select className="w-full bg-surface-container-lowest border border-white/10 text-on-surface p-3 rounded-lg outline-none focus:border-secondary">
                <option>Immersive Dashboard (Default)</option>
                <option>Compact Mini-Player</option>
                <option>Overlay Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/5">
            <h3 className="font-h3 text-h3 text-on-background border-b border-white/5 pb-4">Telemetry Collection</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-md text-on-surface font-bold">Anonymous Performance Uplift</p>
                <p className="text-body-sm text-on-surface-variant opacity-60">Contribute anonymized aim data to improve the AI model.</p>
              </div>
              <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end gap-4">
            <button className="px-6 py-2 border border-white/10 text-on-surface-variant hover:text-on-surface transition-colors uppercase font-label text-label tracking-widest font-bold">Reset Defaults</button>
            <button className="px-8 py-2 bg-secondary text-on-secondary hover:brightness-110 transition-all uppercase font-label text-label tracking-widest font-bold rounded">Save Changes</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
