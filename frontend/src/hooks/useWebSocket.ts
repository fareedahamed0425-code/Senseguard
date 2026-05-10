import { useEffect, useRef, useCallback } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const RECONNECT_INTERVAL_MS = 3000;
const SIMULATION_FALLBACK_DELAY_MS = 5000; // Start simulation after 5s of failure

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const simulationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const updateTelemetry = useTelemetryStore((state) => state.updateTelemetry);
  const setConnectionStatus = useTelemetryStore((state) => state.setConnectionStatus);

  const startSimulation = useCallback(() => {
    if (!isMounted.current) return;
    console.log('[SenseGuard] Starting Web Simulation Mode');
    setConnectionStatus('connected');
    
    const simInterval = setInterval(() => {
      if (!isMounted.current || ws.current?.readyState === WebSocket.OPEN) {
        clearInterval(simInterval);
        return;
      }

      // Mock System Data
      updateTelemetry({
        type: 'system_metrics',
        cpu_usage: 25 + Math.random() * 15,
        ram_usage: 45 + Math.random() * 10,
        ram_used_gb: 7.4,
        ram_total_gb: 16.0,
        gpus: [{ id: 0, name: 'Cloud-Virtual GPU', load: 30 + Math.random() * 40, temperature: 62 + Math.random() * 5 }],
        perf_score: 98,
        perf_status: 'optimal'
      });

      // Mock Mouse Data
      updateTelemetry({
        type: 'mouse_move',
        velocity: 200 + Math.random() * 800,
        api_score: 88 + Math.random() * 8
      });

      // Occasional DeepSeek Analysis mock
      if (Math.random() > 0.98) {
        updateTelemetry({
          type: 'deepseek_analysis',
          content: "Web Simulation: Performance metrics holding stable. Neural pathways optimized for high-latency cloud response."
        });
      }
    }, 2000);
  }, [setConnectionStatus, updateTelemetry]);

  const fetchRecommendation = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const backendPort = urlParams.get('backendPort') || '8000';
      const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://localhost:${backendPort}`;
      const res = await fetch(`${backendUrl}/status`);
      if (res.ok) {
        const data = await res.json();
        useTelemetryStore.setState({ recommendation: data.recommendation });
      }
    } catch {
      // Backend not yet available
    }
  }, []);

  const connect = useCallback(() => {
    if (!isMounted.current) return;
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) return;

    setConnectionStatus('connecting');
    
    // Check if we should trigger simulation
    if (!simulationTimer.current) {
        simulationTimer.current = setTimeout(() => {
            if (ws.current?.readyState !== WebSocket.OPEN) {
                startSimulation();
            }
        }, SIMULATION_FALLBACK_DELAY_MS);
    }

    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted.current) return;
      console.log('[SenseGuard] Connected to AI Core');
      setConnectionStatus('connected');
      if (simulationTimer.current) {
          clearTimeout(simulationTimer.current);
          simulationTimer.current = null;
      }
      fetchRecommendation();
    };

    socket.onmessage = (event) => {
      if (!isMounted.current) return;
      try {
        const data = JSON.parse(event.data);
        updateTelemetry(data);
      } catch (err) {
        console.error('[SenseGuard] Failed to parse WS message', err);
      }
    };

    socket.onclose = () => {
      if (!isMounted.current) return;
      ws.current = null;
      // Only reconnect if not in simulation
      reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL_MS + Math.random() * 1000);
    };

    socket.onerror = (err) => {
      console.warn('[SenseGuard] WebSocket connection failed', err);
    };
  }, [url, updateTelemetry, setConnectionStatus, fetchRecommendation, startSimulation]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (simulationTimer.current) clearTimeout(simulationTimer.current);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  return ws.current;
};
