import { createContext } from 'react';

export interface ConnectionConfig {
  backendAddress: string;
  clientId: string;
  apiBase: string;
  backendUrl: string;
}

export const ConnectionContext = createContext<ConnectionConfig | null>(null);
