import type { WebSocketMessage } from '@/hooks/useWebSocket';
import { useWebSocket } from '@/hooks/useWebSocket';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface OnlineUser {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  onlineAt: number;
}

interface StatsData {
  onlineUsers: number;
  connections: number;
}

interface WebSocketContextValue {
  isConnected: boolean;
  isReconnecting: boolean;
  users: OnlineUser[];
  stats: StatsData;
  subscribe: (
    type: string,
    handler: (msg: WebSocketMessage) => void,
  ) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [stats, setStats] = useState<StatsData>({
    onlineUsers: 0,
    connections: 0,
  });
  const handlersRef = useRef(
    new Map<string, Set<(msg: WebSocketMessage) => void>>(),
  );

  const handleMessage = useCallback((msg: WebSocketMessage) => {
    // 通知订阅者（所有消息类型先转发）
    const typeHandlers = handlersRef.current.get(msg.type);
    if (typeHandlers) {
      typeHandlers.forEach((fn) => fn(msg));
    }

    // 更新 stats
    if (msg.type === 'stats') {
      setStats({
        onlineUsers: msg.payload?.online_users ?? 0,
        connections: msg.payload?.connections ?? 0,
      });
      return;
    }

    if (msg.type !== 'user') return;

    const { payload } = msg;
    if (!payload) return;

    // 全量同步
    if (payload.action === 'sync' && Array.isArray(payload.users)) {
      setUsers(
        payload.users.map((u: any) => ({
          id: u.id,
          username: u.username,
          nickname: u.nickname,
          avatar: u.avatar,
          onlineAt: u.onlineAt || Date.now(),
        })),
      );
      return;
    }

    if (!payload.user?.id) return;

    // 增量更新
    setUsers((prev) => {
      if (payload.action === 'online') {
        const exists = prev.some((u) => u.id === payload.user.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: payload.user.id,
            username: payload.user.username,
            nickname: payload.user.nickname,
            avatar: payload.user.avatar,
            onlineAt: payload.timestamp || Date.now(),
          },
        ];
      }

      if (payload.action === 'offline') {
        return prev.filter((u) => u.id !== payload.user.id);
      }

      return prev;
    });
  }, []);

  const { isConnected, isReconnecting } = useWebSocket(
    undefined,
    handleMessage,
  );

  // 断连时清空
  const prevConnected = useRef(false);
  useEffect(() => {
    if (prevConnected.current && !isConnected) {
      setUsers([]);
    }
    prevConnected.current = isConnected;
  }, [isConnected]);

  const subscribe = useCallback(
    (type: string, handler: (msg: WebSocketMessage) => void) => {
      if (!handlersRef.current.has(type)) {
        handlersRef.current.set(type, new Set());
      }
      handlersRef.current.get(type)!.add(handler);
      return () => {
        handlersRef.current.get(type)?.delete(handler);
      };
    },
    [],
  );

  const value = useMemo(
    () => ({ isConnected, isReconnecting, users, stats, subscribe }),
    [isConnected, isReconnecting, users, stats, subscribe],
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error(
      'useWebSocketContext must be used within WebSocketProvider',
    );
  return ctx;
};
