import { useEffect, useRef, useCallback, useState } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const RECONNECT_INTERVAL_MS = 2000;

export const useWebSocket = (initialUrl: string) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);
  const currentPortIndex = useRef(0);
  
  // List of common ports to try if connecting to localhost
  const LOCAL_PORTS = ['8000', '8002', '8003', '8004', '8005'];
  
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const updateTelemetry = useTelemetryStore((state) => state.updateTelemetry);
  const setConnectionStatus = useTelemetryStore((state) => state.setConnectionStatus);

  const connect = useCallback(() => {
    if (!isMounted.current) return;
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) return;

    setConnectionStatus('connecting');
    
    console.log(`[SenseGuard] Attempting connection to: ${currentUrl}`);
    const socket = new WebSocket(currentUrl);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted.current) return;
      console.log('[SenseGuard] Connected to AI Core at', currentUrl);
      setConnectionStatus('connected');
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
  }, [currentUrl, updateTelemetry, setConnectionStatus]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  return ws.current;
};

