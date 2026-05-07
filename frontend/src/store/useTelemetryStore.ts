import { create } from 'zustand';

export interface GpuData {
  id: number;
  name: string;
  load: number;
  temperature: number;
  memory_used?: number;
  memory_total?: number;
}

interface TelemetryState {
  // System
  cpuUsage: number;
  ramUsagePct: number;   // 0-100 %
  ramUsedGb: number;
  ramTotalGb: number;
  gpus: GpuData[];

  // Mouse / Aim Performance Index
  apiScore: number;
  mouseVelocity: number;
  mouseVelocityHistory: number[]; // last N velocities for live graph

  // Agent outputs
  recommendation: string;
  instability: number;

  // System performance agent
  perfScore: number;
  perfStatus: string;
  thermalThrottling: boolean;
  thermalMsg: string;

  // Active window
  activeWindow: {
    windowTitle: string;
    processName: string;
    displayName: string;
    icon: string;
    pid: number;
    isGame: boolean;
  };

  // Connection
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  lastUpdate: number;

  updateTelemetry: (data: any) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
}

const MAX_VELOCITY_HISTORY = 60;

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  cpuUsage: 0,
  ramUsagePct: 0,
  ramUsedGb: 0,
  ramTotalGb: 16,
  gpus: [],

  apiScore: 100,
  mouseVelocity: 0,
  mouseVelocityHistory: [],

  recommendation: 'Monitoring...',
  instability: 0,

  perfScore: 100,
  perfStatus: 'optimal',
  thermalThrottling: false,
  thermalMsg: 'Thermals optimal',

  activeWindow: {
    windowTitle: 'Desktop',
    processName: 'explorer.exe',
    displayName: 'Detecting...',
    icon: '🖥️',
    pid: 0,
    isGame: false,
  },

  connectionStatus: 'connecting',
  lastUpdate: Date.now(),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  updateTelemetry: (data: any) => {
    if (data.type === 'system_metrics') {
      set({
        cpuUsage: data.cpu_usage ?? 0,
        ramUsagePct: data.ram_usage ?? 0,
        ramUsedGb: data.ram_used_gb ?? 0,
        ramTotalGb: data.ram_total_gb ?? 16,
        gpus: data.gpus ?? [],
        perfScore: data.perf_score ?? get().perfScore,
        perfStatus: data.perf_status ?? get().perfStatus,
        thermalThrottling: data.thermal_throttling ?? false,
        thermalMsg: data.thermal_msg ?? 'Thermals optimal',
        lastUpdate: Date.now(),
      });
    } else if (data.type === 'mouse_move') {
      const newVelocity = data.velocity ?? 0;
      const history = [...get().mouseVelocityHistory, newVelocity].slice(-MAX_VELOCITY_HISTORY);
      set({
        mouseVelocity: newVelocity,
        apiScore: data.api_score ?? get().apiScore,
        instability: data.instability ?? get().instability,
        mouseVelocityHistory: history,
        lastUpdate: Date.now(),
      });
    } else if (data.type === 'active_window') {
      set({
        activeWindow: {
          windowTitle: data.window_title ?? '',
          processName: data.process_name ?? '',
          displayName: data.display_name ?? data.process_name ?? 'Unknown',
          icon: data.icon ?? '🖥️',
          pid: data.pid ?? 0,
          isGame: data.is_game ?? false,
        },
      });
    }
  },
}));
