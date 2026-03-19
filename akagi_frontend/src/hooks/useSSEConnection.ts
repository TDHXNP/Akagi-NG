import { useEffect, useMemo, useState } from 'react';

import type { FullRecommendationData, NotificationItem, SSEErrorCode } from '@/types';

interface UseSSEConnectionResult {
  data: FullRecommendationData | null;
  notifications: NotificationItem[];
  isConnected: boolean;
  error: SSEErrorCode | string | null;
}

export function useSSEConnection(url: string | null): UseSSEConnectionResult {
  const [data, setData] = useState<FullRecommendationData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<SSEErrorCode | string | null>(null);

  useEffect(() => {
    if (!url) return;

    let currentSource: EventSource | null = null;
    let stopped = false;

    const connect = () => {
      if (stopped) return;

      if (currentSource) {
        currentSource.close();
        currentSource = null;
      }

      let es: EventSource;
      try {
        es = new EventSource(url);
      } catch (e) {
        console.error('Invalid SSE URL:', e);
        setError('config_error');
        setIsConnected(false);
        return;
      }

      currentSource = es;

      es.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      // 处理推荐数据事件
      es.addEventListener('recommendations', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          // 数据格式: { "recommendations": ..., "is_riichi": ... }
          setData(parsed);
        } catch (e) {
          console.error('Failed to parse recommendations', e);
        }
      });

      // 处理通知事件
      es.addEventListener('notification', (event) => {
        try {
          const parsed = JSON.parse(event.data);
          // 预期格式: { "list": [...] }
          if (parsed.list) {
            setNotifications(parsed.list);
          }
        } catch (e) {
          console.error('Failed to parse notification', e);
        }
      });

      // 保留 onmessage 处理未命名事件
      es.onmessage = () => {
        // 空操作
      };

      es.onerror = (event) => {
        console.error('SSE error:', event);
        setIsConnected(false);
        setError('service_disconnected');
        if (es.readyState === EventSource.CLOSED) {
          es.close();
        }
      };
    };

    connect();

    return () => {
      stopped = true;
      if (currentSource) {
        currentSource.close();
      }
    };
  }, [url]);

  return useMemo(
    () => ({ data, notifications, isConnected, error }),
    [data, notifications, isConnected, error],
  );
}
