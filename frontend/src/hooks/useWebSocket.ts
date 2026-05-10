import { useEffect, useRef, useCallback } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

const RECONNECT_INTERVAL_MS = 3000;

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const updateTelemetry = useTelemetryStore((state) => state.updateTelemetry);
  const setConnectionStatus = useTelemetryStore((state) => state.setConnectionStatus);

  const fetchRecommendation = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const backendPort = urlParams.get('backendPort') || '8000';
      const backendUrl = import.meta.env.VITE_BACKEND_URL || `http://localhost:${backendPort}`;
      const res = await fetch(`${backendUrl}/status`);
      if (res.ok) {
        const data = await res.json();
        // Update recommendation from agent
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
    
    // Discovery Logic: Try the provided URL, then fallback to common ports if on localhost
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted.current) return;
      console.log('[SenseGuard] Connected to AI Core');
      setConnectionStatus('connected');
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

    socket.onerror = (err) => {
      // If we are on localhost and the first attempt failed, maybe the port changed
      console.warn('[SenseGuard] WebSocket connection failed', err);
    };

    socket.onclose = () => {
      if (!isMounted.current) return;
      setConnectionStatus('disconnected');
      ws.current = null;
      // Auto-reconnect with a slight jitter to avoid slamming the server
      reconnectTimer.current = setTimeout(connect, RECONNECT_INTERVAL_MS + Math.random() * 1000);
    };
  }, [url, updateTelemetry, setConnectionStatus, fetchRecommendation]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (ws.current) {
        ws.current.onclose = null; // prevent reconnect on intentional unmount
        ws.current.close();
      }
    };
  }, [connect]);

  return ws.current;
};
