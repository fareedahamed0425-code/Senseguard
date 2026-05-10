import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const Profile: React.FC = () => {
  const { accuracy } = useTelemetryStore();
  
  return (
    <div className="p-margin max-w-container-max mx-auto space-y-stack-lg">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className="font-label text-[10px] bg-secondary/10 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-bold tracking-widest uppercase">Elite Tier</span>
        </div>
        
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-secondary/30 overflow-hidden group-hover:border-secondary transition-all duration-500 shadow-[0_0_20px_rgba(0,180,216,0.2)]">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-Gtvr_jUglCEQkGnHGeA7KNzUZd5chyuAdlpx--IQ_Vd9a2pSXlDmTRvtRIy2rx2ZfwHVD8aeLnCA6tDEHcoi2RVEcIPRzMJy9M43iiw_UXnQdmZXPfnoxfTq0wbYvoZWza0szmL1RCi0_XUPZau7RmdtX4mNBGLG_Yz3FZHnz_GFx-h8xY-ga8_-02OxYfDF-_2ViWv0oYY3RyuRCExRPVmb6PfKHUbWPa-d2FW2_Y352yWL-CtW7bQQPXqbYW66fq65lWHlQ4" 
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-secondary text-on-secondary p-1.5 rounded-full border-2 border-background cursor-pointer hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </div>
        </div>

        <div className="text-center md:text-left space-y-2">
          <h1 className="font-h1 text-h1 text-on-background tracking-tighter uppercase font-black">Operator Nexus</h1>
          <p className="text-on-surface-variant font-body-md">Elite Competitive Athlete • Joined March 2024</p>
          <div className="flex gap-4 mt-4 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Verified Operator</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">military_tech</span>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Rank #142</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Statistics Grid */}
        <section className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          {[
            { label: 'Total Playtime', value: '1,240h', icon: 'schedule' },
            { label: 'AI Accuracy Avg', value: `${accuracy.toFixed(1)}%`, icon: 'target' },
            { label: 'Sessions Logged', value: '842', icon: 'history' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg text-center space-y-2">
              <span className="material-symbols-outlined text-secondary text-2xl">{stat.icon}</span>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="font-data-lg text-h3 text-on-background font-black">{stat.value}</p>
            </div>
          ))}

          {/* Achievement Showcase */}
          <div className="sm:col-span-3 bg-white/5 border border-white/10 p-6 rounded-lg">
            <h3 className="font-label text-label text-on-surface-variant uppercase tracking-widest mb-6 font-bold">In-Game Achievement Badges</h3>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-secondary/10 rounded-xl border border-secondary/30 flex items-center justify-center relative group cursor-pointer hover:bg-secondary/20 transition-all">
                  <span className="material-symbols-outlined text-secondary text-3xl">workspace_premium</span>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase font-bold tracking-widest">Master Marksman</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tactical Equipment (Hardware) */}
        <section className="md:col-span-4 bg-white/5 border border-white/10 p-6 rounded-lg space-y-6">
          <h3 className="font-label text-label text-on-surface-variant uppercase tracking-widest font-bold">Tactical Hardware</h3>
          <div className="space-y-4">
            {[
              { type: 'Primary Mouse', model: 'Logitech G Pro X Superlight', icon: 'mouse' },
              { type: 'Display Node', model: 'Zowie XL2546K 240Hz', icon: 'monitor' },
              { type: 'Input Node', model: 'Wooting 60HE', icon: 'keyboard' }
            ].map((hw, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b border-white/5">
                <span className="material-symbols-outlined text-secondary">{hw.icon}</span>
                <div>
                  <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest font-bold">{hw.type}</p>
                  <p className="text-body-sm font-bold">{hw.model}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 border border-secondary/30 text-secondary font-label text-[10px] uppercase tracking-widest hover:bg-secondary/10 transition-all font-bold">Manage Hardware Profile</button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
