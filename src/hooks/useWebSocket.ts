import { useCallback, useEffect, useRef, useState } from 'react';

export interface WebSocketMessage {
  seq: number;
  type: string;
  payload: any;
  timestamp: number;
}

export interface WebSocketConfig {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  baseUrl?: string;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
}

const defaultConfig: WebSocketConfig = {
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  heartbeatTimeout: 10000,
};

export const useWebSocket = (
  messageType?: string,
  onMessage?: (message: WebSocketMessage) => void,
  config: WebSocketConfig = defaultConfig,
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSeq, setLastSeq] = useState(0);
  const [message, setMessage] = useState<WebSocketMessage | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatTimerRef = useRef<number | null>(null);
  const heartbeatTimeoutRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const processedSeqsRef = useRef<Set<number>>(new Set());
  const lastSeqRef = useRef(0);

  const configRef = useRef(config);
  configRef.current = config;

  const messageTypeRef = useRef(messageType);
  messageTypeRef.current = messageType;

  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const getWsBaseUrl = useCallback(() => {
    const currentConfig = configRef.current;

    if (currentConfig.baseUrl) {
      return currentConfig.baseUrl;
    }

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;

    if (process.env.NODE_ENV === 'development') {
      return `${protocol}//${hostname}:8080`;
    }

    return `${protocol}//${window.location.host}`;
  }, []);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read config via ref so startHeartbeat is stable and never recreated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startHeartbeat = useCallback(() => {
    clearHeartbeat();

    heartbeatTimerRef.current = window.setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));

        heartbeatTimeoutRef.current = window.setTimeout(() => {
          console.warn('[WebSocket] Heartbeat timeout, reconnecting...');
          if (wsRef.current) {
            wsRef.current.close(1011, 'Heartbeat timeout');
          }
        }, configRef.current.heartbeatTimeout || 10000);
      }
    }, configRef.current.heartbeatInterval || 30000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected, skipping');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('[WebSocket] No token found');
      return;
    }

    const baseUrl = getWsBaseUrl();
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const host = baseUrl.replace(/^https?:\/\//, '');
    const url = `${wsProtocol}://${host}/api/v1/ws?token=${token}${
      lastSeqRef.current > 0 ? `&last_seq=${lastSeqRef.current}` : ''
    }`;

    console.log(`[WebSocket] Connecting to: ${url}`);

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('[WebSocket] Connected successfully');
      setIsConnected(true);
      setIsReconnecting(false);
      setReconnectCount(0);
      reconnectAttemptsRef.current = 0;
      reconnectTimerRef.current = null;
      processedSeqsRef.current.clear();

      startHeartbeat();
    };

    ws.onmessage = (event) => {
      const lines =
        typeof event.data === 'string'
          ? event.data.trim().split('\n')
          : [event.data];
      for (const line of lines) {
        try {
          const data: WebSocketMessage = JSON.parse(line);

          if (data.type === 'pong') {
            if (heartbeatTimeoutRef.current) {
              clearTimeout(heartbeatTimeoutRef.current);
              heartbeatTimeoutRef.current = null;
            }
            continue;
          }

          // Seq gap detection — warn on out-of-order or missing messages
          if (lastSeqRef.current > 0 && data.seq > lastSeqRef.current + 1) {
            console.warn(
              `[WebSocket] Seq gap detected: expected ${
                lastSeqRef.current + 1
              }, got ${data.seq}`,
            );
          }

          setLastSeq(data.seq);
          lastSeqRef.current = data.seq;

          // Idempotency: skip already-processed messages (seq=0 表示无序列，跳过去重)
          if (data.seq !== 0) {
            if (processedSeqsRef.current.has(data.seq)) {
              console.warn(
                `[WebSocket] Duplicate message ignored, seq=${data.seq}`,
              );
              continue;
            }
            processedSeqsRef.current.add(data.seq);
          }
          // Prevent unbounded growth; keep the most recent half
          if (processedSeqsRef.current.size > 1000) {
            const arr = Array.from(processedSeqsRef.current).sort(
              (a, b) => a - b,
            );
            processedSeqsRef.current = new Set(
              arr.slice(Math.floor(arr.length / 2)),
            );
          }

          if (!messageTypeRef.current || data.type === messageTypeRef.current) {
            setMessage(data);
            onMessageRef.current?.(data);
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error, line);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
    };

    ws.onclose = (event) => {
      clearHeartbeat();
      console.log(
        `[WebSocket] Disconnected - Code: ${event.code}, Reason: "${event.reason}"`,
      );
      setIsConnected(false);

      if (event.code === 1000) {
        console.log('[WebSocket] Normal close, not reconnecting');
        return;
      }

      if (
        reconnectAttemptsRef.current >=
        (configRef.current.maxReconnectAttempts || 10)
      ) {
        console.error('[WebSocket] Max reconnect attempts reached');
        setIsReconnecting(false);
        return;
      }

      setIsReconnecting(true);
      reconnectAttemptsRef.current++;
      setReconnectCount(reconnectAttemptsRef.current);

      const interval = Math.min(
        (configRef.current.reconnectInterval || 3000) *
          Math.pow(2, reconnectAttemptsRef.current - 1),
        30000,
      );

      console.log(
        `[WebSocket] Reconnect attempt ${reconnectAttemptsRef.current} in ${interval}ms`,
      );

      reconnectTimerRef.current = window.setTimeout(() => {
        reconnectTimerRef.current = null;
        connect();
      }, interval);
    };

    wsRef.current = ws;
  }, [getWsBaseUrl, startHeartbeat, clearHeartbeat]); // all stable — connect never recreates

  const disconnect = useCallback(() => {
    clearHeartbeat();
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
  }, [clearHeartbeat]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('[WebSocket] Not connected');
    }
  }, []);

  useEffect(() => {
    connect();

    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'access_token') return;
      if (e.newValue && !e.oldValue) {
        connect();
      } else if (!e.newValue) {
        disconnect();
      }
    };
    window.addEventListener('storage', onStorage);

    const onLogout = () => disconnect();
    window.addEventListener('app:logout', onLogout);

    const onLogin = () => connect();
    window.addEventListener('app:login', onLogin);

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      disconnect();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('app:logout', onLogout);
      window.removeEventListener('app:login', onLogin);
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    isReconnecting,
    message,
    lastSeq,
    sendMessage,
    reconnect: connect,
    reconnectCount,
  };
};

export default useWebSocket;
