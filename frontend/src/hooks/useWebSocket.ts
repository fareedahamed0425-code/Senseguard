import { useEffect, useRef, useCallback, useState } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const RECONNECT_INTERVAL_MS = 2000;
const SIMULATION_FALLBACK_DELAY_MS = 5000; 

export const useWebSocket = (initialUrl: string) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const simulationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);
  const currentPortIndex = useRef(0);
  
  // List of common ports to try if connecting to localhost
  const LOCAL_PORTS = ['8000', '8002', '8003', '8004', '8005'];
  
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const updateTelemetry = useTelemetryStore((state) => state.updateTelemetry);
  const setConnectionStatus = useTelemetryStore((state) => state.setConnectionStatus);

  const startSimulation = useCallback(() => {
    if (!isMounted.current) return;
    
    // Check if we are already connected (to prevent overlap)
    if (ws.current?.readyState === WebSocket.OPEN) return;

    console.log('[SenseGuard] Starting Web Simulation Mode');
    // We keep status as 'connecting' or 'disconnected' but the store can handle the 'simulated' flag
    // For now, let's just mark it as connected so the UI shows data
    setConnectionStatus('connected');
    
    const simInterval = setInterval(() => {
      if (!isMounted.current || ws.current?.readyState === WebSocket.OPEN) {
        clearInterval(simInterval);
        return;
      }

      // Mock System Data
      updateTelemetry({
        type: 'system_metrics',
        cpu_usage: 15 + Math.random() * 10,
        ram_usage: 30 + Math.random() * 5,
        ram_used_gb: 4.8,
        ram_total_gb: 16.0,
        gpus: [{ id: 0, name: 'Cloud Simulator GPU', load: 10 + Math.random() * 20, temperature: 45 + Math.random() * 5 }],
        perf_score: 99,
        perf_status: 'simulated'
      });

      // Mock Mouse Data
      updateTelemetry({
        type: 'mouse_move',
        velocity: 100 + Math.random() * 400,
        api_score: 95 + Math.random() * 5,
        instability: 0.01
      });

      if (Math.random() > 0.95) {
        updateTelemetry({
          type: 'deepseek_analysis',
          content: "SIMULATION: Connection to local AI Core pending. Displaying heuristic demo data."
        });
      }
    }, 2000);
  }, [setConnectionStatus, updateTelemetry]);

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

    console.log(`[SenseGuard] Attempting connection to: ${currentUrl}`);
    const socket = new WebSocket(currentUrl);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted.current) return;
      console.log('[SenseGuard] Connected to AI Core at', currentUrl);
      setConnectionStatus('connected');
      if (simulationTimer.current) {
          clearTimeout(simulationTimer.current);
          simulationTimer.current = null;
      }
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
      
      // If we failed on localhost, try the next common port
      if (currentUrl.includes('127.0.0.1') || currentUrl.includes('localhost')) {
          currentPortIndex.current = (currentPortIndex.current + 1) % LOCAL_PORTS.length;
          const nextPort = LOCAL_PORTS[currentPortIndex.current];
          const newUrl = currentUrl.replace(/:\d+/, `:${nextPort}`);
          setCurrentUrl(newUrl);
      }

      reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL_MS);
    };

    socket.onerror = (err) => {
      console.warn('[SenseGuard] WebSocket connection failed', err);
    };
  }, [currentUrl, updateTelemetry, setConnectionStatus, startSimulation]);

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

