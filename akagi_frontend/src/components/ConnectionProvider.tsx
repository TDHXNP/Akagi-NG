import { type ReactNode, useMemo, useState } from 'react';

import { type ConnectionConfig, ConnectionContext } from '@/contexts/ConnectionContext';

interface ConnectionProviderProps {
  children: ReactNode;
  host: string;
  port: number;
  apiBase: string;
}

/**
 * 提供全局的连接配置上下文
 * 接收由外层初始化阶段解析完毕的真实配置
 */
export function ConnectionProvider({ children, host, port, apiBase }: ConnectionProviderProps) {
  const [clientId] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36));

  const value = useMemo(() => {
    return {
      backendAddress: `${host}:${port}`,
      clientId,
      apiBase,
      backendUrl: `${apiBase}/sse?clientId=${clientId}`,
    } satisfies ConnectionConfig;
  }, [host, port, apiBase, clientId]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}
