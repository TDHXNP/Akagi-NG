import 'react-toastify/dist/ReactToastify.css';

import { lazy, Suspense, use, useEffect, useMemo, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { ConnectionProvider } from '@/components/ConnectionProvider';
import { ExitOverlay } from '@/components/ExitOverlay';
import { GameProvider } from '@/components/GameProvider';
import { LaunchScreen } from '@/components/LaunchScreen';
import { SettingsProvider } from '@/components/SettingsProvider';
import { StartupErrorBoundary } from '@/components/StartupErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { APP_SPLASH_DURATION_MS } from '@/config/constants';
import { fetchSettingsApi } from '@/hooks/useSettings';
import { setBaseUrl } from '@/lib/api-client';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Hud = lazy(() => import('@/pages/HUD'));

const initApp = async () => {
  if (!window.electron) {
    throw new Error('Akagi-NG requires Electron environment to boot.');
  }
  const { host, port } = await window.electron.invoke('wait-for-backend');
  const apiBase = `http://${host}:${port}`;
  setBaseUrl(apiBase);
  const settings = await fetchSettingsApi();
  return { host, port, settings, apiBase };
};

const appDataPromise = (async () => {
  const isHud = window.location.hash === '#/hud';
  const fetchTask = initApp();

  if (isHud) return fetchTask;

  const minDelay = new Promise<void>((resolve) => setTimeout(resolve, APP_SPLASH_DURATION_MS));
  const [data] = await Promise.all([fetchTask, minDelay]);
  return data;
})();

const settingsResolvedPromise = appDataPromise.then((d) => d.settings);

function AppInner() {
  const data = use(appDataPromise);
  const isHud = useMemo(() => window.location.hash === '#/hud', []);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('is-hud', isHud);
    return () => {
      document.documentElement.classList.remove('is-hud');
    };
  }, [isHud]);

  useEffect(() => {
    if (!window.electron) return;
    const unsubExit = window.electron.on('exit-animation-start', () => setIsExiting(true));
    return () => unsubExit();
  }, []);

  return (
    <ConnectionProvider host={data.host} port={data.port} apiBase={data.apiBase}>
      <SettingsProvider initialSettings={data.settings}>
        <GameProvider>
          <HashRouter>
            <Routes>
              <Route path='/' element={<Dashboard settingsPromise={settingsResolvedPromise} />} />
              <Route path='/hud' element={<Hud />} />
            </Routes>
          </HashRouter>
        </GameProvider>
      </SettingsProvider>
      {isExiting && <ExitOverlay />}
    </ConnectionProvider>
  );
}

export default function App() {
  const isHud = window.location.hash === '#/hud';

  return (
    <ThemeProvider>
      <StartupErrorBoundary>
        <Suspense
          fallback={isHud ? <div className='h-screen w-screen bg-transparent' /> : <LaunchScreen />}
        >
          <AppInner />
        </Suspense>
      </StartupErrorBoundary>
    </ThemeProvider>
  );
}
